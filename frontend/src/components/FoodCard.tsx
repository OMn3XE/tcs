import React from 'react';
import { Clock, Star, Heart } from 'lucide-react';
import type { FoodItem } from '../types';

interface FoodCardProps {
  food: FoodItem;
  onSelect: (food: FoodItem) => void;
  onToggleFavorite?: (foodId: string) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({ food, onSelect, onToggleFavorite }) => {
  const renderSpice = (level: number) => {
    if (level === 0) return null;
    return '🌶️'.repeat(level);
  };

  const getAvailabilityClass = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Limited':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-500 border-slate-300';
    }
  };

  return (
    <div
      onClick={() => onSelect(food)}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={food.image || (food as any).image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
          alt={food.name}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Popular Tag */}
        {food.popularTag && (
          <span className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-xs shadow-sm">
            {food.popularTag}
          </span>
        )}

        {/* Diet Type Dot Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-full border border-slate-200 shadow-xs">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              food.dietType === 'Non-Veg'
                ? 'bg-rose-500'
                : food.dietType === 'Vegan'
                ? 'bg-emerald-500'
                : 'bg-green-600'
            }`}
          />
          <span className="text-[11px] font-bold text-slate-800">{food.dietType}</span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite(food.id);
          }}
          className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
            food.isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500'
          }`}
          title="Save food to favorites"
        >
          <Heart className={`w-4 h-4 ${food.isFavorite ? 'fill-white' : ''}`} />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Title & Price */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition-colors line-clamp-1">
              {food.name}
            </h3>
            <span className="font-extrabold text-slate-900 text-base shrink-0">
              ₹{food.price}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 line-clamp-2 mb-3">
            {food.description}
          </p>
        </div>

        {/* Footer Meta Row */}
        <div>
          {/* Badges Row */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{food.prepTime} min</span>
            </div>

            {/* Spice Indicator */}
            {food.spiceLevel > 0 && (
              <span className="text-xs" title={`Spice level: ${food.spiceLevel}`}>
                {renderSpice(food.spiceLevel)}
              </span>
            )}

            {/* Rating */}
            <div className="flex items-center gap-1 font-semibold text-slate-800">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>{food.rating}</span>
            </div>
          </div>

          {/* Availability Status Pill */}
          <div className="mt-3 flex items-center justify-between">
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getAvailabilityClass(
                food.isAvailable
              )}`}
            >
              {food.isAvailable}
            </span>
            <span className="text-[11px] font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
              View Details →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
