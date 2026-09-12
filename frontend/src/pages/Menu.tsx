import React, { useState } from 'react';
import { Search, UtensilsCrossed, SlidersHorizontal } from 'lucide-react';
import type { FoodItem, Category, DietType } from '../types';
import { FoodCard } from '../components/FoodCard';

interface MenuPageProps {
  foodItems: FoodItem[];
  onViewFoodDetail: (food: FoodItem) => void;
  onToggleFavorite: (foodId: string) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  foodItems,
  onViewFoodDetail,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activeDiet, setActiveDiet] = useState<DietType | 'All'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [maxPrepTime, setMaxPrepTime] = useState<number>(25);
  const [spiceLevelFilter, setSpiceLevelFilter] = useState<number>(-1);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const categories: Category[] = [
    'All',
    'Breakfast',
    'Lunch',
    'Snacks',
    'Drinks',
    'Rolls',
    'South Indian',
    'Chinese',
  ];

  const filteredFoods = foodItems.filter((food) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nameMatch = food.name.toLowerCase().includes(q);
      const descMatch = food.description.toLowerCase().includes(q);
      const categoryMatch = food.category.toLowerCase().includes(q);
      const ingredientMatch = food.ingredients.some((ing) => ing.toLowerCase().includes(q));
      if (!nameMatch && !descMatch && !categoryMatch && !ingredientMatch) return false;
    }

    // 2. Category
    if (activeCategory !== 'All' && food.category !== activeCategory) return false;

    // 3. Diet
    if (activeDiet === 'Veg' && food.dietType !== 'Veg' && food.dietType !== 'Vegan') return false;
    if (activeDiet === 'Non-Veg' && food.dietType !== 'Non-Veg') return false;
    if (activeDiet === 'Vegan' && food.dietType !== 'Vegan') return false;

    // 4. Max Price
    if (food.price > maxPrice) return false;

    // 5. Max Prep Time
    if (food.prepTime > maxPrepTime) return false;

    // 6. Spice Level
    if (spiceLevelFilter !== -1 && food.spiceLevel !== spiceLevelFilter) return false;

    // 7. Availability Only
    if (availableOnly && food.isAvailable !== 'Available') return false;

    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-emerald-600" />
            <span>Today's Canteen Menu</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Browse all {foodItems.length} live canteen items, prices and preparation times.
          </p>
        </div>

        {/* Search Field & Filter Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search food, roll, dosa, chai..."
              className="w-full py-2.5 pl-10 pr-4 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all ${
              showFilters
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expandable Advanced Filter Panel */}
      {showFilters && (
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-scale-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Diet filter */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Diet Type</label>
              <div className="flex gap-1">
                {(['All', 'Veg', 'Non-Veg', 'Vegan'] as (DietType | 'All')[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setActiveDiet(d)}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg border ${
                      activeDiet === d
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                <span>Max Price</span>
                <span className="text-emerald-600">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            {/* Max Prep Time */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                <span>Max Prep Time</span>
                <span className="text-indigo-600">{maxPrepTime} mins</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={maxPrepTime}
                onChange={(e) => setMaxPrepTime(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Spice Filter */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Spice Level</label>
              <select
                value={spiceLevelFilter}
                onChange={(e) => setSpiceLevelFilter(Number(e.target.value))}
                className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
              >
                <option value={-1}>Any Spice</option>
                <option value={0}>Mild / No Spice</option>
                <option value={1}>Low Spice 🌶️</option>
                <option value={2}>Medium 🌶️🌶️</option>
                <option value={3}>Spicy 🌶️🌶️🌶️</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Show Available Items Only</span>
            </label>

            <button
              onClick={() => {
                setActiveCategory('All');
                setActiveDiet('All');
                setMaxPrice(100);
                setMaxPrepTime(25);
                setSpiceLevelFilter(-1);
                setAvailableOnly(false);
                setSearchQuery('');
              }}
              className="text-xs text-rose-600 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Food Items Count Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>Showing {filteredFoods.length} canteen options</span>
        <span>Sorted by popularity & availability</span>
      </div>

      {/* Grid of Food Cards */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onSelect={onViewFoodDetail}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No food items found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search keywords, budget limits or dietary filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All');
              setActiveDiet('All');
              setMaxPrice(100);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs"
          >
            Clear All Search Filters
          </button>
        </div>
      )}
    </div>
  );
};
