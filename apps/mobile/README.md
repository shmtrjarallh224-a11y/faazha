# Faazha Mobile (Android)

هذا مجلد مشروع Flutter لتطبيق أندرويد الذي يتصل بالـ Express API الموجود في `artifacts/api-server`.

ملاحظات سريعة:
- افتراضيًا يستخدم العنوان `http://10.0.2.2:3001` (محاكي Android) للاتصال بالـ API. إذا تشغّل على جهاز حقيقي غيّر الثابت `API_BASE` في `lib/config.dart` أو استخدم متغيّرات البناء.

تشغيل محلي (بعد استنساخ الفرع `add-flutter-android`):

```bash
cd apps/mobile
# إن لم تنشئ ملفات المنصات بعد (اختياري) فعّل:
# flutter create .
flutter pub get
flutter run
# أو لبناء APK (release):
flutter build apk --release
```

Signing (مثال):

```bash
# إنشاء keystore
keytool -genkey -v -keystore key.jks -alias faazha_key -keyalg RSA -keysize 2048 -validity 10000
# ثم انسخ key.jks إلى apps/mobile/android/app/ واملأ android/key.properties
```

ملفات مهمة:
- lib/main.dart — نقطة البداية مع مثال اتصال بالـ API
- pubspec.yaml — تبعيات المشروع

