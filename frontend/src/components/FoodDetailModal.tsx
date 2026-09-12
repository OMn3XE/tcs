import React from 'react';
import { X, Clock, Star, Heart, Sparkles, CheckCircle2 } from 'lucide-react';
import type { FoodItem } from '../types';

interface FoodDetailModalProps {
  food: FoodItem | null;
  onClose: () => void;
  onToggleFavorite?: (foodId: string) => void;
  onAddToRecommendation?: (food: FoodItem) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  food,
  onClose,
  onToggleFavorite,
  onAddToRecommendation,
}) => {
  if (!food) return null;

  const renderSpice = (level: number) => {
    if (level === 0) return 'Mild / No Spice';
    return '🌶️'.repeat(level) + ` (${level === 3 ? 'Spicy' : level === 2 ? 'Medium' : 'Low'})`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-60 w-full bg-slate-100">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between text-white">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold uppercase tracking-wider mb-1 inline-block">
                {food.category}
              </span>
              <h2 className="text-2xl font-bold tracking-tight">{food.name}</h2>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-emerald-400">₹{food.price}</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="border-r border-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Rating</span>
              <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {food.rating}
              </span>
            </div>

            <div className="border-r border-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Prep Time</span>
              <span className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {food.prepTime}m
              </span>
            </div>

            <div className="border-r border-slate-200">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Calories</span>
              <span className="text-sm font-bold text-slate-800">{food.calories} kcal</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">Diet</span>
              <span
                className={`text-xs font-bold ${
                  food.dietType === 'Non-Veg'
                    ? 'text-rose-600'
                    : food.dietType === 'Vegan'
                    ? 'text-emerald-600'
                    : 'text-green-700'
                }`}
              >
                {food.dietType}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">About Item</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{food.description}</p>
          </div>

          {/* Spice & Ingredients */}
          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Spice Level</span>
              <span className="text-sm font-semibold text-slate-800">{renderSpice(food.spiceLevel)}</span>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Key Ingredients</span>
              <div className="flex flex-wrap gap-1.5">
                {food.ingredients.map((ing, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Compatibility Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white border border-emerald-700/50 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                <span className="text-sm font-bold text-white">AI Compatibility</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-extrabold border border-emerald-400/30">
                92% Match
              </span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-700/80">
              <span className="text-xs font-bold text-emerald-400 block">Why Recommended:</span>
              <ul className="space-y-1 text-xs text-slate-300">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Within your daily college budget limit</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Matches your spicy preference preference</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Currently available live at Counter 2</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Fast preparation (takes only {food.prepTime} minutes)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                if (onAddToRecommendation) onAddToRecommendation(food);
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all text-center flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Add to Recommendation</span>
            </button>

            <button
              onClick={() => {
                if (onToggleFavorite) onToggleFavorite(food.id);
              }}
              className={`p-3 rounded-xl border transition-all ${
                food.isFavorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-rose-500'
              }`}
              title="Favorite"
            >
              <Heart className={`w-5 h-5 ${food.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
