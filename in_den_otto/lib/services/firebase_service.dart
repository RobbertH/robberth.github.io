import 'dart:async';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../models/driver.dart';

class FirebaseService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseAuth _auth = FirebaseAuth.instance;

  String? get currentUid => _auth.currentUser?.uid;

  // Sign in anonymously or with existing account
  Future<User?> ensureAuthenticated() async {
    if (_auth.currentUser != null) return _auth.currentUser;
    final result = await _auth.signInAnonymously();
    return result.user;
  }

  // Update driving status in Firestore
  Future<void> updateDrivingStatus({
    required bool isDriving,
    required bool isAvailableForCall,
  }) async {
    final uid = currentUid;
    if (uid == null) return;

    await _firestore.collection('drivers').doc(uid).set({
      'isDriving': isDriving,
      'isAvailableForCall': isAvailableForCall,
      'lastUpdated': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
  }

  // Update user profile
  Future<void> updateProfile({
    required String displayName,
    String? phoneNumber,
  }) async {
    final uid = currentUid;
    if (uid == null) return;

    await _firestore.collection('drivers').doc(uid).set({
      'displayName': displayName,
      'phoneNumber': phoneNumber,
      'lastUpdated': FieldValue.serverTimestamp(),
    }, SetOptions(merge: true));
  }

  // Stream of available drivers (excluding self)
  Stream<List<Driver>> availableDriversStream() {
    return _firestore
        .collection('drivers')
        .where('isAvailableForCall', isEqualTo: true)
        .snapshots()
        .map((snapshot) => snapshot.docs
            .where((doc) => doc.id != currentUid)
            .map((doc) => Driver.fromFirestore(doc))
            .toList());
  }

  // Get current driver data
  Stream<Driver?> currentDriverStream() {
    final uid = currentUid;
    if (uid == null) return Stream.value(null);

    return _firestore
        .collection('drivers')
        .doc(uid)
        .snapshots()
        .map((doc) => doc.exists ? Driver.fromFirestore(doc) : null);
  }

  // Go offline - mark as not driving
  Future<void> goOffline() async {
    await updateDrivingStatus(isDriving: false, isAvailableForCall: false);
  }
}
