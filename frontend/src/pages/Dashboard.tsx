import React, { useState } from 'react';
import { Header } from '../components/Header';
import { AIPromptCard } from '../components/AIPromptCard';
import { RecommendationCard } from '../components/RecommendationCard';
import { FoodCard } from '../components/FoodCard';
import { PersonalizationPanel } from '../components/PersonalizationPanel';
import { AILoadingOverlay } from '../components/AILoadingOverlay';
import type { FoodItem, Recommendation, UserPreferences, Category } from '../types';
import { fetchRecommendationsAPI } from '../services/api';
import { Sparkles, UtensilsCrossed, ArrowRight } from 'lucide-react';

interface DashboardProps {
  userPrefs: UserPreferences;
  foodItems: FoodItem[];
  currentRecommendation: Recommendation | null;
  setCurrentRecommendation: (rec: Recommendation | null) => void;
  alternatives: Recommendation[];
  setAlternatives: (recs: Recommendation[]) => void;
  onViewFoodDetail: (food: FoodItem) => void;
  onToggleFavorite: (foodId: string) => void;
  onNavigateToTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userPrefs,
  foodItems,
  currentRecommendation,
  setCurrentRecommendation,
  alternatives,
  setAlternatives,
  onViewFoodDetail,
  onToggleFavorite,
  onNavigateToTab,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<Category>('All');

  const categories: Category[] = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Drinks'];

  const handlePromptSubmit = async (promptText: string, mood?: string | null, moodConfidence?: number | null) => {
    setIsProcessing(true);
    try {
      // Call Backend REST API POST /api/recommendations/
      const apiRes = await fetchRecommendationsAPI(promptText, mood, moodConfidence, userPrefs);
      setThinkingSteps(apiRes.thinkingSteps || []);
      
      // Wait for AI loading overlay animation
      setTimeout(() => {
        if (apiRes.recommendation) {
          setCurrentRecommendation(apiRes.recommendation);
        }
        setAlternatives(apiRes.alternatives || []);
        setIsProcessing(false);
      }, 1500);
    } catch (err) {
      console.error('API Error:', err);
      setIsProcessing(false);
    }
  };

  const filteredPreviewFoods = foodItems.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  }).slice(0, 6);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header */}
      <Header
        userPrefs={userPrefs}
        onOpenChat={() => onNavigateToTab('chat')}
        onSearchClick={() => onNavigateToTab('menu')}
      />

      {/* Main Grid: AI Prompt + Personalization Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: AI Prompt & Results */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main AI Prompt Card */}
          <AIPromptCard onSearchSubmit={handlePromptSubmit} isProcessing={isProcessing} />

          {/* AI Loading State */}
          {isProcessing && <AILoadingOverlay steps={thinkingSteps} />}

          {/* AI Recommendation Result Card */}
          {!isProcessing && currentRecommendation && (
            <RecommendationCard
              recommendation={currentRecommendation}
              alternatives={alternatives}
              onViewFoodDetail={onViewFoodDetail}
              onSelectAlternative={(alt) => setCurrentRecommendation(alt)}
              onToggleFavorite={() => onToggleFavorite(currentRecommendation.id)}
            />
          )}

          {/* Today's Menu Section Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
                  <span>Today's Available Menu</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Freshly prepared at college canteen counters today
                </p>
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredPreviewFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onSelect={onViewFoodDetail}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>

            {/* View Full Menu Link */}
            <div className="mt-6 text-center pt-4 border-t border-slate-100">
              <button
                onClick={() => onNavigateToTab('menu')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
              >
                <span>View Full Menu & Filters</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Personalization Panel */}
        <div className="lg:col-span-4 space-y-6">
          <PersonalizationPanel
            userPrefs={userPrefs}
            onEditClick={() => onNavigateToTab('profile')}
          />

          {/* Quick AI Tip Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white border border-emerald-700/40">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Smart Canteen Tip</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Counter 2 (South Indian & Rolls) has shortest wait times before 1:30 PM. Order early to skip lunch rush!
            </p>
            <button
              onClick={() => handlePromptSubmit('I want something quick under ₹40 from Counter 2')}
              className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200 underline"
            >
              Get quick counter recommendation →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
