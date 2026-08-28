# Сантехник

Текущий проект реализован как `React 18 + TypeScript + Vite` SPA с локалями `ru` и `hy`.
Русская версия является основной и открывается на `/`; армянская версия открывается на `/hy/`.

## Команды

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run dev:pages`
- `npm run deploy:pages`

## Переменные окружения

Для корректных canonical URL и Open Graph укажите домен сайта:

```bash
VITE_SITE_URL=https://santechnik-yerevan.am
VITE_CONTACT_EMAIL=info@santechnik-yerevan.am
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GA_CONSENT_MODE=advanced
```

`VITE_GA_MEASUREMENT_ID` включает Google Analytics 4 через consent banner. `VITE_GA_CONSENT_MODE=advanced` загружает Google tag с default denied и cookieless pings до выбора пользователя; для строгого режима без запросов к Google до согласия используйте `basic`.

Если домен поменяется, замените `VITE_SITE_URL` на новый HTTPS-домен без слеша в конце.

## Деплой на домен

Проект подготовлен под `Cloudflare Pages + Cloudflare Email Service`.

- Сайт: Cloudflare Pages
- Домен: через Cloudflare DNS
- Переадресация входящей почты: Cloudflare Email Routing
- Отправка заявок с формы: Pages Function `/api/contact` через Gmail SMTP

См. пошаговую схему в [docs/deployment-cloudflare.md](/Users/david/projects/web/santekhnic/docs/deployment-cloudflare.md).

## Структура

- `src/` — актуальный фронтенд-код приложения.
- `public/` — статические файлы.
- `docs/` — актуальные заметки по деплою.
