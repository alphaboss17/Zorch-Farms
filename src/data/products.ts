import { fa } from 'zod/v4/locales'
import type { Product } from '../types/product'

export const products: Product[] = [
  { id: 'plum-tomatoes', name: 'Tomatoes',
    category: 'fresh-produce', measurementOptions: ['Crate', 'Half Crate', 'Paint Bucket'],
    description: 'Farm fresh, firm tomatoes.', 
    image: 'public/images/tomato-image.jpg', featured: true, popular: true,
  },

  { id: 'eggs', name: 'Eggs',
    category: 'fresh-produce', measurementOptions: ['Crate', 'Half Crate',],
    description: 'Farm fresh eggs, carefully packed for delivery.', 
    image: 'public/images/eggs.jpg', featured: true, popular: false,
  },

  { id: 'red-onions', name: 'Red Onions', 
    category: 'fresh-produce', measurementOptions: ['Bag', 'Half Bag', 'Paint Bucket'], 
    description: 'Large red onions with dependable flavour and keeping quality.', 
    image: 'public/images/onions-image.jpg', featured: true, popular: false,
  },

  { id: 'scotch-bonnet', name: 'Scotch Bonnet (Rodo)', 
    category: 'fresh-produce', measurementOptions: ['Paint Bucket', 'Half Paint Bucket'], 
    description: 'Aromatic Nigerian rodo for the right amount of heat.', 
    image: 'public/images/pepper-image.jpg', featured: true, popular: true, 
  },

  // { id: 'fresh-plantain', name: 'Fresh Plantain',
  //   category: 'fresh-produce', measurementOptions: ['Bunch', 'Half Bunch'], 
  //   description: 'Selected green and ripe plantains, packed with care.', 
  //   image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&w=800&q=85', featured: true, popular: true, 
  // },

  { id: 'whole-chicken', name: 'Whole Chicken', 
    category: 'proteins', measurementOptions: ['1kg', '2kg', '5kg', '10kg'], 
    description: 'Clean, frozen chicken portions for practical meal planning.', 
    image: 'public/images/chicekn.jpg', featured: true, popular: true, 
  },

  { id: 'frozen-turkey', name: 'Frozen Turkey', 
    category: 'proteins', measurementOptions: ['1kg', '2kg', '5kg', '10kg'], 
    description: 'Quality frozen turkey cuts for family and entertaining.', 
    image: 'public/images/turkey.jpg', featured: true, popular: false, 
  },

  { id: 'titus-fish', name: 'Titus Fish', 
    category: 'proteins', measurementOptions: ['1kg', '2kg', '5kg', ], 
    description: 'Quality frozen Titus Fish', 
    image: 'public/images/titus.jpg', featured: true, popular: false, 
  },

  { id: 'long-grain-rice', name: 'Long Grain Rice', 
    category: 'bulk-staples', measurementOptions: ['Paint Rubber', 'Half Paint Rubber', 'Bag'], 
    description: 'Long-grain rice for everyday kitchens.', 
    image: 'public/images/rice-image.jpg', featured: true, popular: true,
  },
  { id: 'brown-beans', name: 'Brown Beans', 
    category: 'bulk-staples', measurementOptions: ['Paint Rubber', 'Half Paint Rubber', 'Bag'], 
    description: 'Clean brown beans for porridge, moi moi, and akara.', 
    image: 'public/images/beans.jfif', featured: false, popular: false, 
  },
  // { id: 'palm-oil', name: 'Red Palm Oil', 
  //   category: 'pantry', measurementOptions: ['1L', '5L', '25L'], 
  //   description: 'Rich, vibrant red palm oil for authentic Nigerian cooking.', 
  //   image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=85', featured: true, popular: false, 
  // },

  { id: 'dried-fish', name: 'Dried Fish', 
    category: 'proteins', measurementOptions: ['1 portion',], 
    description: 'Dried fish for soups and stews.', 
    image: 'public/images/dried-fish.jpg', featured: true, popular: false, 
  },

  { id: 'vegetable-oil', name: 'Vegetable Oil', 
    category: 'pantry', measurementOptions: ['1L', '5L', '25L'], 
    description: 'A reliable cooking staple for the household pantry.', 
    image: 'public/images/veg-oil1.jpg', featured: true, popular: false, 
  },
]

export const getProduct = (id: string) => products.find((product) => product.id === id)
