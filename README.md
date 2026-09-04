# Арина.exe

Mobile-first биографический сайт и интерактивный цифровой архив воспоминаний в Y2K / black-pink-silver эстетике. Production: [yarrobong.github.io/arina-exe](https://yarrobong.github.io/arina-exe/).

## Стек

- React 19 + TypeScript + Vite 7
- Motion for React
- MapLibre GL JS с динамической загрузкой географической главы
- Tailwind CSS 4 и проектные CSS-стили
- Sharp, SVGO и FFmpeg для media pipeline

## Запуск и проверка

Требуется Node.js 24. FFmpeg обязателен для production-конвертации видео и аудио.

```bash
npm ci
npm run dev
npm run verify-media
npm run build
npm run preview
```

Vite использует `base: '/arina-exe/'`, а `assetUrl()` добавляет этот base к путям из content-файлов. Это сохраняет корректные URL на GitHub Pages и в локальной разработке.

## Контент и архитектура

Биография и факты отделены от компонентов и находятся в `src/content/`: `biography.ts`, `places.ts`, `people.ts`, `relationship.ts`, `facts.ts`, `evolution.ts`, `inventory.ts` и `memoryFragments.ts`. Медиа лежат в `public/media/`.

Главы ниже первого экрана загружаются через `React.lazy` и `LazySection`. Deep links дожидаются стабилизации геометрии, но сразу уступают управление пользователю. MapLibre остаётся отдельным динамическим чанком. Состояние найденных Memory Fragments хранится в `localStorage`, а Motion-модалка загружается только при первом открытии. Music Dock соблюдает browser autoplay policy.

## Media pipeline

- `npm run optimize-media` подготавливает WebP из `media-originals/`; исходники не меняются.
- `npm run optimize-media:existing` повторно обрабатывает существующие изображения.
- `npm run optimize:theater-map` чистит исходный SVG схемы через SVGO и создаёт 1200px WebP для интерфейса.
- `npm run verify-media` проверяет статические ссылки на `/media/...` до сборки.
- `npm run build` запускает TypeScript/Vite, сжимает крупные MP3, создаёт mobile-sized H.264/MP4 с `faststart` из используемых WebM и удаляет staging/неиспользуемые deploy-ассеты. У `year-2` аудио сохраняется, если оно присутствует в исходнике.

Исходные WebM остаются в репозитории и используются dev-сервером. В production они заменяются более совместимыми MP4 без хранения второй тяжёлой копии.

## Деплой

`.github/workflows/deploy.yml` собирает `main` на Node.js 24, использует npm cache, проверяет наличие FFmpeg и публикует `dist/` через GitHub Pages. Исторический Cloudflare-командный путь сохранён явно как `npm run deploy:cloudflare`.
