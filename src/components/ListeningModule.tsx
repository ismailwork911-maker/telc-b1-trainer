import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExam } from '../data/exams';
import { calculateScore } from '../data/scoring';
import type { ExamAnswers, ExamRecord, ScoringResult } from '../types';
import StickyHeader from './StickyHeader';
import StickyFooter from './StickyFooter';
import ResultView from './ResultView';

type Phase = 'lesen' | 'sprachbausteine' | 'hoeren' | 'schreiben' | 'result';

const SECTION_TIMES: Record<string, number> = {
  lesen: 70 * 60,
  sprachbausteine: 20 * 60,
  hoeren: 30 * 60,
  schreiben: 30 * 60,
};

const PHASE_LABELS: Record<string, string> = {
  lesen: 'Lesen',
  sprachbausteine: 'Sprachbausteine',
  hoeren: 'Hören',
  schreiben: 'Schreiben',
};

const LV1_LETTERS = ['A','B','C','D','E','F','G','H','I','J'];
const LV3_LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','X'];
const SB2_LETTERS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P'];

export default function ListeningModule() {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const exam = getExam(Number(examId));

  const [phase, setPhase] = useState<Phase>('lesen');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [schreibenText, setSchreibenText] = useState('');
  const [schreibenRubric, setSchreibenRubric] = useState({
    aufgabenerfuellung: 0, kohaerenz: 0, wortschatz: 0, grammatik: 0,
  });
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

  function setAnswer(q: number, v: string) {
    setAnswers(prev => ({ ...prev, [q]: v }));
  }

  const phaseQuestionCounts: Record<string, number> = {
    lesen: 20,
    sprachbausteine: 20,
    hoeren: 20,
    schreiben: 1,
  };

  const answeredForPhase = useMemo(() => {
    switch (phase) {
      case 'lesen': {
        let c = 0;
        for (let q = 1; q <= 20; q++) if (answers[q]) c++;
        return c;
      }
      case 'sprachbausteine': {
        let c = 0;
        for (let q = 21; q <= 40; q++) if (answers[q]) c++;
        return c;
      }
      case 'hoeren': {
        let c = 0;
        for (let q = 41; q <= 60; q++) if (answers[q]) c++;
        return c;
      }
      case 'schreiben': return schreibenText.length > 0 ? 1 : 0;
      default: return 0;
    }
  }, [phase, answers, schreibenText]);

  const totalAnswered = useMemo(() => {
    let c = 0;
    for (let q = 1; q <= 60; q++) if (answers[q]) c++;
    if (schreibenText.length > 0) c++;
    return c;
  }, [answers, schreibenText]);

  const phases: Phase[] = ['lesen', 'sprachbausteine', 'hoeren', 'schreiben'];
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
    const examAnswers: ExamAnswers = {
      answers,
      schreiben: { text: schreibenText, rubric: schreibenRubric },
    };
    const scoring = calculateScore(exam!, examAnswers);
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
        totalQuestions={phaseQuestionCounts[phase] || 0}
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
        {/* ━━━ LESEN ━━━ */}
        {phase === 'lesen' && (
          <div className="space-y-6">
            <AnswerSheetSection title="Leseverstehen — Teil 1" subtitle="Zuordnung A – J (Überschriften)" qRange={[1, 5]}>
              {[1,2,3,4,5].map(q => (
                <LetterRow key={q} num={q} letters={LV1_LETTERS} selected={answers[q]}
                  onSelect={v => setAnswer(q, v)} />
              ))}
            </AnswerSheetSection>

            <AnswerSheetSection title="Leseverstehen — Teil 2" subtitle="a / b / c" qRange={[6, 10]}>
              {[6,7,8,9,10].map(q => (
                <ABCRow key={q} num={q} selected={answers[q]}
                  onSelect={v => setAnswer(q, v)} />
              ))}
            </AnswerSheetSection>

            <AnswerSheetSection title="Leseverstehen — Teil 3" subtitle="Kleinanzeigen A – L / X = keine" qRange={[11, 20]}>
              {Array.from({ length: 10 }, (_, i) => i + 11).map(q => (
                <LetterRow key={q} num={q} letters={LV3_LETTERS} selected={answers[q]}
                  onSelect={v => setAnswer(q, v)} />
              ))}
            </AnswerSheetSection>
          </div>
        )}

        {/* ━━━ SPRACHBAUSTEINE ━━━ */}
        {phase === 'sprachbausteine' && (
          <div className="space-y-6">
            <AnswerSheetSection title="Sprachbausteine — Teil 1" subtitle="a / b / c" qRange={[21, 30]}>
              {Array.from({ length: 10 }, (_, i) => i + 21).map(q => (
                <ABCRow key={q} num={q} selected={answers[q]}
                  onSelect={v => setAnswer(q, v)} />
              ))}
            </AnswerSheetSection>

            <AnswerSheetSection title="Sprachbausteine — Teil 2" subtitle="Wortauswahl A – P" qRange={[31, 40]}>
              {Array.from({ length: 10 }, (_, i) => i + 31).map(q => (
                <LetterRow key={q} num={q} letters={SB2_LETTERS} selected={answers[q]}
                  onSelect={v => setAnswer(q, v)} />
              ))}
            </AnswerSheetSection>
          </div>
        )}

        {/* ━━━ HÖREN ━━━ */}
        {phase === 'hoeren' && (
          <div className="space-y-6">
            <AnswerSheetSection title="Hörverstehen — Teil 1" subtitle="Richtig / Falsch" qRange={[41, 45]}>
              {[41,42,43,44,45].map(q => (
                <RFRow key={q} num={q} selected={answers[q]}
                  onSelect={v => setAnswer(q, v)} />
              ))}
            </AnswerSheetSection>

            <AnswerSheetSection title="Hörverstehen — Teil 2" subtitle="Richtig / Falsch" qRange={[46, 55]}>
              {Array.from({ length: 10 }, (_, i) => i + 46).map(q => (
                <RFRow key={q} num={q} selected={answers[q]}
                  onSelect={v => setAnswer(q, v)} />
              ))}
            </AnswerSheetSection>

            <AnswerSheetSection title="Hörverstehen — Teil 3" subtitle="Richtig / Falsch" qRange={[56, 60]}>
              {[56,57,58,59,60].map(q => (
                <RFRow key={q} num={q} selected={answers[q]}
                  onSelect={v => setAnswer(q, v)} />
              ))}
            </AnswerSheetSection>
          </div>
        )}

        {/* ━━━ SCHREIBEN ━━━ */}
        {phase === 'schreiben' && (
          <SchreibenSection text={schreibenText} setText={setSchreibenText}
            rubric={schreibenRubric} setRubric={setSchreibenRubric} />
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
        answeredCount={totalAnswered}
        totalQuestions={61}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANSWER SHEET COMPONENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function AnswerSheetSection({ title, subtitle, qRange, children }: {
  title: string; subtitle: string; qRange: [number, number]; children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-xl border border-stone-200 overflow-hidden">
      <div className="px-5 py-3 bg-stone-50 border-b border-stone-200">
        <h2 className="font-serif text-base font-bold text-stone-900">{title}</h2>
        <p className="text-[10px] text-stone-400 mt-0.5">Fragen {qRange[0]}–{qRange[1]} · {subtitle}</p>
      </div>
      <div className="divide-y divide-stone-100">
        {children}
      </div>
    </section>
  );
}

function RFRow({ num, selected, onSelect }: {
  num: number; selected: string | undefined; onSelect: (v: string) => void;
}) {
  return (
    <div className="flex items-center px-5 py-2.5 gap-4">
      <span className="w-8 text-sm font-bold text-stone-500 tabular-nums text-right">{num}</span>
      <div className="flex gap-2">
        <Bubble label="R" active={selected === 'R'} onClick={() => onSelect('R')} />
        <Bubble label="F" active={selected === 'F'} onClick={() => onSelect('F')} />
      </div>
    </div>
  );
}

function ABCRow({ num, selected, onSelect }: {
  num: number; selected: string | undefined; onSelect: (v: string) => void;
}) {
  return (
    <div className="flex items-center px-5 py-2.5 gap-4">
      <span className="w-8 text-sm font-bold text-stone-500 tabular-nums text-right">{num}</span>
      <div className="flex gap-2">
        {['A','B','C'].map(l => (
          <Bubble key={l} label={l} active={selected === l} onClick={() => onSelect(l)} />
        ))}
      </div>
    </div>
  );
}

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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCHREIBEN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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
        <h2 className="font-serif text-xl font-bold text-stone-900">Schriftlicher Ausdruck</h2>
        <p className="text-sm text-stone-500 mt-1">Brief / E-Mail schreiben · max. 45 Punkte</p>
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
        <h3 className="text-sm font-semibold text-stone-700 mb-3">Bewertungsraster (Selbsteinschätzung)</h3>
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
