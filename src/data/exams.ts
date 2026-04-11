import type { ExamAnswerKey } from '../types';

// Answer keys for Telc B1 – 15 Modelltests
// Tests 1-8: confirmed from official Lösungen (page 247).
// Tests 9-15: from PDF OCR (may need verification).
//
// Sections & Question numbers:
//   LV Teil 1  Q1-5   (Kurztexte → Überschriften A-J)
//   LV Teil 2  Q6-10  (Zeitungsartikel → A/B/C)
//   LV Teil 3  Q11-20 (Kleinanzeigen → A-O)
//   SB Teil 1  Q21-30 (Lückentext → A/B/C)
//   SB Teil 2  Q31-40 (Wortauswahl → A-O)
//   HV Teil 1  Q41-45 (Richtig/Falsch)
//   HV Teil 2  Q46-55 (Richtig/Falsch)
//   HV Teil 3  Q56-60 (Richtig/Falsch)

export const exams: ExamAnswerKey[] = [
  {
    id: 1, title: 'Modelltest 1',
    lvTeil1: ['E','A','F','G','H'],
    lvTeil2: ['C','A','B','A','B'],
    lvTeil3: ['D','C','A','O','O','K','I','J','O','L'],
    sbTeil1: ['B','A','C','A','B','C','C','B','B','A'],
    sbTeil2: ['J','L','K','N','G','H','D','I','B','O'],
    hvTeil1: ['F','R','R','F','R'],
    hvTeil2: ['R','R','F','F','F','F','R','F','F','R'],
    hvTeil3: ['F','F','R','F','R'],
  },
  {
    id: 2, title: 'Modelltest 2',
    lvTeil1: ['B','I','J','A','C'],
    lvTeil2: ['A','B','C','B','C'],
    lvTeil3: ['O','E','A','C','O','I','G','H','K','D'],
    sbTeil1: ['C','B','A','C','A','C','A','B','B','A'],
    sbTeil2: ['L','P','N','B','F','G','O','A','J','H'],
    hvTeil1: ['R','F','F','F','F'],
    hvTeil2: ['F','R','F','F','R','F','R','R','F','F'],
    hvTeil3: ['F','R','R','F','F'],
  },
  {
    id: 3, title: 'Modelltest 3',
    lvTeil1: ['I','J','D','A','C'],
    lvTeil2: ['B','C','B','A','A'],
    lvTeil3: ['O','A','O','D','G','H','L','I','C','E'],
    sbTeil1: ['B','C','A','C','A','A','A','B','C','C'],
    sbTeil2: ['G','I','B','J','F','H','M','E','A','C'],
    hvTeil1: ['R','F','R','R','F'],
    hvTeil2: ['R','F','F','F','R','F','R','R','F','R'],
    hvTeil3: ['F','R','F','F','F'],
  },
  {
    id: 4, title: 'Modelltest 4',
    lvTeil1: ['C','I','B','J','H'],
    lvTeil2: ['C','B','C','A','C'],
    lvTeil3: ['B','O','O','K','F','C','O','D','H','J'],
    sbTeil1: ['C','B','A','C','A','C','A','C','B','B'],
    sbTeil2: ['B','I','L','H','C','D','O','J','F','P'],
    hvTeil1: ['F','F','F','R','F'],
    hvTeil2: ['F','R','F','F','R','R','R','R','F','R'],
    hvTeil3: ['F','R','F','F','F'],
  },
  {
    id: 5, title: 'Modelltest 5',
    lvTeil1: ['J','A','E','G','B'],
    lvTeil2: ['B','C','C','A','B'],
    lvTeil3: ['J','H','B','O','I','E','O','F','D','K'],
    sbTeil1: ['A','C','B','A','C','B','A','C','B','A'],
    sbTeil2: ['O','C','M','J','P','G','E','N','L','K'],
    hvTeil1: ['F','F','R','R','F'],
    hvTeil2: ['F','R','R','F','F','F','F','F','F','R'],
    hvTeil3: ['F','R','F','F','F'],
  },
  {
    id: 6, title: 'Modelltest 6',
    lvTeil1: ['F','G','J','B','D'],
    lvTeil2: ['C','A','A','B','B'],
    lvTeil3: ['G','F','O','C','A','J','I','O','L','B'],
    sbTeil1: ['C','B','B','A','A','B','A','A','C','C'],
    sbTeil2: ['B','J','M','F','P','I','H','L','C','N'],
    hvTeil1: ['R','F','R','F','R'],
    hvTeil2: ['F','R','F','F','R','F','R','F','F','R'],
    hvTeil3: ['R','R','F','F','F'],
  },
  {
    id: 7, title: 'Modelltest 7',
    lvTeil1: ['F','G','A','I','D'],
    lvTeil2: ['B','A','C','B','C'],
    lvTeil3: ['D','G','O','F','O','A','H','O','I','J'],
    sbTeil1: ['C','A','C','B','A','B','A','B','B','C'],
    sbTeil2: ['K','L','E','M','H','N','G','O','I','D'],
    hvTeil1: ['R','R','R','R','F'],
    hvTeil2: ['R','F','F','F','R','R','F','F','F','F'],
    hvTeil3: ['F','R','F','F','R'],
  },
  {
    id: 8, title: 'Modelltest 8',
    lvTeil1: ['F','G','D','I','H'],
    lvTeil2: ['B','B','B','C','B'],
    lvTeil3: ['A','H','I','G','O','K','O','D','E','J'],
    sbTeil1: ['A','A','B','C','B','C','B','A','A','C'],
    sbTeil2: ['G','I','C','H','N','F','K','O','L','P'],
    hvTeil1: ['F','F','R','R','R'],
    hvTeil2: ['F','R','F','F','F','F','F','F','R','R'],
    hvTeil3: ['F','R','F','F','F'],
  },
  {
    id: 9, title: 'Modelltest 9',
    lvTeil1: ['B','F','A','G','E'],
    lvTeil2: ['A','B','A','A','A'],
    lvTeil3: ['B','X','L','X','E','H','F','G','X','I'],
    sbTeil1: ['B','C','A','C','A','A','B','B','C','A'],
    sbTeil2: ['P','K','J','E','I','C','L','O','B','N'],
    hvTeil1: ['F','R','R','F','R'],
    hvTeil2: ['F','F','F','R','F','F','R','F','R','F'],
    hvTeil3: ['F','R','F','F','F'],
  },
  {
    id: 10, title: 'Modelltest 10',
    lvTeil1: ['F','C','I','B','J'],
    lvTeil2: ['B','A','C','C','B'],
    lvTeil3: ['X','F','X','J','D','C','X','L','B','K'],
    sbTeil1: ['A','C','C','B','B','A','B','C','A','C'],
    sbTeil2: ['J','L','E','I','C','P','D','F','O','A'],
    hvTeil1: ['F','F','R','R','F'],
    hvTeil2: ['F','F','F','R','F','R','R','F','R','R'],
    hvTeil3: ['R','R','F','R','R'],
  },
  {
    id: 11, title: 'Modelltest 11',
    lvTeil1: ['F','A','C','J','H'],
    lvTeil2: ['B','C','B','A','A'],
    lvTeil3: ['X','X','F','B','L','D','A','C','I','J'],
    sbTeil1: ['C','B','A','B','C','B','A','A','C','C'],
    sbTeil2: ['K','L','F','J','H','N','O','C','B','D'],
    hvTeil1: ['F','R','R','R','F'],
    hvTeil2: ['R','F','F','R','F','F','R','F','F','F'],
    hvTeil3: ['F','F','R','F','F'],
  },
  {
    id: 12, title: 'Modelltest 12',
    lvTeil1: ['E','H','J','A','G'],
    lvTeil2: ['B','A','A','B','A'],
    lvTeil3: ['B','X','C','K','A','X','X','H','D','J'],
    sbTeil1: ['C','A','C','A','B','C','C','B','A','B'],
    sbTeil2: ['O','F','J','A','G','B','K','L','N','D'],
    hvTeil1: ['R','F','F','R','F'],
    hvTeil2: ['F','R','F','R','R','F','F','R','F','R'],
    hvTeil3: ['F','R','F','F','F'],
  },
  {
    id: 13, title: 'Modelltest 13',
    lvTeil1: ['A','I','E','G','F'],
    lvTeil2: ['B','A','A','B','C'],
    lvTeil3: ['J','X','E','D','X','H','I','C','L','A'],
    sbTeil1: ['B','A','B','C','C','B','A','C','A','B'],
    sbTeil2: ['K','E','I','P','B','A','O','J','L','G'],
    hvTeil1: ['R','F','F','R','F'],
    hvTeil2: ['F','F','R','R','F','R','R','F','R','F'],
    hvTeil3: ['R','F','R','F','R'],
  },
  {
    id: 14, title: 'Modelltest 14',
    lvTeil1: ['H','E','A','D','F'],
    lvTeil2: ['B','A','C','B','B'],
    lvTeil3: ['E','X','A','K','X','J','F','C','X','B'],
    sbTeil1: ['B','A','B','C','B','C','A','C','C','A'],
    sbTeil2: ['K','J','P','B','M','F','H','I','D','O'],
    hvTeil1: ['R','R','F','R','F'],
    hvTeil2: ['R','F','F','F','F','F','R','F','F','R'],
    hvTeil3: ['R','R','F','F','F'],
  },
  {
    id: 15, title: 'Modelltest 15',
    lvTeil1: ['E','A','D','G','C'],
    lvTeil2: ['B','A','C','B','A'],
    lvTeil3: ['F','X','L','J','E','X','H','I','B','G'],
    sbTeil1: ['B','A','C','C','C','B','C','B','A','A'],
    sbTeil2: ['N','I','F','E','L','A','D','B','P','K'],
    hvTeil1: ['R','F','R','R','R'],
    hvTeil2: ['R','R','F','F','F','R','F','F','R','R'],
    hvTeil3: ['F','F','R','F','R'],
  },
];

export function getExam(id: number): ExamAnswerKey | undefined {
  return exams.find(e => e.id === id);
}

/** Get the correct answer for a question number (1-60) */
export function getCorrectAnswer(exam: ExamAnswerKey, q: number): string {
  if (q >= 1  && q <= 5)  return exam.lvTeil1[q - 1];
  if (q >= 6  && q <= 10) return exam.lvTeil2[q - 6];
  if (q >= 11 && q <= 20) return exam.lvTeil3[q - 11];
  if (q >= 21 && q <= 30) return exam.sbTeil1[q - 21];
  if (q >= 31 && q <= 40) return exam.sbTeil2[q - 31];
  if (q >= 41 && q <= 45) return exam.hvTeil1[q - 41];
  if (q >= 46 && q <= 55) return exam.hvTeil2[q - 46];
  if (q >= 56 && q <= 60) return exam.hvTeil3[q - 56];
  return '';
}
