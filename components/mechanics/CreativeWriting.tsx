
import React, { useState, useRef, useEffect } from 'react';
import { Book, PenTool, Image as ImageIcon, CheckCircle2, RefreshCcw, ArrowRight, ArrowLeft, Trash2, RotateCw, Maximize2, Dices } from 'lucide-react';

interface Sticker {
  id: string;
  emoji: string;
  x: number; // Porcentagem do palco
  y: number; // Porcentagem do palco
  rotation: number;
  scale: number;
}

const THEMES = [
  { id: 'space', title: 'Uma Aventura no Espaço', stickers: ['🚀', '👨‍‍🚀', '👽', '🪐', '⭐', '🌌', '🛸', '☄️', '🛰️'] },
  { id: 'forest', title: 'O Mistério da Floresta', stickers: ['🌲', '🍄', '🦊', '🦉', '🐻', '🔦', '🗺️', '🦋', '🏕️'] },
  { id: 'beach', title: 'Férias Inesquecíveis', stickers: ['🏖️', '🦀', '🍦', '🏄', '🌴', '☀️', '🐚', '⚓', '🛥️'] },
  { id: 'castle', title: 'O Reino Encantado', stickers: ['🏰', '👸', '🤴', '🐉', '🦄', '⚔️', '💎', '👑', '🧙'] },
  { id: 'city', title: 'Vida na Cidade', stickers: ['🏙️', '🚗', '🚌', '🍕', '🏢', '🚦', '🐶', '🛹', '🚲'] }
];

