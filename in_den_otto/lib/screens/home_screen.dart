import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/driving_provider.dart';
import '../services/call_service.dart';
import '../widgets/driving_status_card.dart';
import '../widgets/available_drivers_list.dart';
import 'settings_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A1A),
      appBar: AppBar(
        title: const Text(
          'in den otto',
          style: TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 24,
            letterSpacing: -0.5,
          ),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const SettingsScreen()),
            ),
          ),
        ],
      ),
      body: Consumer<DrivingProvider>(
        builder: (context, provider, _) {
          if (!provider.initialized) {
            return const Center(
              child: CircularProgressIndicator(color: Colors.amber),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              // Trigger refresh
              await Future.delayed(const Duration(milliseconds: 500));
            },
            child: ListView(
              padding: const EdgeInsets.all(20),
              children: [
                const DrivingStatusCard(),
                const SizedBox(height: 24),
                _buildToggleButton(context, provider),
                const SizedBox(height: 32),
                _buildAvailableSection(context, provider),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildToggleButton(BuildContext context, DrivingProvider provider) {
    return GestureDetector(
      onTap: () => provider.toggleManualDriving(),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 24),
        decoration: BoxDecoration(
          gradient: provider.isDriving
              ? const LinearGradient(
                  colors: [Color(0xFF00C853), Color(0xFF00E676)],
                )
              : const LinearGradient(
                  colors: [Color(0xFF1A1A2E), Color(0xFF16213E)],
                ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: provider.isDriving
              ? [
                  BoxShadow(
                    color: const Color(0xFF00C853).withOpacity(0.3),
                    blurRadius: 20,
                    spreadRadius: 2,
                  )
                ]
              : [],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              provider.isDriving ? Icons.directions_car : Icons.car_crash,
              color: Colors.white,
              size: 32,
            ),
            const SizedBox(width: 12),
            Text(
              provider.isDriving ? 'In den otto!' : 'Niet in den otto',
              style: const TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAvailableSection(
      BuildContext context, DrivingProvider provider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.people, color: Colors.amber, size: 20),
            const SizedBox(width: 8),
            Text(
              'Beschikbaar om te bellen (${provider.availableDrivers.length})',
              style: const TextStyle(
                color: Colors.white70,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        if (provider.availableDrivers.isEmpty)
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A2E),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Center(
              child: Column(
                children: [
                  Icon(Icons.hourglass_empty, color: Colors.white38, size: 40),
                  SizedBox(height: 12),
                  Text(
                    'Nog niemand aan het rijden...',
                    style: TextStyle(color: Colors.white38, fontSize: 16),
                  ),
                ],
              ),
            ),
          )
        else
          const AvailableDriversList(),
      ],
    );
  }
}
