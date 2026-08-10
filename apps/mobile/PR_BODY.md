# PR: Add Flutter Android scaffold

Title: chore(mobile): add Flutter Android scaffold (initial files)

This PR adds a full Flutter Android project scaffold under `apps/mobile` so the repository includes a buildable Android client that connects to the existing Express API at `artifacts/api-server`.

What I added
- apps/mobile/ with Flutter project skeleton (pubspec.yaml, lib/, README, .gitignore)
- A small example app (lib/main.dart) that can "Ping API" using Dio and defaults to `http://10.0.2.2:3001` for Android emulator.
- Sample android/key.properties.sample and instructions in apps/mobile/README.md

How to test locally
1. git fetch && git checkout add-flutter-android
2. cd apps/mobile
3. flutter pub get
4. flutter run  # or flutter build apk --release

Notes
- For emulator use `10.0.2.2` to reach localhost. For a physical device use the machine's LAN IP or a tunnel.
- To change the API base without editing code use:
  flutter run --dart-define=API_BASE="https://api.example.com"
  or
  flutter build apk --release --dart-define=API_BASE="https://api.example.com"

Next steps (suggested)
- Add more screens and wire up the actual API endpoints from `artifacts/api-server`.
- Configure Android signing (create a keystore and set android/key.properties).
- Add CI workflow to build APK artifacts on push/tags.

Checklist
- [x] Project scaffold added
- [x] README with build/run instructions
- [ ] Add UI screens and API models
- [ ] Add CI for APK builds

