
import React, { useState, useEffect } from 'react';
import { geminiService } from './geminiService';
import { UserStats } from './types';
import { Sparkles, Bot, MessageSquare, Lightbulb, TrendingUp } from 'lucide-react';

interface AICoachProps {
  stats: UserStats;
}

const AICoach: React.FC<AICoachProps> = ({ stats }) => {
  const [advice, setAdvice] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAdvice();
  }, []);

  const fetchAdvice = async () => {
    setLoading(true);
    const result = await geminiService.getAiCoachAdvice(stats);
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="text-indigo-500" /> AI Memory Coach
        </h2>
        <p className="text-slate-500 mt-2">Personalized guidance based on your neural training patterns.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="glass rounded-3xl p-6 text-center border-t-4 border-indigo-500">
            <div className="w-24 h-24 bg-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white">
              <Bot size={48} />
            </div>
            <h3 className="font-bold text-xl">Lumina</h3>
            <p className="text-xs text-indigo-500 font-bold uppercase tracking-wider">Memory Specialist</p>
          </div>
          
          <div className="glass rounded-3xl p-6">
            <h4 className="font-bold text-sm uppercase text-slate-500 mb-4">Stats Highlight</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="p-2 h-fit bg-blue-500/10 rounded-lg text-blue-500"><TrendingUp size={16} /></div>
                <div>
                  <p className="text-sm font-bold">XP Level</p>
                  <p className="text-xs text-slate-500">{stats.xp} Total XP</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="glass rounded-3xl p-8 relative min-h-[400px]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 animate-pulse text-sm">Lumina is analyzing your metrics...</p>
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <div className="flex items-center gap-2 mb-6 text-indigo-500">
                  <MessageSquare size={24} />
                  <h3 className="text-xl font-bold m-0">Personal Strategy Report</h3>
                </div>
                <div className="space-y-4 text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed text-sm">
                  {advice}
                </div>
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] text-slate-400 italic">Powered by Gemini AI</span>
                  <button 
                    onClick={fetchAdvice}
                    className="px-6 py-2 bg-indigo-500 text-white rounded-xl font-bold hover:scale-105 transition-transform text-xs"
                  >
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
