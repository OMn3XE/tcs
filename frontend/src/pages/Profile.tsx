import React, { useState } from 'react';
import { User, SlidersHorizontal, Check, Save, Building } from 'lucide-react';
import type { UserPreferences, DietType } from '../types';

interface ProfilePageProps {
  userPrefs: UserPreferences;
  onSavePreferences: (updated: UserPreferences) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ userPrefs, onSavePreferences }) => {
  const [formData, setFormData] = useState<UserPreferences>({ ...userPrefs });
  const [isSaved, setIsSaved] = useState(false);

  const cuisinesList = ['Rolls', 'South Indian', 'Chinese', 'Snacks', 'Drinks', 'Lunch', 'Breakfast'];
  const allergiesList = ['Peanuts', 'Dairy', 'Gluten', 'Soy', 'Tree Nuts', 'Seafood'];
  const avoidList = ['Very Oily Food', 'High Sugar', 'Heavy Fried', 'Cold Drinks'];

  const toggleCuisine = (cuisine: string) => {
    const current = formData.favoriteCuisines || [];
    if (current.includes(cuisine)) {
      setFormData({ ...formData, favoriteCuisines: current.filter((c) => c !== cuisine) });
    } else {
      setFormData({ ...formData, favoriteCuisines: [...current, cuisine] });
    }
  };

  const toggleAllergy = (allergy: string) => {
    const current = formData.allergies || [];
    if (current.includes(allergy)) {
      setFormData({ ...formData, allergies: current.filter((a) => a !== allergy) });
    } else {
      setFormData({ ...formData, allergies: [...current, allergy] });
    }
  };

  const toggleAvoid = (avoidItem: string) => {
    const current = formData.avoid || [];
    if (current.includes(avoidItem)) {
      setFormData({ ...formData, avoid: current.filter((a) => a !== avoidItem) });
    } else {
      setFormData({ ...formData, avoid: [...current, avoidItem] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePreferences(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <User className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Student Profile & AI Preferences
          </h1>
        </div>
        <p className="text-sm text-slate-500 font-medium">
          Configure your food preferences, dietary rules and budget limits for personalized recommendations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
          <img
            src={formData.avatar}
            alt={formData.studentName}
            className="w-20 h-20 rounded-full object-cover border-2 border-emerald-500 p-0.5 shadow-md shrink-0"
          />
          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  College / Institute
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full py-2 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-300 text-sm font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-lg">AI Recommendation Preferences</h3>
          </div>

          {/* 1. Dietary Preference */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
              1. Dietary Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['All', 'Veg', 'Non-Veg', 'Vegan'] as (DietType | 'All')[]).map((diet) => (
                <button
                  type="button"
                  key={diet}
                  onClick={() => setFormData({ ...formData, diet })}
                  className={`py-3 px-4 rounded-xl font-bold text-xs border transition-all ${
                    formData.diet === diet
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {diet === 'All' ? 'No Preference (All)' : diet}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Budget Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Maximum Target Budget</span>
                <span className="text-emerald-600 font-extrabold text-sm">₹{formData.budgetMax}</span>
              </div>
              <input
                type="range"
                min="20"
                max="150"
                step="10"
                value={formData.budgetMax}
                onChange={(e) => setFormData({ ...formData, budgetMax: Number(e.target.value) })}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                <span>Maximum Waiting Time</span>
                <span className="text-indigo-600 font-extrabold text-sm">{formData.maxWaitTime} min</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                step="5"
                value={formData.maxWaitTime}
                onChange={(e) => setFormData({ ...formData, maxWaitTime: Number(e.target.value) })}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          {/* 3. Spice Tolerance */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
              3. Spice Tolerance
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['Mild', 'Medium', 'Spicy', 'Any'] as const).map((spice) => (
                <button
                  type="button"
                  key={spice}
                  onClick={() => setFormData({ ...formData, spiceTolerance: spice })}
                  className={`py-3 px-4 rounded-xl font-bold text-xs border transition-all ${
                    formData.spiceTolerance === spice
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {spice} {spice === 'Spicy' ? '🌶️🌶️' : spice === 'Medium' ? '🌶️' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Favorite Cuisines */}
          <div className="pt-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
              4. Favorite Canteen Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {cuisinesList.map((c) => {
                const isSelected = formData.favoriteCuisines?.includes(c);
                return (
                  <button
                    type="button"
                    key={c}
                    onClick={() => toggleCuisine(c)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {c} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Foods to Avoid & Allergies */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                Foods to Avoid
              </label>
              <div className="flex flex-wrap gap-2">
                {avoidList.map((item) => {
                  const isSelected = formData.avoid?.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleAvoid(item)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {item} {isSelected && '✕'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                Allergies & Dietary Restrictions
              </label>
              <div className="flex flex-wrap gap-2">
                {allergiesList.map((allergy) => {
                  const isSelected = formData.allergies?.includes(allergy);
                  return (
                    <button
                      type="button"
                      key={allergy}
                      onClick={() => toggleAllergy(allergy)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {allergy} {isSelected && '⚠️'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4">
          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-fade-in">
              <Check className="w-4 h-4" />
              Preferences saved successfully!
            </span>
          )}

          <button
            type="submit"
            className="py-3.5 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
