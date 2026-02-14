import React, { useState, useEffect, useCallback } from 'react';
import { storageService } from './storageService';
import { ModuleType, UserStats } from './types';
import Dashboard from './modules/Dashboard';
import NumbersModule from './modules/NumbersModule';
import WordsModule from './modules/WordsModule';
import FlashcardsModule from './modules/FlashcardsModule';
import FacesModule from './modules/FacesModule';
import ImagesModule from './modules/ImagesModule';
import AICoach from './modules/AICoach';

import {
  Brain,
  Hash,
  Languages,
  CreditCard,
  UserCircle2,
  Image as ImageIcon,
  Sun,
  Moon,
  TrendingUp,
  Sparkles
} from 'lucide-react';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  const [theme, setTheme] = useState<'light' | 'dark'>(storageService.getTheme());
  const [stats, setStats] = useState<UserStats>(storageService.getUserStats());

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storageService.saveTheme(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addXP = useCallback((amount: number) => {
    setStats(prev => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 1000) + 1;
      const updated = { ...prev, xp: newXP, level: newLevel, completedSessions: prev.completedSessions + 1 };
      storageService.saveUserStats(updated);
      return updated;
    });
  }, []);

  const renderModule = () => {
    switch (activeModule) {
      case ModuleType.DASHBOARD: return <Dashboard stats={stats} onNavigate={setActiveModule} />;
      case ModuleType.NUMBERS: return <NumbersModule addXP={addXP} />;
      case ModuleType.WORDS: return <WordsModule addXP={addXP} />;
      case ModuleType.FLASHCARDS: return <FlashcardsModule addXP={addXP} />;
      case ModuleType.FACES: return <FacesModule addXP={addXP} />;
      case ModuleType.IMAGES: return <ImagesModule addXP={addXP} />;
      case ModuleType.COACH: return <AICoach stats={stats} />;
      default: return <Dashboard stats={stats} onNavigate={setActiveModule} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 transition-all">
      <nav className="w-full md:w-64 glass border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 flex flex-row md:flex-col items-center md:items-stretch gap-2 z-50 sticky top-0 md:h-screen">
        <div className="flex items-center gap-2 px-2 py-4 mb-0 md:mb-6 cursor-pointer" onClick={() => setActiveModule(ModuleType.DASHBOARD)}>
          <img src="/icons/icon-512.png" alt="Memory Master Logo" className="w-10 h-10 object-contain" />
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
          <div className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
            <p className="text-xs uppercase font-bold text-indigo-500 mb-1">Level {stats.level}</p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full" style={{ width: `${(stats.xp % 1000) / 10}%` }}></div>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-400"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            <span className="text-sm font-medium">{theme === 'light' ? 'Dark' : 'Light'}</span>
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
