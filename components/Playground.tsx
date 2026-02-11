
import React, { useState } from 'react';
import { Mechanic } from '../types';
import MathEqualityDnD from './mechanics/MathEqualityDnD';
import MathCrossword from './mechanics/MathCrossword';
import EnglishQuest from './mechanics/EnglishQuest';
import ColorTheory from './mechanics/ColorTheory';
import GeographyBasin from './mechanics/GeographyBasin';
import { X, Info, Palette, Zap, Map as MapIcon, Layers, BookOpen } from 'lucide-react';

interface Props {
  mechanic: Mechanic;
  onClose: () => void;
}

const Playground: React.FC<Props> = ({ mechanic, onClose }) => {
  const [colorMode, setColorMode] = useState<'CMYK' | 'RGB'>('CMYK');
  const [geoLevel, setGeoLevel] = useState<1 | 2>(1);

  const renderDemo = () => {
    switch (mechanic.id) {
      case 'math-equality-dnd':
        return <MathEqualityDnD />;
      case 'math-crossword':
        return <MathCrossword />;
      case 'english-quest':
        return <EnglishQuest />;
      case 'color-theory':
        return <ColorTheory mode={colorMode} />;
      case 'geography-basin':
        return <GeographyBasin level={geoLevel} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-slate-200 w-full max-w-md">
            <div className="text-3xl mb-4 opacity-20">⚙️</div>
            <p className="text-slate-400 text-sm font-medium">Módulo de demonstração em desenvolvimento.</p>
          </div>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-6xl max-h-[95vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20 relative cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-800 transition-all shadow-sm"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Painel Lateral de Controle */}
        <div className="w-full md:w-80 bg-slate-50 p-10 border-r border-slate-200 flex flex-col shrink-0">
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2 text-blue-600">
                <BookOpen className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Painel de Controle</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 leading-none mb-4">{mechanic.title}</h2>
              <p className="text-slate-500 text-[13px] leading-relaxed mb-6 font-medium">
                {mechanic.description}
              </p>
            </div>

            <div className="space-y-8">
              {/* Seletores Dinâmicos por Mecânica */}
              {mechanic.id === 'color-theory' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Modo de Visualização</span>
                  <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl gap-1 shadow-sm">
                    <button 
                      onClick={() => setColorMode('CMYK')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black rounded-xl transition-all ${
                        colorMode === 'CMYK' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Palette className="w-3.5 h-3.5" /> CMYK
                    </button>
                    <button 
                      onClick={() => setColorMode('RGB')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black rounded-xl transition-all ${
                        colorMode === 'RGB' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" /> RGB
                    </button>
                  </div>
                </div>
              )}

              {mechanic.id === 'geography-basin' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Nível do Puzzle</span>
                  <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl gap-1 shadow-sm">
                    <button 
                      onClick={() => setGeoLevel(1)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black rounded-xl transition-all ${
                        geoLevel === 1 ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <MapIcon className="w-3.5 h-3.5" /> FASE 01
                    </button>
                    <button 
                      onClick={() => setGeoLevel(2)}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[11px] font-black rounded-xl transition-all ${
                        geoLevel === 2 ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" /> FASE 02
                    </button>
                  </div>
                </div>
              )}

              {/* Tags Técnicas */}
              <div className="pt-8 border-t border-slate-200 space-y-4">
                <div>
                   <span className="block text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">Segmento Alvo</span>
                   <div className="flex flex-wrap gap-1.5">
                    {mechanic.segments.map(s => (
                      <span key={s} className="bg-slate-200/50 text-slate-500 px-2 py-1 rounded text-[9px] font-black uppercase">{s}</span>
                    ))}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rodapé de Especificação (O "Bloco" solicitado) */}
          <div className="mt-8 pt-8 border-t border-slate-200">
             <div className="bg-blue-50/50 border-l-4 border-blue-400 p-5 rounded-r-2xl">
               <div className="flex items-start gap-3">
                 <Info className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
                 <p className="text-[12px] text-blue-800/80 italic font-medium leading-relaxed">
                   Componente reativo com suporte a eventos de ponteiro para máxima compatibilidade em dispositivos móveis e desktops.
                 </p>
               </div>
             </div>
          </div>
        </div>

        {/* Área de Demonstração */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-slate-100 flex items-center justify-center min-h-[500px]">
          <div className="w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
            {renderDemo()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
