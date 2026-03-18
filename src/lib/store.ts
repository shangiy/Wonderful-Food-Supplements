export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  benefits: string[];
  ingredients: string[];
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export const categories: Category[] = [
  {
    id: 'vitamins',
    name: 'Vitamins and Minerals',
    description: 'Essential micronutrients for daily wellness.',
    imageUrl: 'https://picsum.photos/seed/vitamins/600/400'
  },
  {
    id: 'fitness',
    name: 'Protein and Fitness Supplements',
    description: 'Fuel your workouts and recovery.',
    imageUrl: 'https://picsum.photos/seed/fitness/600/400'
  },
  {
    id: 'weight',
    name: 'Weight Management',
    description: 'Support for healthy body composition.',
    imageUrl: 'https://picsum.photos/seed/weight/600/400'
  },
  {
    id: 'immune',
    name: 'Immune Support',
    description: 'Strengthen your natural defenses.',
    imageUrl: 'https://picsum.photos/seed/immune/600/400'
  },
  {
    id: 'digestive',
    name: 'Digestive Health',
    description: 'Promote gut health and regularity.',
    imageUrl: 'https://picsum.photos/seed/digestive/600/400'
  },
  {
    id: 'beauty',
    name: 'Beauty and Skin Nutrition',
    description: 'Radiate health from the inside out.',
    imageUrl: 'https://picsum.photos/seed/beauty/600/400'
  },
  {
    id: 'children',
    name: "Children's Nutrition",
    description: 'Vital nutrients for growing kids.',
    imageUrl: 'https://picsum.photos/seed/kids/600/400'
  }
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Tre-en-en Grain Concentrates',
    description: 'Unique and exclusive blend of whole food concentrates from wheat, rice and soy.',
    price: 3450,
    category: 'vitamins',
    imageUrl: '/TRE-EN-EN grain concentrates120caps.webp',
    benefits: ['Supports cellular energy', 'Promotes efficient nutrient absorption', 'Improves overall vitality'],
    ingredients: ['Wheat Germ', 'Rice Bran', 'Soy Bean'],
    featured: true
  },
  {
    id: '2',
    name: 'Salmon Oil Plus',
    description: 'Pure and potent fish oil with all 8 omega-3s for heart, brain, and joint health.',
    price: 4200,
    category: 'vitamins',
    imageUrl: '/salmon oil.webp',
    benefits: ['Heart health support', 'Brain health and clarity', 'Joint flexibility'],
    ingredients: ['Salmon Oil', 'Omega-3 fatty acids'],
    featured: true
  },
  {
    id: '3',
    name: 'NeoLifeShake',
    description: 'Delicious, protein-rich meal replacement shakes for weight management and daily nutrition.',
    price: 4950,
    category: 'fitness',
    imageUrl: "/NeoLife shake berries 'n cream.png",
    benefits: ['Glycemic response control', 'Muscle building support', 'Satiety for weight control'],
    ingredients: ['High Quality Protein', 'Fiber Blend', 'Vitamins & Minerals'],
    featured: true
  },
  {
    id: '5',
    name: 'Vitamin C Threshold Release',
    description: 'Slow-release vitamin C for all-day immune support and antioxidant protection.',
    price: 2850,
    category: 'immune',
    imageUrl: '/vitamin c 200tablets.webp',
    benefits: ['Immune system boost', 'Collagen production', 'Healthy gums'],
    ingredients: ['Ascorbic Acid', 'Rose Hips', 'Acerola Cherry'],
  },
  {
    id: '6',
    name: 'NeoLife Vita Guard',
    description: 'Broad-spectrum antioxidant protection for children in a great-tasting chewable tablet.',
    price: 3150,
    category: 'children',
    imageUrl: '/neoLife vita Guard.webp',
    benefits: ['Supports immune system', 'Antioxidant protection', 'Promotes healthy growth'],
    ingredients: ['Vitamin A', 'Vitamin C', 'Vitamin E', 'Zinc', 'Carotenoids'],
  },
  {
    id: '7',
    name: 'Aloe Vera Plus (1 Litre)',
    description: 'A refreshing and natural aloe vera drink designed to support digestion, detoxification, and overall wellness.',
    price: 2450,
    category: 'digestive',
    imageUrl: '/aloe vera plus.webp',
    benefits: ['Supports digestion', 'Detoxification', 'Immune system support'],
    ingredients: ['Pure Aloe Vera', 'Herbal Tea Blend', 'Electrolytes'],
  },
  {
    id: '8',
    name: 'Beta Guard Nutrition (100 Capsules)',
    description: 'A powerful antioxidant supplement formulated to protect cells from oxidative stress. Supports eye health and immune function.',
    price: 3800,
    category: 'immune',
    imageUrl: '/beta guard.webp',
    benefits: ['Cell protection', 'Immune function', 'Eye health support'],
    ingredients: ['Beta-Carotene', 'Vitamin C', 'Vitamin E', 'Selenium', 'Zinc'],
  },
  {
    id: '9',
    name: 'Carotenoid Complex (30 Capsules)',
    description: 'A blend of natural carotenoids that supports healthy vision, skin, and immune system.',
    price: 5200,
    category: 'vitamins',
    imageUrl: '/carotenoid complex.webp',
    benefits: ['Healthy vision', 'Skin health', 'Immune support'],
    ingredients: ['Carrots', 'Tomatoes', 'Spinach', 'Red Bell Peppers'],
  },
  {
    id: '10',
    name: 'Ulcer Management Pack',
    description: 'Specially formulated supplements aimed at supporting stomach health and managing ulcers. Helps soothe the digestive tract and promote healing.',
    price: 7200,
    category: 'digestive',
    imageUrl: '/ulcer management.webp',
    benefits: ['Stomach health', 'Soothes digestive tract', 'Promotes healing'],
    ingredients: ['Herbal Extracts', 'Enzymes', 'Nutrients'],
  },
  {
    id: '11',
    name: 'Chelated Zinc',
    description: 'Highly absorbable zinc supplement that supports immune function, skin health, and wound healing.',
    price: 1950,
    category: 'vitamins',
    imageUrl: '/chelated zinc.webp',
    benefits: ['Immune function', 'Skin health', 'Wound healing'],
    ingredients: ['Chelated Zinc Glycinate'],
  },
  {
    id: '12',
    name: 'Cruciferous Plus',
    description: 'A unique blend of cruciferous vegetable extracts that supports detoxification and hormonal balance.',
    price: 3600,
    category: 'vitamins',
    imageUrl: '/cruciferous plus.webp',
    benefits: ['Detoxification', 'Hormonal balance', 'Cellular health'],
    ingredients: ['Broccoli', 'Kale', 'Radish', 'Mustard'],
  },
  {
    id: '13',
    name: 'Full Motion',
    description: 'Supports joint flexibility and mobility. Ideal for individuals experiencing joint discomfort or stiffness.',
    price: 4650,
    category: 'fitness',
    imageUrl: '/full motion.webp',
    benefits: ['Joint flexibility', 'Mobility', 'Cartilage support'],
    ingredients: ['Glucosamine', 'Herbal Comfort Complex'],
  },
  {
    id: '14',
    name: 'NeoLife Formula IV',
    description: 'A complete multivitamin and mineral supplement designed to support overall health, energy, and well-being.',
    price: 3400,
    category: 'vitamins',
    imageUrl: '/neoLife formula IV.webp',
    benefits: ['Overall health', 'Energy support', 'Daily body functions'],
    ingredients: ['Vitamins', 'Minerals', 'Lipids', 'Sterols'],
  },
  {
    id: '15',
    name: 'NeoLife Tea – Weight Management',
    description: 'A natural herbal tea that aids metabolism and supports weight management. Helps cleanse the body and improve digestion.',
    price: 3100,
    category: 'weight',
    imageUrl: '/neoLife tea.webp',
    benefits: ['Aids metabolism', 'Weight management support', 'Body cleansing'],
    ingredients: ['Herbal Tea Blend', 'Natural Flavors'],
  },
  {
    id: '16',
    name: 'Vitamin A (250 Capsules)',
    description: 'Essential vitamin that supports vision, immune function, and skin health.',
    price: 2200,
    category: 'vitamins',
    imageUrl: '/vitamin a.webp',
    benefits: ['Vision support', 'Immune function', 'Skin health'],
    ingredients: ['Vitamin A Palmitate'],
  },
  {
    id: '17',
    name: 'Vitamin E Complex (100 Capsules)',
    description: 'Powerful antioxidant that protects cells from damage. Supports skin health, heart health, and immune function.',
    price: 3300,
    category: 'vitamins',
    imageUrl: '/vitamin e complex.webp',
    benefits: ['Antioxidant protection', 'Heart health', 'Skin and immune support'],
    ingredients: ['d-alpha tocopherol', 'Mixed tocopherols'],
  }
];
