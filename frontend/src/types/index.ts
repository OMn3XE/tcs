export type DietType = 'Veg' | 'Non-Veg' | 'Vegan';

export type SpiceLevel = 0 | 1 | 2 | 3; // 0: None/Mild, 1: Low, 2: Medium, 3: Spicy

export type AvailabilityStatus = 'Available' | 'Limited' | 'Unavailable';

export type Category = 'All' | 'Breakfast' | 'Lunch' | 'Snacks' | 'Drinks' | 'Rolls' | 'South Indian' | 'Chinese';

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  category: Category;
  prepTime: number; // in minutes
  isAvailable: AvailabilityStatus;
  dietType: DietType;
  spiceLevel: SpiceLevel;
  calories: number;
  ingredients: string[];
  rating: number;
  ratingCount: number;
  image: string;
  description: string;
  popularTag?: string;
  isFavorite?: boolean;
}

export interface UserPreferences {
  studentName: string;
  college: string;
  avatar: string;
  diet: DietType | 'All';
  budgetMin: number;
  budgetMax: number;
  favoriteCuisines: string[];
  spiceTolerance: 'Mild' | 'Medium' | 'Spicy' | 'Any';
  allergies: string[];
  maxWaitTime: number; // minutes
  avoid: string[];
}

export interface Recommendation {
  id: string;
  title: string; // e.g. "Best Match for You" or "Spicy Combo"
  primaryFood: FoodItem;
  sideFood?: FoodItem;
  totalPrice: number;
  savings: number;
  matchScore: number; // Percentage (e.g. 92)
  badges: string[]; // e.g. ["Within budget", "Available now", "10 min prep", "Spicy"]
  explanation: string;
  reasoningDetails: string[];
  prepTimeTotal: number;
  isFavorite?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendations?: Recommendation[];
  quickActions?: string[];
  isProcessing?: boolean;
}

export interface HistoryItem {
  id: string;
  date: string;
  timestamp: string;
  recommendation: Recommendation;
  query: string;
}

export interface FilterState {
  searchQuery: string;
  category: Category;
  diet: DietType | 'All';
  maxPrice: number;
  maxPrepTime: number;
  spiceLevel: SpiceLevel | -1; // -1 for any
  availabilityOnly: boolean;
}
