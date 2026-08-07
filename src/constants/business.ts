export const BUSINESS = {
  name: 'Zorch Farms',
  location: 'Majek, Bashorun Town, Lagos State, Nigeria',
  phoneDisplay: '+234 8031310752',
  phoneLink: 'tel:+2348031310752',
  email: 'awele.juga@gmail.com',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER ?? '2348031310752',
} as const

export const CATEGORY_META = {
  'fresh-produce': { name: 'Fresh Produce', description: 'Farm-fresh Tomatoes, Peppers, Eggs and Vegetables.', image: `${import.meta.env.BASE_URL}images/tomato-image.jpg` },
  proteins: { name: 'Proteins', description: 'Frozen staples for every kitchen.', image: `${import.meta.env.BASE_URL}images/proteins-collage.jpg` },
  'bulk-staples': { name: 'Bulk Staples', description: 'Buy in bulk wholesale quantities for business or household.', image: `${import.meta.env.BASE_URL}images/rice-egg-tomato.jpg` },
  pantry: { name: 'Pantry & Oils', description: 'Kitchen essentials selected for everyday cooking.', image: `${import.meta.env.BASE_URL}images/pantry-oils.jpg` },
} as const
