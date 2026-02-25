
import React, { useState, useEffect } from 'react';
import { storageService } from '../storageService';
import { Flashcard } from '../types';
import { Plus, Trash2, Download, Upload, CreditCard, RotateCw, Save } from 'lucide-react';

interface FlashcardsModuleProps {
  addXP: (xp: number, correct: number, total: number) => void;
}

const FlashcardsModule: React.FC<FlashcardsModuleProps> = ({ addXP }) => {
  const [cards, setCards] = useState<Flashcard[]>(storageService.getFlashcards());
  const [isAdding, setIsAdding] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '', category: 'General' });
  const [studyMode, setStudyMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0); // Track score 3 or higher as "correct"

  useEffect(() => {
    storageService.saveFlashcards(cards);
  }, [cards]);

  const addCard = () => {
    if (!newCard.front || !newCard.back) return;
    const card: Flashcard = {
      id: Math.random().toString(36).substring(2, 11),
      front: newCard.front,
      back: newCard.back,
      category: newCard.category,
      interval: 1,
      easeFactor: 2.5,
      mastery: 0
    };
    setCards([...cards, card]);
    setNewCard({ front: '', back: '', category: 'General' });
    setIsAdding(false);
  };

  const deleteCard = (id: string) => {
    setCards(cards.filter(c => c.id !== id));
  };

  const handleStudyResponse = (quality: number) => {
    if (quality >= 3) {
      setCorrectCount(prev => prev + 1);
    }

    // Basic Spaced Repetition logic (SuperMemo-2 inspired)
    setCards(prev => prev.map((c, i) => {
      if (i === currentIndex) {
        const nextInterval = quality >= 3 ? c.interval * c.easeFactor : 1;
        return { ...c, interval: nextInterval, lastReviewed: Date.now(), mastery: Math.min(100, c.mastery + (quality * 5)) };
      }
      return c;
    }));

    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      setStudyMode(false);
      const finalCorrect = correctCount + (quality >= 3 ? 1 : 0);
      addXP(cards.length, finalCorrect, cards.length);
      setCorrectCount(0);
    }
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cards));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "memory_master_cards.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <CreditCard className="text-indigo-500" /> Deck Manager
          </h2>
          <p className="text-slate-500">Build your custom knowledge base with spaced repetition.</p>
        </div>
        {!studyMode && (
          <div className="flex gap-2">
            <button onClick={exportData} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors">
              <Download size={20} />
            </button>
            <button
              onClick={() => { setCurrentIndex(0); setStudyMode(true); }}
              disabled={cards.length === 0}
              className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold disabled:opacity-50"
            >
              Study Deck
            </button>
          </div>
        )}
      </header>

      {!studyMode ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button
              onClick={() => setIsAdding(true)}
              className="h-48 border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-2 hover:border-indigo-500 hover:text-indigo-500 transition-all text-slate-400"
            >
              <Plus size={32} />
              <span className="font-bold">Add New Card</span>
            </button>

            {cards.map(card => (
              <div key={card.id} className="h-48 glass rounded-3xl p-6 relative group border border-white/5">
                <button
                  onClick={() => deleteCard(card.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={18} />
                </button>
                <div className="text-xs uppercase font-bold text-indigo-500 mb-2">{card.category}</div>
                <h4 className="font-bold text-lg mb-2 line-clamp-2">{card.front}</h4>
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">Mastery: {card.mastery}%</span>
                    <div className="w-16 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${card.mastery}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isAdding && (
            <div className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="glass rounded-3xl p-8 w-full max-w-md space-y-6 shadow-2xl">
                <h3 className="text-2xl font-bold">New Card</h3>
                <div className="space-y-4">
                  <input
                    placeholder="Front Side (Question/Term)"
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border-none outline-none focus:ring-2 ring-indigo-500"
                    value={newCard.front}
                    onChange={e => setNewCard({ ...newCard, front: e.target.value })}
                  />
                  <textarea
                    placeholder="Back Side (Answer/Description)"
                    className="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border-none outline-none focus:ring-2 ring-indigo-500 h-32"
                    value={newCard.back}
                    onChange={e => setNewCard({ ...newCard, back: e.target.value })}
                  />
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-slate-200 dark:bg-slate-700 rounded-2xl font-bold">Cancel</button>
                  <button onClick={addCard} className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl font-bold">Add Card</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-xl mx-auto space-y-8 animate-in zoom-in-95 duration-300">
          <div className="text-center font-bold text-slate-500 uppercase tracking-widest text-sm">
            Card {currentIndex + 1} of {cards.length}
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="h-80 w-full relative perspective-1000 cursor-pointer group"
          >
            <div className={`w-full h-full duration-500 preserve-3d relative ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front */}
              <div className="absolute inset-0 backface-hidden glass rounded-3xl p-8 flex items-center justify-center text-center">
                <p className="text-2xl font-bold">{cards[currentIndex].front}</p>
                <p className="absolute bottom-6 text-xs text-slate-400 flex items-center gap-1"><RotateCw size={12} /> Click to flip</p>
              </div>
              {/* Back */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-500 text-white rounded-3xl p-8 flex items-center justify-center text-center">
                <p className="text-xl leading-relaxed">{cards[currentIndex].back}</p>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-4 gap-2 transition-opacity duration-300 ${isFlipped ? 'opacity-100 pointer-events-auto' : 'opacity-20 pointer-events-none'}`}>
            <ScoreBtn label="Again" color="bg-red-500" onClick={() => handleStudyResponse(1)} />
            <ScoreBtn label="Hard" color="bg-orange-500" onClick={() => handleStudyResponse(2)} />
            <ScoreBtn label="Good" color="bg-green-500" onClick={() => handleStudyResponse(4)} />
            <ScoreBtn label="Easy" color="bg-blue-500" onClick={() => handleStudyResponse(5)} />
          </div>

          <button onClick={() => setStudyMode(false)} className="w-full text-center text-slate-500 font-medium hover:text-indigo-500">
            End Session
          </button>
        </div>
      )}
    </div>
  );
};

const ScoreBtn = ({ label, color, onClick }: { label: string, color: string, onClick: () => void }) => (
  <button onClick={onClick} className={`${color} text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all`}>
    {label}
  </button>
);

export default FlashcardsModule;
