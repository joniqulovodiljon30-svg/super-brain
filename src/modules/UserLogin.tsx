import React, { useState } from 'react';
import { Brain, Sparkles } from 'lucide-react';

interface UserLoginProps {
    onLogin: (username: string) => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ onLogin }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = name.trim();
        if (trimmed.length < 2) {
            setError('Name must be at least 2 characters');
            return;
        }
        if (trimmed.length > 20) {
            setError('Name must be 20 characters or less');
            return;
        }
        // Save to localStorage and notify parent
        localStorage.setItem('memory_master_user', trimmed);
        onLogin(trimmed);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-xl">
            {/* Animated background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-1/3 right-1/3 w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="relative w-full max-w-md mx-4">
                {/* Card */}
                <div className="bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-indigo-500/10">
                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl shadow-indigo-500/30">
                                <Brain className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1">
                                <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Memory Master
                        </h1>
                        <p className="text-slate-400 mt-2 text-center text-sm">
                            Enter your name to start training
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setError('');
                                }}
                                placeholder="Your name..."
                                autoFocus
                                className="w-full px-5 py-4 bg-slate-800/50 border-2 border-white/10 rounded-2xl text-white text-lg font-semibold placeholder:text-slate-500 outline-none transition-all duration-300 focus:border-indigo-500/50 focus:shadow-lg focus:shadow-indigo-500/10"
                            />
                            {error && (
                                <p className="absolute -bottom-6 left-2 text-xs text-red-400 font-medium">{error}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                        >
                            Start Training 🧠
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-slate-600 text-xs mt-6">
                        Your progress will be saved automatically
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserLogin;
