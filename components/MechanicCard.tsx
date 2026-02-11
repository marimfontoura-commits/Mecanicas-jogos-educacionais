
import React from 'react';
import { Mechanic } from '../types';

interface Props {
  mechanic: Mechanic;
  onClick: (m: Mechanic) => void;
}

const MechanicCard: React.FC<Props> = ({ mechanic, onClick }) => {
  return (
    <div 
      className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-slate-400 transition-all cursor-pointer group flex flex-col h-full"
      onClick={() => onClick(mechanic)}
    >
      <div className="h-32 bg-slate-100 flex items-center justify-center p-4 border-b border-slate-100">
        <div className="w-full h-full bg-white rounded border border-slate-200 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
           <span className="text-slate-300 font-bold uppercase text-[10px] tracking-tighter">Preview</span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[9px] font-bold text-slate-400 uppercase">{mechanic.discipline}</span>
        </div>
        <h3 className="font-bold text-slate-800 text-sm mb-2 leading-tight">{mechanic.title}</h3>
        <p className="text-[11px] text-slate-500 line-clamp-2 mb-4">
          {mechanic.description}
        </p>
        <div className="mt-auto flex gap-1">
          <span className="text-[9px] px-1.5 py-0.5 border border-slate-200 text-slate-500 rounded font-bold uppercase">
            {mechanic.type}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MechanicCard;
