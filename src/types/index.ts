// ── Telc B1 Exam Types ──

export interface MCQuestion {
  id: number;
  text: string;
  context?: string;
  options: string[];
  correct: number; // index into options
}

export interface RFQuestion {
  id: number;
  text: string;
  context?: string;
  correct: boolean; // richtig = true, falsch = false
}

export interface WritingTask {
  prompt: string;
  type: 'informal' | 'formal';
  bulletPoints: string[];
}

export interface SpeakingPart {
  part: number;
  title: string;
  description: string;
  prepTime: number; // seconds
}

export interface HoerenTeil1 {
  questions: RFQuestion[]; // 5 items, Q1-5
}

export interface HoerenTeil2 {
  questions: MCQuestion[]; // 10 items, Q6-15
}

export interface HoerenTeil3 {
  questions: MCQuestion[]; // 10 items, Q16-25
}

export interface LesenTeil1 {
  texts: { id: string; heading: string; content: string }[];
  questions: { id: number; text: string; correct: string }[]; // match to text id
}

export interface LesenTeil2 {
  situations: { id: number; text: string; correct: string }[];
  ads: { id: string; title: string; content: string }[];
}

export interface LesenTeil3 {
  passage: string;
  questions: MCQuestion[]; // 10 items
}

export interface SprachbausteineTeil1 {
  text: string; // cloze text with __{n}__ placeholders
  questions: MCQuestion[]; // 10 items
}

export interface SprachbausteineTeil2 {
  text: string;
  questions: MCQuestion[]; // 10 items
}

export interface ExamData {
  id: number;
  title: string;
  hoeren: { teil1: HoerenTeil1; teil2: HoerenTeil2; teil3: HoerenTeil3 };
  lesen: { teil1: LesenTeil1; teil2: LesenTeil2; teil3: LesenTeil3 };
  sprachbausteine: { teil1: SprachbausteineTeil1; teil2: SprachbausteineTeil2 };
  schreiben: WritingTask;
  sprechen: SpeakingPart[];
}

export interface ExamAnswers {
  hoeren: Record<number, number | boolean>; // questionId -> selected answer
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
