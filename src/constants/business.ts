export const BUSINESS = {
  name: 'Zorch Farms',
  location: 'Majek, Bashorun Town, Lagos State, Nigeria',
  phoneDisplay: '+234 8154780923',
  phoneLink: 'tel:+2348154780923',
  email: 'hello@zorchfarms.ng',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER ?? '2348154780923',
} as const

export const CATEGORY_META = {
  'fresh-produce': { name: 'Fresh Produce', description: 'Farm-fresh Tomatoes, Peppers, Eggs and Vegetables.', image: 'public/images/tomato-image.jpg' },
  proteins: { name: 'Proteins', description: 'Frozen staples for every kitchen.', image: 'public/images/proteins-collage.jpg' },
  'bulk-staples': { name: 'Bulk Staples', description: 'Buy in bulk wholesale quantities for business or household.', image: 'public/images/rice-egg-tomato.jpg' },
  pantry: { name: 'Pantry & Oils', description: 'Kitchen essentials selected for everyday cooking.', image: 'public/images/pantry-oils.jpg' },
} as const

