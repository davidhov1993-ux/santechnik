# Implementation Blueprint

> Примечание: этот документ описывает целевую архитектуру следующего этапа. Текущая реализация в репозитории собрана на `React + Vite`, поэтому разделы про `Next.js`, `App Router`, `next/image` и серверную генерацию пока не отражают фактическое состояние кода.

## 1. Рекомендуемый стек

Оптимальный вариант для этого проекта:

- `Next.js` с App Router
- `TypeScript`
- `Tailwind CSS` плюс собственные CSS variables для визуальной системы
- `Framer Motion` или нативная анимация через `motion`/`IntersectionObserver` для сцены и reveal-эффектов
- `MDX` или typed content-слой на `TypeScript` для страниц услуг, FAQ и SEO-контента
- `react-hook-form` + `zod` для формы заявки

Почему не "простая верстка":

- нужен сильный SEO
- нужен быстрый роутинг и хорошие метаданные
- нужен data-driven подход под масштабирование
- нужна аккуратная анимация без потери производительности

## 2. Архитектура приложения

### Предлагаемая структура

```text
app/
  [locale]/
    page.tsx
    layout.tsx
    uslugi/
      page.tsx
      [slug]/
        page.tsx
    o-kompanii/
      page.tsx
    pochemu-vybirayut-nas/
      page.tsx
    sertifikaty/
      page.tsx
    kontakty/
      page.tsx
    zayavka/
      page.tsx
    obekty/
      [slug]/
        page.tsx
    resheniya/
      [slug]/
        page.tsx
components/
  layout/
  scene/
  sections/
  blocks/
  forms/
  seo/
content/
  services/
  pages/
  faqs/
  objects/
  solutions/
lib/
  seo/
  analytics/
  i18n/
  utils/
public/
  images/
  icons/
  certificates/
  og/
styles/
  globals.css
  tokens.css
```

## 3. Data-driven контентная модель

Каждая услуга должна описываться объектом с единым набором полей.

Минимальные поля:

- `slug`
- `title`
- `shortTitle`
- `tagline`
- `metaTitle`
- `metaDescription`
- `heroDescription`
- `serviceSummary`
- `serviceBullets`
- `problemCases`
- `includedWorks`
- `objectTypes`
- `faq`
- `cta`
- `sceneNode`
- `seoCluster`

Это даст:

- генерацию service pages по шаблону
- единый контроль над SEO
- возможность строить главную сцену из данных, а не вручную

## 4. Компонентная система

### Layout

- `SiteHeader`
- `SiteFooter`
- `MobileActionBar`
- `SectionShell`
- `PageHero`

### Главная сцена

- `SwitchboardScene`
- `SwitchboardCore`
- `CableMap`
- `CablePath`
- `ServiceNode`
- `SceneLegend`
- `SceneOverlayStats`

### Контентные секции

- `ServiceRouteMatrix`
- `ObjectFitSection`
- `ProcessRail`
- `TrustPanel`
- `EmergencyStrip`
- `CertificateGrid`
- `FAQAccordion`
- `ConsultationCTA`

### Сервисные страницы

- `ServiceHero`
- `NeedSignals`
- `ScopeList`
- `ObjectUseCases`
- `WorkStages`
- `FailurePrevention`
- `ScenarioExamples`
- `RelatedServices`

## 5. Логика интерактивной сцены в коде

Лучший подход:

- сцена собирается в `SVG`, а не в Canvas
- сервисные узлы рендерятся как реальные HTML-ссылки поверх SVG-структуры
- линии кабелей — `path` с анимацией длины и свечения
- состояние активного узла хранится локально
- при `prefers-reduced-motion` анимация сводится к статичному состоянию

Почему SVG:

- лучше для доступности
- проще связать с DOM и SEO-переходами
- легче контролировать адаптацию по breakpoint

### Состояния сцены

- `idle` — схема собрана, лёгкое статичное свечение
- `revealed` — по скроллу открываются ветви
- `focused` — пользователь навёлся или перешёл по клавиатуре на узел
- `mobileLinear` — мобильный вертикальный режим

## 6. SEO-реализация на уровне кода

### Для каждой страницы

- `generateMetadata()`
- canonical URL
- Open Graph / Twitter cards
- JSON-LD на базе страницы и типа контента

### Для сервисных страниц

- серверный рендер
- статическая генерация с возможностью `revalidate`
- внутренняя перелинковка:
  со сцены
  из related services
  из FAQ
  из object pages

### Что обязательно добавить

- sitemap.xml
- robots.txt
- breadcrumbs
- organization schema
- service schema
- local business schema

## 7. Performance

Чтобы визуальный слой не убил скорость:

- hero-сцена без тяжёлого WebGL
- SVG + CSS transforms + ограниченный JS
- изображения в `next/image`
- lazy-load только второстепенных медиа
- шрифты через `next/font`
- минимальный client-side JS вне сцены и форм

Цель:

- быстрое появление hero
- стабильный CLS
- минимальный TBT

## 8. Анимации

Анимации должны подчеркивать инженерную логику.

Подход:

- кабельные линии раскрываются по маршрутам
- активный сервисный узел подсвечивается точечно
- счётчики и статусы проявляются без "прыжков"
- hover на desktop и tap-state на mobile должны быть предсказуемыми

Не делать:

- постоянные бегущие искры
- агрессивный параллакс
- хаотичное движение проводов
- анимацию, которая мешает читать

## 9. Mobile-first реализация

На мобильном нужен отдельный layout сцены, а не просто масштабирование.

Реализация:

- `SwitchboardSceneDesktop`
- `SwitchboardSceneMobile`

В мобильной версии:

- щиток сверху
- дальше центральная вертикальная магистраль
- сервисные точки чередуются слева и справа как инженерные подключения
- CTA-bar фиксирован внизу

## 10. Формы и лидогенерация

### Основная форма

Поля:

- имя
- телефон
- тип объекта
- интересующая услуга
- описание задачи
- срочность

### Поведение

- короткая форма на большинстве страниц
- расширенная форма на `/zayavka`
- аварийный сценарий должен иметь быстрый путь через кнопку звонка

### Интеграции второго этапа

- email-уведомления
- CRM
- Telegram-уведомления
- аналитика по источникам заявок

## 11. Аналитика

Полезные события:

- клик по аварийному CTA
- клик по номеру телефона
- открытие формы
- отправка формы
- переход в конкретную категорию из hero-сцены
- глубина скролла до блока доверия

Это позволит понять, какие направления приносят качественные лиды, а какие просто шум.

## 12. Масштабирование

Следующий уровень без смены архитектуры:

- добавить кейсы и объектные страницы
- добавить двуязычность `ru/hy`
- расширить FAQ-контент под SEO
- добавить калькулятор только если он не удешевляет восприятие
- подключить headless CMS на уже готовую типизированную модель

## 13. Практический порядок сборки

1. Поднять каркас Next.js-проекта.
2. Подключить design tokens и типографику.
3. Реализовать layout и глобальную навигацию.
4. Собрать data-модель категорий и маршрутов.
5. Сверстать главную сцену в desktop/mobile вариантах.
6. Собрать универсальный шаблон service page.
7. Добавить SEO-метаданные и JSON-LD.
8. Подключить формы и события аналитики.
9. Оптимизировать motion и performance.

Если идти именно в таком порядке, проект не развалится на этапе роста и не превратится в одноразовый лендинг.
