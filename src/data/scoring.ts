import type { ExamAnswerKey, ExamAnswers, ScoringResult, SectionScore } from '../types';
import { getCorrectAnswer } from './exams';

// Points per section (from Übersicht zur Prüfung Zertifikat Deutsch):
//   LV Teil 1: 5 items × 5 pts = 25
//   LV Teil 2: 5 items × 5 pts = 25
//   LV Teil 3: 10 items × 2.5 pts = 25
//   SB Teil 1: 10 items × 1.5 pts = 15
//   SB Teil 2: 10 items × 1.5 pts = 15
//   HV Teil 1: 5 items × 5 pts = 25
//   HV Teil 2: 10 items × 2.5 pts = 25
//   HV Teil 3: 5 items × 5 pts = 25
//   Schreiben: 45 pts (self-assessed rubric)
//   Written total: 225 pts — pass: 135 (60%)

function countCorrect(exam: ExamAnswerKey, answers: Record<number, string>, start: number, end: number): number {
  let correct = 0;
  for (let q = start; q <= end; q++) {
    if (answers[q] && answers[q] === getCorrectAnswer(exam, q)) correct++;
  }
  return correct;
}

export function calculateScore(exam: ExamAnswerKey, userAnswers: ExamAnswers): ScoringResult {
  const a = userAnswers.answers;

  // LV: 75 pts
  const lvT1 = countCorrect(exam, a, 1, 5);
  const lvT2 = countCorrect(exam, a, 6, 10);
  const lvT3 = countCorrect(exam, a, 11, 20);
  const lvScaled = lvT1 * 5 + lvT2 * 5 + lvT3 * 2.5;
  const lv: SectionScore = { raw: lvT1 + lvT2 + lvT3, maxRaw: 20, scaled: lvScaled, maxScaled: 75 };

  // SB: 30 pts
  const sbT1 = countCorrect(exam, a, 21, 30);
  const sbT2 = countCorrect(exam, a, 31, 40);
  const sbScaled = sbT1 * 1.5 + sbT2 * 1.5;
  const sb: SectionScore = { raw: sbT1 + sbT2, maxRaw: 20, scaled: sbScaled, maxScaled: 30 };

  // HV: 75 pts
  const hvT1 = countCorrect(exam, a, 41, 45);
  const hvT2 = countCorrect(exam, a, 46, 55);
  const hvT3 = countCorrect(exam, a, 56, 60);
  const hvScaled = hvT1 * 5 + hvT2 * 2.5 + hvT3 * 5;
  const hv: SectionScore = { raw: hvT1 + hvT2 + hvT3, maxRaw: 20, scaled: hvScaled, maxScaled: 75 };

  // Schreiben: 45 pts
  const r = userAnswers.schreiben.rubric;
  const schreibenScore = r.aufgabenerfuellung + r.kohaerenz + r.wortschatz + r.grammatik;
  const schreiben = { score: schreibenScore, max: 45 };

  // Written total
  const writtenTotal = Math.round(lv.scaled + sb.scaled + hv.scaled + schreibenScore);
  const writtenMax = 225;
  const writtenPassed = writtenTotal >= 135;

  // Grade (based on percentage of 225)
  const pct = writtenTotal / writtenMax;
  let grade: string;
  if (pct >= 0.9) grade = 'Sehr Gut';
  else if (pct >= 0.8) grade = 'Gut';
  else if (pct >= 0.7) grade = 'Befriedigend';
  else if (pct >= 0.6) grade = 'Ausreichend';
  else grade = 'Nicht bestanden';

  // Wiederholung warnings
  const wiederholung: string[] = [];
  if (lv.scaled < 75 * 0.6) wiederholung.push('Leseverstehen unter 60%');
  if (hv.scaled < 75 * 0.6) wiederholung.push('Hörverstehen unter 60%');
  if (!writtenPassed) wiederholung.push('Schriftliche Prüfung nicht bestanden (< 135 Punkte)');

  return {
    lv, sb, hv, schreiben,
    writtenTotal, writtenMax, writtenPassed,
    totalScore: writtenTotal,
    totalMax: writtenMax,
    grade,
    overallPassed: writtenPassed,
    wiederholung,
  };
}
