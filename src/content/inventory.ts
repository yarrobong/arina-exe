export type InventoryRarity = 'Rare' | 'Epic' | 'Legendary' | 'Mythic'

export type InventoryItem = {
  id: string
  slot: number
  name: string
  kind: string
  rarity: InventoryRarity
  status: string
  photo?: string
  origin?: string
  memory?: string
  archiveLink?: string
  archiveLabel?: string
}

export const inventory: InventoryItem[] = [
  {
    id: 'jewelry',
    slot: 1,
    name: 'Любимые украшения',
    kind: 'ACCESSORY',
    rarity: 'Legendary',
    status: 'ACTIVE',
  },
  {
    id: 'phone',
    slot: 2,
    name: 'Телефон',
    kind: 'DEVICE',
    rarity: 'Epic',
    status: 'ACTIVE',
  },
  {
    id: 'bag',
    slot: 3,
    name: 'Сумка',
    kind: 'ACCESSORY',
    rarity: 'Rare',
    status: 'ACTIVE',
  },
  {
    id: 'childhood-bear',
    slot: 4,
    name: 'Мишка из детства',
    kind: 'MEMORY ITEM',
    rarity: 'Mythic',
    status: 'ARCHIVED',
    photo: '/media/childhood/bear.webp',
    origin: 'детский сад',
    memory: 'Любимый мишка из детского сада. Он участвовал в выступлении «Синяя птица» — Арина запомнила его за особенно милую мордочку.',
    archiveLink: '#childhood',
    archiveLabel: 'ВЕРНУТЬСЯ В ДЕТСТВО',
  },
]
