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
    photo: '/media/inventory/jewelry.webp',
  },
  {
    id: 'phone',
    slot: 2,
    name: 'Телефон',
    kind: 'DEVICE',
    rarity: 'Epic',
    status: 'ACTIVE',
    photo: '/media/inventory/phone.webp',
  },
  {
    id: 'bag',
    slot: 3,
    name: 'Сумка',
    kind: 'ACCESSORY',
    rarity: 'Rare',
    status: 'ACTIVE',
    photo: '/media/inventory/bag.webp',
  },
  {
    id: 'perfume',
    slot: 4,
    name: 'Духи',
    kind: 'FRAGRANCE',
    rarity: 'Epic',
    status: 'ACTIVE',
    photo: '/media/inventory/perfume.webp',
  },
  {
    id: 'chokers',
    slot: 5,
    name: 'Чокеры',
    kind: 'ACCESSORY',
    rarity: 'Rare',
    status: 'ACTIVE',
    photo: '/media/inventory/chokers.webp',
  },
  {
    id: 'pink-lamborghini',
    slot: 6,
    name: 'Розовый Lamborghini',
    kind: 'COLLECTIBLE',
    rarity: 'Legendary',
    status: 'ACTIVE',
    photo: '/media/inventory/pink-lamborghini.webp',
  },
]
