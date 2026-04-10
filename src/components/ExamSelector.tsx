import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ExamRecord } from '../types';

export default function ExamSelector() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<Record<number, ExamRecord>>({});

  useEffect(() => {
    const stored = localStorage.getItem('telc-b1-records');
    if (stored) {
      try { setRecords(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="a4-page px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-stone-900 mb-2">
            Telc B1 Prüfungstrainer
          </h1>
          <p className="text-stone-500 text-sm">
            Wählen Sie einen Modelltest aus, um die Prüfung zu üben.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-lg text-xs text-stone-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Bestanden
            <span className="ml-2 w-2 h-2 rounded-full bg-red-400" /> Nicht bestanden
            <span className="ml-2 w-2 h-2 rounded-full bg-stone-300" /> Nicht versucht
          </div>
        </div>

        {/* 3×5 Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {Array.from({ length: 15 }, (_, i) => i + 1).map(id => {
            const record = records[id];
            const isPassed = record?.status === 'Bestanden';
            const isFailed = record?.status === 'Nicht bestanden';

            return (
              <button
                key={id}
                onClick={() => navigate(`/exam/${id}`)}
                className={`group relative aspect-square rounded-xl border-2 transition-all duration-200
                  flex flex-col items-center justify-center gap-1 hover:scale-105 hover:shadow-lg
                  ${isPassed
                    ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400'
                    : isFailed
                      ? 'border-red-300 bg-red-50 hover:border-red-400'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
              >
                <span className={`text-2xl font-bold ${
                  isPassed ? 'text-emerald-700' : isFailed ? 'text-red-600' : 'text-stone-700'
                }`}>
                  {id}
                </span>
                <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wider">
                  Test
                </span>
                {record && (
                  <>
                    <span className={`text-xs font-semibold ${
                      isPassed ? 'text-emerald-600' : 'text-red-500'
                    }`}>
                      {record.points} Pkt
                    </span>
                    <span className={`text-[9px] ${
                      isPassed ? 'text-emerald-500' : 'text-red-400'
                    }`}>
                      {record.status}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Summary */}
        {Object.keys(records).length > 0 && (
          <div className="mt-8 p-4 bg-white rounded-xl border border-stone-200">
            <h3 className="text-sm font-semibold text-stone-700 mb-2">Übersicht</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-stone-800">{Object.keys(records).length}</p>
                <p className="text-xs text-stone-400">Versucht</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">
                  {Object.values(records).filter(r => r.status === 'Bestanden').length}
                </p>
                <p className="text-xs text-stone-400">Bestanden</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-500">
                  {Object.values(records).filter(r => r.status === 'Nicht bestanden').length}
                </p>
                <p className="text-xs text-stone-400">Nicht bestanden</p>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-[10px] text-stone-300 mt-10">
          Ergebnisse werden lokal im Browser gespeichert.
        </p>
      </div>
    </div>
  );
}
