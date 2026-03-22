import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:home_widget/home_widget.dart';
import '../models/detection_state.dart';
import '../models/driver.dart';
import '../services/car_detection_service.dart';
import '../services/firebase_service.dart';
import '../services/notification_service.dart';

class DrivingProvider extends ChangeNotifier {
  final CarDetectionService _detectionService = CarDetectionService();
  final FirebaseService _firebaseService = FirebaseService();
  final NotificationService _notificationService = NotificationService();

  DetectionState _detectionState = const DetectionState();
  List<Driver> _availableDrivers = [];
  Driver? _currentDriver;
  bool _manualOverride = false;
  bool _initialized = false;

  DetectionState get detectionState => _detectionState;
  List<Driver> get availableDrivers => _availableDrivers;
  Driver? get currentDriver => _currentDriver;
  bool get isDriving => _detectionState.isDriving || _manualOverride;
  bool get isAvailableForCall => isDriving;
  bool get initialized => _initialized;

  StreamSubscription? _detectionSub;
  StreamSubscription? _driversSub;
  StreamSubscription? _currentDriverSub;
  final Set<String> _notifiedDriverIds = {};

  Future<void> init() async {
    if (_initialized) return;

    await _firebaseService.ensureAuthenticated();
    await _notificationService.init();

    // Listen to car detection
    _detectionSub = _detectionService.stateStream.listen(_onDetectionChanged);
    await _detectionService.start();

    // Listen to available drivers
    _driversSub = _firebaseService.availableDriversStream().listen((drivers) {
      final previousIds = _availableDrivers.map((d) => d.uid).toSet();
      _availableDrivers = drivers;
      _updateWidget();
      notifyListeners();

      // Notify about new available drivers
      for (final driver in drivers) {
        if (!previousIds.contains(driver.uid) &&
            !_notifiedDriverIds.contains(driver.uid) &&
            isDriving) {
          _notifiedDriverIds.add(driver.uid);
          _notificationService.showDriverAvailableNotification(
            driverName: driver.displayName,
            phoneNumber: driver.phoneNumber,
          );
        }
      }
    });

    // Listen to own driver data
    _currentDriverSub =
        _firebaseService.currentDriverStream().listen((driver) {
      _currentDriver = driver;
      notifyListeners();
    });

    _initialized = true;
    notifyListeners();
  }

  void _onDetectionChanged(DetectionState state) {
    final wasDriving = _detectionState.isDriving;
    _detectionState = state;

    if (state.isDriving && !wasDriving) {
      // Started driving
      _notificationService.showDrivingDetectedNotification();
      _firebaseService.updateDrivingStatus(
        isDriving: true,
        isAvailableForCall: true,
      );
      _notifiedDriverIds.clear();
    } else if (!state.isDriving && wasDriving && !_manualOverride) {
      // Stopped driving
      _notificationService.cancelAll();
      _firebaseService.updateDrivingStatus(
        isDriving: false,
        isAvailableForCall: false,
      );
    }

    _updateWidget();
    notifyListeners();
  }

  void toggleManualDriving() {
    _manualOverride = !_manualOverride;
    _detectionService.setManualDriving(_manualOverride);

    _firebaseService.updateDrivingStatus(
      isDriving: _manualOverride,
      isAvailableForCall: _manualOverride,
    );

    if (_manualOverride) {
      _notifiedDriverIds.clear();
    }

    _updateWidget();
    notifyListeners();
  }

  Future<void> updateProfile(String name, String? phone) async {
    await _firebaseService.updateProfile(
      displayName: name,
      phoneNumber: phone,
    );
  }

  void addCarBluetoothDevice(String pattern) {
    _detectionService.addCarDevicePattern(pattern);
  }

  Future<void> _updateWidget() async {
    try {
      await HomeWidget.saveWidgetData<bool>('isDriving', isDriving);
      await HomeWidget.saveWidgetData<int>(
        'availableCount',
        _availableDrivers.length,
      );
      await HomeWidget.saveWidgetData<String>(
        'availableNames',
        _availableDrivers.map((d) => d.displayName).join(', '),
      );
      await HomeWidget.updateWidget(
        androidName: 'InDenOttoWidgetProvider',
        iOSName: 'InDenOttoWidget',
      );
    } catch (e) {
      print('Widget update error: $e');
    }
  }

  @override
  void dispose() {
    _detectionSub?.cancel();
    _driversSub?.cancel();
    _currentDriverSub?.cancel();
    _detectionService.dispose();
    _firebaseService.goOffline();
    super.dispose();
  }
}
