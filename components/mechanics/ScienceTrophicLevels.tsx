
import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCcw, CheckCircle2, XCircle, ArrowRight, Sparkles, Activity, HelpCircle } from 'lucide-react';

interface Organism {
  id: string;
  name: string;
  type: 'energy' | 'producer' | 'consumer_primary' | 'consumer_secondary' | 'consumer_top';
  icon: string;
  role: string;
}

const ORGANISMS: Organism[] = [
  { id: 'sun', name: 'Sol', type: 'energy', icon: '☀️', role: 'Fonte de Energia' },
  { id: 'leaf', name: 'Folha', type: 'producer', icon: '🍃', role: 'Produtor' },
  { id: 'shrub', name: 'Arbusto', type: 'producer', icon: '🌳', role: 'Produtor' },
  { id: 'squirrel', name: 'Esquilo', type: 'consumer_primary', icon: '🐿️', role: 'Consumidor Primário' },
  { id: 'fox', name: 'Raposa', type: 'consumer_secondary', icon: '🦊', role: 'Consumidor Secundário' },
  { id: 'lynx', name: 'Lince', type: 'consumer_secondary', icon: '🐱', role: 'Consumidor Secundário' },
  { id: 'jaguar', name: 'Onça', type: 'consumer_top', icon: '🐆', role: 'Consumidor Topo' },
];

interface Props {
  level: 1 | 2; // 1: Onça no 3º nível, 2: Onça no 4º nível
}

