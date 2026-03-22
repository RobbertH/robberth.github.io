import 'dart:async';
import 'dart:math';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:sensors_plus/sensors_plus.dart';
import 'package:geolocator/geolocator.dart';
import '../models/detection_state.dart';

/// Detects if the user is in a car using multiple signals:
/// 1. Bluetooth: connected to known car devices
/// 2. GPS speed: moving faster than 15 km/h
/// 3. Accelerometer: sustained motion patterns
///
/// Battery optimization:
/// - Bluetooth scan every 30s (low energy)
/// - GPS only when accelerometer detects movement
/// - Accelerometer sampled at low frequency
class CarDetectionService {
  static const double _speedThresholdKmh = 15.0;
  static const Duration _bluetoothScanInterval = Duration(seconds: 30);
  static const Duration _debounceStopDuration = Duration(seconds: 60);

  final _stateController = StreamController<DetectionState>.broadcast();
  Stream<DetectionState> get stateStream => _stateController.stream;
  DetectionState _currentState = const DetectionState();
  DetectionState get currentState => _currentState;

  Timer? _bluetoothTimer;
  Timer? _stopDebounceTimer;
  StreamSubscription? _accelerometerSub;
  StreamSubscription? _bluetoothSub;

  // Known car Bluetooth device name patterns
  final Set<String> _carDevicePatterns = {};

  void addCarDevicePattern(String pattern) => _carDevicePatterns.add(pattern.toLowerCase());
  void removeCarDevicePattern(String pattern) => _carDevicePatterns.remove(pattern.toLowerCase());

  Future<void> start() async {
    _startBluetoothDetection();
    _startAccelerometerDetection();
  }

  void stop() {
    _bluetoothTimer?.cancel();
    _stopDebounceTimer?.cancel();
    _accelerometerSub?.cancel();
    _bluetoothSub?.cancel();
    _updateState(const DetectionState());
  }

  void dispose() {
    stop();
    _stateController.close();
  }

  // --- Bluetooth Detection ---

  void _startBluetoothDetection() {
    // Initial scan
    _scanBluetooth();
    // Periodic scans - low frequency to save battery
    _bluetoothTimer = Timer.periodic(_bluetoothScanInterval, (_) {
      _scanBluetooth();
    });
  }

  Future<void> _scanBluetooth() async {
    try {
      if (await FlutterBluePlus.adapterState.first != BluetoothAdapterState.on) {
        return;
      }

      // Check connected devices first (no scan needed - saves battery)
      final connected = FlutterBluePlus.connectedDevices;
      for (final device in connected) {
        if (_isCarDevice(device.platformName)) {
          _onCarDetected(
            DetectionSource.bluetooth,
            connectedDevice: device.platformName,
          );
          return;
        }
      }

      // Quick BLE scan (5 seconds max)
      await FlutterBluePlus.startScan(timeout: const Duration(seconds: 5));

      _bluetoothSub?.cancel();
      _bluetoothSub = FlutterBluePlus.scanResults.listen((results) {
        for (final r in results) {
          final name = r.device.platformName;
          if (_isCarDevice(name)) {
            _onCarDetected(DetectionSource.bluetooth, connectedDevice: name);
            FlutterBluePlus.stopScan();
            return;
          }
        }
      });
    } catch (e) {
      print('Bluetooth scan error: $e');
    }
  }

  bool _isCarDevice(String name) {
    if (name.isEmpty) return false;
    final lower = name.toLowerCase();
    // Check user-configured patterns
    for (final pattern in _carDevicePatterns) {
      if (lower.contains(pattern)) return true;
    }
    // Common car Bluetooth patterns
    const carKeywords = [
      'car', 'auto', 'vehicle', 'carplay', 'android auto',
      'handsfree', 'hfp', 'a2dp',
      'bmw', 'mercedes', 'audi', 'volkswagen', 'vw', 'toyota',
      'ford', 'honda', 'hyundai', 'kia', 'volvo', 'tesla',
      'peugeot', 'renault', 'citroën', 'opel', 'fiat', 'skoda',
      'parrot', 'pioneer', 'kenwood', 'jbl', 'harman',
    ];
    return carKeywords.any((kw) => lower.contains(kw));
  }

  // --- Accelerometer + GPS Speed Detection ---

  void _startAccelerometerDetection() {
    double lastMagnitude = 0;
    int movementCount = 0;
    const movementThreshold = 3; // consecutive readings suggesting movement

    _accelerometerSub = userAccelerometerEvents.listen((event) {
      final magnitude = sqrt(
        event.x * event.x + event.y * event.y + event.z * event.z,
      );

      // Detect sustained acceleration changes (not just a bump)
      if ((magnitude - lastMagnitude).abs() > 0.5) {
        movementCount++;
      } else {
        movementCount = max(0, movementCount - 1);
      }
      lastMagnitude = magnitude;

      // If we detect sustained movement, check GPS speed
      if (movementCount >= movementThreshold && !_currentState.isDriving) {
        _checkGpsSpeed();
        movementCount = 0;
      }
    });
  }

  Future<void> _checkGpsSpeed() async {
    try {
      final permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied ||
          permission == LocationPermission.deniedForever) {
        return;
      }

      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          distanceFilter: 10,
        ),
      );

      final speedKmh = (position.speed * 3.6); // m/s to km/h

      if (speedKmh >= _speedThresholdKmh) {
        _onCarDetected(DetectionSource.accelerometer, speedKmh: speedKmh);
      }
    } catch (e) {
      print('GPS speed check error: $e');
    }
  }

  // --- State Management ---

  void _onCarDetected(
    DetectionSource source, {
    String? connectedDevice,
    double? speedKmh,
  }) {
    // Cancel any pending "stop driving" debounce
    _stopDebounceTimer?.cancel();

    _updateState(DetectionState(
      isDriving: true,
      source: source,
      speedKmh: speedKmh,
      connectedDevice: connectedDevice,
    ));
  }

  /// Called when detection signals stop.
  /// Uses debounce to avoid flickering (e.g. stopping at red light).
  void onDetectionLost() {
    _stopDebounceTimer?.cancel();
    _stopDebounceTimer = Timer(_debounceStopDuration, () {
      _updateState(const DetectionState());
    });
  }

  void _updateState(DetectionState state) {
    _currentState = state;
    _stateController.add(state);
  }

  /// Manual override - user toggles driving mode
  void setManualDriving(bool isDriving) {
    if (isDriving) {
      _updateState(const DetectionState(
        isDriving: true,
        source: DetectionSource.manual,
      ));
    } else {
      _updateState(const DetectionState());
    }
  }
}
