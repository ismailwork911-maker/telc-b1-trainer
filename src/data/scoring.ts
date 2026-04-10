import type { ExamAnswerKey, ExamAnswers, ScoringResult } from '../types';

/**
 * Telc B1 Scoring Engine
 *
 * Written Section (225 pts):
 *   - Hören:            25 Q × 5 raw = 125 raw → scaled to 75 pts
 *   - Lesen:            20 Q × 5 raw = 100 raw → scaled to 75 pts
 *   - Sprachbausteine:  20 Q × 5 raw = 100 raw → scaled to 30 pts
 *   - Schreiben:        rubric-graded, 45 pts max
 *   Written pass: ≥ 135 pts (60%)
 *
 * Oral Section (75 pts):
 *   - Sprechen: rubric-graded, 75 pts max
 *   Oral pass: ≥ 45 pts (60%)
 *
 * Total: 300 pts
 */

export function calculateScore(key: ExamAnswerKey, answers: ExamAnswers): ScoringResult {
  // ── Hören (125 raw → 75 scaled) ──
  let hoerenRaw = 0;
  const hoerenMaxRaw = 125;
  // Teil 1: Q1-5 R/F
  key.hoerenTeil1.forEach((correct, i) => {
    if (answers.hoeren[i + 1] === correct) hoerenRaw += 5;
  });
  // Teil 2: Q6-15
  key.hoerenTeil2.forEach((correct, i) => {
    if (answers.hoeren[i + 6] === correct) hoerenRaw += 5;
  });
  // Teil 3: Q16-25
  key.hoerenTeil3.forEach((correct, i) => {
    if (answers.hoeren[i + 16] === correct) hoerenRaw += 5;
  });
  const hoerenScaled = Math.round((hoerenRaw / hoerenMaxRaw) * 75);

  // ── Lesen (100 raw → 75 scaled) ──
  let lesenRaw = 0;
  const lesenMaxRaw = 100;
  // Teil 1: Q26-30 letter match
  key.lesenTeil1.forEach((correct, i) => {
    if (answers.lesen[i + 26] === correct) lesenRaw += 5;
  });
  // Teil 2: Q31-35 letter match
  key.lesenTeil2.forEach((correct, i) => {
    if (answers.lesen[i + 31] === correct) lesenRaw += 5;
  });
  // Teil 3: Q36-45 MC
  key.lesenTeil3.forEach((correct, i) => {
    if (answers.lesen[i + 36] === correct) lesenRaw += 5;
  });
  const lesenScaled = Math.round((lesenRaw / lesenMaxRaw) * 75);

  // ── Sprachbausteine (100 raw → 30 scaled) ──
  let sbRaw = 0;
  const sbMaxRaw = 100;
  key.sprachbausteineTeil1.forEach((correct, i) => {
    if (answers.sprachbausteine[i + 46] === correct) sbRaw += 5;
  });
  key.sprachbausteineTeil2.forEach((correct, i) => {
    if (answers.sprachbausteine[i + 56] === correct) sbRaw += 5;
  });
  const sbScaled = Math.round((sbRaw / sbMaxRaw) * 30);

  // ── Schreiben (45 pts max) ──
  const schreibenScore = Math.min(
    45,
    (answers.schreiben.rubric.aufgabenerfuellung || 0) +
    (answers.schreiben.rubric.kohaerenz || 0) +
    (answers.schreiben.rubric.wortschatz || 0) +
    (answers.schreiben.rubric.grammatik || 0)
  );

  // ── Written total ──
  const writtenTotal = hoerenScaled + lesenScaled + sbScaled + schreibenScore;
  const writtenMax = 225;
  const writtenPassed = writtenTotal >= 135;

  // ── Sprechen (75 pts max) ──
  const sprechenScore = Math.min(
    75,
    (answers.sprechen.rubric.teil1 || 0) +
    (answers.sprechen.rubric.teil2 || 0) +
    (answers.sprechen.rubric.teil3 || 0)
  );
  const oralPassed = sprechenScore >= 45;

  const totalScore = writtenTotal + sprechenScore;
  const overallPassed = writtenPassed && oralPassed;

  let grade: string;
  if (!overallPassed) grade = 'Nicht bestanden';
  else if (totalScore >= 270) grade = 'Sehr Gut';
  else if (totalScore >= 240) grade = 'Gut';
  else if (totalScore >= 210) grade = 'Befriedigend';
  else grade = 'Ausreichend';

  const wiederholung: string[] = [];
  if (!writtenPassed) wiederholung.push('Schriftliche Prüfung');
  if (!oralPassed) wiederholung.push('Mündliche Prüfung');

  return {
    hoeren: { raw: hoerenRaw, maxRaw: hoerenMaxRaw, scaled: hoerenScaled, maxScaled: 75 },
    lesen: { raw: lesenRaw, maxRaw: lesenMaxRaw, scaled: lesenScaled, maxScaled: 75 },
    sprachbausteine: { raw: sbRaw, maxRaw: sbMaxRaw, scaled: sbScaled, maxScaled: 30 },
    schreiben: { score: schreibenScore, max: 45 },
    sprechen: { score: sprechenScore, max: 75 },
    writtenTotal, writtenMax, writtenPassed,
    oralTotal: sprechenScore, oralMax: 75, oralPassed,
    totalScore, totalMax: 300, overallPassed, grade, wiederholung,
  };
}
