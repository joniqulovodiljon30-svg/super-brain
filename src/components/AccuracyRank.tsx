import React from 'react';

interface AccuracyRankProps {
    accuracy: number;
}

interface RankTier {
    title: string;
    emoji: string;
    message: string;
    colorClass: string;
}

const getRankTheme = (accuracy: number): RankTier => {
    if (accuracy < 20) return { title: 'Memory Noob', emoji: '🤡', message: 'Are you even trying? Focus!', colorClass: 'text-red-500 bg-red-500/10 border-red-500/20 shadow-red-500/20' };
    if (accuracy < 40) return { title: 'Sleepy Head', emoji: '😴', message: 'Wake up! Your brain needs coffee.', colorClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20 shadow-orange-500/20' };
    if (accuracy < 60) return { title: 'Average Joe', emoji: '😐', message: 'Perfectly balanced. But you can do better.', colorClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20 shadow-yellow-500/20' };
    if (accuracy < 80) return { title: 'Sharp Mind', emoji: '🧠', message: 'Getting stronger! Your neurons are firing.', colorClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20 shadow-blue-500/20' };
    if (accuracy < 85) return { title: 'Mental Athlete', emoji: '💪', message: 'Great job! Keep practicing.', colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20 shadow-indigo-500/20' };
    if (accuracy < 90) return { title: 'Master', emoji: '🔮', message: 'Incredible focus! You are dangerous.', colorClass: 'text-purple-500 bg-purple-500/10 border-purple-500/20 shadow-purple-500/20' };

    // 90% and above
    // Light Mode: text-purple-800, border-purple-200, bg-white, shadow-xl
    // Dark Mode: glowing fuchsia text and background shadow
    return {
        title: 'Professional Mnemonist',
        emoji: '👑',
        message: 'UNBELIEVABLE! You are a human supercomputer!',
        colorClass: 'text-purple-800 bg-white border-2 border-purple-200 shadow-xl dark:text-fuchsia-400 dark:bg-fuchsia-500/20 dark:border-fuchsia-500/50 dark:shadow-[0_0_20px_rgba(217,70,239,0.7)] dark:drop-shadow-[0_0_10px_rgba(217,70,239,0.8)]'
    };
};

const AccuracyRank: React.FC<AccuracyRankProps> = ({ accuracy }) => {
    const rank = getRankTheme(accuracy);

    const formattedAccuracy = (accuracy === 100 || accuracy === 0)
        ? accuracy.toString()
        : accuracy.toFixed(2);

    return (
        <div className={`rounded-3xl p-6 md:p-8 border transition-all duration-300 flex flex-col md:flex-row items-center gap-6 ${rank.colorClass}`}>
            <div className={`text-6xl md:text-8xl filter animate-bounce-slow ${accuracy >= 90 ? 'drop-shadow-md dark:drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]' : 'drop-shadow-md'}`}>
                {rank.emoji}
            </div>
            <div className="flex-1 text-center md:text-left space-y-2">
                <h3 className={`text-sm font-black uppercase tracking-widest opacity-80 ${accuracy >= 90 ? 'text-gray-500 dark:text-fuchsia-200/80' : ''}`}>
                    Lifetime Rank • {formattedAccuracy}% Accuracy
                </h3>
                <h2 className="text-3xl md:text-4xl font-black drop-shadow-sm">{rank.title}</h2>
                <p className={`text-lg md:text-xl font-medium opacity-90 ${accuracy >= 90 ? 'text-indigo-600 dark:text-fuchsia-300' : ''}`}>
                    {rank.message}
                </p>
            </div>
        </div>
    );
};

export default AccuracyRank;
