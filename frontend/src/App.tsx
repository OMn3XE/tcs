import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { FoodDetailModal } from './components/FoodDetailModal';
import { Dashboard } from './pages/Dashboard';
import { RecommendationsPage } from './pages/Recommendations';
import { MenuPage } from './pages/Menu';
import { ChatPage } from './pages/Chat';
import { FavoritesPage } from './pages/Favorites';
import { HistoryPage } from './pages/History';
import { ProfilePage } from './pages/Profile';

import {
  INITIAL_FOOD_ITEMS,
  INITIAL_USER_PREFERENCES,
  INITIAL_HISTORY,
} from './data/mockData';
import type { FoodItem, Recommendation, UserPreferences, HistoryItem } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const [userPrefs, setUserPrefs] = useState<UserPreferences>(INITIAL_USER_PREFERENCES);
  const [foodItems, setFoodItems] = useState<FoodItem[]>(INITIAL_FOOD_ITEMS);
  const [historyItems] = useState<HistoryItem[]>(INITIAL_HISTORY);

  // Initial default recommendation (Chicken Roll + Masala Fries)
  const [currentRecommendation, setCurrentRecommendation] = useState<Recommendation | null>({
    id: 'rec-default',
    title: 'Best match for you',
    primaryFood: INITIAL_FOOD_ITEMS[0], // Chicken Roll ₹50
    sideFood: INITIAL_FOOD_ITEMS[1],    // Masala Fries ₹25
    totalPrice: 75,
    savings: 5,
    matchScore: 92,
    badges: ['✓ Within budget', '✓ Available now', '✓ 10 min preparation', '🌶 Spicy'],
    explanation: 'Since you have ₹80, prefer spicy food and only have 15 minutes, this is your best match.',
    reasoningDetails: [
      'Chicken Roll (₹50) matches spicy preference & fast 10 min prep.',
      'Masala Fries (₹25) adds extra crunch while leaving ₹5 under your ₹80 budget.',
      'Both items currently available live at Counter 2.'
    ],
    prepTimeTotal: 10,
    isFavorite: false,
  });

  const [alternatives, setAlternatives] = useState<Recommendation[]>([
    {
      id: 'alt-1',
      title: 'Egg Roll + Cold Coffee',
      primaryFood: INITIAL_FOOD_ITEMS[2],
      sideFood: INITIAL_FOOD_ITEMS[11],
      totalPrice: 80,
      savings: 0,
      matchScore: 86,
      badges: ['✓ Within budget', '✓ Available now', '8 min prep'],
      explanation: 'Egg Roll paired with chilled Cold Coffee.',
      reasoningDetails: ['8 min prep time.', 'Fits budget constraint.'],
      prepTimeTotal: 8,
    },
    {
      id: 'alt-2',
      title: 'Veg Noodles',
      primaryFood: INITIAL_FOOD_ITEMS[6],
      totalPrice: 55,
      savings: 25,
      matchScore: 81,
      badges: ['✓ Within budget', '15 min prep', 'Spicy 🌶️'],
      explanation: 'Wok-tossed spicy noodles.',
      reasoningDetails: ['Saves ₹25 from target.'],
      prepTimeTotal: 15,
    }
  ]);

  // Modal State
  const [selectedFoodForModal, setSelectedFoodForModal] = useState<FoodItem | null>(null);

  const handleToggleFavorite = (foodId: string) => {
    setFoodItems((prev) =>
      prev.map((f) => (f.id === foodId ? { ...f, isFavorite: !f.isFavorite } : f))
    );
  };

  const handleSavePreferences = (updated: UserPreferences) => {
    setUserPrefs(updated);
  };

  const handleRecommendSimilar = (_query: string) => {
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Sidebar navigation (Desktop) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userPrefs={userPrefs}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 px-4 sm:px-8 pt-6 pb-24 lg:pb-12 ${
          isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              userPrefs={userPrefs}
              foodItems={foodItems}
              currentRecommendation={currentRecommendation}
              setCurrentRecommendation={setCurrentRecommendation}
              alternatives={alternatives}
              setAlternatives={setAlternatives}
              onViewFoodDetail={(food) => setSelectedFoodForModal(food)}
              onToggleFavorite={handleToggleFavorite}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'recommendations' && (
            <RecommendationsPage
              userPrefs={userPrefs}
              foodItems={foodItems}
              onViewFoodDetail={(food) => setSelectedFoodForModal(food)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'menu' && (
            <MenuPage
              foodItems={foodItems}
              onViewFoodDetail={(food) => setSelectedFoodForModal(food)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'chat' && (
            <ChatPage
              userPrefs={userPrefs}
              foodItems={foodItems}
              onViewFoodDetail={(food) => setSelectedFoodForModal(food)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesPage
              foodItems={foodItems}
              onViewFoodDetail={(food) => setSelectedFoodForModal(food)}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          {activeTab === 'history' && (
            <HistoryPage
              historyItems={historyItems}
              onRecommendSimilar={handleRecommendSimilar}
            />
          )}

          {activeTab === 'profile' && (
            <ProfilePage
              userPrefs={userPrefs}
              onSavePreferences={handleSavePreferences}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Food Detail Modal */}
      <FoodDetailModal
        food={selectedFoodForModal}
        onClose={() => setSelectedFoodForModal(null)}
        onToggleFavorite={handleToggleFavorite}
        onAddToRecommendation={(_food) => {
          setSelectedFoodForModal(null);
          setActiveTab('dashboard');
        }}
      />
    </div>
  );
}

export default App;
