import 'package:url_launcher/url_launcher.dart';

class CallService {
  /// Initiate a phone call to the given number
  static Future<bool> call(String phoneNumber) async {
    final uri = Uri(scheme: 'tel', path: phoneNumber);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
      return true;
    }
    return false;
  }
}
