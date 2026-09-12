import React from 'react';
import { LayoutDashboard, Sparkles, UtensilsCrossed, Heart, User, MessageSquare } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'recommendations', label: 'AI Picks', icon: Sparkles },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'favorites', label: 'Saved', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 z-40 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-emerald-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-50' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
