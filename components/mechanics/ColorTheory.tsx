
import React, { useState, useMemo, useEffect } from 'react';
import { Pipette, Send, RefreshCcw, CheckCircle2, XCircle, Droplets, Zap } from 'lucide-react';

interface Props {
  mode: 'CMYK' | 'RGB';
}

const ColorTheory: React.FC<Props> = ({ mode }) => {
  const [cmyk, setCmyk] = useState({ c: 0, m: 0, y: 0, k: 0 });
  const [rgbInput, setRgbInput] = useState({ r: 0, g: 0, b: 0 });
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const [isDelivered, setIsDelivered] = useState(false);

  // Resetar estados ao trocar de modo
  useEffect(() => {
    reset();
  }, [mode]);

  // Cálculo da cor final baseada no modo
  const finalRgb = useMemo(() => {
    if (mode === 'CMYK') {
      const r = 255 * (1 - cmyk.c / 100) * (1 - cmyk.k / 100);
      const g = 255 * (1 - cmyk.m / 100) * (1 - cmyk.k / 100);
      const b = 255 * (1 - cmyk.y / 100) * (1 - cmyk.k / 100);
      return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
    } else {
      return rgbInput;
    }
  }, [cmyk, rgbInput, mode]);

  // Validação de cor análoga (Hue entre 315 e 45 para Vermelho)
  const isValid = useMemo(() => {
    const { r, g, b } = finalRgb;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    
    if (max !== min) {
      if (max === r) h = (g - b) / (max - min);
      else if (max === g) h = 2 + (b - r) / (max - min);
      else h = 4 + (r - g) / (max - min);
      
      h *= 60;
      if (h < 0) h += 360;
    }

    const isHueMatch = (h >= 315 || h <= 45);
    const isNotGrey = (max - min > 40); // Garante saturação mínima
    
    return isHueMatch && isNotGrey;
  }, [finalRgb]);

  const handleSliderChange = (key: string, val: number) => {
    if (isDelivered) return;
    setFeedback(null);
    if (mode === 'CMYK') {
      setCmyk(prev => ({ ...prev, [key]: val }));
    } else {
      setRgbInput(prev => ({ ...prev, [key]: val }));
    }
  };

  const deliver = () => {
    setIsDelivered(true);
    setFeedback(isValid ? 'success' : 'error');
  };

  const reset = () => {
    setCmyk({ c: 0, m: 0, y: 0, k: 0 });
    setRgbInput({ r: 0, g: 0, b: 0 });
    setFeedback(null);
    setIsDelivered(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8 py-4 select-none">
      {/* Pedido do Cliente */}
      <div className={`w-full border rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm relative overflow-hidden transition-colors ${
        mode === 'RGB' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className="absolute top-0 right-0 p-2 opacity-5">
           {mode === 'CMYK' ? <Droplets className="w-32 h-32 rotate-12" /> : <Zap className="w-32 h-32 -rotate-12" />}
        </div>
        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-inner border ${
          mode === 'RGB' ? 'bg-slate-800 border-slate-600' : 'bg-slate-100 border-white'
        }`}>👤</div>
        <div className="flex-1 text-center md:text-left">
          <h4 className={`text-[10px] font-black uppercase tracking-widest mb-1 ${
            mode === 'RGB' ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Laboratório de {mode === 'CMYK' ? 'Tintas' : 'Luz'} .EDU
          </h4>
          <p className={`font-medium text-xl leading-snug ${mode === 'RGB' ? 'text-white' : 'text-slate-800'}`}>
            "Olá! Preciso de uma {mode === 'CMYK' ? 'tinta' : 'luz'} para o meu projeto. Gostaria de algo <span className="text-red-500 font-black underline underline-offset-4 italic px-1">análogo ao vermelho</span>."
          </p>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Painel de Controle */}
        <div className={`border rounded-[2.5rem] p-8 space-y-8 shadow-sm transition-colors ${
          mode === 'RGB' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Pipette className="w-4 h-4 text-slate-400" />
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {mode === 'CMYK' ? 'Pigmentos (CMYK)' : 'Frequências (RGB)'}
              </h3>
            </div>
          </div>

          <div className="space-y-7">
            {(mode === 'CMYK' ? ['c', 'm', 'y', 'k'] : ['r', 'g', 'b']).map((key) => {
              const value = mode === 'CMYK' ? cmyk[key as keyof typeof cmyk] : rgbInput[key as keyof typeof rgbInput];
              const max = mode === 'CMYK' ? 100 : 255;
              
              return (
                <div key={key} className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <span className={`text-xs font-black uppercase ${mode === 'RGB' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {key === 'c' ? 'Cyan' : key === 'm' ? 'Magenta' : key === 'y' ? 'Yellow' : key === 'k' ? 'Black' : 
                       key === 'r' ? 'Red' : key === 'g' ? 'Green' : 'Blue'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      key === 'c' ? 'bg-cyan-50 text-cyan-600' :
                      key === 'm' ? 'bg-pink-50 text-pink-600' :
                      key === 'y' ? 'bg-yellow-50 text-yellow-600' :
                      key === 'r' ? 'bg-red-50 text-red-600' :
                      key === 'g' ? 'bg-green-50 text-green-600' :
                      key === 'b' ? 'bg-blue-50 text-blue-600' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {value}{mode === 'CMYK' ? '%' : ''}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="0"
                    max={max}
                    value={value}
                    disabled={isDelivered}
                    onChange={(e) => handleSliderChange(key, parseInt(e.target.value))}
                    className={`w-full h-2.5 rounded-full appearance-none cursor-pointer transition-all ${
                      mode === 'RGB' ? 'bg-slate-800' : 'bg-slate-100'
                    }`}
                    style={{
                      accentColor: key === 'c' ? '#06b6d4' : key === 'm' ? '#db2777' : key === 'y' ? '#eab308' : 
                                  key === 'r' ? '#ef4444' : key === 'g' ? '#22c55e' : key === 'b' ? '#3b82f6' : '#0f172a'
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview Visual */}
        <div className="flex flex-col items-center gap-8">
          <div className="relative group">
             {/* Objeto de Preview (Balde para CMYK, Esfera/Monitor para RGB) */}
             {mode === 'CMYK' ? (
                <div className="w-56 h-64 bg-slate-100 rounded-b-[2rem] rounded-t-xl border-4 border-slate-200 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 right-0 h-10 bg-slate-200 flex items-center justify-center border-b border-slate-300">
                    <div className="w-16 h-2 bg-slate-300 rounded-full" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 transition-all duration-700"
                    style={{ height: '82%', backgroundColor: `rgb(${finalRgb.r}, ${finalRgb.g}, ${finalRgb.b})`, boxShadow: 'inset 0 15px 30px rgba(0,0,0,0.15)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-white/10 pointer-events-none" />
                </div>
             ) : (
                <div className="w-64 h-64 bg-slate-900 rounded-full border-8 border-slate-800 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
                  <div className="absolute inset-0 blur-3xl opacity-30" style={{ backgroundColor: `rgb(${finalRgb.r}, ${finalRgb.g}, ${finalRgb.b})` }} />
                  <div className="w-48 h-48 rounded-full transition-all duration-700 shadow-[0_0_80px_rgba(255,255,255,0.1)]"
                    style={{ backgroundColor: `rgb(${finalRgb.r}, ${finalRgb.g}, ${finalRgb.b})`, boxShadow: `0 0 60px rgb(${finalRgb.r}, ${finalRgb.g}, ${finalRgb.b}, 0.5)` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                </div>
             )}
             
             {/* Rótulo Central */}
             <div className={`absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-4 rounded-xl border shadow-xl text-center w-36 backdrop-blur-md ${
               mode === 'RGB' ? 'bg-slate-900/80 border-slate-700' : 'bg-white/95 border-slate-200'
             }`}>
                <div className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                  Modo {mode === 'CMYK' ? 'Físico' : 'Digital'}
                </div>
                <div className={`text-[10px] font-black uppercase tracking-tighter ${mode === 'RGB' ? 'text-white' : 'text-slate-800'}`}>
                  {mode === 'CMYK' ? 'Mistura CMYK' : 'Mistura RGB'}
                </div>
             </div>
          </div>

          <div className="w-full max-w-xs space-y-3">
            <button 
              onClick={isDelivered ? reset : deliver}
              className={`w-full flex items-center justify-center gap-3 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] transition-all shadow-lg active:scale-95 ${
                isDelivered 
                  ? 'bg-white border-2 border-slate-100 text-slate-500 hover:bg-slate-50' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isDelivered ? <><RefreshCcw className="w-4 h-4" /> Nova Mistura</> : <><Send className="w-4 h-4" /> Entregar Pedido</>}
            </button>
            <p className="text-[9px] text-center text-slate-400 font-medium px-4 uppercase tracking-tighter">
              {mode === 'CMYK' ? "Subtrativo: Começa branco, termina preto." : "Aditivo: Começa preto, termina branco."}
            </p>
          </div>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`w-full max-w-2xl animate-in zoom-in-95 slide-in-from-bottom-5 duration-500 rounded-[2rem] p-10 border-2 flex flex-col items-center gap-6 text-center shadow-2xl ${
          feedback === 'success' ? 'bg-green-50/50 border-green-100 text-green-900' : 'bg-red-50/50 border-red-100 text-red-900'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            feedback === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
          }`}>
            {feedback === 'success' ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase tracking-tighter">
              {feedback === 'success' ? 'Harmonia Perfeita!' : 'Cor fora do espectro.'}
            </h3>
            <p className="text-sm leading-relaxed opacity-80 max-w-md mx-auto">
              {feedback === 'success' 
                ? `Parabéns! Você utilizou a lógica de mistura ${mode === 'CMYK' ? 'subtrativa' : 'aditiva'} para encontrar uma cor análoga ao vermelho.`
                : `A cor resultante não é análoga ao vermelho no círculo cromático. Lembre-se que as vizinhas são laranja e magenta.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorTheory;
