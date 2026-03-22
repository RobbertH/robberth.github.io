import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._();
  factory NotificationService() => _instance;
  NotificationService._();

  final FlutterLocalNotificationsPlugin _notifications =
      FlutterLocalNotificationsPlugin();

  Future<void> init() async {
    const androidSettings =
        AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    await _notifications.initialize(
      const InitializationSettings(
        android: androidSettings,
        iOS: iosSettings,
      ),
      onDidReceiveNotificationResponse: _onNotificationTapped,
    );
  }

  void _onNotificationTapped(NotificationResponse response) {
    // Handle notification tap - navigate to call screen
    // This is handled via the app's navigation in practice
  }

  Future<void> showDriverAvailableNotification({
    required String driverName,
    String? phoneNumber,
  }) async {
    await _notifications.show(
      driverName.hashCode,
      'Bel-buddy beschikbaar! 📞',
      '$driverName is ook aan het rijden. Bellen?',
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'driver_available',
          'Driver Available',
          channelDescription: 'Notifies when another driver is available',
          importance: Importance.high,
          priority: Priority.high,
        ),
        iOS: DarwinNotificationDetails(
          presentAlert: true,
          presentBadge: true,
          presentSound: true,
        ),
      ),
      payload: phoneNumber,
    );
  }

  Future<void> showDrivingDetectedNotification() async {
    await _notifications.show(
      0,
      'In den otto! 🚗',
      'We detecteren dat je aan het rijden bent.',
      const NotificationDetails(
        android: AndroidNotificationDetails(
          'driving_status',
          'Driving Status',
          channelDescription: 'Shows driving detection status',
          importance: Importance.low,
          priority: Priority.low,
          ongoing: true,
        ),
        iOS: DarwinNotificationDetails(),
      ),
    );
  }

  Future<void> cancelAll() async {
    await _notifications.cancelAll();
  }
}
