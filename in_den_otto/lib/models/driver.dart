import 'package:cloud_firestore/cloud_firestore.dart';

class Driver {
  final String uid;
  final String displayName;
  final bool isDriving;
  final bool isAvailableForCall;
  final DateTime? lastUpdated;
  final String? phoneNumber;

  Driver({
    required this.uid,
    required this.displayName,
    this.isDriving = false,
    this.isAvailableForCall = false,
    this.lastUpdated,
    this.phoneNumber,
  });

  factory Driver.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Driver(
      uid: doc.id,
      displayName: data['displayName'] ?? 'Unknown',
      isDriving: data['isDriving'] ?? false,
      isAvailableForCall: data['isAvailableForCall'] ?? false,
      lastUpdated: (data['lastUpdated'] as Timestamp?)?.toDate(),
      phoneNumber: data['phoneNumber'],
    );
  }

  Map<String, dynamic> toFirestore() => {
        'displayName': displayName,
        'isDriving': isDriving,
        'isAvailableForCall': isAvailableForCall,
        'lastUpdated': FieldValue.serverTimestamp(),
        'phoneNumber': phoneNumber,
      };
}
