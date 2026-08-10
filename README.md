# Faazha

مشروع Faazha — monorepo TypeScript يحتوي على خادم Express موجود داخل `artifacts/api-server` وتطبيق واجهة مبسط تم إضافته باستخدام Next.js + TypeScript داخل `apps/web`.

الهدف: تشغيل واجهة Next.js (TypeScript) وربطها بخادم API القائم أو تشغيلهما منفصلين.

## ما الذي أُضيف
- تطبيق Next.js (App Router) + TypeScript في `apps/web/`.
- تعديل `pnpm-workspace.yaml` لإضافة `apps/*` إلى workspace.
- ملف README هذا لشرح كيفية التشغيل والتطوير.
- إعداد إعادة توجيه محلية في `apps/web/next.config.js` ليحول مسارات `/api/*` إلى خادم API (افتراضيًا `http://localhost:3001`).

## المتطلبات
- Node.js (18+ موصى به)
- pnpm

## التشغيل السريع (من جذر المستودع)
1. ثبت الحزم:

```bash
pnpm install
```

2. لتشغيل تطبيق الواجهة فقط (Next.js):

```bash
pnpm --filter @workspace/web dev
```

أو من داخل المجلد:

```bash
cd apps/web
pnpm install
pnpm dev
```

3. لتشغيل خادم API الموجود (Express):

```bash
cd artifacts/api-server
export PORT=3001
pnpm run dev
```

4. تشغيل كلا الخدمتين معًا:
- شغّل API على PORT=3001 وNext على المنفذ الافتراضي 3000. الواجهة ستحوّل طلبات /api إلى `http://localhost:3001/api/...` تلقائيًا أثناء التطوير.

## المتغيرات البيئية الهامة
- PORT — مطلوب لتشغيل `artifacts/api-server`.
- NEXT_PUBLIC_API_URL — (اختياري) إذا أردت توجيه الواجهة إلى API مختلف في وقت التشغيل، عيّنه في `.env.local`, مثال:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## تطوير واقتراحات لاحقة
- إضافة Tailwind + دعم RTL للواجهات العربية.
- نقل بعض endpoints من Express إلى Next API routes إذا أردت دمج الواجهة والخادم في نفس الخدمة.
- إعداد CI لتشغيل typechecks وبناء الحزم في كل فرع.

## ربط مع الفرع العمل الحالي
التغييرات أُنشئت في الفرع `add-nextjs-app`، راجع الالتزام الأخير لخطوات التفصيل.

---

License: MIT
