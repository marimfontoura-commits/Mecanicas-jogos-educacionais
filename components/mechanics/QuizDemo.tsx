
import React, { useState } from 'react';

const QuizDemo: React.FC = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const question = "Qual destes elementos é um gás nobre?";
  const options = ["Oxigênio", "Hélio", "Ferro", "Cálcio"];
  const correctIdx = 1;

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelected(idx);
    setIsAnswered(true);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8 rounded-3xl bg-white shadow-xl border border-slate-200">
      <div className="mb-8">
        <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2 block">Ciências • Ensino Médio</span>
        <h2 className="text-2xl font-bold text-slate-800">{question}</h2>
      </div>

      <div className="space-y-4">
        {options.map((opt, idx) => {
          let styles = "bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50";
          if (isAnswered) {
            if (idx === correctIdx) styles = "bg-green-100 border-green-500 text-green-700 font-bold";
            else if (idx === selected) styles = "bg-red-100 border-red-500 text-red-700";
            else styles = "bg-slate-50 border-slate-100 text-slate-400";
          }

          return (
            <button
              key={opt}
              disabled={isAnswered}
              onClick={() => handleAnswer(idx)}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${styles}`}
            >
              <span>{opt}</span>
              {isAnswered && idx === correctIdx && <span className="text-xl">✅</span>}
              {isAnswered && idx === selected && idx !== correctIdx && <span className="text-xl">❌</span>}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-8 text-center animate-in slide-in-from-bottom-4 duration-500">
          <p className="text-slate-600 mb-4">
            {selected === correctIdx 
              ? "Excelente! O Hélio (He) é um gás nobre por possuir sua camada de valência completa."
              : "Não foi dessa vez. O Oxigênio é um calcogênio, o Ferro um metal de transição e o Cálcio um metal alcalino-terroso."}
          </p>
          <button 
            onClick={() => {setIsAnswered(false); setSelected(null);}}
            className="text-indigo-600 font-bold hover:underline"
          >
            Tentar novamente
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizDemo;
