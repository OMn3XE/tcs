import React, { useState } from 'react';
import { Sparkles, Heart, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import type { Recommendation, FoodItem } from '../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  alternatives?: Recommendation[];
  onViewFoodDetail: (food: FoodItem) => void;
  onSelectAlternative?: (rec: Recommendation) => void;
  onToggleFavorite?: (recId: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  alternatives = [],
  onViewFoodDetail,
  onSelectAlternative,
  onToggleFavorite,
}) => {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [isFav, setIsFav] = useState(recommendation.isFavorite || false);

  const handleFavoriteClick = () => {
    setIsFav(!isFav);
    if (onToggleFavorite) {
      onToggleFavorite(recommendation.id);
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-emerald-200 shadow-xl overflow-hidden transition-all duration-300 mb-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              AI Recommendation
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {recommendation.title}
            </h3>
          </div>
        </div>

        {/* Match Percentage Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-extrabold">
          <span>Match</span>
          <span className="text-base text-white">{recommendation.matchScore}%</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Item Breakdown (Left Column) */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200/70">
              {/* Primary Item */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <img
                    src={recommendation.primaryFood.image || (recommendation.primaryFood as any).image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                    alt={recommendation.primaryFood.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                    }}
                    className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {recommendation.primaryFood.name}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {recommendation.primaryFood.category || 'Canteen'} • {recommendation.primaryFood.prepTime || (recommendation.primaryFood as any).preparation_time || 10} min
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 text-base">
                    ₹{recommendation.primaryFood.price}
                  </span>
                </div>
              </div>

              {/* Side Item if any */}
              {recommendation.sideFood && (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={recommendation.sideFood.image || (recommendation.sideFood as any).image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                      alt={recommendation.sideFood.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-emerald-600">+ Side Combo</span>
                        <h4 className="font-bold text-slate-900 text-base">
                          {recommendation.sideFood.name}
                        </h4>
                      </div>
                      <span className="text-xs text-slate-500">
                        {recommendation.sideFood.category || 'Canteen'} • {recommendation.sideFood.prepTime || (recommendation.sideFood as any).preparation_time || 10} min
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 text-base">
                      ₹{recommendation.sideFood.price}
                    </span>
                  </div>
                </div>
              )}

              {/* Total & Savings */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-300/60 text-slate-900">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-slate-600">Total:</span>
                  <span className="text-2xl font-black text-emerald-700">
                    ₹{recommendation.totalPrice}
                  </span>
                </div>

                {recommendation.savings > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                    You save ₹{recommendation.savings}
                  </span>
                )}
              </div>
            </div>

            {/* Badges Grid */}
            <div className="flex flex-wrap gap-2">
              {recommendation.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* AI Explanation & Action Buttons (Right Column) */}
          <div className="md:col-span-5 flex flex-col justify-between h-full space-y-4">
            {/* Explanation Quote Box */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 border border-slate-700 shadow-inner">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI Reasoning</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300 font-normal italic">
                "{recommendation.explanation}"
              </p>

              {/* Detailed Reasoning Bullets */}
              {recommendation.reasoningDetails && recommendation.reasoningDetails.length > 0 && (
                <ul className="mt-3 pt-3 border-t border-slate-700 space-y-1">
                  {recommendation.reasoningDetails.map((detail, idx) => (
                    <li key={idx} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewFoodDetail(recommendation.primaryFood)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleFavoriteClick}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isFav
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
                  }`}
                  title="Save to favorites"
                >
                  <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {alternatives.length > 0 && (
                <button
                  onClick={() => setShowAlternatives(!showAlternatives)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{showAlternatives ? 'Hide Alternatives' : 'Show Alternatives'}</span>
                  {showAlternatives ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Alternative Recommendations Expandable Section */}
        {showAlternatives && alternatives.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span>Alternative Recommendations</span>
              <span className="text-xs font-normal text-slate-500">
                (Ranked by preference & budget)
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {alternatives.map((alt) => (
                <div
                  key={alt.id}
                  onClick={() => onSelectAlternative && onSelectAlternative(alt)}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h5 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                        {alt.primaryFood.name} {alt.sideFood ? `+ ${alt.sideFood.name}` : ''}
                      </h5>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold shrink-0">
                        {alt.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800 mb-2">
                      ₹{alt.totalPrice}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                    <span>{alt.prepTimeTotal} min prep</span>
                    <span className="font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                      Select →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