const ScienceTrophicLevels: React.FC<Props> = ({ level }) => {
  const slotCount = useMemo(() => (level === 1 ? 4 : 5), [level]);
  const [slots, setSlots] = useState<(Organism | null)[]>([]);
  const [draggedOrganism, setDraggedOrganism] = useState<Organism | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const initialSlots = Array(slotCount).fill(null);
    initialSlots[0] = ORGANISMS.find(o => o.id === 'sun') || null;
    setSlots(initialSlots);
    setFeedback(null);
    setIsAnimating(false);
  }, [level, slotCount]);

  const handlePointerDown = (e: React.PointerEvent, organism: Organism) => {
    if (feedback?.type === 'success') return;
    setDraggedOrganism(organism);
    setStartPos({ x: e.clientX, y: e.clientY });
    setDragPos({ x: 0, y: 0 });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggedOrganism) return;
    setDragPos({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggedOrganism) return;
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const slotEl = elements.find(el => el.hasAttribute('data-slot-idx'));

    if (slotEl) {
      const idx = parseInt(slotEl.getAttribute('data-slot-idx')!);
      if (idx > 0) {
        const newSlots = [...slots];
        newSlots[idx] = draggedOrganism;
        setSlots(newSlots);
        setFeedback(null);
      }
    }
    setDraggedOrganism(null);
  };

  const validateFlow = () => {
    if (slots.some(s => s === null)) {
      setFeedback({ type: 'error', msg: "A cadeia está incompleta. Todos os níveis precisam de um organismo." });
      return;
    }

    if (slots[1]?.type !== 'producer') {
      setFeedback({ type: 'error', msg: "Erro no 1º nível: Este nível deve ser ocupado por um produtor capaz de realizar fotossíntese." });
      return;
    }
    if (slots[2]?.type !== 'consumer_primary') {
      setFeedback({ type: 'error', msg: "Erro no 2º nível: Este nível deve ser ocupado por um consumidor primário (que se alimenta do produtor)." });
      return;
    }

    if (level === 1) {
      if (slots[3]?.id !== 'jaguar') {
        setFeedback({ type: 'error', msg: "O objetivo não foi alcançado: A Onça deve estar posicionada no 3º nível deste fluxo." });
        return;
      }
    } else {
      if (slots[3]?.type !== 'consumer_secondary') {
        setFeedback({ type: 'error', msg: "Erro no 3º nível: Para a onça chegar ao 4º nível, o 3º deve ser um consumidor secundário." });
        return;
      }
      if (slots[4]?.id !== 'jaguar') {
        setFeedback({ type: 'error', msg: "O objetivo não foi alcançado: A Onça deve estar posicionada no 4º nível deste fluxo." });
        return;
      }
    }

    setFeedback({ type: 'success', msg: `Parabéns! O fluxo energético está correto e a Onça ocupa o ${level === 1 ? '3º' : '4º'} nível trófico.` });
    setIsAnimating(true);
  };

  const reset = () => {
    const initialSlots = Array(slotCount).fill(null);
    initialSlots[0] = ORGANISMS.find(o => o.id === 'sun') || null;
    setSlots(initialSlots);
    setFeedback(null);
    setIsAnimating(false);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6 py-2 select-none">
      {/* BLOCO DE ENUNCIADO */}
      <div className="w-full bg-white border-2 border-green-100 rounded-[2rem] p-6 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Activity className="w-24 h-24 text-green-600" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
          <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-100 shrink-0">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-[9px] font-black text-green-600 uppercase tracking-[0.2em] mb-1">Missão de Biologia</h4>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 leading-tight">
              {level === 1 
                ? "Como faremos para uma onça ocupar o terceiro nível trófico?" 
                : "Pergunta dois: e para ocupar o 4º nível trófico?"}
            </h2>
            <p className="text-slate-400 text-xs mt-1 font-medium">
              Posicione os seres vivos no trilho de fluxo abaixo.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col gap-8">
        {/* Trilho Estilo Wordfactori */}
        <div className="relative bg-slate-900 rounded-[3rem] p-10 md:p-12 border-[8px] border-slate-800 shadow-2xl flex items-center justify-center min-h-[300px]">
          <div className="absolute h-2 w-[80%] bg-slate-800 top-1/2 -translate-y-1/2 z-0 rounded-full" />
          
          <div className="flex items-center justify-between w-full max-w-3xl relative z-10">
            {slots.map((organism, idx) => (
              <React.Fragment key={idx}>
                <div 
                  data-slot-idx={idx}
                  className={`w-20 h-20 md:w-28 md:h-28 rounded-[1.8rem] border-4 transition-all flex flex-col items-center justify-center gap-1 relative ${
                    idx === 0 ? 'bg-amber-500 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3)]' : 
                    organism ? 'bg-white border-white shadow-xl scale-105' : 'bg-slate-800/40 border-slate-700 border-dashed hover:border-slate-500'
                  }`}
                >
                  {organism ? (
                    <>
                      <span className="text-3xl md:text-5xl mb-1">{organism.icon}</span>
                      <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-tighter text-center px-1 leading-none ${idx === 0 ? 'text-amber-900' : 'text-slate-500'}`}>
                        {idx === 0 ? 'Energia' : organism.name}
                      </span>
                    </>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-slate-700/50 animate-pulse" />
                  )}

                  {isAnimating && idx < slots.length - 1 && (
                    <div className="absolute top-1/2 left-[100%] w-[100%] h-6 -translate-y-1/2 flex items-center pointer-events-none z-50">
                       {[0, 1, 2, 3].map(p => (
                         <div 
                           key={p} 
                           className="w-2.5 h-2.5 bg-amber-400 rounded-full absolute shadow-[0_0_12px_#fbbf24] opacity-0 animate-energy-flow"
                           style={{ animationDelay: `${(idx * 0.4) + (p * 0.15)}s` }}
                         />
                       ))}
                    </div>
                  )}
                </div>
                {idx < slots.length - 1 && <ArrowRight className="w-5 h-5 text-slate-700 shrink-0 mx-1" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Biblioteca de Componentes */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-100 text-slate-400 px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
            Seres Vivos
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {ORGANISMS.map(org => {
              if (org.id === 'sun') return null;
              return (
                <div
                  key={org.id}
                  onPointerDown={(e) => handlePointerDown(e, org)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  className={`group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing touch-none ${
                    feedback?.type === 'success' ? 'opacity-30 pointer-events-none' : 'border-slate-50 bg-slate-50 hover:bg-white hover:border-green-400 hover:shadow-lg'
                  }`}
                >
                  <div className="text-4xl transition-transform group-hover:scale-110 duration-200">{org.icon}</div>
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none">{org.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Controles Finais */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <button 
            onClick={validateFlow}
            disabled={feedback?.type === 'success'}
            className="w-full md:w-64 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-slate-800 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            <Activity className="w-4 h-4" /> Ativar Fluxo
          </button>
          <button onClick={reset} className="w-full md:w-48 bg-white border-2 border-slate-100 text-slate-400 py-3 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:text-slate-600 transition-all">
            <RefreshCcw className="w-3 h-3 inline mr-2" /> Reiniciar
          </button>
        </div>
      </div>

      {/* Drag Proxy */}
      {draggedOrganism && (
        <div 
          className="fixed pointer-events-none z-[100] p-6 bg-white border-2 border-slate-900 rounded-[2rem] shadow-2xl flex flex-col items-center gap-2 scale-110"
          style={{ left: startPos.x - 50 + dragPos.x, top: startPos.y - 50 + dragPos.y }}
        >
          <span className="text-5xl">{draggedOrganism.icon}</span>
          <span className="text-[10px] font-black text-slate-900 uppercase">{draggedOrganism.name}</span>
        </div>
      )}

      {/* Feedback Overlay */}
      {feedback && (
        <div className={`w-full max-w-xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 rounded-[2.5rem] p-8 border-2 flex flex-col items-center gap-4 text-center shadow-xl mb-10 ${
          feedback.type === 'success' ? 'bg-green-50 border-green-200 text-green-950' : 'bg-red-50 border-red-200 text-red-950'
        }`}>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
            feedback.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black uppercase tracking-tighter">
              {feedback.type === 'success' ? 'Fluxo Concluído!' : 'Cadeia Interrompida'}
            </h3>
            <p className="text-xs opacity-90 leading-relaxed max-w-sm mx-auto font-medium italic">
              "{feedback.msg}"
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes energy-flow {
          0% { left: -40px; opacity: 0; transform: scale(0.5); }
          20% { opacity: 1; transform: scale(1.1); }
          80% { opacity: 1; transform: scale(1); }
          100% { left: 80px; opacity: 0; transform: scale(0.5); }
        }
        .animate-energy-flow {
          animation: energy-flow 1.2s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default ScienceTrophicLevels;
