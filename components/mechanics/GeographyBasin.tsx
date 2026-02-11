
import React, { useState, useEffect } from 'react';
import { RefreshCcw, CheckCircle2, Waves, Droplets, Info, Map as MapIcon } from 'lucide-react';

interface Tile {
  id: string;
  type: 'empty' | 'nascente' | 'reto' | 'curva' | 'afluente' | 'foz';
  rotation: 0 | 90 | 180 | 270;
}

interface Props {
  level: 1 | 2;
}

const GeographyBasin: React.FC<Props> = ({ level }) => {
  const GRID_SIZE = 5;
  const [grid, setGrid] = useState<Tile[][]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Tile['type'] | null>('reto');
  const [feedback, setFeedback] = useState<'success' | 'incomplete' | null>(null);

  // Inicializar grid
  useEffect(() => {
    const newGrid: Tile[][] = Array(GRID_SIZE).fill(null).map((_, r) => 
      Array(GRID_SIZE).fill(null).map((_, c) => ({
        id: `${r}-${c}`,
        type: 'empty',
        rotation: 0
      }))
    );
    setGrid(newGrid);
    setFeedback(null);
  }, [level]);

  const placePiece = (r: number, c: number) => {
    if (!selectedPiece || feedback === 'success') return;
    const newGrid = [...grid.map(row => [...row])];
    if (newGrid[r][c].type === selectedPiece) {
      newGrid[r][c].rotation = ((newGrid[r][c].rotation + 90) % 360) as Tile['rotation'];
    } else {
      newGrid[r][c].type = selectedPiece;
      newGrid[r][c].rotation = 0;
    }
    setGrid(newGrid);
    setFeedback(null);
  };

  const clearTile = (r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault();
    const newGrid = [...grid.map(row => [...row])];
    newGrid[r][c].type = 'empty';
    newGrid[r][c].rotation = 0;
    setGrid(newGrid);
    setFeedback(null);
  };

  const checkSolution = () => {
    const counts = { nascente: 0, foz: 0, afluente: 0, total: 0 };
    grid.flat().forEach(t => {
      if (t.type !== 'empty') {
        counts.total++;
        if (t.type === 'nascente') counts.nascente++;
        if (t.type === 'foz') counts.foz++;
        if (t.type === 'afluente') counts.afluente++;
      }
    });

    if (level === 1) {
      if (counts.nascente >= 1 && counts.foz >= 1 && counts.total >= 3) setFeedback('success');
      else setFeedback('incomplete');
    } else {
      if (counts.nascente >= 1 && counts.foz >= 1 && counts.afluente >= 1 && counts.total >= 4) setFeedback('success');
      else setFeedback('incomplete');
    }
  };

  const PieceIcon = ({ type }: { type: Tile['type'] }) => {
    switch (type) {
      case 'nascente': return (
        <div className="w-full h-full bg-blue-50 flex items-center justify-center">
          <div className="w-1/2 h-1/2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center">
            <Droplets className="w-2/3 h-2/3 text-white" />
          </div>
        </div>
      );
      case 'foz': return (
        <div className="w-full h-full bg-blue-600 flex flex-col items-center justify-center gap-1">
          <Waves className="w-1/2 h-1/2 text-white/50" />
          <div className="w-full h-2 bg-white/20" />
        </div>
      );
      case 'reto': return <div className="w-full h-full flex justify-center"><div className="w-1/3 h-full bg-blue-400" /></div>;
      case 'curva': return (
        <div className="w-full h-full relative">
          <div className="absolute top-0 left-0 w-2/3 h-2/3 border-t-[14px] border-l-[14px] border-blue-400 rounded-tl-full" />
        </div>
      );
      case 'afluente': return (
        <div className="w-full h-full relative flex items-center justify-center">
          <div className="w-1/3 h-full bg-blue-400" />
          <div className="absolute w-1/2 h-1/3 bg-blue-400 left-1/2 top-1/2 -translate-y-1/2" />
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-8 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 items-start">
        {/* Grid de Construção */}
        <div className="bg-[#f2e6d5] p-6 rounded-[3rem] shadow-xl border-[12px] border-[#e8dac1] relative">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="grid grid-cols-5 gap-1.5 relative z-10">
            {grid.map((row, r) => row.map((tile, c) => (
              <div 
                key={tile.id}
                onClick={() => placePiece(r, c)}
                onContextMenu={(e) => clearTile(r, c, e)}
                className={`w-14 h-14 md:w-20 md:h-20 bg-white/30 rounded-lg border border-white/40 hover:bg-white/60 transition-all cursor-pointer overflow-hidden group shadow-sm ${
                  tile.type !== 'empty' ? 'bg-white/80 shadow-md ring-1 ring-blue-100' : ''
                }`}
              >
                <div className="w-full h-full transition-transform duration-500" style={{ transform: `rotate(${tile.rotation}deg)` }}>
                  <PieceIcon type={tile.type} />
                </div>
              </div>
            )))}
          </div>
        </div>

        {/* Ferramentas */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center mb-6">Peças Hidrográficas</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              {(['nascente', 'reto', 'curva', 'afluente', 'foz'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedPiece(type)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all group ${
                    selectedPiece === type 
                      ? 'border-blue-500 bg-blue-50 ring-4 ring-blue-100' 
                      : 'border-slate-50 bg-slate-50 hover:border-slate-200 text-slate-500'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 overflow-hidden shadow-sm group-hover:scale-110 transition-transform">
                    <PieceIcon type={type} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tight">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <button 
              onClick={checkSolution}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
            >
              Validar Bacia
            </button>
            <button 
              onClick={() => setGrid(grid.map(row => row.map(t => ({ ...t, type: 'empty', rotation: 0 }))))}
              className="w-full text-slate-400 py-2 font-bold uppercase text-[9px] hover:text-slate-600 transition-colors"
            >
              <RefreshCcw className="w-3 h-3 inline mr-1" /> Resetar
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`p-8 rounded-[2rem] border-2 flex flex-col items-center text-center gap-4 animate-in slide-in-from-bottom-4 duration-500 ${
          feedback === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {feedback === 'success' ? <CheckCircle2 className="w-12 h-12 text-green-500" /> : <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500 font-bold">!</div>}
          <div className="space-y-1">
            <h4 className="text-xl font-black uppercase tracking-tighter">
              {feedback === 'success' ? 'Bacia Perfeita!' : 'Curso d\'água Incompleto'}
            </h4>
            <p className="text-sm opacity-80 max-w-sm">
              {feedback === 'success' 
                ? 'Parabéns! A bacia foi montada seguindo a lógica de escoamento correta.' 
                : 'Você precisa garantir que haja uma nascente, o curso principal e uma foz (e afluentes na Fase 02).'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeographyBasin;
