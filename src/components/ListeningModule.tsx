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
  hoeren: 30 * 60,       // 30 min
  lesen: 45 * 60,        // 45 min
  sprachbausteine: 20 * 60, // 20 min
  schreiben: 30 * 60,    // 30 min
  sprechen: 20 * 60,     // 20 min
};

const PHASE_LABELS: Record<string, string> = {
  hoeren: 'Hören',
  lesen: 'Lesen',
  sprachbausteine: 'Sprachbausteine',
  schreiben: 'Schreiben',
  sprechen: 'Sprechen',
};

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

  const totalQuestionsForPhase = useMemo(() => {
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
  const currentPhaseIndex = phases.indexOf(phase);

  function handleNextPhase() {
    if (currentPhaseIndex < phases.length - 1) {
      setPhase(phases[currentPhaseIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handlePrevPhase() {
    if (currentPhaseIndex > 0) {
      setPhase(phases[currentPhaseIndex - 1]);
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
    const scoring = calculateScore(exam, answers);
    setResult(scoring);
    setPhase('result');

    // Save to localStorage
    const record: ExamRecord = {
      examId: exam.id,
      points: scoring.totalScore,
      status: scoring.overallPassed ? 'Bestanden' : 'Nicht bestanden',
      date: new Date().toISOString(),
    };
    const stored = localStorage.getItem('telc-b1-records');
    const records = stored ? JSON.parse(stored) : {};
    records[exam.id] = record;
    localStorage.setItem('telc-b1-records', JSON.stringify(records));

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (phase === 'result' && result) {
    return <ResultView result={result} examTitle={exam.title} onBack={() => navigate('/')} />;
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <StickyHeader
        totalSeconds={SECTION_TIMES[phase] || 1800}
        answeredCount={answeredForPhase}
        totalQuestions={totalQuestionsForPhase}
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
                  : i < currentPhaseIndex
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
              }`}
            >
              {PHASE_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="a4-page px-4">
        {phase === 'hoeren' && (
          <HoerenSection exam={exam} answers={hoerenAnswers} setAnswers={setHoerenAnswers} />
        )}
        {phase === 'lesen' && (
          <LesenSection exam={exam} answers={lesenAnswers} setAnswers={setLesenAnswers} />
        )}
        {phase === 'sprachbausteine' && (
          <SprachbausteineSection exam={exam} answers={sbAnswers} setAnswers={setSbAnswers} />
        )}
        {phase === 'schreiben' && (
          <SchreibenSection
            exam={exam}
            text={schreibenText}
            setText={setSchreibenText}
            rubric={schreibenRubric}
            setRubric={setSchreibenRubric}
          />
        )}
        {phase === 'sprechen' && (
          <SprechenSection
            exam={exam}
            rubric={sprechenRubric}
            setRubric={setSprechenRubric}
          />
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 mb-4">
          <button
            onClick={handlePrevPhase}
            disabled={currentPhaseIndex === 0}
            className="px-4 py-2 text-sm font-medium text-stone-600 bg-stone-100 rounded-lg
                       hover:bg-stone-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Zurück
          </button>
          {currentPhaseIndex < phases.length - 1 ? (
            <button
              onClick={handleNextPhase}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg
                         hover:bg-emerald-700 transition-colors"
            >
              Weiter →
            </button>
          ) : null}
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
        totalQuestions={69} // 25 + 20 + 20 + 1 + 3
        onSubmit={handleSubmit}
      />
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HÖREN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function HoerenSection({ exam, answers, setAnswers }: {
  exam: ReturnType<typeof getExam> & {};
  answers: Record<number, number | boolean>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, number | boolean>>>;
}) {
  return (
    <div className="space-y-8">
      {/* Teil 1 */}
      <section>
        <div className="mb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Hören — Teil 1</h2>
          <p className="text-sm text-stone-500 mt-1">
            Fragen 1–5: Richtig oder Falsch? (je 5 Punkte)
          </p>
        </div>
        <div className="space-y-3">
          {exam.hoeren.teil1.questions.map(q => (
            <div key={q.id} className="bg-white rounded-lg border border-stone-200 p-4">
              <p className="text-xs text-stone-400 mb-1">{q.context}</p>
              <p className="font-exam text-sm text-stone-800 mb-3">{q.id}. {q.text}</p>
              <div className="flex gap-2">
                {[true, false].map(val => (
                  <button
                    key={String(val)}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                    className={`px-4 py-1.5 text-sm rounded-md border transition-all ${
                      answers[q.id] === val
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {val ? 'Richtig' : 'Falsch'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Teil 2 */}
      <section>
        <div className="mb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Hören — Teil 2</h2>
          <p className="text-sm text-stone-500 mt-1">
            Fragen 6–15: Wählen Sie a, b oder c. (je 5 Punkte)
          </p>
        </div>
        <div className="space-y-3">
          {exam.hoeren.teil2.questions.map(q => (
            <MCQuestionCard
              key={q.id}
              id={q.id}
              context={q.context}
              text={q.text}
              options={q.options}
              selected={answers[q.id] as number | undefined}
              onSelect={val => setAnswers(prev => ({ ...prev, [q.id]: val }))}
            />
          ))}
        </div>
      </section>

      {/* Teil 3 */}
      <section>
        <div className="mb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Hören — Teil 3</h2>
          <p className="text-sm text-stone-500 mt-1">
            Fragen 16–25: Wählen Sie a, b oder c. (je 5 Punkte)
          </p>
        </div>
        <div className="space-y-3">
          {exam.hoeren.teil3.questions.map(q => (
            <MCQuestionCard
              key={q.id}
              id={q.id}
              context={q.context}
              text={q.text}
              options={q.options}
              selected={answers[q.id] as number | undefined}
              onSelect={val => setAnswers(prev => ({ ...prev, [q.id]: val }))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LESEN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function LesenSection({ exam, answers, setAnswers }: {
  exam: ReturnType<typeof getExam> & {};
  answers: Record<number, number | string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, number | string>>>;
}) {
  return (
    <div className="space-y-8">
      {/* Teil 1 – Matching */}
      <section>
        <div className="mb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Lesen — Teil 1</h2>
          <p className="text-sm text-stone-500 mt-1">
            Ordnen Sie die Texte den Situationen zu.
          </p>
        </div>
        {/* Show texts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {exam.lesen.teil1.texts.map(t => (
            <div key={t.id} className="bg-stone-50 rounded-md border border-stone-200 p-3">
              <span className="inline-block px-2 py-0.5 bg-stone-200 rounded text-xs font-bold text-stone-700 mb-1">
                {t.id}
              </span>
              <p className="font-serif text-sm text-stone-700 font-medium">{t.heading}</p>
              <p className="text-xs text-stone-500 mt-1">{t.content}</p>
            </div>
          ))}
        </div>
        {/* Questions */}
        <div className="space-y-3">
          {exam.lesen.teil1.questions.map(q => (
            <div key={q.id} className="bg-white rounded-lg border border-stone-200 p-4">
              <p className="font-exam text-sm text-stone-800 mb-3">{q.id}. {q.text}</p>
              <div className="flex gap-1.5 flex-wrap">
                {exam.lesen.teil1.texts.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: t.id }))}
                    className={`w-9 h-9 text-sm font-bold rounded-md border transition-all ${
                      answers[q.id] === t.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {t.id}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Teil 2 – Matching */}
      <section>
        <div className="mb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Lesen — Teil 2</h2>
          <p className="text-sm text-stone-500 mt-1">
            Ordnen Sie die Anzeigen den Situationen zu.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {exam.lesen.teil2.ads.map(a => (
            <div key={a.id} className="bg-stone-50 rounded-md border border-stone-200 p-3">
              <span className="inline-block px-2 py-0.5 bg-stone-200 rounded text-xs font-bold text-stone-700 mb-1">
                {a.id}
              </span>
              <p className="font-serif text-sm text-stone-700 font-medium">{a.title}</p>
              <p className="text-xs text-stone-500 mt-1">{a.content}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          {exam.lesen.teil2.situations.map(s => (
            <div key={s.id} className="bg-white rounded-lg border border-stone-200 p-4">
              <p className="font-exam text-sm text-stone-800 mb-3">{s.id}. {s.text}</p>
              <div className="flex gap-1.5 flex-wrap">
                {exam.lesen.teil2.ads.map(a => (
                  <button
                    key={a.id}
                    onClick={() => setAnswers(prev => ({ ...prev, [s.id]: a.id }))}
                    className={`w-9 h-9 text-sm font-bold rounded-md border transition-all ${
                      answers[s.id] === a.id
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {a.id}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Teil 3 – MC */}
      <section>
        <div className="mb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Lesen — Teil 3</h2>
          <p className="text-sm text-stone-500 mt-1">
            Lesen Sie den Text und beantworten Sie die Fragen.
          </p>
        </div>
        <div className="bg-stone-50 rounded-lg border border-stone-200 p-5 mb-4">
          <p className="font-exam text-sm leading-relaxed text-stone-700 whitespace-pre-line">
            {exam.lesen.teil3.passage}
          </p>
        </div>
        <div className="space-y-3">
          {exam.lesen.teil3.questions.map(q => (
            <MCQuestionCard
              key={q.id}
              id={q.id}
              text={q.text}
              options={q.options}
              selected={answers[q.id] as number | undefined}
              onSelect={val => setAnswers(prev => ({ ...prev, [q.id]: val }))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPRACHBAUSTEINE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SprachbausteineSection({ exam, answers, setAnswers }: {
  exam: ReturnType<typeof getExam> & {};
  answers: Record<number, number>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}) {
  return (
    <div className="space-y-8">
      {/* Teil 1 */}
      <section>
        <div className="mb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Sprachbausteine — Teil 1</h2>
          <p className="text-sm text-stone-500 mt-1">
            Lesen Sie den Text und wählen Sie das richtige Wort.
          </p>
        </div>
        <div className="bg-stone-50 rounded-lg border border-stone-200 p-5 mb-4">
          <p className="font-exam text-sm leading-relaxed text-stone-700 whitespace-pre-line">
            {exam.sprachbausteine.teil1.text}
          </p>
        </div>
        <div className="space-y-3">
          {exam.sprachbausteine.teil1.questions.map(q => (
            <MCQuestionCard
              key={q.id}
              id={q.id}
              text={q.text}
              options={q.options}
              selected={answers[q.id]}
              onSelect={val => setAnswers(prev => ({ ...prev, [q.id]: val }))}
            />
          ))}
        </div>
      </section>

      {/* Teil 2 */}
      <section>
        <div className="mb-4">
          <h2 className="font-serif text-xl font-bold text-stone-900">Sprachbausteine — Teil 2</h2>
          <p className="text-sm text-stone-500 mt-1">
            Lesen Sie den Text und wählen Sie das richtige Wort.
          </p>
        </div>
        <div className="bg-stone-50 rounded-lg border border-stone-200 p-5 mb-4">
          <p className="font-exam text-sm leading-relaxed text-stone-700 whitespace-pre-line">
            {exam.sprachbausteine.teil2.text}
          </p>
        </div>
        <div className="space-y-3">
          {exam.sprachbausteine.teil2.questions.map(q => (
            <MCQuestionCard
              key={q.id}
              id={q.id}
              text={q.text}
              options={q.options}
              selected={answers[q.id]}
              onSelect={val => setAnswers(prev => ({ ...prev, [q.id]: val }))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SCHREIBEN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SchreibenSection({ exam, text, setText, rubric, setRubric }: {
  exam: ReturnType<typeof getExam> & {};
  text: string;
  setText: (t: string) => void;
  rubric: { aufgabenerfuellung: number; kohaerenz: number; wortschatz: number; grammatik: number };
  setRubric: React.Dispatch<React.SetStateAction<typeof rubric>>;
}) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const rubricItems = [
    { key: 'aufgabenerfuellung' as const, label: 'I. Aufgabenerfüllung', max: 15, desc: 'Inhaltliche Vollständigkeit, alle Leitpunkte behandelt' },
    { key: 'kohaerenz' as const, label: 'II. Kohärenz', max: 10, desc: 'Textaufbau, Verknüpfungen, logischer Zusammenhang' },
    { key: 'wortschatz' as const, label: 'III. Wortschatz', max: 10, desc: 'Angemessener und korrekter Wortgebrauch' },
    { key: 'grammatik' as const, label: 'IV. Grammatik', max: 10, desc: 'Korrekte Strukturen, Satzbau, Morphologie' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="font-serif text-xl font-bold text-stone-900">Schreiben</h2>
        <p className="text-sm text-stone-500 mt-1">
          Schreiben Sie einen Brief. (max. 45 Punkte)
        </p>
      </div>

      {/* Task */}
      <div className="bg-amber-50 rounded-lg border border-amber-200 p-5">
        <p className="text-xs uppercase tracking-wider text-amber-600 font-semibold mb-2">
          {exam.schreiben.type === 'formal' ? 'Formeller Brief' : 'Informeller Brief'}
        </p>
        <p className="font-exam text-sm text-stone-800 mb-3">{exam.schreiben.prompt}</p>
        <p className="text-xs text-stone-500 mb-2">Schreiben Sie etwas zu folgenden Punkten:</p>
        <ul className="space-y-1">
          {exam.schreiben.bulletPoints.map((bp, i) => (
            <li key={i} className="text-sm text-stone-700 flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              {bp}
            </li>
          ))}
        </ul>
      </div>

      {/* Editor */}
      <div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Schreiben Sie Ihren Brief hier..."
          className="w-full h-64 p-4 font-exam text-sm leading-relaxed bg-white border border-stone-200
                     rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <p className="text-xs text-stone-400 mt-1 text-right">
          {wordCount} Wörter
        </p>
      </div>

      {/* Self-grading Rubric */}
      <div className="bg-white rounded-lg border border-stone-200 p-5">
        <h3 className="text-sm font-semibold text-stone-700 mb-1">Bewertungsraster (Selbstbewertung)</h3>
        <p className="text-xs text-stone-400 mb-4">
          Bewerten Sie Ihren Text nach den Telc-Kriterien.
        </p>
        <div className="space-y-4">
          {rubricItems.map(item => (
            <div key={item.key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-stone-700">{item.label}</label>
                <span className="text-sm font-mono text-stone-500">
                  {rubric[item.key]} / {item.max}
                </span>
              </div>
              <p className="text-[10px] text-stone-400 mb-2">{item.desc}</p>
              <input
                type="range"
                min={0}
                max={item.max}
                step={1}
                value={rubric[item.key]}
                onChange={e => setRubric(prev => ({ ...prev, [item.key]: Number(e.target.value) }))}
                className="w-full accent-emerald-600"
              />
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SPRECHEN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SprechenSection({ exam, rubric, setRubric }: {
  exam: ReturnType<typeof getExam> & {};
  rubric: { teil1: number; teil2: number; teil3: number };
  setRubric: React.Dispatch<React.SetStateAction<typeof rubric>>;
}) {
  const [prepTimer, setPrepTimer] = useState(20 * 60);
  const [prepRunning, setPrepRunning] = useState(false);

  // Prep timer
  useState(() => {
    if (!prepRunning) return;
    const iv = setInterval(() => {
      setPrepTimer(prev => {
        if (prev <= 1) { setPrepRunning(false); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  });

  const parts = [
    { key: 'teil1' as const, max: 25, ...exam.sprechen[0] },
    { key: 'teil2' as const, max: 25, ...exam.sprechen[1] },
    { key: 'teil3' as const, max: 25, ...exam.sprechen[2] },
  ];

  const prepMin = Math.floor(prepTimer / 60);
  const prepSec = prepTimer % 60;

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h2 className="font-serif text-xl font-bold text-stone-900">Sprechen</h2>
        <p className="text-sm text-stone-500 mt-1">
          Mündliche Prüfung (max. 75 Punkte)
        </p>
      </div>

      {/* Prep timer */}
      <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-amber-800">Vorbereitungszeit</p>
          <p className="text-xs text-amber-600">20 Minuten für die gesamte mündliche Prüfung</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl font-bold text-amber-700">
            {String(prepMin).padStart(2, '0')}:{String(prepSec).padStart(2, '0')}
          </span>
          <button
            onClick={() => setPrepRunning(!prepRunning)}
            className="px-3 py-1.5 text-xs font-medium bg-amber-200 text-amber-800 rounded-md hover:bg-amber-300"
          >
            {prepRunning ? '⏸ Pause' : '▶ Start'}
          </button>
        </div>
      </div>

      {/* Speaking Parts */}
      {parts.map(part => (
        <div key={part.key} className="bg-white rounded-lg border border-stone-200 p-5">
          <h3 className="font-serif text-lg font-bold text-stone-800 mb-1">
            Teil {part.part}: {part.title}
          </h3>
          <p className="font-exam text-sm text-stone-600 whitespace-pre-line mb-4">
            {part.description}
          </p>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-sm font-medium text-stone-700">Bewertung</label>
              <span className="text-sm font-mono text-stone-500">
                {rubric[part.key]} / {part.max}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={part.max}
              step={1}
              value={rubric[part.key]}
              onChange={e => setRubric(prev => ({ ...prev, [part.key]: Number(e.target.value) }))}
              className="w-full accent-emerald-600"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Shared MC Card
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function MCQuestionCard({ id, text, options, selected, onSelect, context }: {
  id: number;
  text: string;
  options: string[];
  selected: number | undefined;
  onSelect: (idx: number) => void;
  context?: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 p-4">
      {context && <p className="text-xs text-stone-400 mb-1">{context}</p>}
      <p className="font-exam text-sm text-stone-800 mb-3">{id}. {text}</p>
      <div className="space-y-1.5">
        {options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(idx)}
            className={`w-full text-left px-3 py-2 text-sm rounded-md border transition-all ${
              selected === idx
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
