import React from 'react';
import { Heart, Sparkles, Flame } from 'lucide-react';
import type { FoodItem } from '../types';
import { FoodCard } from '../components/FoodCard';

interface FavoritesPageProps {
  foodItems: FoodItem[];
  onViewFoodDetail: (food: FoodItem) => void;
  onToggleFavorite: (foodId: string) => void;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  foodItems,
  onViewFoodDetail,
  onToggleFavorite,
}) => {
  const favoriteFoods = foodItems.filter((f) => f.isFavorite);
  const frequentlyOrdered = foodItems.slice(0, 4);
  const recommendedForYou = foodItems.filter((f) => f.rating >= 4.6).slice(0, 4);

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Your Favorites
          </h1>
        </div>
        <p className="text-sm text-slate-500 font-medium">
          Quick access to your saved dishes, frequent picks, and personalized recommendations.
        </p>
      </div>

      {/* Section 1: Favorite Foods */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Saved Favorite Foods ({favoriteFoods.length})</span>
          </h2>
        </div>

        {favoriteFoods.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onSelect={onViewFoodDetail}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <Heart className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No favorite foods added yet</p>
            <p className="text-xs text-slate-400">Click the heart icon on any food item to save it here.</p>
          </div>
        )}
      </div>

      {/* Section 2: Frequently Ordered */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Frequently Ordered by You</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {frequentlyOrdered.map((food) => (
            <div
              key={food.id}
              onClick={() => onViewFoodDetail(food)}
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
            >
              <img
                src={food.image}
                alt={food.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="overflow-hidden">
                <h4 className="font-bold text-slate-900 text-sm truncate">{food.name}</h4>
                <span className="text-xs font-semibold text-slate-500">₹{food.price}</span>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-1">
                  <Sparkles className="w-3 h-3" />
                  <span>94% Match</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Recommended For You */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Suggested Picks for You</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendedForYou.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onSelect={onViewFoodDetail}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