const CreativeWriting: React.FC = () => {
  const [themeIdx, setThemeIdx] = useState(0);
  const [step, setStep] = useState<'illustrate' | 'write' | 'publish'>('illustrate');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [textParts, setTextParts] = useState({ beginning: '', middle: '', end: '' });
  
  const theme = THEMES[themeIdx];
  const stageRef = useRef<HTMLDivElement>(null);
  
  // Estados para manipulação (Drag/Rotate/Scale)
  const [isManipulating, setIsManipulating] = useState<'drag' | 'rotate' | 'scale' | null>(null);
  const [startData, setStartData] = useState({ x: 0, y: 0, val: 0 });

  const addSticker = (emoji: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newSticker: Sticker = { 
      id, 
      emoji, 
      x: 50, 
      y: 50, 
      rotation: 0, 
      scale: 1 
    };
    setStickers([...stickers, newSticker]);
    setSelectedId(id);
  };

  const removeSticker = (id: string) => {
    setStickers(stickers.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateSticker = (id: string, updates: Partial<Sticker>) => {
    setStickers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const shuffleTheme = () => {
    let nextIdx = themeIdx;
    while (nextIdx === themeIdx) {
      nextIdx = Math.floor(Math.random() * THEMES.length);
    }
    setThemeIdx(nextIdx);
    setStickers([]); // Limpa a cena para o novo tema
    setSelectedId(null);
  };

  const handlePointerDown = (e: React.PointerEvent, id: string, mode: 'drag' | 'rotate' | 'scale') => {
    e.stopPropagation();
    const sticker = stickers.find(s => s.id === id);
    if (!sticker) return;

    setSelectedId(id);
    setIsManipulating(mode);
    
    if (mode === 'drag') {
      setStartData({ x: e.clientX, y: e.clientY, val: 0 });
    } else if (mode === 'rotate') {
      setStartData({ x: e.clientX, y: e.clientY, val: sticker.rotation });
    } else if (mode === 'scale') {
      setStartData({ x: e.clientX, y: e.clientY, val: sticker.scale });
    }
    
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isManipulating || !selectedId || !stageRef.current) return;
    
    const sticker = stickers.find(s => s.id === selectedId);
    if (!sticker) return;

    const rect = stageRef.current.getBoundingClientRect();

    if (isManipulating === 'drag') {
      const dx = ((e.clientX - startData.x) / rect.width) * 100;
      const dy = ((e.clientY - startData.y) / rect.height) * 100;
      
      updateSticker(selectedId, { 
        x: Math.max(0, Math.min(100, sticker.x + dx)), 
        y: Math.max(0, Math.min(100, sticker.y + dy)) 
      });
      setStartData({ ...startData, x: e.clientX, y: e.clientY });
    } else if (isManipulating === 'rotate') {
      const diff = e.clientX - startData.x;
      updateSticker(selectedId, { rotation: startData.val + diff });
    } else if (isManipulating === 'scale') {
      const diff = (e.clientX - startData.x) / 100;
      updateSticker(selectedId, { scale: Math.max(0.5, Math.min(3, startData.val + diff)) });
    }
  };

  const handlePointerUp = () => {
    setIsManipulating(null);
  };

  const handleTextChange = (part: keyof typeof textParts, val: string) => {
    setTextParts({ ...textParts, [part]: val });
  };

  const reset = () => {
    setStickers([]);
    setSelectedId(null);
    setTextParts({ beginning: '', middle: '', end: '' });
    setStep('illustrate');
    setThemeIdx((themeIdx + 1) % THEMES.length);
  };

  return (
    <div className="w-full flex flex-col gap-6 py-4 select-none animate-in fade-in duration-700">
      {/* Header do Editor */}
      <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg shrink-0">
            <Book className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">Editor Storybook</h4>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{theme.title}</h2>
              {step === 'illustrate' && (
                <button 
                  onClick={shuffleTheme}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-500 transition-all active:scale-90"
                  title="Sortear novo tema"
                >
                  <Dices className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {step === 'illustrate' && (
            <button onClick={() => setStep('write')} className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              Próximo <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {step === 'write' && (
            <div className="flex gap-2 w-full md:w-auto">
               <button onClick={() => setStep('illustrate')} className="flex-1 md:flex-none text-slate-400 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
              <button onClick={() => setStep('publish')} className="flex-1 md:flex-none bg-green-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                Publicar Livro <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {step === 'illustrate' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">
          {/* Palco da Ilustração */}
          <div 
            className="relative aspect-[16/9] bg-white border-4 border-slate-100 rounded-[3rem] shadow-inner overflow-hidden flex items-center justify-center group" 
            ref={stageRef}
            onClick={() => setSelectedId(null)}
            onPointerMove={handlePointerMove}
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            {stickers.length === 0 && (
              <div className="text-slate-300 text-center space-y-2 pointer-events-none">
                <ImageIcon className="w-12 h-12 mx-auto opacity-20" />
                <p className="text-sm font-medium">Sua ilustração aparecerá aqui.<br/>Selecione adesivos ao lado!</p>
              </div>
            )}

            {stickers.map((s) => (
              <div
                key={s.id}
                className={`absolute select-none transition-shadow ${selectedId === s.id ? 'z-50' : 'z-10'}`}
                style={{ 
                  left: `${s.x}%`, 
                  top: `${s.y}%`, 
                  transform: `translate(-50%, -50%) rotate(${s.rotation}deg) scale(${s.scale})` 
                }}
              >
                <div 
                  className={`text-6xl cursor-move flex items-center justify-center ${selectedId === s.id ? 'ring-2 ring-indigo-400 ring-offset-4 rounded-xl' : ''}`}
                  onPointerDown={(e) => handlePointerDown(e, s.id, 'drag')}
                >
                  {s.emoji}
                </div>

                {selectedId === s.id && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white border border-slate-200 p-1.5 rounded-full shadow-xl">
                    <button 
                      onPointerDown={(e) => handlePointerDown(e, s.id, 'rotate')}
                      className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                      title="Rotacionar"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button 
                      onPointerDown={(e) => handlePointerDown(e, s.id, 'scale')}
                      className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                      title="Redimensionar"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-slate-200 mx-1" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeSticker(s.id); }}
                      className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 space-y-6 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center border-b border-slate-50 pb-4">Caixa de Adesivos</h3>
            <div className="grid grid-cols-3 gap-3">
              {theme.stickers.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addSticker(emoji)}
                  className="aspect-square bg-slate-50 rounded-2xl text-2xl flex items-center justify-center hover:bg-indigo-50 hover:scale-105 transition-all active:scale-95 border border-transparent hover:border-indigo-200"
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Dica de Edição:</p>
              <ul className="text-[9px] text-slate-400 space-y-1">
                <li>• Clique no adesivo para selecioná-lo</li>
                <li>• Arraste para mover</li>
                <li>• Use os ícones acima para rotacionar ou redimensionar</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {step === 'write' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white border border-slate-200 rounded-[3rem] p-6 md:p-10 shadow-sm space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
              <PenTool className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tighter">Escreva sua Narrativa</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Início (O que aconteceu primeiro?)</label>
                <textarea 
                  value={textParts.beginning}
                  onChange={(e) => handleTextChange('beginning', e.target.value)}
                  placeholder="Ex: Era uma vez um robô..."
                  className="w-full h-48 bg-slate-50 rounded-3xl p-6 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all resize-none border-none leading-relaxed"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Meio (Qual foi o problema?)</label>
                <textarea 
                  value={textParts.middle}
                  onChange={(e) => handleTextChange('middle', e.target.value)}
                  placeholder="Ex: De repente, ele encontrou..."
                  className="w-full h-48 bg-slate-50 rounded-3xl p-6 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all resize-none border-none leading-relaxed"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Fim (Como tudo terminou?)</label>
                <textarea 
                  value={textParts.end}
                  onChange={(e) => handleTextChange('end', e.target.value)}
                  placeholder="Ex: No final, todos ficaram felizes..."
                  className="w-full h-48 bg-slate-50 rounded-3xl p-6 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all resize-none border-none leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'publish' && (
        <div className="flex flex-col items-center gap-10 py-6">
          <div className="w-full max-w-5xl md:aspect-[1.8/1] bg-[#FFF9F2] rounded-3xl shadow-2xl border-4 md:border-8 border-slate-900 flex flex-col md:flex-row overflow-hidden relative">
            <div className="hidden md:block absolute inset-y-0 left-1/2 w-1 bg-black/10 z-10 shadow-inner" /> 
            
            <div className="flex-1 min-h-[300px] relative overflow-hidden bg-white/50 border-b md:border-b-0 md:border-r border-black/5 p-8 flex items-center justify-center">
              <div className="relative w-full h-full border border-black/5 rounded-xl">
                 {stickers.map((s) => (
                  <div
                    key={s.id}
                    className="absolute"
                    style={{ 
                      left: `${s.x}%`, 
                      top: `${s.y}%`, 
                      transform: `translate(-50%, -50%) rotate(${s.rotation}deg) scale(${s.scale * 0.8})` 
                    }}
                  >
                    <span className="text-6xl">{s.emoji}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 p-8 md:p-12 overflow-y-auto flex flex-col gap-6">
              <h1 className="text-2xl font-black text-slate-900 border-b-2 border-slate-900 pb-2 mb-4 leading-none">{theme.title}</h1>
              <div className="space-y-6 text-slate-800 text-base font-medium leading-loose italic">
                <p>{textParts.beginning}</p>
                <p>{textParts.middle}</p>
                <p>{textParts.end}</p>
              </div>
              <div className="mt-auto pt-8 flex items-center justify-between opacity-30 grayscale">
                 <span className="text-[10px] font-black uppercase tracking-widest">Autor(a): Estudante</span>
                 <span className="text-[10px] font-black uppercase tracking-widest">Pág 01</span>
              </div>
            </div>
          </div>

          <button onClick={reset} className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 transition-all flex items-center gap-3">
            <RefreshCcw className="w-5 h-5" /> Escrever Outra História
          </button>
        </div>
      )}
    </div>
  );
};

export default CreativeWriting;
