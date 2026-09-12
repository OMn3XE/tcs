import type { FoodItem, Recommendation, UserPreferences, DietType } from '../types';
import { INITIAL_FOOD_ITEMS } from '../data/mockData';

export interface RecommendationRequest {
  query?: string;
  budget?: number;
  diet?: DietType | 'All';
  maxTime?: number;
  spicePreference?: 'Mild' | 'Medium' | 'Spicy' | 'Any';
  mood?: 'Hungry' | 'Healthy' | 'Comfort' | 'Spicy' | 'Refreshing';
}

export interface RecommendationResult {
  primary: Recommendation;
  alternatives: Recommendation[];
  thinkingSteps: string[];
}

/**
 * Natural language parser for student prompt input.
 * e.g., "I have ₹80, I'm very hungry, want something spicy, and only have 15 minutes."
 */
export function parseQuery(query: string): Partial<RecommendationRequest> {
  const result: Partial<RecommendationRequest> = {};
  const lower = query.toLowerCase();

  // 1. Budget Extraction (e.g. ₹80, rs 80, 80 rupees, under 50, 50 rs)
  const budgetMatch = lower.match(/(?:₹|rs\.?|rupees?|under|budget|max)\s*(\d+)/i) || lower.match(/(\d+)\s*(?:₹|rs\.?|rupees?)/i);
  if (budgetMatch) {
    result.budget = parseInt(budgetMatch[1], 10);
  }

  // 2. Time Extraction (e.g. 15 mins, 10 min, 15 minutes, fast, quick)
  const timeMatch = lower.match(/(\d+)\s*(?:mins?|minutes?|m)/i);
  if (timeMatch) {
    result.maxTime = parseInt(timeMatch[1], 10);
  } else if (lower.includes('quick') || lower.includes('fast') || lower.includes('hurry')) {
    result.maxTime = 10;
  }

  // 3. Diet Extraction
  if (lower.includes('veg') && !lower.includes('non-veg') && !lower.includes('non veg')) {
    result.diet = 'Veg';
  } else if (lower.includes('non-veg') || lower.includes('non veg') || lower.includes('chicken') || lower.includes('egg')) {
    result.diet = 'Non-Veg';
  } else if (lower.includes('vegan')) {
    result.diet = 'Vegan';
  }

  // 4. Spice Extraction
  if (lower.includes('spicy') || lower.includes('hot') || lower.includes('chili') || lower.includes('masala')) {
    result.spicePreference = 'Spicy';
  } else if (lower.includes('mild') || lower.includes('sweet') || lower.includes('not spicy')) {
    result.spicePreference = 'Mild';
  }

  // 5. Mood / Hunger
  if (lower.includes('very hungry') || lower.includes('filling') || lower.includes('heavy') || lower.includes('starving')) {
    result.mood = 'Hungry';
  } else if (lower.includes('healthy') || lower.includes('light') || lower.includes('fresh') || lower.includes('diet')) {
    result.mood = 'Healthy';
  } else if (lower.includes('cool') || lower.includes('drink') || lower.includes('refreshing')) {
    result.mood = 'Refreshing';
  }

  return result;
}

/**
 * Service function to recommend food items based on query & preferences.
 * Designed to mirror future backend POST /api/recommendations/ contract.
 */
