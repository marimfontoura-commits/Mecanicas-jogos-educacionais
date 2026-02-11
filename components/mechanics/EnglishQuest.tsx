
import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, RefreshCcw } from 'lucide-react';

interface Option {
  id: string;
  label: string;
}

const EnglishQuest: React.FC = () => {
  const [phase, setPhase] = useState<0 | 1>(0);
  const [draggedItem, setDraggedItem] = useState<Option | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [visualState, setVisualState] = useState<string | null>(null);
  const [isCrossing, setIsCrossing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const dropZoneRef = useRef<HTMLDivElement>(null);

  const phases = [
    {
      sentence: "The door is _______",
      options: [
        { id: 'pink', label: 'pink' },
        { id: 'open', label: 'open' },
        { id: 'sticky', label: 'sticky' }
      ],
      correct: 'open'
    },
    {
      sentence: "The bridge is _______",
      options: [
        { id: 'wide', label: 'wide' },
        { id: 'small', label: 'small' },
        { id: 'long', label: 'long' }
      ],
      correct: 'long'
    }
  ];

  const currentPhaseData = phases[phase];

  const handlePointerDown = (e: React.PointerEvent, item: Option) => {
    if (isCrossing || isCompleted) return;
    setDraggedItem(item);
    setStartPos({ x: e.clientX, y: e.clientY });
    setDragPos({ x: 0, y: 0 });
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setDragPos({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !draggedItem) return;
    setIsDragging(false);

    const rect = dropZoneRef.current?.getBoundingClientRect();
    if (rect) {
      const isInside = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      );

      if (isInside) {
        handleDrop(draggedItem);
      }
    }
    setDraggedItem(null);
  };

  const handleDrop = (item: Option) => {
    setVisualState(item.id);
    
    if (item.id === currentPhaseData.correct) {
      setFeedback("Correct! Passing...");
      setTimeout(() => {
        setIsCrossing(true);
        setTimeout(() => {
          if (phase === 0) {
            setPhase(1);
            setVisualState(null);
            setIsCrossing(false);
            setFeedback(null);
          } else {
            setIsCompleted(true);
            setFeedback("Quest Completed!");
          }
        }, 1500);
      }, 500);
    } else {
      setFeedback(`It's ${item.id}, but not what we need.`);
      setTimeout(() => setFeedback(null), 2000);
    }
  };

  const reset = () => {
    setPhase(0);
    setVisualState(null);
    setIsCrossing(false);
    setIsCompleted(false);
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-10 select-none py-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-slate-800 font-bold text-xl uppercase tracking-widest">English Quest</h3>
        <p className="text-slate-400 text-sm">Help the character cross by completing the sentence</p>
      </div>

      {/* Stage Area */}
      <div className="relative w-full h-[350px] bg-white border border-slate-100 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
        {/* Background Decor */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-slate-900 rounded-full" />
          <div className="absolute bottom-10 right-10 w-40 h-40 border-2 border-slate-900 rotate-45" />
        </div>

        {/* Phase View */}
        <div className="relative h-full w-full flex items-center justify-between px-20">
          
          {/* Character */}
          <div 
            className={`absolute bottom-24 transition-all duration-1000 ease-in-out z-20 ${
              isCrossing ? 'translate-x-[600px] opacity-0' : 'translate-x-0'
            }`}
            style={{ left: '15%' }}
          >
            <div className="text-6xl animate-bounce">🏃</div>
          </div>

          {/* Obstacle Phase 0: Door */}
          {phase === 0 && (
            <div className="absolute right-1/4 bottom-24 flex flex-col items-center">
              <div 
                className={`w-32 h-48 border-4 border-slate-800 rounded-t-lg transition-all duration-500 relative bg-white ${
                  visualState === 'pink' ? 'bg-pink-300' : ''
                } ${
                  visualState === 'open' ? 'rotate-y-90 origin-right translate-x-12 opacity-0' : ''
                } ${
                  visualState === 'sticky' ? 'after:content-["✨"] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-2xl' : ''
                }`}
              >
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-800" />
              </div>
              <div className="text-4xl mt-2">🚪</div>
            </div>
          )}

          {/* Obstacle Phase 1: Bridge */}
          {phase === 1 && (
            <div className="absolute left-[30%] right-[10%] bottom-24 h-6">
              <div className="absolute -left-10 bottom-0 text-4xl">⛰️</div>
              <div className="absolute -right-10 bottom-0 text-4xl">⛰️</div>
              
              <div 
                className={`h-full bg-slate-800 transition-all duration-700 mx-auto rounded-full shadow-lg ${
                  visualState === 'long' ? 'w-full' : 
                  visualState === 'wide' ? 'w-1/3 h-12 -bottom-3' :
                  visualState === 'small' ? 'w-8' : 'w-0'
                }`}
                style={{ position: 'relative' }}
              />
            </div>
          )}
        </div>

        {/* Feedback Overlay */}
        {feedback && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl animate-in fade-in slide-in-from-top-2">
            {feedback}
          </div>
        )}
      </div>

      {/* Interface Area */}
      <div className="w-full flex flex-col items-center gap-8">
        {/* Sentence */}
        <div className="flex items-center gap-4 text-3xl font-light text-slate-800">
          <span>{currentPhaseData.sentence.split('_______')[0]}</span>
          <div 
            ref={dropZoneRef}
            className={`min-w-[140px] h-14 border-2 border-dashed rounded-xl flex items-center justify-center transition-all px-4 ${
              visualState ? 'border-slate-400 bg-slate-50 border-solid' : 'border-slate-200 bg-white'
            }`}
          >
            {visualState ? (
              <span className="font-bold text-slate-900 animate-in zoom-in-50">{visualState}</span>
            ) : (
              <div className="w-4 h-4 rounded-full bg-slate-100" />
            )}
          </div>
          <span>{currentPhaseData.sentence.split('_______')[1]}</span>
        </div>

        {/* Options */}
        <div className="flex gap-4">
          {currentPhaseData.options.map((opt) => (
            <div
              key={opt.id}
              onPointerDown={(e) => handlePointerDown(e, opt)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`
                px-8 py-4 bg-white border border-slate-200 border-b-4 rounded-2xl text-xl font-bold text-slate-600 shadow-sm cursor-grab active:cursor-grabbing touch-none transition-all hover:-translate-y-1 hover:border-slate-400
                ${isDragging && draggedItem?.id === opt.id ? 'opacity-0' : 'opacity-100'}
                ${isCrossing || isCompleted ? 'opacity-20 pointer-events-none' : ''}
              `}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>

      {/* Completion View */}
      {isCompleted && (
        <div className="fixed inset-0 z-30 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
          <div className="text-8xl">🏆</div>
          <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Great Job!</h2>
          <p className="text-slate-500">You helped the character cross all obstacles.</p>
          <button 
            onClick={reset}
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg hover:scale-105 transition-transform"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}

      {/* Drag Proxy */}
      {isDragging && draggedItem && (
        <div 
          className="fixed pointer-events-none z-[100] px-8 py-4 bg-white border-2 border-slate-800 border-b-4 rounded-2xl shadow-2xl text-xl font-bold text-slate-900 scale-110"
          style={{
            left: startPos.x - 60 + dragPos.x,
            top: startPos.y - 30 + dragPos.y,
          }}
        >
          {draggedItem.label}
        </div>
      )}
    </div>
  );
};

export default EnglishQuest;
