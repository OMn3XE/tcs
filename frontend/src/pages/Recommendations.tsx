import React, { useState, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, Clock, Wallet, Flame } from 'lucide-react';
import type { FoodItem, Recommendation, UserPreferences, DietType } from '../types';
import { recommendFood } from '../services/recommendationService';
import { RecommendationCard } from '../components/RecommendationCard';
import { AILoadingOverlay } from '../components/AILoadingOverlay';

interface RecommendationsPageProps {
  userPrefs: UserPreferences;
  foodItems: FoodItem[];
  onViewFoodDetail: (food: FoodItem) => void;
  onToggleFavorite: (foodId: string) => void;
}

export const RecommendationsPage: React.FC<RecommendationsPageProps> = ({
  userPrefs,
  foodItems,
  onViewFoodDetail,
  onToggleFavorite,
}) => {
  const [selectedBudget, setSelectedBudget] = useState<number>(80);
  const [selectedDiet, setSelectedDiet] = useState<DietType | 'All'>('All');
  const [selectedTime, setSelectedTime] = useState<number>(20);
  const [selectedMood, setSelectedMood] = useState<'Hungry' | 'Healthy' | 'Comfort' | 'Spicy' | 'Refreshing'>('Spicy');
  
  const [isLoading, setIsLoading] = useState(false);
  const [primaryRec, setPrimaryRec] = useState<Recommendation | null>(null);
  const [alternatives, setAlternatives] = useState<Recommendation[]>([]);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await recommendFood(
        {
          budget: selectedBudget,
          diet: selectedDiet,
          maxTime: selectedTime,
          mood: selectedMood,
        },
        userPrefs,
        foodItems
      );
      setPrimaryRec(res.primary);
      setAlternatives(res.alternatives);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [selectedBudget, selectedDiet, selectedTime, selectedMood]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-6 h-6 text-emerald-600 animate-pulse" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Recommendations
          </h1>
        </div>
        <p className="text-sm text-slate-500 font-medium">
          Personalized picks ranked based on your preferences and today's live canteen availability.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Customize AI Engine Parameters</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Auto-calculates ranking</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Budget Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Target Budget</span>
            </label>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[30, 50, 80, 100].map((b) => (
                <button
                  key={b}
                  onClick={() => setSelectedBudget(b)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedBudget === b
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ₹{b}{b === 100 ? '+' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Diet Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Dietary Filter</span>
            </label>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {(['All', 'Veg', 'Non-Veg', 'Vegan'] as (DietType | 'All')[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDiet(d)}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                    selectedDiet === d
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Time Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Available Time</span>
            </label>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {[
                { label: '<10m', val: 10 },
                { label: '10-20m', val: 20 },
                { label: '20m+', val: 30 },
              ].map((t) => (
                <button
                  key={t.val}
                  onClick={() => setSelectedTime(t.val)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedTime === t.val
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Filter */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Current Mood</span>
            </label>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value as any)}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-900 text-xs font-bold border border-transparent focus:border-emerald-500 focus:bg-white focus:outline-none"
            >
              <option value="Hungry">😋 Hungry (Full Combo)</option>
              <option value="Spicy">🌶️ Spicy Craving</option>
              <option value="Healthy">🥗 Light & Healthy</option>
              <option value="Comfort">🍲 Warm Comfort Food</option>
              <option value="Refreshing">🥤 Refreshing Beverage</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Results Section */}
      {isLoading ? (
        <AILoadingOverlay />
      ) : (
        <div className="space-y-8">
          {primaryRec && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                  #1 Top Ranked Match
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Calculated using 4-Factor AI Algorithm
                </span>
              </div>

              <RecommendationCard
                recommendation={primaryRec}
                alternatives={alternatives}
                onViewFoodDetail={onViewFoodDetail}
                onSelectAlternative={(alt) => setPrimaryRec(alt)}
                onToggleFavorite={() => onToggleFavorite(primaryRec.id)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
