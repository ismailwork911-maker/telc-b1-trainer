import type { ExamData, ExamAnswers, ScoringResult } from '../types';

/**
 * Telc B1 Scoring Engine
 *
 * Written Section (225 pts):
 *   - Hören:            25 Q × 5 raw = 125 raw → scaled to 75 pts (factor 0.6)
 *   - Lesen:            20 Q → scaled to 75 pts
 *   - Sprachbausteine:  20 Q → scaled to 30 pts
 *   - Schreiben:        rubric-graded, 45 pts max
 *   Written pass: ≥ 135 pts (60%)
 *
 * Oral Section (75 pts):
 *   - Sprechen: rubric-graded, 75 pts max
 *   Oral pass: ≥ 45 pts (60%)
 *
 * Total: 300 pts
 */

export function calculateScore(exam: ExamData, answers: ExamAnswers): ScoringResult {
  // ── Hören (125 raw → 75 scaled) ──
  let hoerenRaw = 0;
  const hoerenMaxRaw = 125; // 25 × 5
  // Teil 1: Richtig/Falsch
  for (const q of exam.hoeren.teil1.questions) {
    const ans = answers.hoeren[q.id];
    if (ans === q.correct) hoerenRaw += 5;
  }
  // Teil 2 + 3: Multiple choice
  for (const q of [...exam.hoeren.teil2.questions, ...exam.hoeren.teil3.questions]) {
    const ans = answers.hoeren[q.id];
    if (ans === q.correct) hoerenRaw += 5;
  }
  const hoerenScaled = Math.round((hoerenRaw / hoerenMaxRaw) * 75);

  // ── Lesen (scaled to 75 pts) ──
  let lesenRaw = 0;
  let lesenMaxRaw = 0;
  // Teil 1: 5 matching questions
  for (const q of exam.lesen.teil1.questions) {
    lesenMaxRaw += 5;
    if (answers.lesen[q.id] === q.correct) lesenRaw += 5;
  }
  // Teil 2: 5 matching questions
  for (const s of exam.lesen.teil2.situations) {
    lesenMaxRaw += 5;
    if (answers.lesen[s.id] === s.correct) lesenRaw += 5;
  }
  // Teil 3: 10 MC questions
  for (const q of exam.lesen.teil3.questions) {
    lesenMaxRaw += 5;
    if (answers.lesen[q.id] === q.correct) lesenRaw += 5;
  }
  const lesenScaled = lesenMaxRaw > 0 ? Math.round((lesenRaw / lesenMaxRaw) * 75) : 0;

  // ── Sprachbausteine (scaled to 30 pts) ──
  let sbRaw = 0;
  let sbMaxRaw = 0;
  for (const q of [...exam.sprachbausteine.teil1.questions, ...exam.sprachbausteine.teil2.questions]) {
    sbMaxRaw += 5;
    if (answers.sprachbausteine[q.id] === q.correct) sbRaw += 5;
  }
  const sbScaled = sbMaxRaw > 0 ? Math.round((sbRaw / sbMaxRaw) * 30) : 0;

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

  // ── Total ──
  const totalScore = writtenTotal + sprechenScore;
  const overallPassed = writtenPassed && oralPassed;

  // ── Grade ──
  let grade: string;
  if (!overallPassed) {
    grade = 'Nicht bestanden';
  } else if (totalScore >= 270) {
    grade = 'Sehr Gut';
  } else if (totalScore >= 240) {
    grade = 'Gut';
  } else if (totalScore >= 210) {
    grade = 'Befriedigend';
  } else {
    grade = 'Ausreichend';
  }

  // ── Wiederholung ──
  const wiederholung: string[] = [];
  if (!writtenPassed) wiederholung.push('Schriftliche Prüfung');
  if (!oralPassed) wiederholung.push('Mündliche Prüfung');

  return {
    hoeren: { raw: hoerenRaw, maxRaw: hoerenMaxRaw, scaled: hoerenScaled, maxScaled: 75 },
    lesen: { raw: lesenRaw, maxRaw: lesenMaxRaw, scaled: lesenScaled, maxScaled: 75 },
    sprachbausteine: { raw: sbRaw, maxRaw: sbMaxRaw, scaled: sbScaled, maxScaled: 30 },
    schreiben: { score: schreibenScore, max: 45 },
    sprechen: { score: sprechenScore, max: 75 },
    writtenTotal,
    writtenMax,
    writtenPassed,
    oralTotal: sprechenScore,
    oralMax: 75,
    oralPassed,
    totalScore,
    totalMax: 300,
    overallPassed,
    grade,
    wiederholung,
  };
}
