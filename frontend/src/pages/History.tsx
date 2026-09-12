import React from 'react';
import { History as HistoryIcon, Sparkles, Calendar, RotateCcw } from 'lucide-react';
import type { HistoryItem } from '../types';

interface HistoryPageProps {
  historyItems: HistoryItem[];
  onRecommendSimilar: (query: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ historyItems, onRecommendSimilar }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <HistoryIcon className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Recommendation History
          </h1>
        </div>
        <p className="text-sm text-slate-500 font-medium">
          View your previous AI food recommendations and re-order similar combinations in 1-click.
        </p>
      </div>

      {/* History Timeline */}
      <div className="space-y-6">
        {historyItems.map((item) => {
          const rec = item.recommendation;
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Timeline Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    AI Match: {rec.matchScore}%
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">
                    Total: ₹{rec.totalPrice}
                  </span>
                </div>
              </div>

              {/* Prompt Query preview */}
              {item.query && (
                <div className="text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Prompt: "{item.query}"</span>
                </div>
              )}

              {/* Item Combination Cards */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  {/* Primary Item */}
                  <div className="flex items-center gap-3">
                    <img
                      src={rec.primaryFood.image}
                      alt={rec.primaryFood.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{rec.primaryFood.name}</h4>
                      <span className="text-xs text-slate-500">₹{rec.primaryFood.price}</span>
                    </div>
                  </div>

                  {/* Plus side item if any */}
                  {rec.sideFood && (
                    <div className="flex items-center gap-3 pl-2 sm:border-l border-slate-200">
                      <span className="text-xs font-bold text-emerald-600">+</span>
                      <img
                        src={rec.sideFood.image}
                        alt={rec.sideFood.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{rec.sideFood.name}</h4>
                        <span className="text-xs text-slate-500">₹{rec.sideFood.price}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Re-order / Similar Action */}
                <button
                  onClick={() => onRecommendSimilar(item.query || `Recommend something similar to ${rec.title}`)}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Recommend Similar</span>
                </button>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {rec.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
