import React from 'react';
import { Sparkles, Search } from 'lucide-react';
import type { UserPreferences } from '../types';

interface HeaderProps {
  userPrefs: UserPreferences;
  onOpenChat: () => void;
  onSearchClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userPrefs, onOpenChat, onSearchClick }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/60 mb-6">
      {/* Greeting & Title */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {getGreeting()}, <span className="text-emerald-600">{userPrefs.studentName}</span>
          </h1>
          <span className="inline-block animate-bounce text-xl">👋</span>
        </div>
        <p className="text-sm text-slate-500 font-medium mt-1">
          What's on your mind today? Let AI find your perfect meal.
        </p>
      </div>

      {/* Action Pills & Canteen Badge */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Live Canteen Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>● Canteen Open</span>
          <span className="text-slate-400 font-normal">|</span>
          <span className="text-emerald-700 font-normal">Closes at 4:30 PM</span>
        </div>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={onOpenChat}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Chat</span>
        </button>

        {/* Quick Search */}
        <button
          onClick={onSearchClick}
          className="p-2 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all shadow-xs"
          title="Search food menu"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
