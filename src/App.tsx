import React, { useState, useEffect } from 'react';
import { storageService } from './storageService';
import { ModuleType } from './types';
import { useStats } from './hooks/useStats';
import { calculateLevel } from './utils/leveling';
import Dashboard from './modules/Dashboard';
import UserLogin from './modules/UserLogin';
import NumbersModule from './modules/NumbersModule';
import WordsModule from './modules/WordsModule';
import FlashcardsModule from './modules/FlashcardsModule';
import FacesModule from './modules/FacesModule';
import ImagesModule from './modules/ImagesModule';
import AICoach from './modules/AICoach';

import {
  Hash,
  Languages,
  CreditCard,
  UserCircle2,
  Image as ImageIcon,
  Sun,
  Moon,
  TrendingUp,
  Sparkles,
  LogOut
} from 'lucide-react';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  const [theme, setTheme] = useState<'light' | 'dark'>(storageService.getTheme());
  const [username, setUsername] = useState<string | null>(null);

  // Check localStorage for saved username on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('memory_master_user');
    if (savedUser) {
      setUsername(savedUser);
    }
  }, []);

  // Supabase-backed stats (keyed by username)
  const { stats, activityData, loading, updateStats } = useStats(username);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storageService.saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleLogin = (name: string) => {
    setUsername(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('memory_master_user');
    setUsername(null);
    setActiveModule(ModuleType.DASHBOARD);
  };

  // Wrapper: called by game modules after a session finishes
  const handleGameFinish = async (score: number, correct: number, total: number, gameType: ModuleType) => {
    await updateStats(score, correct, total, gameType);
  };

  // Show login modal if no username
  if (!username) {
    return (
      <div className={theme === 'dark' ? 'dark' : ''}>
        <UserLogin onLogin={handleLogin} />
      </div>
    );
  }

  const renderModule = () => {
    switch (activeModule) {
      case ModuleType.DASHBOARD:
        return <Dashboard stats={stats} activityData={activityData} loading={loading} onNavigate={setActiveModule} username={username} />;
      case ModuleType.NUMBERS:
        return <NumbersModule addXP={(xp: number, correct: number, total: number) => handleGameFinish(xp, correct, total, ModuleType.NUMBERS)} />;
      case ModuleType.WORDS:
        return <WordsModule addXP={(xp: number, correct: number, total: number) => handleGameFinish(xp, correct, total, ModuleType.WORDS)} />;
      case ModuleType.FLASHCARDS:
        return <FlashcardsModule addXP={(xp: number, correct: number, total: number) => handleGameFinish(xp, correct, total, ModuleType.FLASHCARDS)} />;
      case ModuleType.FACES:
        return <FacesModule addXP={(xp: number, correct: number, total: number) => handleGameFinish(xp, correct, total, ModuleType.FACES)} />;
      case ModuleType.IMAGES:
        return <ImagesModule addXP={(xp: number, correct: number, total: number) => handleGameFinish(xp, correct, total, ModuleType.IMAGES)} />;
      case ModuleType.COACH:
        return <AICoach stats={{
          xp: stats.xp,
          level: stats.current_level,
          streak: stats.streak_days,
          completedSessions: stats.total_sessions,
          performanceHistory: []
        }} />;
      default:
        return <Dashboard stats={stats} activityData={activityData} loading={loading} onNavigate={setActiveModule} username={username} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 transition-all">
      <nav className="w-full md:w-64 glass border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 flex flex-row md:flex-col items-center md:items-stretch gap-2 z-50 sticky top-0 md:h-screen">
        <div className="flex items-center gap-2 px-2 py-4 mb-0 md:mb-6 cursor-pointer" onClick={() => setActiveModule(ModuleType.DASHBOARD)}>
          <img src="/icons/icon-512.png" alt="Memory Master Logo" className="w-10 h-10 object-contain rounded-[13px]" />
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-500 hidden md:block">
            Memory Master
          </h1>
        </div>

        <div className="flex-1 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar gap-1">
          <NavButton icon={<TrendingUp size={20} />} label="Stats" active={activeModule === ModuleType.DASHBOARD} onClick={() => setActiveModule(ModuleType.DASHBOARD)} />
          <NavButton icon={<Hash size={20} />} label="Numbers" active={activeModule === ModuleType.NUMBERS} onClick={() => setActiveModule(ModuleType.NUMBERS)} />
          <NavButton icon={<Languages size={20} />} label="Words" active={activeModule === ModuleType.WORDS} onClick={() => setActiveModule(ModuleType.WORDS)} />
          <NavButton icon={<CreditCard size={20} />} label="Decks" active={activeModule === ModuleType.FLASHCARDS} onClick={() => setActiveModule(ModuleType.FLASHCARDS)} />
          <NavButton icon={<UserCircle2 size={20} />} label="Faces" active={activeModule === ModuleType.FACES} onClick={() => setActiveModule(ModuleType.FACES)} />
          <NavButton icon={<ImageIcon size={20} />} label="Grid" active={activeModule === ModuleType.IMAGES} onClick={() => setActiveModule(ModuleType.IMAGES)} />
          <NavButton icon={<Sparkles size={20} />} label="AI Coach" active={activeModule === ModuleType.COACH} onClick={() => setActiveModule(ModuleType.COACH)} />
        </div>

        <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-800 hidden md:flex flex-col gap-4">
          {/* User info */}
          <div className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
            <p className="text-xs uppercase font-bold text-indigo-500 mb-1">Level {stats.current_level}</p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full transition-all duration-500"
                style={{ width: `${calculateLevel(stats.xp).progressPct}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 truncate">👤 {username}</p>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span className="text-sm font-medium">{theme === 'light' ? 'Dark' : 'Light'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-slate-500 hover:text-red-500"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Switch User</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto h-[calc(100vh-64px)] md:h-screen custom-scrollbar">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {renderModule()}
        </div>
      </main>
    </div>
  );
};

const NavButton: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${active
      ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30'
      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
      }`}
  >
    {icon}
    <span className="hidden md:inline font-medium text-sm">{label}</span>
  </button>
);

export default App;
