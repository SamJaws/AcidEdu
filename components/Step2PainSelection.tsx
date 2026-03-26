
import React, { useState } from 'react';
import { PainPoint } from '../types';

interface Step2Props {
  pains: PainPoint[]; 
  setPains: (pains: PainPoint[]) => void;
  onSelect: (pain: PainPoint) => void;
  onSelectMultiple: (pains: PainPoint[]) => void;
  onBack: () => void; 
  loading: boolean; 
  t: (k: string) => string;
}

const Step2PainSelection: React.FC<Step2Props> = ({ pains, setPains, onSelect, onSelectMultiple, onBack, loading, t }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleExport = () => {
    const text = pains.map(p => `${p.title}|${p.description}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `treatments_list.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const lines = content.split('\n');
      const importedPains: PainPoint[] = lines
        .map((line, idx) => {
          const [title, description] = line.split('|');
          if (!title || !description) return null;
          return { id: `imported-${idx}`, title: title.trim(), description: description.trim() };
        })
        .filter(p => p !== null) as PainPoint[];
      if (importedPains.length > 0) setPains(importedPains);
    };
    reader.readAsText(file);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleGenerateSelected = () => {
    const selectedPains = pains.filter(p => selectedIds.includes(p.id));
    if (selectedPains.length > 0) {
      onSelectMultiple(selectedPains);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-lime-500 font-black text-sm uppercase tracking-[0.2em] mb-2 block">02 / {t('step2')}</span>
          <h2 className="text-4xl font-black tracking-tight">{t('painsTitle')}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => {
              if (selectedIds.length === pains.length) {
                setSelectedIds([]);
              } else {
                setSelectedIds(pains.map(p => p.id));
              }
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-black text-[10px] uppercase tracking-widest text-lime-500 hover:text-lime-400 transition-colors border border-slate-200 dark:border-slate-700"
          >
            {selectedIds.length === pains.length ? t('deselectAll') : t('selectAll')}
          </button>
          {selectedIds.length > 0 && (
            <button 
              onClick={handleGenerateSelected}
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-lime-400 text-slate-900 font-black text-xs hover:scale-105 transition-all shadow-lg shadow-lime-400/20 disabled:opacity-50"
            >
              🚀 {t('generateSelected')} ({selectedIds.length})
            </button>
          )}
          <button 
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
          >
            📥 {t('exportList')}
          </button>
          <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700">
            📤 {t('importList')}
            <input type="file" className="hidden" accept=".txt" onChange={handleImport} />
          </label>
          <button 
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs hover:scale-105 transition-all"
          >
            ← {t('back')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {pains.map((pain) => (
          <div
            key={pain.id}
            className={`group relative p-8 rounded-[2rem] bg-white dark:bg-slate-900 border transition-all hover:shadow-2xl hover:shadow-lime-400/10 ${
              selectedIds.includes(pain.id) 
                ? 'border-lime-400 ring-2 ring-lime-400/20' 
                : 'border-slate-200 dark:border-slate-800 hover:border-lime-400/50'
            }`}
          >
            <div className="absolute top-6 right-6 z-10">
              <input 
                type="checkbox"
                checked={selectedIds.includes(pain.id)}
                onChange={() => toggleSelection(pain.id)}
                className="w-6 h-6 rounded-lg border-2 border-slate-300 dark:border-slate-700 checked:bg-lime-400 checked:border-lime-400 transition-all cursor-pointer accent-lime-400"
              />
            </div>

            <button
              disabled={loading}
              onClick={() => onSelect(pain)}
              className="w-full text-left"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
                selectedIds.includes(pain.id) ? 'bg-lime-400 text-slate-900' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-lime-400 group-hover:text-slate-900'
              }`}>
                <span className="text-2xl">💀</span>
              </div>
              <h3 className={`text-xl font-black mb-3 transition-colors ${
                selectedIds.includes(pain.id) ? 'text-lime-500' : 'group-hover:text-lime-500'
              }`}>{pain.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm italic">"{pain.description}"</p>
              <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-lime-500 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                {t('pickThisOne')}
              </div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step2PainSelection;
