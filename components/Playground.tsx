
import React, { useState } from 'react';
import { Mechanic } from '../types';
import MathEqualityDnD from './mechanics/MathEqualityDnD';
import MathCrossword from './mechanics/MathCrossword';
import EnglishQuest from './mechanics/EnglishQuest';
import ColorTheory from './mechanics/ColorTheory';
import GeographyBasin from './mechanics/GeographyBasin';
import ScienceTrophicLevels from './mechanics/ScienceTrophicLevels';
import CreativeWriting from './mechanics/CreativeWriting';
import { X, Info, Palette, Zap, Map as MapIcon, Layers, BookOpen, Activity } from 'lucide-react';

interface Props {
  mechanic: Mechanic;
  onClose: () => void;
}

const Playground: React.FC<Props> = ({ mechanic, onClose }) => {
  const [colorMode, setColorMode] = useState<'CMYK' | 'RGB'>('CMYK');
  const [geoLevel, setGeoLevel] = useState<1 | 2>(1);
  const [scienceLevel, setScienceLevel] = useState<1 | 2>(1);

  const renderDemo = () => {
    switch (mechanic.id) {
      case 'creative-writing':
        return <CreativeWriting />;
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
      case 'science-trophic':
        return <ScienceTrophicLevels level={scienceLevel} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl border border-slate-200 w-full max-w-md mx-auto mt-20">
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
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-800 transition-all shadow-sm"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="w-full md:w-80 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 h-full">
          <div className="flex-1 p-10 overflow-y-auto custom-scrollbar">
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-3 text-blue-600">
                <BookOpen className="w-5 h-5" />
                <span className="text-overline font-semibold">Painel de Controle</span>
              </div>
              <h2 className="text-h3 text-slate-900 leading-tight mb-4">{mechanic.title}</h2>
              <p className="text-body-sm text-slate-600 leading-relaxed mb-8 font-medium">
                {mechanic.description}
              </p>
            </div>

            <div className="space-y-10">
              {mechanic.id === 'color-theory' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <span className="text-overline text-slate-500 mb-4 font-semibold block">Modo de Visualização</span>
                  <div className="flex bg-white border border-slate-200 p-2 rounded-xl gap-2 shadow-sm">
                    <button onClick={() => setColorMode('CMYK')} className={`flex-1 flex items-center justify-center gap-2 py-3 text-caption font-semibold rounded-lg transition-all ${colorMode === 'CMYK' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <Palette className="w-4 h-4" /> CMYK
                    </button>
                    <button onClick={() => setColorMode('RGB')} className={`flex-1 flex items-center justify-center gap-2 py-3 text-caption font-semibold rounded-lg transition-all ${colorMode === 'RGB' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <Zap className="w-4 h-4" /> RGB
                    </button>
                  </div>
                </div>
              )}

              {mechanic.id === 'geography-basin' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <span className="text-overline text-slate-500 mb-4 font-semibold block">Nível do Puzzle</span>
                  <div className="flex bg-white border border-slate-200 p-2 rounded-xl gap-2 shadow-sm">
                    <button onClick={() => setGeoLevel(1)} className={`flex-1 flex items-center justify-center gap-2 py-3 text-caption font-semibold rounded-lg transition-all ${geoLevel === 1 ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <MapIcon className="w-4 h-4" /> FASE 01
                    </button>
                    <button onClick={() => setGeoLevel(2)} className={`flex-1 flex items-center justify-center gap-2 py-3 text-caption font-semibold rounded-lg transition-all ${geoLevel === 2 ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <Layers className="w-4 h-4" /> FASE 02
                    </button>
                  </div>
                </div>
              )}

              {mechanic.id === 'science-trophic' && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <span className="text-overline text-slate-500 mb-4 font-semibold block">Objetivo Trófico</span>
                  <div className="flex bg-white border border-slate-200 p-2 rounded-xl gap-2 shadow-sm">
                    <button onClick={() => setScienceLevel(1)} className={`flex-1 flex items-center justify-center gap-2 py-3 text-caption font-semibold rounded-lg transition-all ${scienceLevel === 1 ? 'bg-green-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <Activity className="w-4 h-4" /> 3º Nível
                    </button>
                    <button onClick={() => setScienceLevel(2)} className={`flex-1 flex items-center justify-center gap-2 py-3 text-caption font-semibold rounded-lg transition-all ${scienceLevel === 2 ? 'bg-green-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-50'}`}>
                      <Activity className="w-4 h-4" /> 4º Nível
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-8 border-t border-slate-200">
                <span className="text-overline text-slate-500 mb-4 font-semibold block">Segmento Alvo</span>
                <div className="flex flex-wrap gap-2">
                  {mechanic.segments.map(s => (
                    <span key={s} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-overline font-semibold hover:bg-slate-200 transition-colors">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 pt-8 bg-slate-50 border-t border-slate-200">
          </div>
        </div>

        <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-slate-100">
          <div className="w-full max-w-5xl mx-auto animate-in fade-in zoom-in-95 duration-700">
            {renderDemo()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
