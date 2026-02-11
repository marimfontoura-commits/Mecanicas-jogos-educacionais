
import React, { useState, useMemo } from 'react';
import { Search, Filter, GraduationCap, BookOpen, Layers, Sparkles } from 'lucide-react';
import { MECHANICS } from './constants';
import { Mechanic, Segment, Discipline, MechanicType, FilterState } from './types';
import MechanicCard from './components/MechanicCard';
import Playground from './components/Playground';

const App: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    segment: 'all',
    discipline: 'all',
    type: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);

  const filteredMechanics = useMemo(() => {
    return MECHANICS.filter(m => {
      const matchSegment = filters.segment === 'all' || m.segments.includes(filters.segment as Segment);
      const matchDiscipline = filters.discipline === 'all' || m.discipline === filters.discipline;
      const matchType = filters.type === 'all' || m.type === filters.type;
      const matchSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchSegment && matchDiscipline && matchType && matchSearch;
    });
  }, [filters, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Navbar Minimalista */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 h-14">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center text-white text-[10px] font-black">I</div>
            <h1 className="text-sm font-bold text-slate-800 uppercase tracking-tighter">Interações<span className="text-slate-400">.EDU</span></h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Pesquisar catálogo..." 
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs w-64 focus:outline-none focus:ring-1 focus:ring-slate-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>
            <button className="text-[11px] font-bold text-slate-400 uppercase hover:text-slate-600 transition-colors">Acessar Docs</button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        {/* Sidebar Filtros Neutros */}
        <aside className="w-full md:w-64 p-6 border-r border-slate-200 bg-white md:bg-transparent">
          <div className="space-y-8">
            <section>
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <BookOpen className="w-3 h-3" /> Disciplina
              </h3>
              <div className="flex flex-col gap-1">
                {['all', ...Object.values(Discipline)].map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilters(f => ({ ...f, discipline: d as any }))}
                    className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      filters.discipline === d 
                      ? 'bg-white border border-slate-200 text-slate-900 shadow-sm font-bold' 
                      : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {d === 'all' ? 'Todas' : d}
                  </button>
                ))}
              </div>
            </section>
          </div>
        </aside>

        {/* Listagem de Cards */}
        <section className="flex-1 p-6 md:p-10">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-800">Diretório de Interações</h2>
            <p className="text-slate-500 text-sm">Biblioteca de componentes técnicos para mecânicas de jogos pedagógicos.</p>
          </div>

          {filteredMechanics.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMechanics.map(m => (
                <MechanicCard 
                  key={m.id} 
                  mechanic={m} 
                  onClick={setSelectedMechanic}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-16 text-center border border-slate-200">
              <p className="text-slate-400 text-sm">Nenhuma mecânica corresponde aos filtros selecionados.</p>
              <button 
                onClick={() => setFilters({ segment: 'all', discipline: 'all', type: 'all' })}
                className="mt-4 text-xs font-bold text-slate-800 hover:underline"
              >
                Resetar Filtros
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Modal de Preview */}
      {selectedMechanic && (
        <Playground 
          mechanic={selectedMechanic} 
          onClose={() => setSelectedMechanic(null)} 
        />
      )}
    </div>
  );
};

export default App;
