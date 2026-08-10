# بناء متعدد المراحل لاستخدام pnpm وبناء تطبيق Next.js داخل monorepo (apps/web)
FROM node:20-alpine AS builder
WORKDIR /app

# تفعيل corepack لاستخدام pnpm المضمّن
RUN corepack enable && corepack prepare pnpm@latest --activate

# انسخ ملفات القفل وملفات التهيئة للاستفادة من cache
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./

# انسخ بقية المشروع
COPY . .

# ثبت الحزم
RUN pnpm install --frozen-lockfile

# بنِ تطبيق الويب
WORKDIR /app/apps/web
RUN pnpm --filter=@workspace/web build || pnpm --filter=apps/web build

# مرحلة التشغيل الخفيفة
FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# انسخ مخرجات البناء وملفات التشغيل اللازمة من مرحلة البيلدر
COPY --from=builder /app/apps/web ./

ENV NODE_ENV=production
EXPOSE 3000

# استخدم pnpm start أو next start حسب السكربت
CMD ["pnpm","start"]
