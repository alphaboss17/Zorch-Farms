export const BUSINESS = {
  name: 'Zorch Farms',
  location: 'Majek, Bashorun Town, Lagos State, Nigeria',
  phoneDisplay: '+234 8031310752',
  phoneLink: 'tel:+2348031310752',
  email: 'awele.juga@gmail.com',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER ?? '2348031310752',
} as const

export const CATEGORY_META = {
  'fresh-produce': {
    name: 'Fresh Produce',
    description: 'Farm-fresh Tomatoes, Peppers, Eggs and Vegetables.',
    image: `${import.meta.env.BASE_URL}images/tomato-image.jpg`,
  },

  'frozen-foods': {
    name: 'Frozen Foods',
    description: 'Quality frozen foods for every kitchen.',
    image: `${import.meta.env.BASE_URL}images/proteins-collage.jpg`,
  },

  grains: {
    name: 'Grains',
    description: 'Rice, beans and other staple grains for your home or business.',
    image: `${import.meta.env.BASE_URL}images/rice-egg-tomato.jpg`,
  },

  oils: {
    name: 'Oils',
    description: 'Quality cooking oils for everyday meals and bulk buying.',
    image: `${import.meta.env.BASE_URL}images/veg-oil1.jpg`,
  },

  'soups-spices': {
    name: 'Soups & Spices',
    description: 'Essential soups, spices and seasonings for everyday cooking.',
    image: `${import.meta.env.BASE_URL}images/soup-spices.jpg`,
  },
} as const