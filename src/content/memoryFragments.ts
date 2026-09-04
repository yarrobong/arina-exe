export type MemoryFragment = {
  id: string
  label: string
  memory: string
  source: string
}

export const memoryFragments: MemoryFragment[] = [
  {
    id: 'childhood-barbie',
    label: 'CHILDHOOD SIGNAL',
    memory: 'В детстве Арина очень любила фильмы Barbie — и иногда пересматривает их до сих пор.',
    source: 'memory://childhood/barbie',
  },
  {
    id: 'taezhny-playground',
    label: 'LOCATION MEMORY',
    memory: 'В Таёжном одной из любимых точек была центральная площадка — до того, как её убрали.',
    source: 'memory://geography/taezhny',
  },
  {
    id: 'kazan-2023',
    label: 'SCHOOL MEMORY',
    memory: 'В 2023 году Арина ездила с классом в Казань.',
    source: 'memory://school/kazan',
  },
  {
    id: 'sport-build',
    label: 'SPORT MEMORY',
    memory: 'В 12–14 лет Арина была спортсменкой. Себе в 10 лет она сейчас сказала бы: «Не бросай спорт.»',
    source: 'memory://sport/build',
  },
  {
    id: 'urfu-warm',
    label: 'UNIVERSITY MEMORY',
    memory: 'Самым тёплым периодом жизни сейчас Арина называет первый курс УрФУ.',
    source: 'memory://urfu/year-1',
  },
  {
    id: 'pink-jeans',
    label: 'RELATIONSHIP MEMORY',
    memory: 'На первой встрече розовые джинсы выглядели как очень стильный выбор. На деле это были единственные чистые джинсы Ярика.',
    source: 'memory://relationship/pink-jeans',
  },
  {
    id: 'kindergarten-bear',
    label: 'ITEM MEMORY',
    memory: 'Любимый мишка пришёл из детского сада, участвовал в выступлении «Синяя птица» и запомнился Арине своей милой мордочкой.',
    source: 'memory://inventory/bear',
  },
]
