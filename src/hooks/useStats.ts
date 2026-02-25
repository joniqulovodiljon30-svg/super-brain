import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { SupabaseUserStats } from '../types';
import { calculateLevel } from '../utils/leveling';

const DEFAULT_STATS: SupabaseUserStats = {
    user_id: '',
    current_level: 1,
    xp: 0,
    streak_days: 0,
    personal_best_streak: 0,
    total_sessions: 0,
    accuracy_average: 0,
    total_correct_all_time: 0,
    total_questions_all_time: 0,
    last_active_date: null,
};

interface UseStatsReturn {
    stats: SupabaseUserStats;
    activityData: { date: string; score: number }[];
    loading: boolean;
    updateStats: (score: number, correct: number, totalQuestions: number) => Promise<void>;
}

export function useStats(username: string | null): UseStatsReturn {
    const [stats, setStats] = useState<SupabaseUserStats>(DEFAULT_STATS);
    const [activityData, setActivityData] = useState<{ date: string; score: number }[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch stats when username is available
    useEffect(() => {
        if (!username) {
            setLoading(false);
            return;
        }

        const fetchStats = async () => {
            setLoading(true);
            try {
                // 1. Check if user exists using maybeSingle() which returns null safely instead of throwing PGRST116
                const { data: existingData, error: fetchError } = await supabase
                    .from('user_stats')
                    .select('*')
                    .eq('user_id', username)
                    .maybeSingle();

                if (fetchError) {
                    console.error('Error checking user stats:', fetchError);
                }

                if (existingData) {
                    // User exists, load their data
                    setStats(existingData as SupabaseUserStats);
                } else {
                    // New user: explicitly initialize the database row
                    const newStats = { ...DEFAULT_STATS, user_id: username };
                    const { error: insertError } = await supabase
                        .from('user_stats')
                        .insert(newStats);

                    if (insertError) {
                        console.error('Error inserting default stats:', insertError);
                    }

                    // Set local state to defaults immediately
                    setStats(newStats);
                }

                // Fetch last 7 days of activity logs
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
                const fromDate = sevenDaysAgo.toISOString().split('T')[0];

                const { data: activityRows, error: actError } = await supabase
                    .from('activity_logs')
                    .select('activity_date, score')
                    .eq('user_id', username)
                    .gte('activity_date', fromDate)
                    .order('activity_date', { ascending: true });

                if (actError) {
                    console.error('Error fetching activity logs:', actError);
                }

                // Build full 7-day array (fill missing days with 0)
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const fullWeek: { date: string; score: number }[] = [];

                for (let i = 0; i < 7; i++) {
                    const d = new Date();
                    d.setDate(d.getDate() - 6 + i);
                    const dateStr = d.toISOString().split('T')[0];
                    const dayName = dayNames[d.getDay()];
                    const match = activityRows?.find(
                        (r: { activity_date: string; score: number }) => r.activity_date === dateStr
                    );
                    fullWeek.push({
                        date: dayName,
                        score: match ? match.score : 0,
                    });
                }

                setActivityData(fullWeek);
            } catch (err) {
                console.error('Unexpected error in useStats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [username]);

    // Update stats after a game session
    const updateStats = useCallback(
        async (score: number, correct: number, totalQuestions: number) => {
            if (!username) {
                console.warn('Cannot update stats: no username.');
                return;
            }

            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];

            // Calculate new values using the custom tiered leveling logic
            const newXP = stats.xp + score;
            const newLevelData = calculateLevel(newXP);
            const newLevel = newLevelData.currentLevel;
            const newSessions = stats.total_sessions + 1;

            // Cumulative accuracy calculation
            const newTotalCorrect = (stats.total_correct_all_time || 0) + correct;
            const newTotalQuestions = (stats.total_questions_all_time || 0) + totalQuestions;
            const newAccuracy = newTotalQuestions > 0 ? (newTotalCorrect / newTotalQuestions) * 100 : 0;

            // Streak calculation
            let newStreak = 1;
            if (stats.last_active_date) {
                const lastDate = new Date(stats.last_active_date);
                const lastDateStr = lastDate.toISOString().split('T')[0];

                if (lastDateStr === todayStr) {
                    newStreak = stats.streak_days; // Same day
                } else {
                    const yesterday = new Date(now);
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split('T')[0];
                    if (lastDateStr === yesterdayStr) {
                        newStreak = stats.streak_days + 1; // Consecutive
                    }
                    // else: gap → reset to 1
                }
            }

            const newBestStreak = Math.max(stats.personal_best_streak, newStreak);

            const updatedStats: SupabaseUserStats = {
                ...stats,
                xp: newXP,
                current_level: newLevel,
                total_sessions: newSessions,
                accuracy_average: newAccuracy,
                total_correct_all_time: newTotalCorrect,
                total_questions_all_time: newTotalQuestions,
                streak_days: newStreak,
                personal_best_streak: newBestStreak,
                last_active_date: now.toISOString(),
            };

            // Upsert user_stats
            const { error: statsErr } = await supabase
                .from('user_stats')
                .upsert({
                    user_id: username,
                    current_level: updatedStats.current_level,
                    xp: updatedStats.xp,
                    streak_days: updatedStats.streak_days,
                    personal_best_streak: updatedStats.personal_best_streak,
                    total_sessions: updatedStats.total_sessions,
                    accuracy_average: updatedStats.accuracy_average,
                    last_active_date: updatedStats.last_active_date,
                }, { onConflict: 'user_id' });

            if (statsErr) {
                console.error('Error updating stats:', statsErr);
                return;
            }

            // Upsert today's activity log
            const { data: existingLog } = await supabase
                .from('activity_logs')
                .select('id, score, sessions_count')
                .eq('user_id', username)
                .eq('activity_date', todayStr)
                .maybeSingle();

            if (existingLog) {
                await supabase
                    .from('activity_logs')
                    .update({
                        score: existingLog.score + score,
                        sessions_count: existingLog.sessions_count + 1,
                    })
                    .eq('id', existingLog.id);
            } else {
                await supabase
                    .from('activity_logs')
                    .insert({
                        user_id: username,
                        activity_date: todayStr,
                        score: score,
                        sessions_count: 1,
                    });
            }

            // Update local state
            setStats(updatedStats);

            // Update activity chart
            const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const todayDayName = dayNames[now.getDay()];
            setActivityData(prev => {
                const updated = [...prev];
                const todayIdx = updated.findIndex(d => d.date === todayDayName);
                if (todayIdx !== -1) {
                    updated[todayIdx] = { ...updated[todayIdx], score: updated[todayIdx].score + score };
                }
                return updated;
            });
        },
        [username, stats]
    );

    return { stats, activityData, loading, updateStats };
}
