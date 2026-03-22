import 'dart:async';
import 'package:flutter_background_service/flutter_background_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Configures background execution so car detection continues
/// when the app is minimized. Uses minimal resources:
/// - Android: foreground service with low-priority notification
/// - iOS: background fetch + significant location changes
class BackgroundService {
  static Future<void> init() async {
    final service = FlutterBackgroundService();

    await service.configure(
      androidConfiguration: AndroidConfiguration(
        onStart: _onStart,
        autoStart: true,
        isForegroundMode: true,
        foregroundServiceNotificationId: 888,
        initialNotificationTitle: 'In Den Otto',
        initialNotificationContent: 'Monitoring driving status...',
        foregroundServiceTypes: [AndroidForegroundType.location],
      ),
      iosConfiguration: IosConfiguration(
        autoStart: true,
        onForeground: _onStart,
        onBackground: _onIosBackground,
      ),
    );
  }

  @pragma('vm:entry-point')
  static Future<bool> _onIosBackground(ServiceInstance service) async {
    // iOS background fetch - keep it quick
    return true;
  }

  @pragma('vm:entry-point')
  static Future<void> _onStart(ServiceInstance service) async {
    // This runs in a separate isolate
    if (service is AndroidServiceInstance) {
      service.on('setAsForeground').listen((_) {
        service.setAsForegroundService();
      });
      service.on('setAsBackground').listen((_) {
        service.setAsBackgroundService();
      });
    }

    service.on('stopService').listen((_) {
      service.stopSelf();
    });

    // Periodic status check - every 30 seconds
    Timer.periodic(const Duration(seconds: 30), (_) async {
      // Send heartbeat to main isolate
      service.invoke('heartbeat', {
        'timestamp': DateTime.now().toIso8601String(),
      });
    });
  }

  static Future<void> startService() async {
    final service = FlutterBackgroundService();
    await service.startService();
  }

  static Future<void> stopService() async {
    final service = FlutterBackgroundService();
    service.invoke('stopService');
  }

  static Future<bool> isRunning() async {
    final service = FlutterBackgroundService();
    return await service.isRunning();
  }
}
