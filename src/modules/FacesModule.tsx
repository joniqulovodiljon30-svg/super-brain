
import React, { useState, useEffect } from 'react';
import { NAMES, OCCUPATIONS, FEATURES } from '../constants';
import { FaceData } from '../types';
import { UserCircle, Search, RefreshCw, AlertCircle } from 'lucide-react';

interface FacesModuleProps {
  addXP: (xp: number) => void;
}

const FacesModule: React.FC<FacesModuleProps> = ({ addXP }) => {
  const [stage, setStage] = useState<'study' | 'test' | 'summary'>('study');
  const [faces, setFaces] = useState<FaceData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userGuess, setUserGuess] = useState({ name: '', occupation: '' });
  const [results, setResults] = useState<{ correct: boolean, face: FaceData, guess: any }[]>([]);

  useEffect(() => {
    generateFaces();
  }, []);

  const generateFaces = () => {
    const newFaces = Array.from({ length: 5 }, (_, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      occupation: OCCUPATIONS[Math.floor(Math.random() * OCCUPATIONS.length)],
      imageUrl: `https://picsum.photos/seed/${Math.random()}/300/300`,
      feature: FEATURES[Math.floor(Math.random() * FEATURES.length)]
    }));
    setFaces(newFaces);
    setStage('study');
    setCurrentIndex(0);
    setResults([]);
  };

  const nextFace = () => {
    if (currentIndex < faces.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStage('test');
      setCurrentIndex(0);
    }
  };

  const submitGuess = () => {
    const nameMatch = userGuess.name.toLowerCase().trim() === faces[currentIndex].name.toLowerCase();
    const occMatch = userGuess.occupation.toLowerCase().trim() === faces[currentIndex].occupation.toLowerCase();
    const isCorrect = nameMatch && occMatch;

    setResults(prev => [...prev, { correct: isCorrect, face: faces[currentIndex], guess: userGuess }]);
    setUserGuess({ name: '', occupation: '' });

    if (currentIndex < faces.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStage('summary');
      const correctCount = results.filter(r => r.correct).length + (isCorrect ? 1 : 0);
      addXP(correctCount * 100);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <UserCircle className="text-pink-500" /> Face & Name Lab
        </h2>
        <p className="text-slate-500">The key to social success. Remember names, jobs, and unique features.</p>
      </header>

      {stage === 'study' && faces[currentIndex] && (
        <div className="glass rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 shrink-0">
            <img src={faces[currentIndex].imageUrl} className="w-full h-full object-cover" alt="Study target" />
          </div>
          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="text-slate-400 text-sm font-bold uppercase">Candidate {currentIndex + 1} of {faces.length}</div>
            <div className="space-y-2">
              <h3 className="text-5xl font-bold text-pink-500">{faces[currentIndex].name}</h3>
              <p className="text-2xl text-slate-600 dark:text-slate-300 font-medium">{faces[currentIndex].occupation}</p>
            </div>
            <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border-l-4 border-pink-500">
              <p className="text-xs uppercase text-slate-500 mb-1">Distinctive Feature</p>
              <p className="font-bold">{faces[currentIndex].feature}</p>
            </div>
            <button onClick={nextFace} className="w-full md:w-auto px-10 py-4 bg-pink-500 text-white rounded-2xl font-bold text-lg">
              {currentIndex === faces.length - 1 ? 'Start Recognition Test' : 'Next Person'}
            </button>
          </div>
        </div>
      )}

      {stage === 'test' && faces[currentIndex] && (
        <div className="glass rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 shrink-0">
            <img src={faces[currentIndex].imageUrl} className="w-full h-full object-cover" alt="Who is this?" />
          </div>
          <div className="flex-1 space-y-6">
            <h3 className="text-2xl font-bold">Recognition Test</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase font-bold text-slate-500">Name</label>
                <input
                  autoFocus
                  type="text"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-pink-500"
                  value={userGuess.name}
                  onChange={e => setUserGuess(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs uppercase font-bold text-slate-500">Occupation</label>
                <input
                  type="text"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-pink-500"
                  value={userGuess.occupation}
                  onChange={e => setUserGuess(prev => ({ ...prev, occupation: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && submitGuess()}
                />
              </div>
            </div>
            <button onClick={submitGuess} className="w-full py-4 bg-indigo-500 text-white rounded-2xl font-bold">
              Submit Guess
            </button>
          </div>
        </div>
      )}

      {stage === 'summary' && (
        <div className="glass rounded-3xl p-8 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Performance Summary</h3>
            <button onClick={generateFaces} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold hover:bg-slate-200 transition-colors">
              <RefreshCw size={18} /> New Session
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((res, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden border border-white/5">
                <img src={res.face.imageUrl} className="w-full h-40 object-cover" />
                <div className="p-4 space-y-2">
                  <div className="flex justify-between">
                    <p className="font-bold text-lg">{res.face.name}</p>
                    {res.correct ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                  </div>
                  <p className="text-sm text-slate-500">{res.face.occupation}</p>
                  {!res.correct && (
                    <div className="mt-2 text-xs p-2 bg-red-500/10 rounded-lg text-red-500">
                      You guessed: {res.guess.name || '?'}, {res.guess.occupation || '?'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const XCircle = ({ className }: { className?: string }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>;

export default FacesModule;
