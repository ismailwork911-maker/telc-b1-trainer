export interface ExamAnswerKey {
  id: number;
  title: string;
  // Leseverstehen Teil 1 (Q1-5): letter A-J (match text → heading)
  lvTeil1: string[];
  // Leseverstehen Teil 2 (Q6-10): A, B, or C
  lvTeil2: string[];
  // Leseverstehen Teil 3 (Q11-20): letter A-L or 'X' (keine passende Anzeige)
  lvTeil3: string[];
  // Sprachbausteine Teil 1 (Q21-30): A, B, or C
  sbTeil1: string[];
  // Sprachbausteine Teil 2 (Q31-40): letter A-P (word bank)
  sbTeil2: string[];
  // Hörverstehen Teil 1 (Q41-45): 'R' or 'F'
  hvTeil1: string[];
  // Hörverstehen Teil 2 (Q46-55): 'R' or 'F'
  hvTeil2: string[];
  // Hörverstehen Teil 3 (Q56-60): 'R' or 'F'
  hvTeil3: string[];
}

export interface ExamAnswers {
  answers: Record<number, string>;
  schreiben: {
    text: string;
    rubric: {
      aufgabenerfuellung: number;
      kohaerenz: number;
      wortschatz: number;
      grammatik: number;
    };
  };
}

export interface SectionScore {
  raw: number;
  maxRaw: number;
  scaled: number;
  maxScaled: number;
}

export interface ScoringResult {
  lv: SectionScore;
  sb: SectionScore;
  hv: SectionScore;
  schreiben: { score: number; max: number };
  writtenTotal: number;
  writtenMax: number;
  writtenPassed: boolean;
  totalScore: number;
  totalMax: number;
  grade: string;
  overallPassed: boolean;
  wiederholung: string[];
}

export interface ExamRecord {
  examId: number;
  points: number;
  status: 'Bestanden' | 'Nicht bestanden';
  date: string;
}
