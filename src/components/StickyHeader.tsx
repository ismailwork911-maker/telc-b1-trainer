import { useTimer } from '../hooks/useTimer';

interface Props {
  totalSeconds: number;
  answeredCount: number;
  totalQuestions: number;
  onTimerRef?: (controls: { start: () => void; pause: () => void; reset: () => void }) => void;
}

export default function StickyHeader({ totalSeconds, answeredCount, totalQuestions, onTimerRef }: Props) {
  const timer = useTimer(totalSeconds);

  if (onTimerRef) onTimerRef({ start: timer.start, pause: timer.pause, reset: timer.reset });

  const barColor = timer.isRed
    ? 'bg-red-500'
    : timer.isAmber
      ? 'bg-amber-500'
      : 'bg-emerald-500';

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200 shadow-sm">
      <div className="a4-page px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Telc B1 Prüfung
            </span>
          </div>
          <div className={`font-mono text-2xl font-bold tabular-nums ${
            timer.isRed ? 'text-red-600' : timer.isAmber ? 'text-amber-600' : 'text-stone-800'
          }`}>
            {timer.display}
          </div>
          <div className="flex items-center gap-2">
            {!timer.running ? (
              <button
                onClick={timer.start}
                className="px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-md hover:bg-emerald-100 transition-colors"
              >
                ▶ Start
              </button>
            ) : (
              <button
                onClick={timer.pause}
                className="px-3 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-md hover:bg-amber-100 transition-colors"
              >
                ⏸ Pause
              </button>
            )}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
            style={{ width: `${timer.progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-stone-400">
            {answeredCount} / {totalQuestions} beantwortet
          </span>
          <span className="text-[10px] text-stone-400">
            {Math.round(timer.progress)}% Zeit verbraucht
          </span>
        </div>
      </div>
    </div>
  );
}
