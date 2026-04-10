interface Props {
  answeredCount: number;
  totalQuestions: number;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function StickyFooter({ answeredCount, totalQuestions, onSubmit, disabled }: Props) {
  return (
    <div className="sticky bottom-0 z-50 bg-white/95 backdrop-blur border-t border-stone-200 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
      <div className="a4-page px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
            <span className="text-sm font-bold text-stone-700">{answeredCount}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-stone-800">
              Beantwortet: {answeredCount} von {totalQuestions}
            </p>
            <p className="text-[10px] text-stone-400">
              {totalQuestions - answeredCount > 0
                ? `Noch ${totalQuestions - answeredCount} Fragen offen`
                : 'Alle Fragen beantwortet!'}
            </p>
          </div>
        </div>
        <button
          onClick={onSubmit}
          disabled={disabled}
          className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg
                     hover:bg-emerald-700 active:bg-emerald-800 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed
                     shadow-sm hover:shadow-md"
        >
          Prüfung auswerten
        </button>
      </div>
    </div>
  );
}
