
import React from 'react';
import { UserStats, ModuleType } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Flame, Trophy, Calendar, Target } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
  onNavigate: (module: ModuleType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onNavigate }) => {
  const chartData = stats.performanceHistory.length > 0 
    ? stats.performanceHistory.slice(-7)
    : [
        { date: 'Mon', score: 400 },
        { date: 'Tue', score: 300 },
        { date: 'Wed', score: 600 },
        { date: 'Thu', score: 800 },
        { date: 'Fri', score: 500 },
        { date: 'Sat', score: 900 },
        { date: 'Sun', score: 750 },
      ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold">Welcome Back, Master!</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Your memory palace is expanding. Ready for today's training?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Trophy className="text-yellow-500" />} label="Current Level" value={stats.level.toString()} subValue={`${1000 - (stats.xp % 1000)} XP to next`} />
        <StatCard icon={<Flame className="text-orange-500" />} label="Streak" value={`${stats.streak} Days`} subValue="Personal Best: 12" />
        <StatCard icon={<Calendar className="text-blue-500" />} label="Sessions" value={stats.completedSessions.toString()} subValue="Total completions" />
        <StatCard icon={<Target className="text-green-500" />} label="Accuracy" value="94%" subValue="+2% from last week" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Activity Progress</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff' 
                  }}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#6366f1' : '#6366f180'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
          <h3 className="text-xl font-bold">Training Plan</h3>
          <div className="space-y-3">
            <QuickLink label="Word Sequences" desc="Memorize lists in order" onClick={() => onNavigate(ModuleType.WORDS)} />
            <QuickLink label="Speed Numbers" desc="10 digits - Level 5" onClick={() => onNavigate(ModuleType.NUMBERS)} />
            <QuickLink label="Face Recognition" desc="New Set Available" onClick={() => onNavigate(ModuleType.FACES)} />
            <QuickLink label="Image Grid" desc="Spatial Recall" onClick={() => onNavigate(ModuleType.IMAGES)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, subValue: string }> = ({ icon, label, value, subValue }) => (
  <div className="glass rounded-3xl p-6 transition-transform hover:scale-[1.02] cursor-default">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-white/10">{icon}</div>
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-xs text-slate-400">{subValue}</div>
  </div>
);

const QuickLink: React.FC<{ label: string, desc: string, onClick: () => void }> = ({ label, desc, onClick }) => (
  <button 
    onClick={onClick}
    className="w-full text-left p-4 rounded-2xl hover:bg-white/5 border border-white/5 transition-colors group"
  >
    <p className="font-semibold group-hover:text-indigo-500 transition-colors">{label}</p>
    <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
  </button>
);

export default Dashboard;
