
import React, { useState, useEffect, useRef } from 'react';
import { WORDS_DB, LANGUAGES } from './constants';
import { Languages as LangIcon, Brain, CheckCircle2, XCircle, Timer, RefreshCw } from 'lucide-react';

interface WordsModuleProps {
  addXP: (xp: number) => void;
}

const WordsModule: React.FC<WordsModuleProps> = ({ addXP }) => {
  const [stage, setStage] = useState<'config' | 'memorize' | 'test'>('config');
  const [wordCount, setWordCount] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [selectedLang, setSelectedLang] = useState<string>('EN');
  const [sessionWords, setSessionWords] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<{word: string, input: string, correct: boolean}[]>([]);
  const [testInputs, setTestInputs] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  
  const timerRef = useRef<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const startSession = () => {
    const langWords = [...(WORDS_DB[selectedLang] || WORDS_DB.EN)];
    
    for (let i = langWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [langWords[i], langWords[j]] = [langWords[j], langWords[i]];
    }

    let generatedWords: string[] = [];
    if (wordCount <= langWords.length) {
      generatedWords = langWords.slice(0, wordCount);
    } else {
      generatedWords = [...langWords];
      while (generatedWords.length < wordCount) {
        const remaining = wordCount - generatedWords.length;
        const reshuffled = [...langWords].sort(() => 0.5 - Math.random());
        generatedWords = [...generatedWords, ...reshuffled.slice(0, remaining)];
      }
    }
    
    setSessionWords(generatedWords);
    setTestInputs(new Array(wordCount).fill(''));
    setStage('memorize');
    setTimeLeft(timeLimit);
    setTestResults([]);
    inputRefs.current = new Array(wordCount).fill(null);
  };

  useEffect(() => {
    if (stage === 'memorize' && timeLeft > 0) {
      timerRef.current = window.setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && stage === 'memorize') {
      setStage('test');
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [stage, timeLeft]);

  const finishMemorization = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStage('test');
  };

  const submitRecall = () => {
    const results = sessionWords.map((word, index) => ({
      word,
      input: testInputs[index],
      correct: testInputs[index].toLowerCase().trim() === word.toLowerCase().trim()
    }));
    setTestResults(results);
    const score = results.filter(r => r.correct).length;
    addXP(score * 50);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index < sessionWords.length - 1) {
        inputRefs.current[index + 1]?.focus();
        inputRefs.current[index + 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        submitRecall();
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <LangIcon className="text-indigo-500" /> Words (0-500)
        </h2>
        <p className="text-slate-500">Memorize non-repeating unique word lists.</p>
      </header>

      {stage === 'config' && (
        <div className="glass rounded-3xl p-6 md:p-10 space-y-10 animate-in fade-in duration-300 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase text-slate-500 block tracking-widest">Language</label>
              <div className="flex gap-2">
                {LANGUAGES.map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.code)}
                    className={`flex-1 py-4 rounded-2xl font-black transition-all border-2 ${
                      selectedLang === lang.code 
                        ? 'bg-indigo-500 text-white border-indigo-500 shadow-xl scale-[1.02]' 
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold uppercase text-slate-500 block tracking-widest">Word Count: <span className="text-indigo-500">{wordCount}</span></label>
              <input 
                type="range" min="5" max="500" step="5" value={wordCount}
                onChange={(e) => setWordCount(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>5</span><span>250</span><span>500</span>
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <label className="text-sm font-bold uppercase text-slate-500 block tracking-widest">Time: <span className="text-indigo-500">{timeLimit}s</span></label>
              <input 
                type="range" min="10" max="3600" step="10" value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>10s</span><span>1800s</span><span>3600s</span>
              </div>
            </div>
          </div>

          <button onClick={startSession} className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-black text-xl shadow-2xl hover:bg-indigo-600 transition-all hover:scale-[1.01] active:scale-95">
            Start Training
          </button>
        </div>
      )}

      {stage === 'memorize' && (
        <div className="glass rounded-3xl p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
          <div className="flex justify-center">
            <div className="bg-indigo-500/10 text-indigo-500 px-8 py-3 rounded-full font-black text-xl flex items-center gap-3">
              <Timer size={24} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
            {sessionWords.map((word, idx) => (
              <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 transition-colors hover:border-indigo-500/50">
                <span className="text-indigo-500 font-black text-xs min-w-[20px]">{idx + 1}</span>
                <span className="text-lg font-bold truncate">{word}</span>
              </div>
            ))}
          </div>

          <button 
            onClick={finishMemorization}
            className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-black text-xl shadow-2xl flex items-center justify-center gap-3"
          >
            I'm Ready <Brain size={24} />
          </button>
        </div>
      )}

      {stage === 'test' && testResults.length === 0 && (
        <div className="glass rounded-3xl p-6 md:p-10 space-y-8 animate-in zoom-in-95 duration-300">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black">Recall Progress: {testInputs.filter(i => i).length}/{sessionWords.length}</h3>
            <p className="text-slate-500 font-bold">Press Enter after each word.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto p-4 custom-scrollbar">
            {sessionWords.map((_, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-2xl">
                <span className="text-slate-400 font-black w-8 text-right text-xs">{idx + 1}</span>
                <input 
                  // Fix: wrapped the assignment in braces to ensure the callback returns void.
                  ref={el => { inputRefs.current[idx] = el; }}
                  autoFocus={idx === 0}
                  type="text"
                  placeholder="..."
                  autoComplete="off"
                  className="flex-1 p-3 bg-transparent border-none outline-none font-bold text-lg"
                  value={testInputs[idx]}
                  onChange={(e) => {
                    const newInputs = [...testInputs];
                    newInputs[idx] = e.target.value;
                    setTestInputs(newInputs);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                />
              </div>
            ))}
          </div>
          
          <button onClick={submitRecall} className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-black text-xl shadow-2xl">
            Finish & Check
          </button>
        </div>
      )}

      {stage === 'test' && testResults.length > 0 && (
        <div className="glass rounded-3xl p-6 md:p-10 space-y-8 animate-in zoom-in duration-300">
          <div className="text-center space-y-2">
            <div className={`text-6xl font-black ${testResults.filter(r => r.correct).length === sessionWords.length ? 'text-green-500' : 'text-indigo-500'}`}>
              {testResults.filter(r => r.correct).length} / {sessionWords.length}
            </div>
            <p className="text-slate-500 font-black uppercase tracking-widest">Score Breakdown</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[40vh] overflow-y-auto p-4 custom-scrollbar">
            {testResults.map((res, i) => (
              <div key={i} className={`p-4 rounded-2xl flex items-center justify-between border-2 ${res.correct ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-slate-400">{i + 1}</span>
                  <div>
                    <p className="font-black text-lg">{res.word}</p>
                    {!res.correct && <p className="text-xs text-red-500 font-bold">You: {res.input || '?'}</p>}
                  </div>
                </div>
                {res.correct ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={() => setStage('config')} className="flex-1 py-5 bg-indigo-500 text-white rounded-2xl font-black text-lg shadow-xl">
              New Set
            </button>
            <button onClick={startSession} className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-lg flex items-center justify-center gap-3">
              <RefreshCw size={20} /> Shuffle Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordsModule;
