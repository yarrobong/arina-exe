# Арина.exe — актуальный статус

## Готово

- Mobile-first Y2K / black-pink-silver интерфейс и адаптивная desktop-stage оболочка.
- Hero с тремя реальными фотографиями, peek следующего кадра и приоритетной загрузкой первого изображения.
- Активная якорная навигация по главам и устойчивые deep links к lazy-секциям.
- Биографические главы с реальными фотографиями, photo stack / Scrollaroids и course media.
- Детский VHS Video Archive, Sport Archive и линия обучения.
- Географический scroll-story и interactive explore на MapLibre с реальными точками и OSM tiles.
- Evolution / Arina.exe changelog, People Archive, Relationship timeline и архив из 19 фотографий.
- NightChat, TarotCheck, Theater Memory, Facts, Inventory, Compromat и Future.
- Memory Fragments с `localStorage`, lazy-loaded reveal, Escape/overlay close и reduced-motion режимом.
- Music Dock с реальными треками и привязкой к жизненным главам.
- Lazy loading изображений, видео, секций и MapLibre; мобильные paint/GPU ограничения для тяжёлых эффектов.
- Проверка media references, оптимизация изображений/SVG и production H.264 media pipeline.
- Автоматический deploy в GitHub Pages с корректным `/arina-exe/` base.
- Canonical, Open Graph, Twitter и Apple mobile metadata.

## Остаётся

- Проверить ощущения от scroll-story, карты, fixed overlays и видеодекодирования на нескольких реальных iPhone/iPad поколениях.
- При появлении новых исходных медиа прогонять media pipeline и контролировать размер Pages-артефакта.
- Уязвимость Sharp/libvips остаётся только в dev media tooling: исправление требует перехода с Sharp 0.34 на 0.35 (semver-major), поэтому обновление следует делать отдельным проверяемым проходом.

Биографические факты, хронология relationship, координаты карты, аудиотреки и порядок фотографий считаются утверждённым контентом и не должны меняться в технических polish-pass без отдельного запроса.
