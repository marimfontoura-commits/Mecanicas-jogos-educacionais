
export enum Segment {
  EI = 'Educação Infantil',
  AI = 'Anos Iniciais',
  AF = 'Anos Finais',
  EM = 'Ensino Médio'
}

export enum Discipline {
  MATEMATICA = 'Matemática',
  PORTUGUES = 'Português',
  CIENCIAS = 'Ciências',
  HISTORIA = 'História',
  GEOGRAFIA = 'Geografia',
  INGLES = 'Inglês',
  ARTES = 'Artes'
}

export enum MechanicType {
  DRAG_DROP = 'Drag and Drop',
  QUIZ = 'Múltipla Escolha',
  MEMORY = 'Jogo da Memória',
  SORTING = 'Classificação',
  SEQUENCE = 'Ordenação'
}

export interface Mechanic {
  id: string;
  title: string;
  description: string;
  type: MechanicType;
  discipline: Discipline;
  segments: Segment[];
  years: string[];
  thumbnail: string;
}

export interface FilterState {
  segment: Segment | 'all';
  discipline: Discipline | 'all';
  type: MechanicType | 'all';
}
