import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { X, Flame, Loader2, Sparkles } from 'lucide-react';

interface StreakHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    username: string;
}

const StreakHistoryModal: React.FC<StreakHistoryModalProps> = ({ isOpen, onClose, username }) => {
    const [dates, setDates] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !username) return;

        const fetchHistory = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('activity_logs')
                    .select('activity_date')
                    .eq('user_id', username)
                    .order('activity_date', { ascending: false });

                if (error) {
                    console.error('Error fetching activity history:', error);
                    setDates([]);
                    return;
                }

                // Extract unique dates
                const uniqueDates = [...new Set((data || []).map((row: { activity_date: string }) => row.activity_date))];
                setDates(uniqueDates);
            } catch (err) {
                console.error('Unexpected error:', err);
                setDates([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [isOpen, username]);

    if (!isOpen) return null;

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr + 'T00:00:00');
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    // Check if a date is today
    const isToday = (dateStr: string): boolean => {
        const today = new Date().toISOString().split('T')[0];
        return dateStr === today;
    };

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative w-full max-w-lg max-h-[80vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-3xl shadow-2xl shadow-orange-500/10 dark:shadow-orange-500/5 overflow-hidden animate-in zoom-in-95 fade-in duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/80 px-6 py-5 flex items-center justify-between">
                    <h2 className="text-xl font-black flex items-center gap-2 dark:text-white">
                        🔥 Your Activity History
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4 overflow-y-auto max-h-[calc(80vh-80px)] custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                            <p className="text-slate-400 font-medium">Loading history...</p>
                        </div>
                    ) : dates.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-orange-400" />
                            </div>
                            <div>
                                <p className="text-lg font-bold dark:text-white">No activity yet</p>
                                <p className="text-slate-400 text-sm mt-1">Start a game to build your streak!</p>
                            </div>
                        </div>
                    ) : (
                        /* Date List */
                        <div className="space-y-2 pb-4">
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                                {dates.length} active {dates.length === 1 ? 'day' : 'days'} total
                            </p>
                            {dates.map((dateStr, index) => (
                                <div
                                    key={dateStr}
                                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${isToday(dateStr)
                                            ? 'bg-orange-500/10 border-orange-500/30 dark:bg-orange-500/10 dark:border-orange-500/30'
                                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600'
                                        }`}
                                    style={{ animationDelay: `${index * 30}ms` }}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isToday(dateStr)
                                            ? 'bg-orange-500 shadow-lg shadow-orange-500/30'
                                            : 'bg-slate-200 dark:bg-slate-700'
                                        }`}>
                                        <Flame size={18} className={isToday(dateStr) ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-bold text-sm ${isToday(dateStr) ? 'text-orange-600 dark:text-orange-400' : 'dark:text-white'}`}>
                                            {formatDate(dateStr)}
                                        </p>
                                        {isToday(dateStr) && (
                                            <p className="text-[11px] font-semibold text-orange-500 uppercase tracking-wider">Today</p>
                                        )}
                                    </div>
                                    <span className="text-lg flex-shrink-0">{isToday(dateStr) ? '🔥' : '✅'}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StreakHistoryModal;
