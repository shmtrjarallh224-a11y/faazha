import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'config.dart';

void main() {
  runApp(const FaazhaApp());
}

class FaazhaApp extends StatelessWidget {
  const FaazhaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Faazha Mobile',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String _status = 'Idle';
  final Dio _dio = Dio(BaseOptions(baseUrl: API_BASE));

  Future<void> _pingApi() async {
    setState(() => _status = 'Loading...');
    try {
      final resp = await _dio.get('/api');
      setState(() => _status = 'OK: ${resp.statusCode}');
    } catch (e) {
      setState(() => _status = 'Error: ${_errorMessage(e)}');
    }
  }

  String _errorMessage(Object e) {
    if (e is DioException) {
      return e.message ?? e.type.name;
    }
    return e.toString();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Faazha Mobile (Android)'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Backend: '),
            Text(API_BASE, style: const TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _pingApi,
              icon: const Icon(Icons.cloud_outlined),
              label: const Text('Ping API'),
            ),
            const SizedBox(height: 12),
            Text('Status: $_status'),
            const SizedBox(height: 24),
            const Text('Notes:'),
            const Text('- For Android emulator use 10.0.2.2 to reach host localhost.'),
            const Text('- To change API URL, rebuild with --dart-define=API_BASE="https://..."'),
          ],
        ),
      ),
    );
  }
}
