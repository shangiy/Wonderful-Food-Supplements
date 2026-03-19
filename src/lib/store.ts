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
  status: 'optimal' | 'out-of-stock' | 'discontinued';
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
    imageUrl: '/vitamin A Capsules250.webp'
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
    imageUrl: '/All-C chewable.webp'
  },
  {
    id: 'homecare',
    name: "Home Care",
    description: 'Safe and effective cleaning solutions for a healthy home.',
    imageUrl: 'https://picsum.photos/seed/homecleaning/600/400'
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
    featured: true,
    status: 'optimal'
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
    featured: true,
    status: 'optimal'
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
    featured: true,
    status: 'optimal'
  },
  {
    id: '5',
    name: 'Vitamin C Threshold Release',
    description: 'Slow-release vitamin C for all-day immune support and antioxidant protection.',
    price: 2850,
    category: 'immune',
    imageUrl: '/vitamin c 200tablets.webp',
    benefits: ['Immune system boost', 'Collagen protection', 'Healthy gums'],
    ingredients: ['Ascorbic Acid', 'Rose Hips', 'Acerola Cherry'],
    featured: true,
    status: 'optimal'
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
    featured: true,
    status: 'optimal'
  },
  {
    id: '24',
    name: 'All-C Chewable',
    description: 'Delicious, cherry-flavored chewable vitamin C for children and adults who prefer chewables. Potent antioxidant protection.',
    price: 2650,
    category: 'children',
    imageUrl: '/All-C chewable.webp',
    benefits: ['Immune support', 'Antioxidant protection', 'Healthy teeth and gums'],
    ingredients: ['Vitamin C', 'Acerola Cherry', 'Rose Hips'],
    status: 'optimal'
  },
  {
    id: '7',
    name: 'Aloe Vera Plus (1 Litre)',
    description: 'A refreshing and natural aloe vera drink designed to support digestion, detoxification, and overall wellness.',
    price: 2450,
    category: 'digestive',
    imageUrl: '/Aloe Vera plus 1Litre.webp',
    benefits: ['Supports digestion', 'Detoxification', 'Immune system support'],
    ingredients: ['Pure Aloe Vera', 'Herbal Tea Blend', 'Electrolytes'],
    featured: true,
    status: 'optimal'
  },
  {
    id: '8',
    name: 'Beta Guard Nutrition (100 Capsules)',
    description: 'A powerful antioxidant supplement formulated to protect cells from oxidative stress. Supports eye health, immune function, and overall vitality.',
    price: 3800,
    category: 'immune',
    imageUrl: '/Beta Guard nutrition 100 caps sup.webp',
    benefits: ['Cell protection', 'Immune function', 'Eye health support'],
    ingredients: ['Beta-Carotene', 'Vitamin C', 'Vitamin E', 'Selenium', 'Zinc'],
    status: 'optimal'
  },
  {
    id: '9',
    name: 'Carotenoid Complex (30 Capsules)',
    description: 'A blend of natural carotenoids that supports healthy vision, skin, and immune system.',
    price: 5200,
    category: 'vitamins',
    imageUrl: '/carotenoid complex 30capsules.webp',
    benefits: ['Healthy vision', 'Skin health', 'Immune support'],
    ingredients: ['Carrots', 'Tomatoes', 'Spinach', 'Red Bell Peppers'],
    status: 'optimal'
  },
  {
    id: '10',
    name: 'Ulcer Management Pack',
    description: 'Specially formulated supplements aimed at supporting stomach health and managing ulcers. Helps soothe the digestive tract and promote healing.',
    price: 7200,
    category: 'digestive',
    imageUrl: '/category 3, ulcer management.webp',
    benefits: ['Stomach health', 'Soothes digestive tract', 'Promotes healing'],
    ingredients: ['Herbal Extracts', 'Enzymes', 'Nutrients'],
    status: 'optimal'
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
    status: 'optimal'
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
    status: 'optimal'
  },
  {
    id: '13',
    name: 'Full Motion',
    description: 'Supports joint flexibility and mobility. Ideal for individuals experiencing joint discomfort or stiffness.',
    price: 4650,
    category: 'fitness',
    imageUrl: '/full motion .webp',
    benefits: ['Joint flexibility', 'Mobility', 'Cartilage support'],
    ingredients: ['Glucosamine', 'Herbal Comfort Complex'],
    status: 'optimal'
  },
  {
    id: '14',
    name: 'NeoLife Formula IV',
    description: 'A complete multivitamin and mineral supplement designed to support overall health, energy, and well-being.',
    price: 3400,
    category: 'vitamins',
    imageUrl: '/neoLife Formula IV.webp',
    benefits: ['Overall health', 'Energy support', 'Daily body functions'],
    ingredients: ['Vitamins', 'Minerals', 'Lipids', 'Sterols'],
    status: 'optimal'
  },
  {
    id: '15',
    name: 'NeoLife Tea – Weight Management',
    description: 'A natural herbal tea that aids metabolism and supports weight management. Helps cleanse the body and improve digestion.',
    price: 3100,
    category: 'weight',
    imageUrl: '/neolifeTea WeightManagement.webp',
    benefits: ['Aids metabolism', 'Weight management support', 'Body cleansing'],
    ingredients: ['Herbal Tea Blend', 'Natural Flavors'],
    status: 'optimal'
  },
  {
    id: '16',
    name: 'Vitamin A (250 Capsules)',
    description: 'Essential vitamin that supports vision, immune function, and skin health.',
    price: 2200,
    category: 'vitamins',
    imageUrl: '/vitamin A Capsules250.webp',
    benefits: ['Vision support', 'Immune function', 'Skin health'],
    ingredients: ['Vitamin A Palmitate'],
    status: 'optimal'
  },
  {
    id: '17',
    name: 'Vitamin E Complex (100 Capsules)',
    description: 'Powerful antioxidant that protects cells from damage. Supports skin health, heart health, and immune function.',
    price: 3300,
    category: 'vitamins',
    imageUrl: '/vitamin E complex 100capsules.webp',
    benefits: ['Antioxidant protection', 'Heart health', 'Skin and immune support'],
    ingredients: ['d-alpha tocopherol', 'Mixed tocopherols'],
    status: 'optimal'
  },
  {
    id: '18',
    name: 'NeoLifeShake – Weight Management',
    description: 'A balanced nutritional shake designed to support healthy weight loss or maintenance. Keeps you full while delivering essential nutrients.',
    price: 4950,
    category: 'weight',
    imageUrl: '/neolifeshake weight mangement.webp',
    benefits: ['Supports healthy weight loss', 'High quality protein', 'Glycemic response control'],
    ingredients: ['Soy Protein', 'Fiber', 'Vitamins', 'Minerals'],
    status: 'optimal'
  },
  {
    id: '19',
    name: 'Golden Home Care Concentrated Disinfectant',
    description: 'A powerful, hospital-grade concentrated disinfectant for a clean and germ-free environment.',
    price: 2150,
    category: 'homecare',
    imageUrl: '/Golden home care conc disinfectant.webp',
    benefits: ['Kills 99.9% of germs', 'Economical concentrated formula', 'Safe for household surfaces'],
    ingredients: ['Quaternary Ammonium Compounds', 'Specialty Surfactants'],
    featured: true,
    status: 'optimal'
  },
  {
    id: '20',
    name: 'Lipotropic Adjunct',
    description: 'Advanced nutritional supplement providing lipotropic factors to support healthy lipid metabolism and heart health.',
    price: 3550,
    category: 'vitamins',
    imageUrl: '/lipotropic adjunct neolife.webp',
    benefits: ['Supports healthy lipid metabolism', 'Heart health support', 'Provides B-vitamins and lipotropic factors'],
    ingredients: ['Choline', 'Inositol', 'Betaine', 'B-Vitamins'],
    status: 'optimal'
  },
  {
    id: '21',
    name: 'Feminine Herbal Complex',
    description: 'A unique blend of herbs specifically selected to support the unique needs of a woman\'s body and promote overall well-being.',
    price: 5700,
    category: 'vitamins',
    imageUrl: '/Feminine herbal nutrition supplement.webp',
    benefits: ['Supports hormonal balance', 'Promotes feminine wellness', 'Helps reduce discomfort during monthly cycles'],
    ingredients: ['Wild Yam', 'Red Sage', 'Vitex', 'Lady’s Mantle'],
    status: 'optimal'
  },
  {
    id: '22',
    name: 'Fibre Tablets',
    description: 'A unique blend of dietary fibers to support digestive health and regularity.',
    price: 2850,
    category: 'digestive',
    imageUrl: '/Fibre Tablet digestive wellbeing.webp',
    benefits: ['Promotes regularity', 'Supports digestive health', 'Helps maintain healthy blood sugar levels'],
    ingredients: ['Oat Fiber', 'Soy Fiber', 'Citrus Fiber', 'Apple Pectin'],
    status: 'optimal'
  },
  {
    id: '23',
    name: 'Vegan D',
    description: 'A proprietary blend of 100% vegan, naturally sourced Vitamin D2 and D3 to support bone health and immune function.',
    price: 3200,
    category: 'vitamins',
    imageUrl: '/Vegan D with vitamin D1 & D2 .webp',
    benefits: ['Supports immune health', 'Promotes strong bones', '100% Vegan whole-food source'],
    ingredients: ['Vitamin D2', 'Vitamin D3', 'Mushroom Extracts', 'Reindeer Lichen'],
    status: 'optimal'
  }
];
