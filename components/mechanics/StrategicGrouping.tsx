import React, { useState, useEffect, useCallback } from 'react';
import { RotateCcw, Check, AlertCircle, Zap } from 'lucide-react';

interface Number {
  id: string;
  value: number;
  operation?: 'add' | 'subtract' | 'multiply'; // Para Fase 2
}

type FeedbackType = 'success' | 'error' | 'stuck' | null;

interface StrategicGroupingProps {
  phase?: 1 | 2;
}

const StrategicGrouping: React.FC<StrategicGroupingProps> = ({ phase = 1 }) => {
  // Configurações por fase
  const phaseConfig = {
    1: {
      target: 10,
      initialNumbers: [
        { id: '1', value: 8 },
        { id: '2', value: 2 },
        { id: '3', value: 5 },
        { id: '4', value: 3 },
        { id: '5', value: 7 }
      ],
      title: 'Agrupamento Estratégico: Soma',
      description: 'Combina números que somem exatamente 10',
      hint: 'Procure por números que se adicionam para fazer 10'
    },
    2: {
      target: 0,
      initialNumbers: [
        { id: 'a', value: 18 },
        { id: 'b', value: 18, operation: 'subtract' },
        { id: 'c', value: 9 },
        { id: 'd', value: 9, operation: 'subtract' },
        { id: 'e', value: 6 },
        { id: 'f', value: 0, operation: 'multiply' },
        { id: 'g', value: 4 },
        { id: 'h', value: 0, operation: 'multiply' }
      ],
      title: 'Agrupamento Estratégico: Anulação',
      description: 'Use subtrações ou multiplicações para zerar o resultado',
      hint: 'Combine pares como A − A ou qualquer valor × 0 para anular.'
    }
  };

  const config = phaseConfig[phase];
  const TARGET = config.target;

  const [numbers, setNumbers] = useState<Number[]>(config.initialNumbers);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState<FeedbackType>(null);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());
  const [inputValue, setInputValue] = useState('');
  const [noMoreMoves, setNoMoreMoves] = useState(false);

  const computeExpression = useCallback((sourceNumbers: Number[], selection: Set<string>) => {
    const ordered = sourceNumbers.filter(n => selection.has(n.id));
    if (ordered.length === 0) return null;

    let total = 0;
    ordered.forEach((num, index) => {
      const op = num.operation ?? 'add';
      if (index === 0) {
        if (op === 'add') total = num.value;
        else if (op === 'subtract') total = -num.value;
        else if (op === 'multiply') total = num.value;
        return;
      }

      if (op === 'add') total += num.value;
      else if (op === 'subtract') total -= num.value;
      else if (op === 'multiply') total *= num.value;
    });

    return total;
  }, []);

  // Verifica se existe alguma combinação possível
  const hasValidCombination = useCallback((nums: Number[]): boolean => {
    if (nums.length < 2) return false;
    
    if (phase === 1) {
      // Fase 1: Encontra números que somem 10
      for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
          let sum = nums[i].value + nums[j].value;
          if (sum === TARGET) return true;
          
          for (let k = j + 1; k < nums.length; k++) {
            if (sum + nums[k].value === TARGET) return true;
          }
        }
      }
    } else {
      const totalCombos = 1 << nums.length;
      for (let mask = 0; mask < totalCombos; mask++) {
        if (mask === 0) continue;
        const ids = new Set<string>();
        let bitCount = 0;
        for (let idx = 0; idx < nums.length; idx++) {
          if (mask & (1 << idx)) {
            ids.add(nums[idx].id);
            bitCount += 1;
          }
        }
        if (bitCount < 2) continue;
        const result = computeExpression(nums, ids);
        if (result === 0) return true;
      }
    }
    
    return false;
  }, [phase, TARGET, computeExpression]);

  // Verifica se o jogo terminou (apenas um número restante)
  useEffect(() => {
    if (numbers.length === 1) {
      setGameWon(true);
      setNoMoreMoves(false);
    } else if (numbers.length > 1 && !hasValidCombination(numbers)) {
      setNoMoreMoves(true);
      setFeedback('stuck');
    } else {
      setNoMoreMoves(false);
    }
  }, [numbers, hasValidCombination]);

  const selectedSum = Array.from(selected).reduce((sum, id) => {
    const num = numbers.find(n => n.id === id);
    return sum + (num?.value || 0);
  }, 0);

  // Calcula se a seleção é válida para combinar
  const isValidSelection = () => {
    if (selected.size < 2) return false;
    
    if (phase === 1) {
      // Fase 1: soma deve ser exatamente 10
      return selectedSum === TARGET;
    } else {
      const result = computeExpression(numbers, selected);
      return result === 0;
    }
  };

  const handleNumberClick = (id: string) => {
    if (gameWon || animatingIds.size > 0 || noMoreMoves) return;

    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
    setFeedback(null);
    setInputValue('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setFeedback(null);
  };

  const executeGrouping = () => {
    if (selected.size < 2) {
      setFeedback('error');
      setTimeout(() => setFeedback(null), 1500);
      return;
    }

    // Na Fase 2, o resultado é sempre 0 (anulação)
    const expectedResult = phase === 1 ? TARGET : 0;
    
    // Valida se a seleção é válida
    const resultValue = phase === 1 ? selectedSum : computeExpression(numbers, selected);
    const valid = phase === 1 
      ? selectedSum === TARGET 
      : resultValue === 0;

    if (valid && resultValue === expectedResult) {
      // Sucesso!
      setFeedback('success');
      
      // Animar os números que serão substituídos
      setAnimatingIds(new Set(selected));
      
      setTimeout(() => {
        // Encontrar o índice mais à esquerda dos números selecionados
        const selectedIndices = numbers
          .map((n, idx) => selected.has(n.id) ? idx : -1)
          .filter(idx => idx !== -1);
        
        const minIndex = Math.min(...selectedIndices);
        
        // Na Fase 2, o resultado é 0; na Fase 1 é 10
        const newId = Math.random().toString(36).substr(2, 9);
        const newNumber: Number = { id: newId, value: expectedResult, operation: 'add' };
        
        // Remover selecionados e inserir o novo número na posição mais à esquerda
        const newNumbers = numbers.filter(n => !selected.has(n.id));
        newNumbers.splice(minIndex, 0, newNumber);
        
        setNumbers(newNumbers);
        setSelected(new Set());
        setMoves(m => m + 1);
        setAnimatingIds(new Set());
        setFeedback(null);
        setInputValue('');
      }, 800);
    } else {
      // Erro
      setFeedback('error');
      setTimeout(() => {
        setSelected(new Set());
        setFeedback(null);
        setInputValue('');
      }, 1500);
    }
  };

  const handleSubmit = () => {
    executeGrouping();
  };

  const handleInputSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      validateFinalSum(parseInt(inputValue, 10));
    }
  };

  const validateFinalSum = (userAnswer: number) => {
    // Calcula a soma de TODOS os números restantes
    const totalSum = numbers.reduce((sum, num) => sum + num.value, 0);
    
    if (userAnswer === totalSum) {
      // Acertou!
      setFeedback('success');
      setTimeout(() => {
        setGameWon(true);
        setFeedback(null);
      }, 500);
    } else {
      // Errou
      setFeedback('error');
      setTimeout(() => {
        setFeedback(null);
        setInputValue('');
      }, 1500);
    }
  };

  const handleReset = () => {
    setNumbers(config.initialNumbers);
    setSelected(new Set());
    setFeedback(null);
    setMoves(0);
    setGameWon(false);
    setNoMoreMoves(false);
    setInputValue('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-overline font-bold text-blue-600">FASE {phase}</span>
        </div>
        <h1 className="text-h3 text-slate-900 mb-2">{config.title}</h1>
        <p className="text-body-sm text-slate-600">
          {config.description}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="text-overline text-slate-500 font-semibold mb-1">Movimentos</div>
          <div className="text-h2 text-slate-900">{moves}</div>
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="text-overline text-slate-500 font-semibold mb-1">Selecionados</div>
          <div className="text-h2 text-slate-900">{selected.size}</div>
        </div>
        <div className={`rounded-xl p-4 border-2 transition-all ${
          isValidSelection()
            ? 'bg-green-50 border-green-300'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="text-overline text-slate-500 font-semibold mb-1">
            {phase === 1 ? 'Soma' : 'Válido'}
          </div>
          <div className={`text-h2 ${isValidSelection() ? 'text-green-600' : 'text-slate-900'}`}>
            {phase === 1 ? selectedSum : (isValidSelection() ? '✓' : '✗')}
          </div>
        </div>
      </div>

      {/* Expressão com Números - Com Animação de Fusão */}
      <div className="mb-8 p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 relative overflow-hidden">
        <style>{`
          @keyframes mergeScale {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
          
          @keyframes mergeFloat {
            0% {
              transform: translateY(0);
              opacity: 1;
            }
            100% {
              transform: translateY(-60px);
              opacity: 0;
            }
          }

          .number-merging {
            animation: mergeFloat 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>
        
        <div className="flex items-center justify-center gap-3 flex-wrap relative z-10">
          {numbers.map((num, idx) => (
            <div key={num.id}>
              <button
                onClick={() => handleNumberClick(num.id)}
                disabled={gameWon || animatingIds.size > 0 || noMoreMoves}
                className={`relative w-16 h-16 rounded-lg font-bold text-lg transition-all duration-300 transform ${
                  selected.has(num.id)
                    ? 'bg-blue-500 text-white shadow-lg scale-110 ring-4 ring-blue-200'
                    : 'bg-white text-slate-900 shadow-md hover:shadow-lg hover:scale-105 border-2 border-slate-200 hover:border-slate-300'
                } ${
                  animatingIds.has(num.id)
                    ? 'number-merging'
                    : ''
                } ${
                  feedback === 'error' && selected.size > 0 && !gameWon
                    ? 'border-red-500 border-2'
                    : ''
                } disabled:cursor-not-allowed`}
                aria-label={`Número ${num.value}`}
              >
                {num.value}
              </button>
              {idx < numbers.length - 1 && (
                <div className="text-slate-400 text-lg mx-2 inline-block">
                  {(() => {
                    const op = numbers[idx + 1]?.operation ?? 'add';
                    if (op === 'subtract') return '−';
                    if (op === 'multiply') return '×';
                    return '+';
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feedback de Erro/Sucesso/Stuck */}
      {feedback && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
          feedback === 'success'
            ? 'bg-green-50 border border-green-200'
            : feedback === 'stuck'
            ? 'bg-yellow-50 border border-yellow-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          {feedback === 'success' ? (
            <>
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-body-sm font-semibold text-green-900">
                {phase === 1 
                  ? '✓ Excelente! Números fundidos em 10.'
                  : '✓ Perfeito! Números anulados (= 0).'
                }
              </p>
            </>
          ) : feedback === 'stuck' ? (
            <>
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <p className="text-body-sm font-semibold text-yellow-900">
                {phase === 1
                  ? '⚠️ Nenhuma combinação de 10 disponível. Tente resetar!'
                  : '⚠️ Nenhuma combinação válida. Tente resetar!'
                }
              </p>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-body-sm font-semibold text-red-900">
                {selected.size < 2 
                  ? 'Selecione 2 ou mais números.' 
                  : phase === 1
                  ? 'Essa soma não resulta em 10.'
                  : 'Essa combinação não anula o resultado. Use subtrações equivalentes ou multiplique por 0.'
                }
              </p>
            </>
          )}
        </div>
      )}

      {/* Input para Digitar a Soma */}
      <div className="mb-8 p-6 bg-blue-50 border-2 border-blue-200 rounded-xl">
        <label className="text-overline text-blue-700 font-semibold mb-3 block">
          💡 Ou responda direto: Qual é o {phase === 1 ? 'resultado final?' : 'valor anulado?'}
        </label>
        <div className="flex gap-3">
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputSubmit}
            placeholder={phase === 1 ? 'Digite a soma total' : 'Digite 0 para anular'}
            disabled={gameWon || animatingIds.size > 0}
            className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg font-semibold text-center text-lg placeholder-blue-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => {
              if (inputValue) {
                validateFinalSum(parseInt(inputValue, 10));
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue) {
                validateFinalSum(parseInt(inputValue, 10));
              }
            }}
            disabled={!inputValue || gameWon || animatingIds.size > 0}
            className="py-3 px-8 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg disabled:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-400 flex items-center gap-2 whitespace-nowrap"
            aria-label="Confirmar digitação"
            title="Clique aqui ou pressione Enter"
          >
            <Zap className="w-5 h-5" />
            Enviar
          </button>
        </div>
      </div>

      {/* Modos de Conclusão */}
      {gameWon && (
        <div className="mb-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 animate-in zoom-in-75 duration-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🎉</div>
              <div>
                <h3 className="text-body font-bold text-green-900">Parabéns!</h3>
                <p className="text-body-sm text-green-800">Você descobriu a soma final em <span className="font-bold">{moves}</span> movimento{moves !== 1 ? 's' : ''}.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={handleSubmit}
          disabled={selected.size === 0 || gameWon || animatingIds.size > 0 || noMoreMoves}
          className={`flex-1 py-3 px-4 rounded-xl font-semibold text-center transition-all duration-300 ${
            selected.size === 0 || gameWon || animatingIds.size > 0 || noMoreMoves
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
          }`}
          aria-label="Combinar números"
        >
          Combinar Números ({selected.size})
        </button>
        <button
          onClick={handleReset}
          className="py-3 px-4 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all duration-300 shadow-sm hover:shadow-md"
          aria-label="Resetar jogo"
          title="Reiniciar o jogo"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Instruções */}
      <div className="pt-6 border-t border-slate-200">
        <p className="text-overline text-slate-600 font-semibold mb-3">Como Jogar</p>
        {phase === 1 ? (
          <ul className="space-y-2 text-body-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">Caminho 1:</span>
              <span><strong>Agrupamentos</strong> - Clique em 2+ números, confirme se somam 10</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">Caminho 2:</span>
              <span><strong>Resposta Direta</strong> - Digite a soma final de todos os números</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 font-bold mt-0.5">🎯</span>
              <span>Você vence quando descobrir o resultado total da expressão!</span>
            </li>
          </ul>
        ) : (
          <ul className="space-y-2 text-body-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold mt-0.5">Caminho 1:</span>
              <span><strong>Anulações</strong> - Forme pares como A − A ou multiplique qualquer termo por 0</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 font-bold mt-0.5">Caminho 2:</span>
              <span><strong>Resposta Direta</strong> - Digite 0 como valor final</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400 font-bold mt-0.5">💡</span>
              <span>Dica: Números iguais se anulam (2-2=0), e qualquer coisa × 0 = 0</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default StrategicGrouping;
