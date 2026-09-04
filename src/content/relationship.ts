export type RelationshipEventType =
  | 'connection'
  | 'call'
  | 'idle'
  | 'media'
  | 'night'
  | 'meetup'
  | 'tarot'
  | 'first-meetup'
  | 'archive'
  | 'theater'

export type RelationshipEvent = {
  id: string
  period: string
  label: string
  title: string
  text: string
  type: RelationshipEventType
}

// Array order is story order. The UI renders it without sorting or regrouping.
export const relationshipTimeline: RelationshipEvent[] = [
  {
    id: 'connection',
    period: 'середина ноября',
    label: '01 / connection detected',
    title: 'Дайвинчик',
    text: 'Арина и Ярик познакомились на Дайвинчике. Связь перешла в Discord, а затем в TikTok — но постоянного общения ещё не было.',
    type: 'connection',
  },
  {
    id: 'voice-call',
    period: 'тот же ранний период',
    label: '02 / voice call',
    title: 'Первый созвон',
    text: 'Вместо стандартного «как дела» Ярик почти сразу предложил созвониться. Арина приятно удивилась. Они мило поговорили.',
    type: 'call',
  },
  {
    id: 'idle',
    period: 'после созвона',
    label: '03 / connection idle',
    title: 'Пауза',
    text: 'После первого звонка они какое-то время почти не общались. Связь не исчезла — просто затихла на несколько недель.',
    type: 'idle',
  },
  {
    id: 'tiktok',
    period: 'через пару недель',
    label: '04 / media exchange',
    title: 'TikTok',
    text: 'Они были друг у друга в TikTok и начали иногда пересылать видео. Это ещё не постоянная переписка — только редкие маленькие сигналы.',
    type: 'media',
  },
  {
    id: 'night-chat',
    period: 'одна конкретная ночь',
    label: '05 / conversation active',
    title: 'До самого утра',
    text: 'Ярик был на дне рождения Юли: Вадим сильно перепил, а Ярик лежал на втором этаже и переписывался с Ариной. У Арины друзья из Советского уже уснули. Они продолжали говорить примерно до шести–семи утра.',
    type: 'night',
  },
  {
    id: 'meetup-request',
    period: 'после ночной переписки',
    label: '06 / meetup request',
    title: 'Идея встретиться',
    text: 'После той ночи общение стало регулярнее. Ярик предложил встретиться: сначала просто погулять, но погода была не очень. Тут выяснилось, что им обоим нравятся «Очень странные дела». В тот момент выходил пятый сезон, и появилась идея посмотреть сериал вместе.',
    type: 'meetup',
  },
  {
    id: 'tarot-check',
    period: 'перед первой встречей',
    label: '07 / safety check',
    title: 'Сомнения и Таро',
    text: 'Арина сначала согласилась приехать. Потом подруга напомнила: она почти не знает Ярика и собирается к нему домой. Арина немного испугалась, и Олеся сделала расклад на Ярика и эту поездку.',
    type: 'tarot',
  },
  {
    id: 'first-meetup',
    period: 'начало декабря',
    label: '08 / first meetup',
    title: 'Первая встреча',
    text: 'После проверки встреча состоялась. С этой точки начинаются уже совместные воспоминания — и один очень розовый элемент образа.',
    type: 'first-meetup',
  },
  {
    id: 'our-archive',
    period: 'после первой встречи',
    label: '09 / memory archive',
    title: 'Дальше — вместе',
    text: 'Отношения продолжались, а вместе с ними рос архив совместных кадров. Точные даты этих фотографий не подписаны, поэтому они остаются одной честной подборкой без выдуманной хронологии.',
    type: 'archive',
  },
  {
    id: 'theater',
    period: 'май',
    label: '10 / romeo & juliet',
    title: 'Первый поход в театр',
    text: 'На первом акте они сидели практически в самой дальней точке. После путаницы с местами их неожиданно пересадили на первый ряд — туда, где билет стоил примерно 10 000 ₽.',
    type: 'theater',
  },
]

export const relationshipPhotos = [
  { src: '/media/relationship/our-photo-01.webp', alt: 'Арина и Ярик на скамейке' },
  { src: '/media/relationship/our-photo-02.webp', alt: 'Арина и Ярик на фоне заката' },
  { src: '/media/relationship/our-photo-03.jpg', alt: 'Совместное селфи Арины и Ярика' },
  ...Array.from({ length: 16 }, (_, index) => ({
    src: `/media/relationship/our-archive-${String(index + 1).padStart(2, '0')}.webp`,
    alt: `Совместный кадр из архива ${index + 1}`,
  })),
]

export const nightChatMoments = [
  { time: '01:47', activity: 'video · sent' },
  { time: '02:36', activity: 'ещё не спят' },
  { time: '03:12', activity: 'conversation · active' },
  { time: '04:48', activity: 'everyone else · offline' },
  { time: '05:38', activity: 'still typing…' },
  { time: '06:54', activity: 'good morning?' },
]
