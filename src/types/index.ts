// ── Telc B1 Exam Types (Answer-Key Only) ──

/** Answer key for one exam — no question text, just correct answers */
export interface ExamAnswerKey {
  id: number;
  title: string;
  /** Q1-5 Richtig/Falsch */
  hoerenTeil1: boolean[];
  /** Q6-15 index 0=a, 1=b, 2=c */
  hoerenTeil2: number[];
  /** Q16-25 index 0=a, 1=b, 2=c */
  hoerenTeil3: number[];
  /** Q26-30 letter match (e.g. 'A','F','G'...) */
  lesenTeil1: string[];
  /** Q31-35 letter match */
  lesenTeil2: string[];
  /** Q36-45 index 0=a, 1=b, 2=c */
  lesenTeil3: number[];
  /** Q46-55 index 0=a, 1=b, 2=c */
  sprachbausteineTeil1: number[];
  /** Q56-65 index 0=a, 1=b, 2=c */
  sprachbausteineTeil2: number[];
}

export interface ExamAnswers {
  hoeren: Record<number, number | boolean>;
  lesen: Record<number, number | string>;
  sprachbausteine: Record<number, number>;
  schreiben: {
    text: string;
    rubric: { aufgabenerfuellung: number; kohaerenz: number; wortschatz: number; grammatik: number };
  };
  sprechen: {
    rubric: { teil1: number; teil2: number; teil3: number };
  };
}

export interface ScoringResult {
  hoeren: { raw: number; maxRaw: number; scaled: number; maxScaled: number };
  lesen: { raw: number; maxRaw: number; scaled: number; maxScaled: number };
  sprachbausteine: { raw: number; maxRaw: number; scaled: number; maxScaled: number };
  schreiben: { score: number; max: number };
  sprechen: { score: number; max: number };
  writtenTotal: number;
  writtenMax: number;
  writtenPassed: boolean;
  oralTotal: number;
  oralMax: number;
  oralPassed: boolean;
  totalScore: number;
  totalMax: number;
  overallPassed: boolean;
  grade: string;
  wiederholung: string[];
}

export interface ExamRecord {
  examId: number;
  points: number;
  status: 'Bestanden' | 'Nicht bestanden';
  date: string;
}
