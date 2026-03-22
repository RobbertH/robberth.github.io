import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/driving_provider.dart';
import '../services/call_service.dart';

class AvailableDriversList extends StatelessWidget {
  const AvailableDriversList({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<DrivingProvider>(
      builder: (context, provider, _) {
        final drivers = provider.availableDrivers;

        return Column(
          children: drivers.map((driver) {
            return Container(
              margin: const EdgeInsets.only(bottom: 8),
              decoration: BoxDecoration(
                color: const Color(0xFF1A1A2E),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: Colors.amber.withOpacity(0.2),
                  width: 1,
                ),
              ),
              child: ListTile(
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                leading: CircleAvatar(
                  backgroundColor: Colors.amber.withOpacity(0.2),
                  child: Text(
                    driver.displayName.isNotEmpty
                        ? driver.displayName[0].toUpperCase()
                        : '?',
                    style: const TextStyle(
                      color: Colors.amber,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                title: Text(
                  driver.displayName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                subtitle: Text(
                  _timeAgo(driver.lastUpdated),
                  style: const TextStyle(color: Colors.white38, fontSize: 12),
                ),
                trailing: driver.phoneNumber != null &&
                        driver.phoneNumber!.isNotEmpty
                    ? IconButton(
                        onPressed: () => _confirmCall(context, driver.displayName,
                            driver.phoneNumber!),
                        icon: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.green.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.call,
                              color: Colors.greenAccent, size: 24),
                        ),
                      )
                    : null,
              ),
            );
          }).toList(),
        );
      },
    );
  }

  String _timeAgo(DateTime? time) {
    if (time == null) return 'zojuist';
    final diff = DateTime.now().difference(time);
    if (diff.inMinutes < 1) return 'zojuist';
    if (diff.inMinutes < 60) return '${diff.inMinutes} min geleden';
    return '${diff.inHours}u geleden';
  }

  void _confirmCall(BuildContext context, String name, String phone) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A2E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text(
          '$name bellen?',
          style: const TextStyle(color: Colors.white),
        ),
        content: Text(
          '$name is ook aan het rijden en beschikbaar om te bellen.',
          style: const TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Niet nu',
                style: TextStyle(color: Colors.white38)),
          ),
          ElevatedButton.icon(
            onPressed: () {
              Navigator.pop(ctx);
              CallService.call(phone);
            },
            icon: const Icon(Icons.call),
            label: const Text('Bellen'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.green,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
