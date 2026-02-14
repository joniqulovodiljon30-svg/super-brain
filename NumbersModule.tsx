
import React, { useState, useEffect, useRef } from 'react';
import { Timer, RefreshCw, Zap, CheckCircle2, XCircle } from 'lucide-react';

interface NumbersModuleProps {
  addXP: (xp: number) => void;
}

const NumbersModule: React.FC<NumbersModuleProps> = ({ addXP }) => {
  const [stage, setStage] = useState<'config' | 'memorize' | 'recall' | 'result'>('config');
  const [digits, setDigits] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [sequence, setSequence] = useState<string>('');
  const [userInput, setUserInput] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const timerRef = useRef<number | null>(null);

  const startSession = () => {
    const newSeq = Array.from({ length: digits }, () => Math.floor(Math.random() * 10)).join('');
    setSequence(newSeq);
    setStage('memorize');
    setTimeLeft(timeLimit);
    setUserInput('');
  };

  useEffect(() => {
    if (stage === 'memorize' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && stage === 'memorize') {
      setStage('recall');
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage, timeLeft]);

  const handleSubmit = () => {
    setStage('result');
    if (userInput === sequence) {
      addXP(digits * 20);
    }
  };

  const chunkString = (str: string, size: number) => {
    const chunks = [];
    for (let i = 0; i < str.length; i += size) {
      chunks.push(str.substring(i, i + size));
    }
    return chunks;
  };

  const renderComparison = () => {
    const maxLength = Math.max(sequence.length, userInput.length);
    const comparison = [];

    for (let i = 0; i < maxLength; i++) {
      const targetChar = sequence[i] || '';
      const userChar = userInput[i] || '';
      const isCorrect = targetChar === userChar;

      comparison.push(
        <div key={i} className={`flex flex-col items-center p-2 rounded-xl border transition-colors ${isCorrect ? 'bg-green-500/5 border-green-500/30' : 'bg-red-500/5 border-red-500/30'} min-w-[45px]`}>
          <span className="text-[10px] text-slate-400 font-mono mb-1">{i + 1}</span>
          <div className="flex items-center gap-1 font-mono text-xl font-bold">
            <span className="text-green-600">{targetChar}</span>
            {!isCorrect && (
              <>
                <span className="text-slate-300 text-sm">|</span>
                <span className="text-red-500">{userChar || '_'}</span>
              </>
            )}
          </div>
        </div>
      );
    }
    return comparison;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Zap className="text-yellow-500" /> Numbers (0-500)
          </h2>
          <p className="text-slate-500">Train with long digit sequences.</p>
        </div>
      </div>

      {stage === 'config' && (
        <div className="glass rounded-3xl p-6 md:p-10 space-y-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500">Sequence Length: <span className="text-indigo-500">{digits}</span> digits</label>
              <input 
                type="range" min="5" max="500" step="5" value={digits} 
                onChange={(e) => setDigits(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>5</span><span>250</span><span>500</span>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-bold uppercase tracking-wider text-slate-500">Time Limit: <span className="text-indigo-500">{timeLimit}s</span></label>
              <input 
                type="range" min="10" max="1800" step="10" value={timeLimit} 
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>10s</span><span>900s</span><span>1800s</span>
              </div>
            </div>
          </div>
          <button 
            onClick={startSession}
            className="w-full py-5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-bold text-xl shadow-xl shadow-indigo-500/30 transition-all hover:scale-[1.01] active:scale-95"
          >
            Start Memorization
          </button>
        </div>
      )}

      {stage === 'memorize' && (
        <div className="glass rounded-3xl p-6 md:p-10 text-center space-y-10">
          <div className="bg-indigo-500/10 text-indigo-500 px-6 py-2 rounded-full font-bold inline-flex items-center gap-2 mx-auto">
            <Timer size={20} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
            {chunkString(sequence, 2).map((chunk, idx) => (
              <span key={idx} className="text-3xl md:text-5xl font-bold font-mono text-slate-700 dark:text-slate-100 bg-white/5 px-4 py-2 rounded-xl shadow-sm min-w-[60px] border border-white/5">
                {chunk}
              </span>
            ))}
          </div>

          <button 
            onClick={() => setStage('recall')}
            className="text-indigo-500 font-bold hover:underline underline-offset-8 decoration-2"
          >
            Done, start recall
          </button>
        </div>
      )}

      {stage === 'recall' && (
        <div className="glass rounded-3xl p-6 md:p-10 space-y-8 text-center animate-in zoom-in-95 duration-300">
          <h3 className="text-2xl font-bold">Recall: {userInput.length} / {sequence.length}</h3>
          <textarea 
            autoFocus
            rows={5}
            placeholder="Type the numbers here..."
            className="w-full text-center text-3xl font-mono bg-transparent border-b-4 border-indigo-500 outline-none p-4 resize-none placeholder:text-slate-700/20"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          />
          <button 
            onClick={handleSubmit}
            className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-bold text-xl shadow-lg"
          >
            Check Result
          </button>
        </div>
      )}

      {stage === 'result' && (
        <div className="glass rounded-3xl p-6 md:p-10 text-center space-y-8 animate-in fade-in zoom-in duration-300">
          <div className={`text-4xl md:text-6xl font-bold flex items-center justify-center gap-4 ${userInput === sequence ? 'text-green-500' : 'text-red-500'}`}>
            {userInput === sequence ? <><CheckCircle2 size={48} /> Perfect!</> : <><XCircle size={48} /> Not Quite!</>}
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-center items-center gap-6 text-xs font-black uppercase text-slate-400 bg-slate-100 dark:bg-slate-900/50 py-2 rounded-full px-6 w-fit mx-auto">
              <span className="text-green-600">Correct</span>
              <span className="h-3 w-px bg-slate-300"></span>
              <span className="text-red-500">Your Error</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 max-h-[50vh] overflow-y-auto p-4 custom-scrollbar">
              {renderComparison()}
            </div>
          </div>

          <button 
            onClick={() => setStage('config')}
            className="w-full max-w-sm mx-auto py-5 bg-indigo-500 text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-xl"
          >
            <RefreshCw size={24} /> New Session
          </button>
        </div>
      )}
    </div>
  );
};

export default NumbersModule;
