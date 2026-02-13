
import React from 'react';
import { Mechanic } from '../types';

interface Props {
  mechanic: Mechanic;
  onClick: (m: Mechanic) => void;
}

const MechanicCard: React.FC<Props> = ({ mechanic, onClick }) => {
  return (
    <div 
      className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
      onClick={() => onClick(mechanic)}
    >
      <div className="h-40 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6 border-b border-slate-100">
        <div className="w-full h-full bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-inner group-hover:shadow-md group-hover:border-slate-300 transition-all">
           <span className="text-slate-400 font-semibold text-body-sm uppercase tracking-wider">Prévia</span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <span className="text-overline text-blue-600 mb-2 font-semibold">{mechanic.discipline}</span>
        <h3 className="text-h4 text-slate-900 mb-3 leading-snug">{mechanic.title}</h3>
        <p className="text-body-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed">
          {mechanic.description}
        </p>
        <div className="mt-auto flex gap-2">
          <span className="text-overline px-3 py-1.5 border border-slate-200 text-slate-700 rounded-md font-semibold hover:bg-slate-50 transition-colors">
            {mechanic.type}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MechanicCard;
