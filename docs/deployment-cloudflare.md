# Деплой сайта, домена и почты

Ниже базовая схема для `santekhnic-yerevan.am`.

## 1. Подключить домен к Cloudflare

1. Добавьте домен в Cloudflare.
2. У регистратора замените nameservers на те, что выдаст Cloudflare.
3. Дождитесь активации зоны.

## 2. Поднять сайт в Cloudflare Pages

1. В Cloudflare откройте `Workers & Pages`.
2. Создайте новый `Pages` project из GitHub-репозитория проекта.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. После первого деплоя добавьте custom domain:
   - `santekhnic-yerevan.am`
   - `www.santekhnic-yerevan.am` при необходимости

## 3. Настроить входящую почту на домене

Рекомендуемый публичный адрес на сайте:

- `info@santekhnic-yerevan.am`

В `Email Routing`:

1. Включите Email Routing.
2. Создайте правило:
   - custom address: `info`
   - destination inbox: ваш реальный ящик
3. Подтвердите destination inbox по письму от Cloudflare.

## 4. Настроить исходящую почту для формы

Форма отправляет заявки через Gmail SMTP из Cloudflare Pages Function.

Фактические SMTP-настройки в коде:

- host: `smtp.gmail.com`
- port: `587`
- TLS: STARTTLS
- username: задаётся через `GMAIL_SMTP_USER`
- recipient: задаётся через `CONTACT_NOTIFICATION_TO`

Для Gmail нужно включить двухфакторную аутентификацию и создать App Password:

- Google Account → Security → 2-Step Verification → App passwords
- тип приложения: Mail
- полученный пароль сохранить только как Cloudflare Pages secret

В Cloudflare Pages → Settings → Variables and Secrets → Production добавить runtime secret:

- `GMAIL_SMTP_USER`: Gmail-ящик, от имени которого отправляются письма
- `GMAIL_APP_PASSWORD`: Gmail App Password
- `CONTACT_NOTIFICATION_TO`: ящик, куда приходят заявки
- `SMTP_EHLO_DOMAIN`: `santekhnic-yerevan.am` опционально

После изменения secrets нужен новый production redeploy.

## 5. Настроить публичные переменные сайта

В Pages variables:

- `VITE_SITE_URL=https://santekhnic-yerevan.am`
- `VITE_CONTACT_EMAIL=info@santekhnic-yerevan.am`
- `VITE_GA_MEASUREMENT_ID=...`
- `VITE_GA_CONSENT_MODE=advanced`

## 6. Что уже сделано в коде

- живая serverless-ручка: `/api/contact`
- отправка формы с фронтенда на backend
- вложения файлов для фото и документов
- валидация полей и ограничение вложений
- автоответ заявителю, если в форме указан email
- публичный email вынесен в `VITE_CONTACT_EMAIL`

## 7. Ограничения

- видео из формы лучше отправлять в WhatsApp, а не через сайт
- лимит вложений в текущей реализации: до 8 файлов и до 3 МБ суммарно
- локальный `vite dev` не поднимает Pages Functions

Для локальной проверки формы:

```bash
npm run dev:pages
```
