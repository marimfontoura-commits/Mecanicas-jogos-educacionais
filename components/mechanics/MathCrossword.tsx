
import React, { useState, useRef } from 'react';

type CellType = 'number' | 'operator' | 'target';

interface Cell {
  type: CellType;
  value?: string;
  id?: string;
  correctValue?: string;
}

const MathCrossword: React.FC = () => {
  const [gridValues, setGridValues] = useState<Record<string, string>>({});
  const [draggedItem, setDraggedItem] = useState<{ value: string; id: string } | null>(null);
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [feedback, setFeedback] = useState<'success' | null>(null);

  /**
   * Mapeamento exato da imagem de referência:
   * Colunas: 0-6 | Linhas: 0-4
   * (0,2): 5
   * (1,2): +
   * (2,0): 1, (2,1): +, (2,2): 3, (2,3): =, (2,4): [TARGET: 4]
   * (3,2): =
   * (4,2): [TARGET: 8], (4,3): +, (4,4): 6, (4,5): =, (4,6): [TARGET: 14]
   */
  const grid: (Cell | null)[][] = [
    [null, null, { type: 'number', value: '5' }, null, null, null, null],
    [null, null, { type: 'operator', value: '+' }, null, null, null, null],
    [
      { type: 'number', value: '1' }, 
      { type: 'operator', value: '+' }, 
      { type: 'number', value: '3' }, 
      { type: 'operator', value: '=' }, 
      { type: 'target', id: 't1', correctValue: '4' },
      null, 
      null
    ],
    [null, null, { type: 'operator', value: '=' }, null, null, null, null],
    [
      null, 
      null, 
      { type: 'target', id: 't2', correctValue: '8' }, 
      { type: 'operator', value: '+' }, 
      { type: 'number', value: '6' }, 
      { type: 'operator', value: '=' }, 
      { type: 'target', id: 't3', correctValue: '14' }
    ]
  ];

  const availableNumbers = ['4', '8', '14', '12', '7'];

  const handlePointerDown = (e: React.PointerEvent, value: string) => {
    if (feedback) return;
    setDraggedItem({ value, id: Math.random().toString() });
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

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const targetEl = elements.find(el => el.hasAttribute('data-target-id'));

    if (targetEl) {
      const targetId = targetEl.getAttribute('data-target-id')!;
      const newValues = { ...gridValues, [targetId]: draggedItem.value };
      setGridValues(newValues);
      checkWin(newValues);
    }

    setDraggedItem(null);
  };

  const checkWin = (currentValues: Record<string, string>) => {
    const targets = grid.flat().filter(c => c?.type === 'target');
    const allCorrect = targets.every(t => currentValues[t!.id!] === t!.correctValue);

    if (allCorrect) {
      setFeedback('success');
    }
  };

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-4xl select-none py-12">
      <div className="text-center space-y-1">
        <h3 className="text-slate-800 font-bold text-xl uppercase tracking-widest">Cruzadinha Matemática</h3>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Arraste os números para as caixas vazias</p>
      </div>

      {/* Grid - White Label Style (Caixas quadradas conectadas) */}
      <div className="relative p-10 bg-white border border-slate-100 rounded-lg shadow-sm">
        <div 
          className="grid" 
          style={{ 
            gridTemplateColumns: `repeat(${grid[0].length}, 56px)`,
            gridTemplateRows: `repeat(${grid.length}, 56px)`
          }}
        >
          {grid.map((row, rIdx) => (
            row.map((cell, cIdx) => {
              if (!cell) return <div key={`${rIdx}-${cIdx}`} className="w-[56px] h-[56px]" />;
              
              const isTarget = cell.type === 'target';
              const currentVal = isTarget ? gridValues[cell.id!] : cell.value;
              const isCorrect = feedback === 'success' && isTarget;

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  data-target-id={cell.id}
                  className={`
                    w-[56px] h-[56px] flex items-center justify-center border border-black text-2xl font-light transition-all
                    ${cell.type === 'operator' ? 'bg-white' : 'bg-white'}
                    ${isTarget ? (currentVal ? 'bg-white text-slate-900' : 'bg-slate-50 cursor-default') : ''}
                    ${isCorrect ? 'bg-green-50 text-green-600 border-green-500 z-10' : ''}
                  `}
                >
                  {currentVal}
                </div>
              );
            })
          ))}
        </div>
      </div>

      {/* Banco de Números */}
      <div className="flex flex-col items-center gap-4">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opções</div>
        <div className="flex gap-4">
          {availableNumbers.map((val, idx) => {
            const isUsed = Object.values(gridValues).includes(val);
            return (
              <div
                key={idx}
                onPointerDown={(e) => handlePointerDown(e, val)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                className={`
                  w-14 h-14 flex items-center justify-center border border-black bg-white text-2xl font-light cursor-grab active:cursor-grabbing touch-none hover:shadow-lg transition-all
                  ${isUsed ? 'opacity-20 grayscale pointer-events-none' : ''}
                  ${feedback ? 'opacity-20 pointer-events-none' : ''}
                `}
              >
                {val}
              </div>
            );
          })}
        </div>
      </div>

      {/* Drag Proxy */}
      {isDragging && draggedItem && (
        <div 
          className="fixed pointer-events-none z-[100] w-14 h-14 flex items-center justify-center bg-white border border-black shadow-2xl text-2xl font-light text-slate-900 scale-110"
          style={{
            left: startPos.x - 28 + dragPos.x,
            top: startPos.y - 28 + dragPos.y,
          }}
        >
          {draggedItem.value}
        </div>
      )}

      {/* Feedback de Sucesso */}
      {feedback === 'success' && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col items-center gap-4">
          <div className="bg-green-500 text-white px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs shadow-lg">
            Parabéns! Desafio Concluído
          </div>
          <button 
            onClick={() => {setGridValues({}); setFeedback(null);}}
            className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors underline underline-offset-4"
          >
            Reiniciar Exercício
          </button>
        </div>
      )}
    </div>
  );
};

export default MathCrossword;
