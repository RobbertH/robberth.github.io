# In Den Otto 🚗

A Flutter app that detects when you're driving and connects you with other available drivers for phone calls.

## Features

- **Auto-detect driving** via Bluetooth car connection, CarPlay/Android Auto, or speed >15 km/h
- **Battery efficient** - Bluetooth scans every 30s, GPS only when movement detected
- **Real-time availability** - See who else is driving and available to call
- **Push notifications** - Get notified when a buddy becomes available
- **Home screen widget** - Quick toggle and see available drivers at a glance
- **60s debounce** - Won't flicker when you stop at a red light

## Setup

### 1. Firebase
```bash
# Install FlutterFire CLI
dart pub global activate flutterfire_cli

# Configure Firebase (creates firebase_options.dart)
flutterfire configure
```

### 2. Enable Firebase services
- **Authentication**: Enable Anonymous sign-in
- **Cloud Firestore**: Create database, deploy rules with `firebase deploy --only firestore`
- **Cloud Messaging**: For push notifications

### 3. Run
```bash
flutter pub get
flutter run
```

### 4. Android permissions
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

<!-- Widget receiver in <application> -->
<receiver android:name=".InDenOttoWidgetProvider"
    android:exported="true">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
    </intent-filter>
    <meta-data android:name="android.appwidget.provider"
        android:resource="@xml/widget_info" />
</receiver>
```

### 5. iOS permissions
Add to `ios/Runner/Info.plist`:
```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>Detect car Bluetooth connection</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Detect driving speed</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Detect driving in background</string>
<key>UIBackgroundModes</key>
<array>
    <string>bluetooth-central</string>
    <string>location</string>
    <string>fetch</string>
    <string>remote-notification</string>
</array>
```

## Architecture

```
lib/
├── main.dart                    # App entry, permissions gate
├── models/
│   ├── driver.dart              # Firestore driver model
│   └── detection_state.dart     # Detection state enum/class
├── services/
│   ├── car_detection_service.dart  # BT + accelerometer + GPS
│   ├── firebase_service.dart       # Firestore + Auth
│   ├── notification_service.dart   # Local notifications
│   ├── background_service.dart     # Background execution
│   └── call_service.dart           # Phone call launcher
├── providers/
│   └── driving_provider.dart    # State management (ChangeNotifier)
├── screens/
│   ├── home_screen.dart         # Main screen
│   └── settings_screen.dart     # Profile + BT device config
└── widgets/
    ├── driving_status_card.dart # Animated status display
    └── available_drivers_list.dart # List with call buttons
```
