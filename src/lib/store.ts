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
    id: '4',
    name: 'Cal-Mag Plus',
    description: 'Balanced calcium and magnesium with Vitamin D3 to support bone health.',
    price: 2100,
    category: 'vitamins',
    imageUrl: 'https://picsum.photos/seed/calmag/500/500',
    benefits: ['Strong bones and teeth', 'Nerve function support', 'Muscle relaxation'],
    ingredients: ['Calcium', 'Magnesium', 'Vitamin D3'],
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
  }
];
