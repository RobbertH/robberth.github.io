enum DetectionSource {
  bluetooth,
  carPlay,
  androidAuto,
  accelerometer,
  manual,
  none,
}

class DetectionState {
  final bool isDriving;
  final DetectionSource source;
  final double? speedKmh;
  final String? connectedDevice;

  const DetectionState({
    this.isDriving = false,
    this.source = DetectionSource.none,
    this.speedKmh,
    this.connectedDevice,
  });

  DetectionState copyWith({
    bool? isDriving,
    DetectionSource? source,
    double? speedKmh,
    String? connectedDevice,
  }) {
    return DetectionState(
      isDriving: isDriving ?? this.isDriving,
      source: source ?? this.source,
      speedKmh: speedKmh ?? this.speedKmh,
      connectedDevice: connectedDevice ?? this.connectedDevice,
    );
  }

  String get sourceLabel {
    switch (source) {
      case DetectionSource.bluetooth:
        return 'Bluetooth: $connectedDevice';
      case DetectionSource.carPlay:
        return 'CarPlay';
      case DetectionSource.androidAuto:
        return 'Android Auto';
      case DetectionSource.accelerometer:
        return 'Speed: ${speedKmh?.toStringAsFixed(0)} km/h';
      case DetectionSource.manual:
        return 'Manual toggle';
      case DetectionSource.none:
        return 'Not detected';
    }
  }
}
