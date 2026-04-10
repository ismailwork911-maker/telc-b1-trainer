import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExam } from '../data/exams';
import { calculateScore } from '../data/scoring';
import type { ExamAnswers, ExamRecord, ScoringResult } from '../types';
import StickyHeader from './StickyHeader';
import StickyFooter from './StickyFooter';
import ResultView from './ResultView';

type Phase = 'hoeren' | 'lesen' | 'sprachbausteine' | 'schreiben' | 'sprechen' | 'result';

const SECTION_TIMES: Record<string, number> = {
  hoeren: 30 * 60,
  lesen: 45 * 60,
  sprachbausteine: 20 * 60,
  schreiben: 30 * 60,
  sprechen: 20 * 60,
};

const PHASE_LABELS: Record<string, string> = {
  hoeren: 'Hören',
  lesen: 'Lesen',
  sprachbausteine: 'Sprachbausteine',
  schreiben: 'Schreiben',
  sprechen: 'Sprechen',
};

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export default function ListeningModule() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const exam = getExam(Number(examId));

  const [phase, setPhase] = useState<Phase>('hoeren');
  const [hoerenAnswers, setHoerenAnswers] = useState<Record<number, number | boolean>>({});
  const [lesenAnswers, setLesenAnswers] = useState<Record<number, number | string>>({});
  const [sbAnswers, setSbAnswers] = useState<Record<number, number>>({});
  const [schreibenText, setSchreibenText] = useState('');
  const [schreibenRubric, setSchreibenRubric] = useState({ aufgabenerfuellung: 0, kohaerenz: 0, wortschatz: 0, grammatik: 0 });
  const [sprechenRubric, setSprechenRubric] = useState({ teil1: 0, teil2: 0, teil3: 0 });
  const [result, setResult] = useState<ScoringResult | null>(null);

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-stone-800 mb-2">Prüfung nicht gefunden</h2>
          <button onClick={() => navigate('/')} className="text-emerald-600 hover:underline">
            Zurück zur Übersicht
          </button>
        </div>
      </div>
    );
  }

  const totalQForPhase = useMemo(() => {
    switch (phase) {
      case 'hoeren': return 25;
      case 'lesen': return 20;
      case 'sprachbausteine': return 20;
      case 'schreiben': return 1;
      case 'sprechen': return 3;
      default: return 0;
    }
  }, [phase]);

  const answeredForPhase = useMemo(() => {
    switch (phase) {
      case 'hoeren': return Object.keys(hoerenAnswers).length;
      case 'lesen': return Object.keys(lesenAnswers).length;
      case 'sprachbausteine': return Object.keys(sbAnswers).length;
      case 'schreiben': return schreibenText.length > 0 ? 1 : 0;
      case 'sprechen': {
        let c = 0;
        if (sprechenRubric.teil1 > 0) c++;
        if (sprechenRubric.teil2 > 0) c++;
        if (sprechenRubric.teil3 > 0) c++;
        return c;
      }
      default: return 0;
    }
  }, [phase, hoerenAnswers, lesenAnswers, sbAnswers, schreibenText, sprechenRubric]);

  const phases: Phase[] = ['hoeren', 'lesen', 'sprachbausteine', 'schreiben', 'sprechen'];
  const currentIdx = phases.indexOf(phase);

  function goNext() {
    if (currentIdx < phases.length - 1) {
      setPhase(phases[currentIdx + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  function goPrev() {
    if (currentIdx > 0) {
      setPhase(phases[currentIdx - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleSubmit() {
    const answers: ExamAnswers = {
      hoeren: hoerenAnswers,
      lesen: lesenAnswers,
      sprachbausteine: sbAnswers,
      schreiben: { text: schreibenText, rubric: schreibenRubric },
      sprechen: { rubric: sprechenRubric },
    };
    const scoring = calculateScore(exam!, answers);
    setResult(scoring);
    setPhase('result');

    const record: ExamRecord = {
      examId: exam!.id,
      points: scoring.totalScore,
      status: scoring.overallPassed ? 'Bestanden' : 'Nicht bestanden',
      date: new Date().toISOString(),
    };
    const stored = localStorage.getItem('telc-b1-records');
    const records = stored ? JSON.parse(stored) : {};
    records[exam!.id] = record;
    localStorage.setItem('telc-b1-records', JSON.stringify(records));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (phase === 'result' && result) {
    return <ResultView result={result} examTitle={exam!.title} onBack={() => navigate('/')} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <StickyHeader
        totalSeconds={SECTION_TIMES[phase] || 1800}
        answeredCount={answeredForPhase}
        totalQuestions={totalQForPhase}
      />

      {/* Phase tabs */}
      <div className="a4-page px-4 pt-4">
        <div className="flex gap-1 mb-6 overflow-x-auto">
          {phases.map((p, i) => (
            <button
              key={p}
              onClick={() => { setPhase(p); window.scrollTo({ top: 0 }); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                p === phase
                  ? 'bg-emerald-600 text-white'
                  : i < currentIdx
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {PHASE_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      <div className="a4-page px-4">
        {/* ━━━ HÖREN ━━━ */}
        {phase === 'hoeren' && (
          <div className="space-y-6">
            {/* Teil 1: R/F */}
            <AnswerSheetSection title="Hören — Teil 1" subtitle="Richtig / Falsch" qRange={[1, 5]}>
              {[1, 2, 3, 4, 5].map(q => (
                <RFRow key={q} num={q} selected={hoerenAnswers[q] as boolean | undefined}
                  onSelect={v => setHoerenAnswers(prev => ({ ...prev, [q]: v }))} />
              ))}
            </AnswerSheetSection>

            {/* Teil 2: a/b/c */}
            <AnswerSheetSection title="Hören — Teil 2" subtitle="a / b / c" qRange={[6, 15]}>
              {Array.from({ length: 10 }, (_, i) => i + 6).map(q => (
                <ABCRow key={q} num={q} selected={hoerenAnswers[q] as number | undefined}
                  onSelect={v => setHoerenAnswers(prev => ({ ...prev, [q]: v }))} />
              ))}
            </AnswerSheetSection>

            {/* Teil 3: a/b/c */}
            <AnswerSheetSection title="Hören — Teil 3" subtitle="a / b / c" qRange={[16, 25]}>
              {Array.from({ length: 10 }, (_, i) => i + 16).map(q => (
                <ABCRow key={q} num={q} selected={hoerenAnswers[q] as number | undefined}
                  onSelect={v => setHoerenAnswers(prev => ({ ...prev, [q]: v }))} />
              ))}
            </AnswerSheetSection>
          </div>
        )}

        {/* ━━━ LESEN ━━━ */}
        {phase === 'lesen' && (
          <div className="space-y-6">
            {/* Teil 1: Letter match A-H */}
            <AnswerSheetSection title="Lesen — Teil 1" subtitle="Zuordnung A – H" qRange={[26, 30]}>
              {[26, 27, 28, 29, 30].map(q => (
                <LetterRow key={q} num={q} letters={LETTERS.slice(0, 8)}
                  selected={lesenAnswers[q] as string | undefined}
                  onSelect={v => setLesenAnswers(prev => ({ ...prev, [q]: v }))} />
              ))}
            </AnswerSheetSection>

            {/* Teil 2: Letter match A-H */}
            <AnswerSheetSection title="Lesen — Teil 2" subtitle="Zuordnung A – H" qRange={[31, 35]}>
              {[31, 32, 33, 34, 35].map(q => (
                <LetterRow key={q} num={q} letters={LETTERS.slice(0, 8)}
                  selected={lesenAnswers[q] as string | undefined}
                  onSelect={v => setLesenAnswers(prev => ({ ...prev, [q]: v }))} />
              ))}
            </AnswerSheetSection>

            {/* Teil 3: a/b/c */}
            <AnswerSheetSection title="Lesen — Teil 3" subtitle="a / b / c" qRange={[36, 45]}>
              {Array.from({ length: 10 }, (_, i) => i + 36).map(q => (
                <ABCRow key={q} num={q} selected={lesenAnswers[q] as number | undefined}
                  onSelect={v => setLesenAnswers(prev => ({ ...prev, [q]: v }))} />
              ))}
            </AnswerSheetSection>
          </div>
        )}

        {/* ━━━ SPRACHBAUSTEINE ━━━ */}
        {phase === 'sprachbausteine' && (
          <div className="space-y-6">
            <AnswerSheetSection title="Sprachbausteine — Teil 1" subtitle="a / b / c" qRange={[46, 55]}>
              {Array.from({ length: 10 }, (_, i) => i + 46).map(q => (
                <ABCRow key={q} num={q} selected={sbAnswers[q]}
                  onSelect={v => setSbAnswers(prev => ({ ...prev, [q]: v }))} />
              ))}
            </AnswerSheetSection>

            <AnswerSheetSection title="Sprachbausteine — Teil 2" subtitle="a / b / c" qRange={[56, 65]}>
              {Array.from({ length: 10 }, (_, i) => i + 56).map(q => (
                <ABCRow key={q} num={q} selected={sbAnswers[q]}
                  onSelect={v => setSbAnswers(prev => ({ ...prev, [q]: v }))} />
              ))}
            </AnswerSheetSection>
          </div>
        )}

        {/* ━━━ SCHREIBEN ━━━ */}
        {phase === 'schreiben' && (
          <SchreibenSection text={schreibenText} setText={setSchreibenText}
            rubric={schreibenRubric} setRubric={setSchreibenRubric} />
        )}

        {/* ━━━ SPRECHEN ━━━ */}
        {phase === 'sprechen' && (
          <SprechenSection rubric={sprechenRubric} setRubric={setSprechenRubric} />
        )}

        {/* Nav */}
        <div className="flex justify-between mt-8 mb-4">
          <button onClick={goPrev} disabled={currentIdx === 0}
            className="px-4 py-2 text-sm font-medium text-stone-600 bg-stone-100 rounded-lg
                       hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            ← Zurück
          </button>
          {currentIdx < phases.length - 1 && (
            <button onClick={goNext}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg
                         hover:bg-emerald-700 transition-colors">
              Weiter →
            </button>
          )}
        </div>
      </div>

      <StickyFooter
        answeredCount={
          Object.keys(hoerenAnswers).length +
          Object.keys(lesenAnswers).length +
          Object.keys(sbAnswers).length +
          (schreibenText.length > 0 ? 1 : 0) +
          (sprechenRubric.teil1 > 0 ? 1 : 0) +
          (sprechenRubric.teil2 > 0 ? 1 : 0) +
          (sprechenRubric.teil3 > 0 ? 1 : 0)
        }
        totalQuestions={69}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANSWER SHEET COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function AnswerSheetSection({ title, subtitle, qRange, children }: {
  title: string; subtitle: string; qRange: [number, number]; children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-5 py-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-base font-bold text-stone-900">{title}</h2>
          <p className="text-[10px] text-stone-400 mt-0.5">Fragen {qRange[0]}–{qRange[1]} · {subtitle}</p>
        </div>
        <span className="text-xs font-mono text-stone-400 bg-stone-100 px-2 py-0.5 rounded">
          je 5 Pkt
        </span>
      </div>
      <div className="divide-y divide-stone-100">
        {children}
      </div>
    </section>
  );
}

/** Richtig / Falsch bubble row */
function RFRow({ num, selected, onSelect }: {
  num: number; selected: boolean | undefined; onSelect: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center px-5 py-2.5 gap-4">
      <span className="w-8 text-sm font-bold text-stone-500 tabular-nums text-right">{num}</span>
      <div className="flex gap-2">
        <Bubble label="R" active={selected === true} onClick={() => onSelect(true)} />
        <Bubble label="F" active={selected === false} onClick={() => onSelect(false)} />
      </div>
    </div>
  );
}

/** a / b / c bubble row */
function ABCRow({ num, selected, onSelect }: {
  num: number; selected: number | undefined; onSelect: (v: number) => void;
}) {
  return (
    <div className="flex items-center px-5 py-2.5 gap-4">
      <span className="w-8 text-sm font-bold text-stone-500 tabular-nums text-right">{num}</span>
      <div className="flex gap-2">
        {['a', 'b', 'c'].map((label, idx) => (
          <Bubble key={label} label={label} active={selected === idx} onClick={() => onSelect(idx)} />
        ))}
      </div>
    </div>
  );
}

/** Letter match row (A-H) */
function LetterRow({ num, letters, selected, onSelect }: {
  num: number; letters: string[]; selected: string | undefined; onSelect: (v: string) => void;
}) {
  return (
    <div className="flex items-center px-5 py-2.5 gap-4">
      <span className="w-8 text-sm font-bold text-stone-500 tabular-nums text-right">{num}</span>
      <div className="flex gap-1.5 flex-wrap">
        {letters.map(l => (
          <Bubble key={l} label={l} active={selected === l} onClick={() => onSelect(l)} small />
        ))}
      </div>
    </div>
  );
}

/** Single answer bubble */
function Bubble({ label, active, onClick, small }: {
  label: string; active: boolean; onClick: () => void; small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`${small ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'} rounded-full font-semibold
        border-2 transition-all duration-150 select-none
        ${active
          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm scale-110'
          : 'bg-white text-stone-500 border-stone-200 hover:border-stone-400 hover:text-stone-700'
        }`}
    >
      {label}
    </button>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCHREIBEN (kept: editor + rubric)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SchreibenSection({ text, setText, rubric, setRubric }: {
  text: string; setText: (t: string) => void;
  rubric: { aufgabenerfuellung: number; kohaerenz: number; wortschatz: number; grammatik: number };
  setRubric: React.Dispatch<React.SetStateAction<typeof rubric>>;
}) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const rubricItems = [
    { key: 'aufgabenerfuellung' as const, label: 'I. Aufgabenerfüllung', max: 15, desc: 'Inhaltliche Vollständigkeit' },
    { key: 'kohaerenz' as const, label: 'II. Kohärenz', max: 10, desc: 'Textaufbau, Verknüpfungen' },
    { key: 'wortschatz' as const, label: 'III. Wortschatz', max: 10, desc: 'Angemessener Wortgebrauch' },
    { key: 'grammatik' as const, label: 'IV. Grammatik', max: 10, desc: 'Korrekte Strukturen' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-bold text-stone-900">Schreiben</h2>
        <p className="text-sm text-stone-500 mt-1">Brief schreiben · max. 45 Punkte</p>
      </div>

      <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 text-sm text-amber-800">
        Schreiben Sie den Brief wie in Ihrem Prüfungsbuch angegeben.
      </div>

      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder="Schreiben Sie Ihren Brief hier..."
        className="w-full h-64 p-4 font-serif text-sm leading-relaxed bg-white border border-stone-200
                   rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500" />
      <p className="text-xs text-stone-400 text-right -mt-4">{wordCount} Wörter</p>

      <div className="bg-white rounded-lg border border-stone-200 p-5">
        <h3 className="text-sm font-semibold text-stone-700 mb-3">Bewertungsraster</h3>
        <div className="space-y-4">
          {rubricItems.map(item => (
            <div key={item.key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-stone-700">{item.label}</label>
                <span className="text-sm font-mono text-stone-500">{rubric[item.key]} / {item.max}</span>
              </div>
              <p className="text-[10px] text-stone-400 mb-1.5">{item.desc}</p>
              <input type="range" min={0} max={item.max} step={1} value={rubric[item.key]}
                onChange={e => setRubric(prev => ({ ...prev, [item.key]: Number(e.target.value) }))}
                className="w-full accent-emerald-600" />
            </div>
          ))}
          <div className="pt-3 border-t border-stone-100 flex justify-between">
            <span className="text-sm font-semibold text-stone-700">Gesamt</span>
            <span className="text-sm font-mono font-bold text-emerald-600">
              {rubric.aufgabenerfuellung + rubric.kohaerenz + rubric.wortschatz + rubric.grammatik} / 45
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPRECHEN (kept: timer + rubric)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SprechenSection({ rubric, setRubric }: {
  rubric: { teil1: number; teil2: number; teil3: number };
  setRubric: React.Dispatch<React.SetStateAction<typeof rubric>>;
}) {
  const [prepTimer, setPrepTimer] = useState(20 * 60);
  const [prepRunning, setPrepRunning] = useState(false);

  useState(() => {
    if (!prepRunning) return;
    const iv = setInterval(() => {
      setPrepTimer(prev => { if (prev <= 1) { setPrepRunning(false); return 0; } return prev - 1; });
    }, 1000);
    return () => clearInterval(iv);
  });

  const parts = [
    { key: 'teil1' as const, label: 'Teil 1 – Kontaktaufnahme', max: 25 },
    { key: 'teil2' as const, label: 'Teil 2 – Gespräch über ein Thema', max: 25 },
    { key: 'teil3' as const, label: 'Teil 3 – Gemeinsam planen', max: 25 },
  ];
  const m = Math.floor(prepTimer / 60), s = prepTimer % 60;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-bold text-stone-900">Sprechen</h2>
        <p className="text-sm text-stone-500 mt-1">Mündliche Prüfung · max. 75 Punkte</p>
      </div>

      <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-amber-800">Vorbereitungszeit</p>
          <p className="text-xs text-amber-600">20 Minuten</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl font-bold text-amber-700">
            {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
          </span>
          <button onClick={() => setPrepRunning(!prepRunning)}
            className="px-3 py-1.5 text-xs font-medium bg-amber-200 text-amber-800 rounded-md hover:bg-amber-300">
            {prepRunning ? '⏸ Pause' : '▶ Start'}
          </button>
        </div>
      </div>

      {parts.map(part => (
        <div key={part.key} className="bg-white rounded-lg border border-stone-200 p-5">
          <h3 className="font-serif text-base font-bold text-stone-800 mb-3">{part.label}</h3>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-stone-600">Bewertung</label>
            <span className="text-sm font-mono text-stone-500">{rubric[part.key]} / {part.max}</span>
          </div>
          <input type="range" min={0} max={part.max} step={1} value={rubric[part.key]}
            onChange={e => setRubric(prev => ({ ...prev, [part.key]: Number(e.target.value) }))}
            className="w-full accent-emerald-600" />
        </div>
      ))}
    </div>
  );
}