export async function recommendFood(
  req: RecommendationRequest,
  userPrefs?: UserPreferences,
  availableFoods: FoodItem[] = INITIAL_FOOD_ITEMS
): Promise<RecommendationResult> {
  const parsed = req.query ? parseQuery(req.query) : {};
  
  const targetBudget = req.budget || parsed.budget || userPrefs?.budgetMax || 80;
  const targetDiet = req.diet || parsed.diet || userPrefs?.diet || 'All';
  const targetMaxTime = req.maxTime || parsed.maxTime || userPrefs?.maxWaitTime || 20;
  const targetSpice = req.spicePreference || parsed.spicePreference || userPrefs?.spiceTolerance || 'Any';
  const mood = req.mood || parsed.mood || 'Hungry';

  const thinkingSteps = [
    `Analyzing student prompt: "${req.query || 'Custom preferences filter'}"`,
    `Filtering items within budget ₹${targetBudget} and prep time ≤${targetMaxTime} mins...`,
    `Verifying live canteen counter availability & dietary constraints (${targetDiet})...`,
    `Evaluating flavor profiles & matching spice preference (${targetSpice})...`,
    `Ranking combinations for maximum value & student satisfaction...`
  ];

  // Simulated small network delay to make AI response feel authentic
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Filter available items based on hard diet & availability criteria
  let validFoods = availableFoods.filter(item => item.isAvailable !== 'Unavailable');

  if (targetDiet === 'Veg') {
    validFoods = validFoods.filter(item => item.dietType === 'Veg' || item.dietType === 'Vegan');
  } else if (targetDiet === 'Vegan') {
    validFoods = validFoods.filter(item => item.dietType === 'Vegan');
  } else if (targetDiet === 'Non-Veg') {
    validFoods = validFoods.filter(item => item.dietType === 'Non-Veg');
  }

  // Create single & combo options within budget
  interface ScoredOption {
    primary: FoodItem;
    side?: FoodItem;
    totalPrice: number;
    score: number;
    badges: string[];
    explanation: string;
    details: string[];
    prepTime: number;
  }

  const options: ScoredOption[] = [];

  // Evaluate single items
  for (const food of validFoods) {
    if (food.price <= targetBudget) {
      const { score, badges, explanation, details } = calculateScore(
        food,
        undefined,
        targetBudget,
        targetMaxTime,
        targetSpice
      );
      options.push({
        primary: food,
        totalPrice: food.price,
        score,
        badges,
        explanation,
        details,
        prepTime: food.prepTime,
      });
    }
  }

  // Evaluate 2-item combinations if budget allows and mood is Hungry/Combo
  for (let i = 0; i < validFoods.length; i++) {
    for (let j = i + 1; j < validFoods.length; j++) {
      const food1 = validFoods[i];
      const food2 = validFoods[j];
      const total = food1.price + food2.price;

      if (total <= targetBudget) {
        // Ensure combo has 1 drink/side or roll+snack
        const isComplementary = (food1.category === 'Drinks' || food2.category === 'Drinks') ||
                                (food1.category === 'Snacks' || food2.category === 'Snacks');
        
        if (isComplementary || mood === 'Hungry') {
          const maxPrep = Math.max(food1.prepTime, food2.prepTime);
          const { score, badges, explanation, details } = calculateScore(
            food1,
            food2,
            targetBudget,
            targetMaxTime,
            targetSpice
          );
          options.push({
            primary: food1,
            side: food2,
            totalPrice: total,
            score,
            badges,
            explanation,
            details,
            prepTime: maxPrep,
          });
        }
      }
    }
  }

  // Sort by score descending
  options.sort((a, b) => b.score - a.score);

  // Fallback if no option within strict budget
  if (options.length === 0) {
    const cheapest = [...availableFoods].sort((a, b) => a.price - b.price)[0];
    options.push({
      primary: cheapest,
      totalPrice: cheapest.price,
      score: 75,
      badges: ['Cheapest option', 'Available now'],
      explanation: `Best available fallback option given strict limits.`,
      details: [`Fits minimal waiting time of ${cheapest.prepTime} mins.`],
      prepTime: cheapest.prepTime,
    });
  }

  // Pick top match & alternatives
  const best = options[0];
  const alternativesList = options.slice(1, 4);

  const primaryRec: Recommendation = {
    id: `rec-${Date.now()}-0`,
    title: 'Best match for you',
    primaryFood: best.primary,
    sideFood: best.side,
    totalPrice: best.totalPrice,
    savings: Math.max(0, targetBudget - best.totalPrice),
    matchScore: Math.min(99, Math.round(best.score)),
    badges: best.badges,
    explanation: best.explanation,
    reasoningDetails: best.details,
    prepTimeTotal: best.prepTime,
  };

  const alternatives: Recommendation[] = alternativesList.map((opt, index) => ({
    id: `rec-${Date.now()}-${index + 1}`,
    title: opt.side ? `${opt.primary.name} + ${opt.side.name}` : opt.primary.name,
    primaryFood: opt.primary,
    sideFood: opt.side,
    totalPrice: opt.totalPrice,
    savings: Math.max(0, targetBudget - opt.totalPrice),
    matchScore: Math.min(98, Math.round(opt.score)),
    badges: opt.badges,
    explanation: opt.explanation,
    reasoningDetails: opt.details,
    prepTimeTotal: opt.prepTime,
  }));

  return {
    primary: primaryRec,
    alternatives,
    thinkingSteps,
  };
}

function calculateScore(
  primary: FoodItem,
  side: FoodItem | undefined,
  budget: number,
  maxTime: number,
  spicePref: string
): { score: number; badges: string[]; explanation: string; details: string[] } {
  let score = 70; // baseline
  const badges: string[] = [];
  const details: string[] = [];

  const totalPrice = primary.price + (side ? side.price : 0);
  const totalPrepTime = Math.max(primary.prepTime, side ? side.prepTime : 0);

  // 1. Budget Match (+15 max)
  if (totalPrice <= budget) {
    score += 12;
    badges.push('✓ Within budget');
    const savings = budget - totalPrice;
    if (savings > 0) {
      details.push(`Leaves ₹${savings} under your ₹${budget} budget limit.`);
    } else {
      details.push(`Exactly matches your ₹${budget} target.`);
    }
  } else {
    score -= 15;
  }

  // 2. Prep Time Match (+10 max)
  if (totalPrepTime <= maxTime) {
    score += 10;
    badges.push(`✓ ${totalPrepTime} min preparation`);
    details.push(`Preparation time of ${totalPrepTime} mins is within your ${maxTime} min window.`);
  } else {
    score -= 8;
  }

  // 3. Availability Badge
  if (primary.isAvailable === 'Available' && (!side || side.isAvailable === 'Available')) {
    badges.push('✓ Available now');
  }

  // 4. Spice Match
  const maxSpice = Math.max(primary.spiceLevel, side ? side.spiceLevel : 0);
  if (spicePref === 'Spicy' && maxSpice >= 2) {
    score += 10;
    badges.push('🌶 Spicy');
    details.push(`Satisfies spicy flavor craving (Spice Level ${'🌶'.repeat(maxSpice)}).`);
  } else if (spicePref === 'Mild' && maxSpice <= 1) {
    score += 8;
    badges.push('🍃 Mild');
    details.push(`Gentle spice profile as requested.`);
  }

  // 5. Rating bonus
  score += (primary.rating - 4.0) * 10;

  // 6. Natural Explanation phrasing
  let explanation = '';
  if (side) {
    explanation = `Since you have ₹${budget}, prefer ${spicePref.toLowerCase()} food and have ${maxTime} minutes, ${primary.name} paired with ${side.name} is your best combo.`;
  } else {
    explanation = `Since you have ₹${budget} and ${maxTime} minutes, ${primary.name} is your best individual match today.`;
  }

  return {
    score,
    badges,
    explanation,
    details,
  };
}
