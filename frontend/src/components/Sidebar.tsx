import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  UtensilsCrossed, 
  Heart, 
  History, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  LogIn,
  LogOut,
  UserCheck
} from 'lucide-react';
import type { UserPreferences } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userPrefs?: UserPreferences;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onOpenAuthModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  userPrefs: _userPrefs,
  isCollapsed,
  setIsCollapsed,
  onOpenAuthModal,
}) => {
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'recommendations', label: 'AI Recommendations', icon: Sparkles, badge: 'AI' },
    { id: 'menu', label: "Today's Menu", icon: UtensilsCrossed },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen bg-white border-r border-slate-200/80 z-30 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
        <div 
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0">
            <Sparkles className="w-5 h-5 text-white animate-pulse-subtle" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 tracking-tight text-lg">
                Canteen<span className="text-emerald-600">AI</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 -mt-1">
                College Smart Dining
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 relative group ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}

            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              {!isCollapsed && <span>{item.label}</span>}

              {item.badge && !isCollapsed && (
                <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {item.badge}
                </span>
              )}

              {/* Tooltip when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Live Canteen Status Indicator */}
      {!isCollapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-slate-50 border border-slate-200/60">
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-800">Canteen Open</span>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Closes at 4:30 PM today
          </p>
        </div>
      )}

      {/* Bottom Profile & Settings */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        {isAuthenticated && user ? (
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${
                activeTab === 'profile'
                  ? 'bg-slate-100 text-slate-900'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-sm border border-emerald-500 shrink-0 shadow-xs">
                {user.username.charAt(0).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="flex flex-col text-left overflow-hidden flex-1">
                  <span className="text-xs font-bold text-slate-900 truncate">
                    {user.username}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                    <UserCheck className="w-3 h-3" /> Signed In
                  </span>
                </div>
              )}
            </button>

            {!isCollapsed && (
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => onOpenAuthModal && onOpenAuthModal()}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <LogIn className="w-4 h-4 text-emerald-400" />
            {!isCollapsed && <span>Sign In / Register</span>}
          </button>
        )}
      </div>
    </aside>
  );
};

