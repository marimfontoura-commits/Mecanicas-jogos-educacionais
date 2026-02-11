
import React, { useState } from 'react';
import { Map as MapIcon, Compass, CheckCircle2, RefreshCcw } from 'lucide-react';

interface Biome {
  id: string;
  name: string;
  color: string;
  hint: string;
}

const BIOMES: Biome[] = [
  { id: 'am', name: 'Amazônia', color: '#15803d', hint: 'Clima equatorial e maior biodiversidade.' },
  { id: 'ce', name: 'Cerrado', color: '#eab308', hint: 'A savana brasileira com árvores retorcidas.' },
  { id: 'ca', name: 'Caatinga', color: '#b45309', hint: 'Bioma semiárido exclusivo do Brasil.' },
  { id: 'ma', name: 'Mata Atlântica', color: '#16a34a', hint: 'Floresta costeira com alto endemismo.' },
  { id: 'pa', name: 'Pantanal', color: '#0ea5e9', hint: 'A maior planície inundável do mundo.' },
  { id: 'pm', name: 'Pampa', color: '#84cc16', hint: 'Campos sulinos predominantes no RS.' }
];

const GeographyBiomes: React.FC = () => {
  const [placedBiomes, setPlacedBiomes] = useState<Record<string, string>>({});
  const [draggedBiome, setDraggedBiome] = useState<Biome | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [isCompleted, setIsCompleted] = useState(false);

  const handlePointerDown = (e: React.PointerEvent, biome: Biome) => {
    if (isCompleted || placedBiomes[biome.id]) return;
    setDraggedBiome(biome);
    setStartPos({ x: e.clientX, y: e.clientY });
    setCurrentPos({ x: 0, y: 0 });
    setIsDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setCurrentPos({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !draggedBiome) return;
    setIsDragging(false);

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const targetEl = elements.find(el => el.hasAttribute('data-biome-id'));

    if (targetEl) {
      const targetId = targetEl.getAttribute('data-biome-id')!;
      if (targetId === draggedBiome.id) {
        const next = { ...placedBiomes, [targetId]: draggedBiome.name };
        setPlacedBiomes(next);
        if (Object.keys(next).length === BIOMES.length) {
          setIsCompleted(true);
        }
      }
    }
    setDraggedBiome(null);
  };

  const reset = () => {
    setPlacedBiomes({});
    setIsCompleted(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-8 py-4 select-none">
      <div className="text-center space-y-2">
        <h3 className="text-slate-800 font-bold text-xl uppercase tracking-widest">Biomas do Brasil</h3>
        <p className="text-slate-400 text-sm">Arraste os biomas para suas localizações corretas no mapa</p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        {/* Mapa Simplificado */}
        <div className="relative bg-white border border-slate-100 rounded-[2.5rem] shadow-sm p-12 min-h-[500px] flex items-center justify-center">
           <div className="relative w-full max-w-md aspect-square bg-slate-50 rounded-full flex items-center justify-center">
              {/* Zonas de Drop (Simulando um mapa simplificado por posições) */}
              {BIOMES.map((biome, idx) => {
                const positions = [
                  { top: '20%', left: '30%' }, // AM
                  { top: '50%', left: '50%' }, // CE
                  { top: '35%', left: '70%' }, // CA
                  { top: '65%', left: '75%' }, // MA
                  { top: '65%', left: '40%' }, // PA
                  { top: '85%', left: '45%' }, // PM
                ];
                const pos = positions[idx];
                const isPlaced = !!placedBiomes[biome.id];

                return (
                  <div
                    key={biome.id}
                    data-biome-id={biome.id}
                    className={`absolute w-24 h-24 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-500 ${
                      isPlaced 
                        ? 'border-solid border-white shadow-lg scale-110 z-10' 
                        : 'border-slate-200 bg-slate-100/50'
                    }`}
                    style={{ 
                      top: pos.top, 
                      left: pos.left,
                      backgroundColor: isPlaced ? biome.color : undefined,
                      color: isPlaced ? 'white' : 'transparent'
                    }}
                  >
                    {isPlaced ? (
                      <div className="text-[10px] font-black uppercase text-center px-1 leading-tight">
                        {biome.name}
                      </div>
                    ) : (
                      <MapIcon className="w-6 h-6 text-slate-200" />
                    )}
                  </div>
                );
              })}
              
              {/* Decorativo: Rosa dos Ventos */}
              <div className="absolute top-4 right-4 text-slate-200">
                <Compass className="w-12 h-12" />
              </div>
           </div>
        </div>

        {/* Biblioteca de Biomas */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm space-y-4">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Biomas Disponíveis</h3>
             <div className="flex flex-col gap-3">
               {BIOMES.map(biome => {
                 const isPlaced = !!placedBiomes[biome.id];
                 return (
                   <div
                    key={biome.id}
                    onPointerDown={(e) => handlePointerDown(e, biome)}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className={`group relative p-4 rounded-2xl border-2 transition-all cursor-grab active:cursor-grabbing touch-none ${
                      isPlaced 
                        ? 'opacity-20 pointer-events-none border-slate-100 bg-slate-50' 
                        : 'border-slate-100 bg-white hover:border-slate-400 hover:shadow-md'
                    }`}
                   >
                     <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: biome.color }} />
                        <span className="text-xs font-bold text-slate-700">{biome.name}</span>
                     </div>
                     <p className="text-[9px] text-slate-400 mt-1 leading-tight">{biome.hint}</p>
                   </div>
                 );
               })}
             </div>
          </div>

          <button 
            onClick={reset}
            className="w-full bg-slate-100 text-slate-400 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-200 hover:text-slate-600 transition-all"
          >
            <RefreshCcw className="w-4 h-4 inline mr-2" /> Reiniciar Mapa
          </button>
        </div>
      </div>

      {/* Drag Proxy */}
      {isDragging && draggedBiome && (
        <div 
          className="fixed pointer-events-none z-[100] px-6 py-3 bg-white border-2 border-slate-800 rounded-2xl shadow-2xl flex items-center gap-3 scale-110"
          style={{
            left: startPos.x - 60 + currentPos.x,
            top: startPos.y - 20 + currentPos.y,
          }}
        >
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: draggedBiome.color }} />
          <span className="text-xs font-black text-slate-900 uppercase">{draggedBiome.name}</span>
        </div>
      )}

      {/* Sucesso */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl border border-white flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Geografia Dominada!</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Você identificou corretamente todos os principais biomas brasileiros e suas localizações aproximadas.
              </p>
            </div>
            <button 
              onClick={reset}
              className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
            >
              Jogar Novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeographyBiomes;
