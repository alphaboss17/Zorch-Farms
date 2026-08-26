import type { Category, Product } from './types'

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

export const initialProducts: Product[] = [
  {
    id: 'tomatoes',
    slug: 'fresh-tomatoes',
    name: 'Fresh Tomatoes',
    category: 'Fresh Produce',
    description: 'Fresh, ripe tomatoes selected for everyday cooking.',
    image_url: productArt('🍅', '#fce8df'),
    featured: true,
    popular: true,
    available: true,
    variants: [
      {
        id: 'tomatoes-basket',
        product_id: 'tomatoes',
        measurement: 'Basket',
        price: 12000,
        available: true,
      },
    ],
  },

  {
    id: 'pepper',
    slug: 'fresh-pepper',
    name: 'Fresh Pepper',
    category: 'Fresh Produce',
    description: 'Vibrant fresh pepper for soups and sauces.',
    image_url: productArt('🌶️', '#fff0df'),
    featured: false,
    popular: true,
    available: true,
    variants: [
      {
        id: 'pepper-paint-bucket',
        product_id: 'pepper',
        measurement: 'Paint Bucket',
        price: 15000,
        available: true,
      },
    ],
  },

  {
    id: 'onions',
    slug: 'onions',
    name: 'Onions',
    category: 'Fresh Produce',
    description: 'Clean, firm onions for the kitchen.',
    image_url: productArt('🧅', '#f7edd9'),
    featured: false,
    popular: true,
    available: true,
    variants: [
      {
        id: 'onions-basket',
        product_id: 'onions',
        measurement: 'Basket',
        price: 28000,
        available: true,
      },
    ],
  },

  {
    id: 'vegetables',
    slug: 'fresh-vegetables',
    name: 'Fresh Vegetables',
    category: 'Fresh Produce',
    description: 'A fresh bundle of leafy vegetables.',
    image_url: productArt('🥬', '#e6f6d9'),
    featured: false,
    popular: false,
    available: true,
    variants: [
      {
        id: 'vegetables-paint-rubber',
        product_id: 'vegetables',
        measurement: 'Paint Rubber',
        price: 3500,
        available: true,
      },
    ],
  },

  {
    id: 'chicken',
    slug: 'frozen-chicken',
    name: 'Frozen Chicken',
    category: 'Frozen Foods',
    description: 'Quality frozen chicken, neatly packed.',
    image_url: productArt('🍗', '#f7ebdf'),
    featured: true,
    popular: true,
    available: true,
    variants: [
      {
        id: 'chicken-carton',
        product_id: 'chicken',
        measurement: 'Carton',
        price: 42000,
        available: true,
      },
    ],
  },

  {
    id: 'turkey',
    slug: 'frozen-turkey',
    name: 'Frozen Turkey',
    category: 'Frozen Foods',
    description: 'Premium frozen turkey portions.',
    image_url: productArt('🦃', '#f4ebdc'),
    featured: false,
    popular: false,
    available: false,
    variants: [
      {
        id: 'turkey-carton',
        product_id: 'turkey',
        measurement: 'Carton',
        price: 56000,
        available: false,
      },
    ],
  },

  {
    id: 'fish',
    slug: 'frozen-fish',
    name: 'Frozen Fish',
    category: 'Frozen Foods',
    description: 'Frozen fish for delicious home meals.',
    image_url: productArt('🐟', '#e2f3f5'),
    featured: false,
    popular: true,
    available: true,
    variants: [
      {
        id: 'fish-carton',
        product_id: 'fish',
        measurement: 'Carton',
        price: 38000,
        available: true,
      },
    ],
  },

  {
    id: 'rice',
    slug: 'rice',
    name: 'Rice',
    category: 'Rice & Beans',
    description: 'Premium long-grain rice for family meals.',
    image_url: productArt('🌾', '#f6f1df'),
    featured: true,
    popular: true,
    available: true,
    variants: [
      {
        id: 'rice-50kg',
        product_id: 'rice',
        measurement: '50kg',
        price: 85000,
        available: true,
      },
    ],
  },

  {
    id: 'beans',
    slug: 'beans',
    name: 'Beans',
    category: 'Rice & Beans',
    description: 'Clean beans, ready for your pantry.',
    image_url: productArt('🫘', '#f7eed8'),
    featured: false,
    popular: true,
    available: true,
    variants: [
      {
        id: 'beans-50kg',
        product_id: 'beans',
        measurement: '50kg',
        price: 110000,
        available: true,
      },
    ],
  },

  {
    id: 'palm-oil',
    slug: 'palm-oil',
    name: 'Palm Oil',
    category: 'Oil',
    description: 'Freshly processed red palm oil.',
    image_url: productArt('🫗', '#fff4cc'),
    featured: false,
    popular: true,
    available: true,
    variants: [
      {
        id: 'palm-oil-5l',
        product_id: 'palm-oil',
        measurement: '5L',
        price: 26000,
        available: true,
      },
    ],
  },

  {
    id: 'spices',
    slug: 'local-spices',
    name: 'Local Spices',
    category: 'Spices',
    description: 'A fragrant blend of local cooking spices.',
    image_url: productArt('🌶️', '#fff0df'),
    featured: false,
    popular: false,
    available: false,
    variants: [
      {
        id: 'spices-1kg',
        product_id: 'spices',
        measurement: '1kg',
        price: 6000,
        available: false,
      },
    ],
  },

  {
    id: 'soup',
    slug: 'soup-ingredients',
    name: 'Soup Ingredients',
    category: 'Soup Ingredients',
    description: 'Essential ingredients for Nigerian soups.',
    image_url: productArt('🥣', '#f1eadf'),
    featured: false,
    popular: true,
    available: true,
    variants: [
      {
        id: 'soup-paint-rubber',
        product_id: 'soup',
        measurement: 'Paint Rubber',
        price: 9500,
        available: true,
      },
    ],
  },
]