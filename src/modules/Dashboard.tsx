
import React from 'react';
import { SupabaseUserStats, ModuleType } from '../types';
import { calculateLevel } from '../utils/leveling';
import AccuracyRank from '../components/AccuracyRank';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Flame, Trophy, Calendar, Target, Loader2 } from 'lucide-react';

interface DashboardProps {
  stats: SupabaseUserStats;
  activityData: { date: string; score: number }[];
  loading: boolean;
  onNavigate: (module: ModuleType) => void;
  username: string;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, activityData, loading, onNavigate, username }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto" />
          <p className="text-slate-500 font-medium">Loading your stats...</p>
        </div>
      </div>
    );
  }

  const { xpForNextLevel, progressPct } = calculateLevel(stats.xp);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold">Welcome Back, {username}! 🧠</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Your memory palace is expanding. Ready for today's training?</p>
      </header>

      <div className="mb-4">
        <AccuracyRank accuracy={stats.accuracy_average} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Trophy className="text-yellow-500" />}
          label="Current Level"
          value={stats.current_level.toString()}
          subValue={`${xpForNextLevel - (stats.xp - (stats.xp - progressPct))}XP to next`}
        />
        <StatCard
          icon={<Flame className="text-orange-500" />}
          label="Streak"
          value={`${stats.streak_days} Days`}
          subValue={`Personal Best: ${stats.personal_best_streak}`}
        />
        <StatCard
          icon={<Calendar className="text-blue-500" />}
          label="Sessions"
          value={stats.total_sessions.toString()}
          subValue="Total completions"
        />
        <StatCard
          icon={<Target className="text-green-500" />}
          label="Accuracy"
          value={`${(stats.accuracy_average === 100 || stats.accuracy_average === 0) ? stats.accuracy_average : stats.accuracy_average.toFixed(2)}%`}
          subValue={stats.total_sessions > 0 ? `Over ${stats.total_sessions} sessions` : 'No sessions yet'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md dark:shadow-lg rounded-3xl p-6 md:p-8 transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold dark:text-white transition-colors duration-300">Activity Progress</h3>
            <span className="text-xs text-slate-400 font-medium">Last 7 days</span>
          </div>
          <div className="h-[300px] w-full">
            {activityData.length > 0 && activityData.some(d => d.score > 0) ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <BarChart data={activityData}>
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#ffffff'
                    }}
                    itemStyle={{ color: '#ffffff' }}
                    labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                    formatter={(value: number | undefined) => [`${value ?? 0} XP`, 'Score']}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={40}>
                    {activityData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === activityData.length - 1 ? '#6366f1' : '#6366f180'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <p className="text-slate-400 text-lg font-medium">No activity yet</p>
                  <p className="text-slate-500 text-sm">Complete a training session to see your progress!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md dark:shadow-lg rounded-3xl p-6 md:p-8 space-y-6 transition-all duration-300">
          <h3 className="text-xl font-bold dark:text-white transition-colors duration-300">Quick Training</h3>
          <div className="space-y-3">
            <QuickLink label="Word Sequences" desc="Memorize lists in order" onClick={() => onNavigate(ModuleType.WORDS)} />
            <QuickLink label="Speed Numbers" desc="Rapid digit recall" onClick={() => onNavigate(ModuleType.NUMBERS)} />
            <QuickLink label="Face Recognition" desc="Name the faces" onClick={() => onNavigate(ModuleType.FACES)} />
            <QuickLink label="Image Grid" desc="Spatial Recall" onClick={() => onNavigate(ModuleType.IMAGES)} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, subValue: string }> = ({ icon, label, value, subValue }) => (
  <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md dark:shadow-lg rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02] cursor-default">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 transition-colors duration-300">{icon}</div>
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
    </div>
    <div className="text-3xl font-bold mb-1 dark:text-white transition-colors duration-300">{value}</div>
    <div className="text-xs text-slate-400">{subValue}</div>
  </div>
);

const QuickLink: React.FC<{ label: string, desc: string, onClick: () => void }> = ({ label, desc, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 transition-all duration-300 group"
  >
    <p className="font-semibold group-hover:text-indigo-500 dark:text-white transition-colors duration-300">{label}</p>
    <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
  </button>
);

export default Dashboard;
