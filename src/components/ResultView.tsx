import type { ScoringResult } from '../types';

interface Props {
  result: ScoringResult;
  examTitle: string;
  onBack: () => void;
}

export default function ResultView({ result, examTitle, onBack }: Props) {
  const gradeColors: Record<string, string> = {
    'Sehr Gut': 'text-emerald-700 bg-emerald-50 border-emerald-200',
    'Gut': 'text-emerald-600 bg-emerald-50 border-emerald-200',
    'Befriedigend': 'text-amber-600 bg-amber-50 border-amber-200',
    'Ausreichend': 'text-amber-700 bg-amber-50 border-amber-200',
    'Nicht bestanden': 'text-red-600 bg-red-50 border-red-200',
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="a4-page px-4">
        {/* Grade Header */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Ergebnis</p>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mb-1">{examTitle}</h1>
          <div className={`inline-block mt-4 px-6 py-3 rounded-xl border-2 ${gradeColors[result.grade] || ''}`}>
            <p className="text-sm font-medium opacity-70 mb-1">
              {result.totalScore} / {result.totalMax} Punkte
            </p>
            <p className="text-3xl font-bold font-serif">{result.grade}</p>
          </div>
        </div>

        {/* Written exam status */}
        <div className="mb-8">
          <StatusCard
            title="Schriftliche Prüfung"
            score={result.writtenTotal}
            max={result.writtenMax}
            threshold={135}
            passed={result.writtenPassed}
          />
        </div>

        {/* Wiederholung warning */}
        {result.wiederholung.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-sm font-semibold text-red-700 mb-1">Wiederholung erforderlich</p>
            <ul className="space-y-1">
              {result.wiederholung.map(w => (
                <li key={w} className="text-sm text-red-600">• {w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden mb-8">
          <div className="px-5 py-3 bg-stone-50 border-b border-stone-200">
            <h3 className="text-sm font-semibold text-stone-700">Detaillierte Auswertung</h3>
          </div>
          <div className="divide-y divide-stone-100">
            <ScoreRow
              label="Leseverstehen"
              raw={result.lv.raw}
              maxRaw={result.lv.maxRaw}
              scaled={result.lv.scaled}
              maxScaled={result.lv.maxScaled}
            />
            <ScoreRow
              label="Sprachbausteine"
              raw={result.sb.raw}
              maxRaw={result.sb.maxRaw}
              scaled={result.sb.scaled}
              maxScaled={result.sb.maxScaled}
            />
            <ScoreRow
              label="Hörverstehen"
              raw={result.hv.raw}
              maxRaw={result.hv.maxRaw}
              scaled={result.hv.scaled}
              maxScaled={result.hv.maxScaled}
            />
            <div className="px-5 py-3 flex items-center justify-between">
              <span className="text-sm text-stone-700">Schriftlicher Ausdruck</span>
              <div className="text-right">
                <span className="text-sm font-mono font-semibold text-stone-800">
                  {result.schreiben.score} / {result.schreiben.max}
                </span>
              </div>
            </div>
            <div className="px-5 py-3 flex items-center justify-between bg-emerald-50">
              <span className="text-sm font-bold text-stone-900">Gesamtergebnis</span>
              <span className={`text-lg font-mono font-bold ${
                result.overallPassed ? 'text-emerald-700' : 'text-red-600'
              }`}>
                {result.totalScore} / {result.totalMax}
              </span>
            </div>
          </div>
        </div>

        {/* Grade Scale */}
        <div className="bg-white rounded-xl border border-stone-200 p-5 mb-8">
          <h3 className="text-sm font-semibold text-stone-700 mb-3">Notenskala (schriftlich / 225)</h3>
          <div className="space-y-1.5">
            {[
              { range: '≥ 203 (90%)', grade: 'Sehr Gut', color: 'bg-emerald-500' },
              { range: '≥ 180 (80%)', grade: 'Gut', color: 'bg-emerald-400' },
              { range: '≥ 158 (70%)', grade: 'Befriedigend', color: 'bg-amber-400' },
              { range: '≥ 135 (60%)', grade: 'Ausreichend', color: 'bg-amber-500' },
              { range: '< 135', grade: 'Nicht bestanden', color: 'bg-red-400' },
            ].map(item => (
              <div
                key={item.grade}
                className={`flex items-center justify-between px-3 py-2 rounded-md text-sm ${
                  item.grade === result.grade ? 'ring-2 ring-emerald-500 bg-stone-50 font-semibold' : 'text-stone-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span>{item.grade}</span>
                </div>
                <span className="font-mono text-xs">{item.range}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-stone-400 mb-6">
          Ohne mündliche Prüfung (75 Pkt). Bewertung basiert auf dem schriftlichen Teil (225 Pkt).
        </p>

        {/* Back button */}
        <div className="text-center pb-8">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-stone-800 text-white font-medium rounded-lg hover:bg-stone-900 transition-colors"
          >
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, score, max, threshold, passed }: {
  title: string; score: number; max: number; threshold: number; passed: boolean;
}) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;
  return (
    <div className={`rounded-xl border-2 p-4 ${
      passed ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
    }`}>
      <p className="text-xs text-stone-500 mb-1">{title}</p>
      <p className={`text-2xl font-bold font-mono ${passed ? 'text-emerald-700' : 'text-red-600'}`}>
        {score} / {max}
      </p>
      <div className="mt-2 h-1.5 bg-white/60 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${passed ? 'bg-emerald-500' : 'bg-red-400'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[10px] mt-1 text-stone-400">
        {pct}% — Mindestens {threshold} ({Math.round((threshold / max) * 100)}%) zum Bestehen
      </p>
      <p className={`text-xs font-semibold mt-1 ${passed ? 'text-emerald-600' : 'text-red-500'}`}>
        {passed ? '✓ Bestanden' : '✗ Nicht bestanden'}
      </p>
    </div>
  );
}

function ScoreRow({ label, raw, maxRaw, scaled, maxScaled }: {
  label: string; raw: number; maxRaw: number; scaled: number; maxScaled: number;
}) {
  return (
    <div className="px-5 py-3 flex items-center justify-between">
      <span className="text-sm text-stone-700">{label}</span>
      <div className="text-right">
        <span className="text-sm font-mono font-semibold text-stone-800">
          {scaled} / {maxScaled}
        </span>
        <span className="text-[10px] text-stone-400 ml-2">
          ({raw}/{maxRaw} richtig)
        </span>
      </div>
    </div>
  );
}
