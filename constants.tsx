
import { Mechanic, MechanicType, Discipline, Segment } from './types';

export const MECHANICS: Mechanic[] = [
  {
    id: 'math-crossword',
    title: 'Cruzadinha Matemática',
    description: 'Resolva equações interligadas horizontal e verticalmente arrastando os números para as posições corretas.',
    type: MechanicType.DRAG_DROP,
    discipline: Discipline.MATEMATICA,
    segments: [Segment.AI, Segment.AF],
    years: ['4º ano', '5º ano', '6º ano', '7º ano'],
    thumbnail: 'https://picsum.photos/seed/crossword/400/300'
  },
  {
    id: 'math-equality-dnd',
    title: 'Igualdade Matemática (D&D)',
    description: 'Arraste os números corretos para completar e balancear a equação (9 + ? = 15 - ?).',
    type: MechanicType.DRAG_DROP,
    discipline: Discipline.MATEMATICA,
    segments: [Segment.AI],
    years: ['1º ano', '2º ano', '3º ano'],
    thumbnail: 'https://picsum.photos/seed/math1/400/300'
  },
  {
    id: 'english-quest',
    title: 'English Quest: Obstacles',
    description: 'Ajude o personagem a atravessar obstáculos completando frases em inglês com os adjetivos corretos.',
    type: MechanicType.DRAG_DROP,
    discipline: Discipline.INGLES,
    segments: [Segment.AI],
    years: ['3º ano', '4º ano', '5º ano'],
    thumbnail: 'https://picsum.photos/seed/english1/400/300'
  },
  {
    id: 'color-theory',
    title: 'Laboratório de Cores',
    description: 'Misture pigmentos (CMYK) ou luzes (RGB) para criar cores análogas e atender aos pedidos dos clientes.',
    type: MechanicType.SEQUENCE,
    discipline: Discipline.ARTES,
    segments: [Segment.AF, Segment.EM],
    years: ['8º ano', '9º ano', '1ª série'],
    thumbnail: 'https://picsum.photos/seed/art1/400/300'
  },
  {
    id: 'geography-basin',
    title: 'Bacia Hidrográfica: Puzzle',
    description: 'Monte o curso de um rio em uma malha quadriculada, conectando nascentes, afluentes e foz seguindo a lógica de escoamento.',
    type: MechanicType.DRAG_DROP,
    discipline: Discipline.GEOGRAFIA,
    segments: [Segment.AF, Segment.EM],
    years: ['6º ano', '7º ano', '1ª série'],
    thumbnail: 'https://picsum.photos/seed/geo-river/400/300'
  }
];
