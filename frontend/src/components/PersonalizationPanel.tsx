import React from 'react';
import { SlidersHorizontal, ShieldCheck, Clock, Wallet, Flame, Edit3 } from 'lucide-react';
import type { UserPreferences } from '../types';

interface PersonalizationPanelProps {
  userPrefs: UserPreferences;
  onEditClick: () => void;
}

export const PersonalizationPanel: React.FC<PersonalizationPanelProps> = ({ userPrefs, onEditClick }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">Your Preferences</h3>
        </div>
        <button
          onClick={onEditClick}
          className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      {/* Preferences Grid */}
      <div className="space-y-3.5">
        {/* Diet */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Dietary Preference:
          </span>
          <span className="font-bold text-slate-900 px-2 py-0.5 rounded bg-slate-100">
            {userPrefs.diet}
          </span>
        </div>

        {/* Spice Tolerance */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Favorite Flavor:
          </span>
          <span className="font-bold text-slate-900">
            {userPrefs.spiceTolerance} Food 🌶️
          </span>
        </div>

        {/* Budget */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            Target Budget:
          </span>
          <span className="font-bold text-slate-900">
            ₹{userPrefs.budgetMin} – ₹{userPrefs.budgetMax}
          </span>
        </div>

        {/* Avoid */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-500" />
            Avoid:
          </span>
          <span className="font-semibold text-slate-800 text-right truncate max-w-[140px]">
            {userPrefs.avoid.join(', ') || 'None'}
          </span>
        </div>

        {/* Max Time */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Available Time:
          </span>
          <span className="font-bold text-slate-900">
            {userPrefs.maxWaitTime} min
          </span>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={onEditClick}
        className="w-full mt-5 py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors text-center block"
      >
        Edit Preferences
      </button>
    </div>
  );
};
