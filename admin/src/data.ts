import type { Category } from './types'

const productArt = (emoji: string, color: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="20" fill="${color}"/><text x="60" y="72" font-size="52" text-anchor="middle">${emoji}</text></svg>`,
  )}`

export const artForCategory = (category: Category) => {
  const art: Record<Category, [string, string]> = {
    'Fresh Produce': ['🥬', '#e6f6d9'],
    'Frozen Foods': ['🍗', '#e7f4f5'],
    'Rice & Beans': ['🫘', '#f7eed8'],
    Oil: ['🫗', '#fff4cc'],
    Spices: ['🌶️', '#fff0df'],
    'Soup Ingredients': ['🥣', '#f1eadf'],
  }

  const selectedArt = art[category]

  if (!selectedArt) {
    return productArt('🛒', '#eef1f3')
  }

  return productArt(...selectedArt)
}