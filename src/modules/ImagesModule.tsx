
import React, { useState, useEffect } from 'react';
// Added Search to the lucide-react imports
import { ImageIcon, Grid, RefreshCw, Eye, EyeOff, Search } from 'lucide-react';

interface ImagesModuleProps {
  addXP: (xp: number, correct: number, total: number) => void;
}

const ImagesModule: React.FC<ImagesModuleProps> = ({ addXP }) => {
  const [stage, setStage] = useState<'config' | 'memorize' | 'recall' | 'result'>('config');
  const [gridSize, setGridSize] = useState(3);
  const [images, setImages] = useState<string[]>([]);
  const [selection, setSelection] = useState<number[]>([]);
  const [targetOrder, setTargetOrder] = useState<number[]>([]);
  const [userOrder, setUserOrder] = useState<number[]>([]);

  const setupGrid = () => {
    const total = gridSize * gridSize;
    const newImages = Array.from({ length: total }, (_, i) => `https://picsum.photos/seed/${Math.random()}/200/200`);
    setImages(newImages);

    // Pick 3-5 images for sequence
    const count = Math.min(total, gridSize + 2);
    const order: number[] = [];
    while (order.length < count) {
      const r = Math.floor(Math.random() * total);
      if (!order.includes(r)) order.push(r);
    }
    setTargetOrder(order);
    setStage('memorize');
    setUserOrder([]);
  };

  const handleTileClick = (idx: number) => {
    if (stage === 'recall') {
      if (userOrder.includes(idx)) return;
      const nextOrder = [...userOrder, idx];
      setUserOrder(nextOrder);

      if (nextOrder.length === targetOrder.length) {
        setStage('result');
        const correctCount = nextOrder.filter((val, i) => val === targetOrder[i]).length;
        addXP(correctCount, correctCount, targetOrder.length);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="mb-8">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Grid className="text-emerald-500" /> Image Grid Recall
        </h2>
        <p className="text-slate-500">Visualize positions and sequences in a spatially mapped grid.</p>
      </header>

      {stage === 'config' && (
        <div className="glass rounded-3xl p-8 space-y-8 text-center">
          <div className="space-y-4 max-w-sm mx-auto">
            <label className="text-sm font-bold uppercase text-slate-500">Grid Size ({gridSize}x{gridSize})</label>
            <div className="flex justify-center gap-4">
              {[3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => setGridSize(s)}
                  className={`w-16 h-16 rounded-2xl font-bold text-xl border-2 transition-all ${gridSize === s ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                >
                  {s}x{s}
                </button>
              ))}
            </div>
          </div>
          <button onClick={setupGrid} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg">
            Start Visualization
          </button>
        </div>
      )}

      {(stage === 'memorize' || stage === 'recall') && (
        <div className="space-y-8">
          <div className="text-center">
            {stage === 'memorize' ? (
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500/10 text-emerald-500 rounded-full font-bold animate-pulse">
                <Eye size={20} /> Memorize the Sequence
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-500/10 text-indigo-500 rounded-full font-bold">
                <Search size={20} /> Replicate the Order
              </div>
            )}
          </div>

          <div className="grid gap-4 mx-auto" style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            maxWidth: `${gridSize * 120}px`
          }}>
            {images.map((img, i) => {
              const isTarget = targetOrder.includes(i);
              const orderIndex = targetOrder.indexOf(i);
              const isSelected = userOrder.includes(i);
              const userSelectionIndex = userOrder.indexOf(i);

              return (
                <div
                  key={i}
                  onClick={() => handleTileClick(i)}
                  className={`aspect-square relative rounded-2xl overflow-hidden cursor-pointer transition-all ${stage === 'memorize' && isTarget ? 'ring-4 ring-emerald-500 ring-offset-4 ring-offset-slate-900' : 'border border-white/5'
                    } ${stage === 'recall' && isSelected ? 'opacity-40 grayscale' : ''}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                  {stage === 'memorize' && isTarget && (
                    <div className="absolute inset-0 bg-emerald-500/40 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white drop-shadow-md">{orderIndex + 1}</span>
                    </div>
                  )}
                  {stage === 'recall' && isSelected && (
                    <div className="absolute inset-0 bg-indigo-500/40 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white drop-shadow-md">{userSelectionIndex + 1}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {stage === 'memorize' && (
            <button
              onClick={() => setStage('recall')}
              className="w-full max-w-sm mx-auto block py-4 bg-emerald-500 text-white rounded-2xl font-bold"
            >
              I have memorized it
            </button>
          )}
        </div>
      )}

      {stage === 'result' && (
        <div className="glass rounded-3xl p-8 text-center space-y-6">
          <div className="text-5xl font-bold">
            {userOrder.every((v, i) => v === targetOrder[i]) ? (
              <span className="text-green-500">Perfect Precision!</span>
            ) : (
              <span className="text-red-500">Spatial Error!</span>
            )}
          </div>
          <p className="text-slate-500">You matched {userOrder.filter((v, i) => v === targetOrder[i]).length} out of {targetOrder.length} correctly.</p>
          <button onClick={() => setStage('config')} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold">
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ImagesModule;
