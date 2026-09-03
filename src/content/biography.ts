import type { Era } from './types'

export const eras: Era[] = [
  {
    id: 'childhood',
    eyebrow: 'Глава 01',
    title: 'Маленькая Арина',
    years: '2007 — детство',
    story:
      'Самые ранние воспоминания — семейные видео, садик, бабушки, дача и Таёжный. Маленькая Арина много смеялась, встречала родителей с работы и однажды пела в темноте песню про «колечко», натянув шапку на глаза.',
    photos: [
      { src: '/media/childhood/hero-01.webp', alt: 'Детская фотография Арины', caption: 'Детство', date: '2007–2012' },
      { src: '/media/childhood/bear.webp', alt: 'Арина в детстве', caption: 'Ещё один кадр из детства' },
      { src: '/media/childhood/arina-little-01.webp', alt: 'Арина в детстве с цветком', caption: 'Таёжный архив' },
      { src: '/media/childhood/arina-little-02.webp', alt: 'Арина с мамой в детстве', caption: 'Семейный кадр' },
      { src: '/media/childhood/arina-little-04.webp', alt: 'Арина в машине в детстве', caption: 'Дорога' },
      { src: '/media/childhood/arina-little-05.webp', alt: 'Арина с мамой в саду', caption: 'Дачный сезон' },
      { src: '/media/childhood/arina-little-06.webp', alt: 'Арина в костюме на празднике', caption: 'Праздничный билд' },
      { src: '/media/childhood/arina-little-07.webp', alt: 'Арина с папой и грибами', caption: 'Семейная добыча' },
      { src: '/media/childhood/arina-little-08.webp', alt: 'Арина в детстве дома', caption: 'Домашний кадр' },
      { src: '/media/childhood/arina-little-09.webp', alt: 'Арина на детском празднике', caption: 'Утренник' },
      { src: '/media/childhood/baby-01.gif', alt: 'Арина совсем маленькая в движении', caption: 'Ранний GIF' },
      { src: '/media/childhood/baby-02.gif', alt: 'Арина в детстве улыбается на видео', caption: 'Видеоархив' },
    ],
    song: {
      title: 'Три желания',
      artist: 'Маша и Медведь',
      src: '/media/audio/Маша и Медведь - Три желания.mp3',
    },
  },
  {
    id: 'school-1-4',
    eyebrow: 'Глава 02',
    title: 'Та самая отличница',
    years: '1–4 класс',
    story:
      'Таёжная средняя школа. Арина была отличницей — причём, по её версии, настолько убедительной, что её хвалила буквально вся школа.',
    photos: [
      { src: '/media/school/1-4/01.webp', alt: 'Арина в начальной школе', caption: 'Начальная школа' },
      { src: '/media/school/1-4/02.webp', alt: 'Школьная фотография Арины', caption: 'Фото с классом' },
      { src: '/media/school/1-4/arina-school-event.webp', alt: 'Арина на школьном празднике', caption: 'Школьное событие' },
    ],
    song: {
      title: 'Ай, будет круто!',
      artist: 'Детский хор Великан',
      src: '/media/audio/deti-online.com_-_ay-budet-kruto.mp3',
    },
  },
  {
    id: 'school-5-9',
    eyebrow: 'Глава 03',
    title: 'Новая школа, новые люди',
    years: '2018–2023',
    story:
      'После переезда в Советский началась школа №1 и появились друзья, которые остались рядом до сих пор: Дарина, Даша, Алина и Арина. В 2023 году была поездка с классом в Казань. А где-то в седьмом классе случилась эпоха легендарных графичных «кирпичных бровей».',
    photos: [
      { src: '/media/school/5-9/01.webp', alt: 'Арина в школе №1', caption: 'Советский' },
      { src: '/media/school/5-9/kazan.webp', alt: 'Поездка Арины в Казань', caption: 'Казань', date: '2023' },
      { src: '/media/school/5-9/arina-trip.webp', alt: 'Арина с семьёй у Кунгурской пещеры', caption: 'Кунгурская пещера', date: '6 класс · 2019' },
      { src: '/media/school/5-9/brows.webp', alt: 'Кирпичные брови Арины', caption: 'Архив модных решений' },
    ],
    song: {
      title: 'Самый лучший эмо панк',
      artist: 'Пошлая Молли',
      src: '/media/audio/Пошлая Молли - Самый лучший эмо панк.mp3',
    },
  },
  {
    id: 'school-10-11',
    eyebrow: 'Глава 04',
    title: 'Математика и выпускной режим',
    years: '10–11 класс',
    story:
      'Новые знакомства, Олеся и Виталий, а ещё серьёзное увлечение математикой. Школьная история постепенно подходила к финалу.',
    photos: [
      { src: '/media/school/10-11/01.webp', alt: 'Арина в 10–11 классе', caption: 'Старшая школа' },
      { src: '/media/school/10-11/classroom-01.webp', alt: 'Арина в 10–11 классе', caption: 'Старшая школа' },
      { src: '/media/school/10-11/classroom-02.webp', alt: 'Арина с одноклассниками', caption: 'Одноклассники' },
      { src: '/media/school/10-11/classroom-03.webp', alt: 'Арина на школьной перемене', caption: 'Школьный день' },
      { src: '/media/school/10-11/classroom-04.webp', alt: 'Арина с друзьями в школе', caption: 'Своя компания' },
      { src: '/media/school/10-11/classroom-05.webp', alt: 'Арина с одноклассниками', caption: 'Архив класса' },
      { src: '/media/school/10-11/classroom-06.webp', alt: 'Арина в старшей школе', caption: 'Ещё один кадр' },
    ],
    song: {
      title: 'Наперегонки с ветром',
      artist: 'Корни',
      src: '/media/audio/korni-naperegonki-s-vetrom.mp3',
    },
  },
  {
    id: 'urfu-1',
    eyebrow: 'Глава 05',
    title: 'Первый курс УрФУ',
    years: '2025–2026',
    story:
      'ИНЭУ, бизнес-информатика, бакалавриат. Первый курс запомнился как очень тёплый и в целом лёгкий: много новых классных людей, знакомые лица из Советского и одна отдельная сюжетная линия под названием «менеджмент», который удалось окончательно закрыть только в марте.',
    photos: [
      { src: '/media/urfu/year-1-01.webp', alt: 'Арина в УрФУ', caption: 'Первый курс' },
      { src: '/media/urfu/year-1-friends.webp', alt: 'Друзья Арины в УрФУ', caption: 'Новые люди' },
    ],
    song: {
      title: 'Magic City',
      artist: 'Yung Trappa feat. Yung Pretty',
      src: '/media/audio/Yung Trappa feat. Yung Pretty - Magic City.mp3',
    },
  },
  {
    id: 'urfu-2',
    eyebrow: 'Глава 06',
    title: 'Второй курс.exe',
    years: 'сентябрь 2026',
    story: 'Загрузка новой главы. Всё только начинается.',
    video: {
      src: '/media/urfu/year-2.gif',
      title: 'Видео второго курса',
      description: 'Первый кадр новой главы',
      kind: 'gif',
    },
    photos: [],
    song: {
      title: 'MISS U',
      artist: 'AQUAKEY',
      src: '/media/audio/AQUAKEY - MISS U.mp3',
    },
  },
]
