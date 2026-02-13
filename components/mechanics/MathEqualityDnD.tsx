
import React, { useState, useRef } from 'react';

const MathEqualityDnD: React.FC = () => {
  const [draggedItem, setDraggedItem] = useState<{ id: number; value: number } | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [droppedValues, setDroppedValues] = useState<Record<string, number | null>>({
    t1: null,
    t2: null
  });
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  const targetRefs = {
    t1: useRef<HTMLDivElement>(null),
    t2: useRef<HTMLDivElement>(null),
  };

  const options = [
    { id: 1, value: 1 },
    { id: 2, value: 5 },
    { id: 3, value: 6 },
    { id: 4, value: 10 },
  ];

  // Equação: 9 + [t1] = 15 - [t2]
  // Resposta Correta: 9 + 1 = 10 e 15 - 5 = 10.
  const checkCorrectness = (newValues: Record<string, number | null>) => {
    const v1 = newValues.t1;
    const v2 = newValues.t2;

    if (v1 !== null && v2 !== null) {
      if (9 + v1 === 15 - v2) {
        setFeedback('success');
      } else {
        setFeedback('error');
        setTimeout(() => {
          setDroppedValues({ t1: null, t2: null });
          setFeedback(null);
        }, 1500);
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent, item: { id: number; value: number }) => {
    if (feedback === 'success') return;
    
    setDraggedItem(item);
    setStartPos({ x: e.clientX, y: e.clientY });
    setPosition({ x: 0, y: 0 });
    setFeedback(null);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !draggedItem) return;

    setIsDragging(false);
    
    let targetFound = null;
    for (const [key, ref] of Object.entries(targetRefs)) {
      const rect = ref.current?.getBoundingClientRect();
      if (rect) {
        const isInside = (
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom
        );
        if (isInside) {
          targetFound = key;
          break;
        }
      }
    }

    if (targetFound) {
      const newValues = { ...droppedValues, [targetFound]: draggedItem.value };
      setDroppedValues(newValues);
      checkCorrectness(newValues);
    }
    
    setPosition({ x: 0, y: 0 });
    setDraggedItem(null);
  };

  const reset = () => {
    setDroppedValues({ t1: null, t2: null });
    setFeedback(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-12 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col items-center gap-12 select-none">
      <div className="text-center space-y-2">
        <h3 className="text-slate-800 font-bold text-xl">Complete a Operação</h3>
        <p className="text-slate-400 text-sm">Arraste o bloco numérico para o espaço vazio</p>
      </div>

      {/* Área da Equação - Estilo White Label / Duolingo */}
      <div className="flex items-center gap-4 py-12 px-16 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-inner">
        <div className="w-24 h-24 flex items-center justify-center bg-white border border-slate-200 border-b-4 rounded-2xl text-4xl font-light text-slate-800 shadow-sm">
          9
        </div>
        
        <div className="text-3xl text-slate-300 font-light px-2">+</div>
        
        {/* Drop Target 1 */}
        <div 
          ref={targetRefs.t1}
          className={`w-24 h-24 flex items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
            feedback === 'success' ? 'bg-green-50 border-green-500 text-green-600 border-solid border-b-4 shadow-none' :
            feedback === 'error' ? 'bg-red-50 border-red-500 text-red-600' :
            droppedValues.t1 ? 'bg-white border-slate-400 border-solid border-b-4 text-slate-900' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {droppedValues.t1 ? (
            <span className="text-4xl font-light animate-in zoom-in-75 duration-200">{droppedValues.t1}</span>
          ) : (
            <div className="w-5 h-5 rounded-full bg-slate-200/60" />
          )}
        </div>

        <div className="text-3xl text-slate-300 font-light px-4">=</div>

        <div className="w-24 h-24 flex items-center justify-center bg-white border border-slate-200 border-b-4 rounded-2xl text-4xl font-light text-slate-800 shadow-sm">
          15
        </div>

        <div className="text-3xl text-slate-300 font-light px-2">-</div>

        {/* Drop Target 2 */}
        <div 
          ref={targetRefs.t2}
          className={`w-24 h-24 flex items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
            feedback === 'success' ? 'bg-green-50 border-green-500 text-green-600 border-solid border-b-4 shadow-none' :
            feedback === 'error' ? 'bg-red-50 border-red-500 text-red-600' :
            droppedValues.t2 ? 'bg-white border-slate-400 border-solid border-b-4 text-slate-900' : 'bg-slate-100 border-slate-200'
          }`}
        >
          {droppedValues.t2 ? (
            <span className="text-4xl font-light animate-in zoom-in-75 duration-200">{droppedValues.t2}</span>
          ) : (
            <div className="w-5 h-5 rounded-full bg-slate-200/60" />
          )}
        </div>
      </div>

      {/* Options - Drag Sources */}
      <div className="flex gap-4 items-center p-6 bg-white rounded-2xl border border-slate-100">
        {options.map((item) => {
          const isUsed = Object.values(droppedValues).includes(item.value);
          return (
            <div
              key={item.id}
              onPointerDown={(e) => handlePointerDown(e, item)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`
                w-20 h-20 flex items-center justify-center bg-white border border-slate-200 border-b-4 rounded-2xl shadow-sm text-3xl font-light text-slate-600 cursor-grab active:cursor-grabbing touch-none
                ${isDragging && draggedItem?.id === item.id ? 'opacity-0' : 'opacity-100'}
                ${isUsed ? 'opacity-10 grayscale pointer-events-none' : 'hover:border-slate-400 hover:-translate-y-1 transition-all active:translate-y-0 active:border-b-0'}
                ${feedback === 'success' ? 'pointer-events-none opacity-20' : ''}
              `}
            >
              {item.value}
            </div>
          );
        })}
      </div>

      {/* Drag Proxy */}
      {isDragging && draggedItem && (
        <div 
          className="fixed pointer-events-none z-[100] w-20 h-20 flex items-center justify-center bg-white border-2 border-slate-800 border-b-4 rounded-2xl shadow-2xl text-3xl font-light text-slate-900 scale-110"
          style={{
            left: startPos.x - 40 + position.x,
            top: startPos.y - 40 + position.y,
          }}
        >
          {draggedItem.value}
        </div>
      )}

      {/* Feedback State */}
      <div className="h-16 flex items-center justify-center">
        {feedback === 'success' && (
          <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 bg-green-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg">
              ✓ Equação Balanceada
            </div>
            <button 
              onClick={reset}
              className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-slate-800 transition-colors underline underline-offset-4"
            >
              Reiniciar
            </button>
          </div>
        )}
        {feedback === 'error' && (
          <div className="animate-bounce bg-red-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-lg">
            ✕ Tente Novamente
          </div>
        )}
      </div>
    </div>
  );
};

export default MathEqualityDnD;
