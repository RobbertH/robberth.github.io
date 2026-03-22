import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/driving_provider.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _btDeviceController = TextEditingController();
  final List<String> _btDevices = [];

  @override
  void initState() {
    super.initState();
    final provider = context.read<DrivingProvider>();
    _nameController.text = provider.currentDriver?.displayName ?? '';
    _phoneController.text = provider.currentDriver?.phoneNumber ?? '';
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _btDeviceController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A1A),
      appBar: AppBar(
        title: const Text('Instellingen'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          _sectionTitle('Profiel'),
          _buildTextField(
            controller: _nameController,
            label: 'Je naam',
            icon: Icons.person,
          ),
          const SizedBox(height: 12),
          _buildTextField(
            controller: _phoneController,
            label: 'Telefoonnummer',
            icon: Icons.phone,
            keyboardType: TextInputType.phone,
          ),
          const SizedBox(height: 12),
          ElevatedButton(
            onPressed: _saveProfile,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.amber,
              foregroundColor: Colors.black,
              padding: const EdgeInsets.symmetric(vertical: 14),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: const Text('Opslaan', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
          const SizedBox(height: 32),
          _sectionTitle('Bluetooth Apparaten'),
          const Text(
            'Voeg de naam (of deel ervan) van je auto-bluetooth toe '
            'voor betere detectie.',
            style: TextStyle(color: Colors.white38, fontSize: 13),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildTextField(
                  controller: _btDeviceController,
                  label: 'Apparaat naam',
                  icon: Icons.bluetooth,
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: _addBtDevice,
                icon: const Icon(Icons.add_circle, color: Colors.amber, size: 32),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ..._btDevices.map((device) => ListTile(
                leading: const Icon(Icons.bluetooth_connected,
                    color: Colors.blue, size: 20),
                title: Text(device, style: const TextStyle(color: Colors.white)),
                trailing: IconButton(
                  icon: const Icon(Icons.delete, color: Colors.red, size: 20),
                  onPressed: () {
                    setState(() => _btDevices.remove(device));
                    context.read<DrivingProvider>().addCarBluetoothDevice(device);
                  },
                ),
                contentPadding: EdgeInsets.zero,
              )),
          const SizedBox(height: 32),
          _sectionTitle('Over'),
          const Text(
            'In Den Otto detecteert automatisch of je in de auto zit '
            'via Bluetooth, CarPlay/Android Auto, of snelheid (>15 km/u). '
            'Zo kun je makkelijk een bel-buddy vinden onderweg!',
            style: TextStyle(color: Colors.white38, fontSize: 13, height: 1.5),
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        title,
        style: const TextStyle(
          color: Colors.amber,
          fontSize: 18,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    TextInputType? keyboardType,
  }) {
    return TextField(
      controller: controller,
      keyboardType: keyboardType,
      style: const TextStyle(color: Colors.white),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(color: Colors.white38),
        prefixIcon: Icon(icon, color: Colors.white38),
        filled: true,
        fillColor: const Color(0xFF1A1A2E),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  void _saveProfile() {
    context.read<DrivingProvider>().updateProfile(
          _nameController.text,
          _phoneController.text,
        );
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Profiel opgeslagen!'),
        backgroundColor: Colors.green,
      ),
    );
  }

  void _addBtDevice() {
    final name = _btDeviceController.text.trim();
    if (name.isEmpty) return;
    setState(() => _btDevices.add(name));
    context.read<DrivingProvider>().addCarBluetoothDevice(name);
    _btDeviceController.clear();
  }
}
