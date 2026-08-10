# نشر على rocket.new باستخدام Docker

الخيار 1 — نشر باستخدام واجهة rocket.new مباشرة (تأكد من دعم pnpm):
- Install command: pnpm install
- Build command: pnpm --filter=@workspace/web build
  أو: pnpm --filter=apps/web build
- Root directory: جذر المستودع أو apps/web (حسب اختيار المنصة)
- Output: apps/web/.next أو apps/web/out (إن استخدمت next export)
- Start: pnpm --filter=@workspace/web start أو next start

الخيار 2 — نشر باستخدام Docker (موصى به إن لم تدعم المنصة pnpm/workspaces):
1. استخدم Dockerfile الموجود في جذر المستودع.
2. خطوات محلية لاختبار:
   - docker build -t faazha:latest .
   - docker run -p 3000:3000 faazha:latest
