import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/driving_provider.dart';

class DrivingStatusCard extends StatelessWidget {
  const DrivingStatusCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<DrivingProvider>(
      builder: (context, provider, _) {
        final isDriving = provider.isDriving;
        final state = provider.detectionState;

        return AnimatedContainer(
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: isDriving
                ? const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF1B5E20), Color(0xFF2E7D32)],
                  )
                : const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF1A1A2E), Color(0xFF16213E)],
                  ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: isDriving
                ? [
                    BoxShadow(
                      color: Colors.green.withOpacity(0.2),
                      blurRadius: 30,
                      spreadRadius: 5,
                    )
                  ]
                : [],
          ),
          child: Column(
            children: [
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: Icon(
                  isDriving ? Icons.directions_car : Icons.home,
                  key: ValueKey(isDriving),
                  size: 64,
                  color: isDriving ? Colors.greenAccent : Colors.white24,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                isDriving ? 'Je bent in den otto!' : 'Niet aan het rijden',
                style: TextStyle(
                  color: isDriving ? Colors.white : Colors.white54,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              if (isDriving) ...[
                const SizedBox(height: 8),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.15),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    state.sourceLabel,
                    style: const TextStyle(color: Colors.white70, fontSize: 13),
                  ),
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}
