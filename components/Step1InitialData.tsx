
import React from 'react';
import { VideoPlatform, CreationTheme, HumorType } from '../types';
import { PLATFORMS, WORD_COUNT_OPTIONS, CREATION_THEMES, HUMOR_OPTIONS } from '../constants';

interface Step1Props {
  character: string; setCharacter: (v: string) => void;
  transcription: string; setTranscription: (v: string) => void;
  platform: VideoPlatform; setPlatform: (v: VideoPlatform) => void;
  humor: HumorType; setHumor: (v: HumorType) => void;
  targetWordCount: number; setTargetWordCount: (v: number) => void;
  selectedThemes: CreationTheme[]; setSelectedThemes: (v: CreationTheme[]) => void;
  hasProduct: boolean; setHasProduct: (v: boolean) => void;
  productName: string; setProductName: (v: string) => void;
  hasBaseScript: boolean; setHasBaseScript: (v: boolean) => void;
  baseScript: string; setBaseScript: (v: string) => void;
  onSubmit: () => void; loading: boolean; t: (k: string) => string;
}

const Step1InitialData: React.FC<Step1Props> = (props) => {
  const { 
    character, setCharacter, 
    transcription, setTranscription,
    platform, setPlatform, 
    humor, setHumor,
    targetWordCount, setTargetWordCount, 
    selectedThemes, setSelectedThemes,
    hasProduct, setHasProduct, 
    productName, setProductName, 
    hasBaseScript, setHasBaseScript,
    baseScript, setBaseScript,
    onSubmit, loading, t 
  } = props;

  const toggleTheme = (theme: CreationTheme) => {
    if (selectedThemes.includes(theme)) {
      if (selectedThemes.length > 1) {
        setSelectedThemes(selectedThemes.filter(t => t !== theme));
      }
    } else {
      setSelectedThemes([...selectedThemes, theme]);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-14 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-8 duration-700 relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-lime-400/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="space-y-12">
        <div className="relative">
          <span className="text-lime-500 font-black text-xs uppercase tracking-[0.3em] mb-4 block">01 — {t('step1')}</span>
          <h2 className="text-5xl font-black mb-4 tracking-tight leading-tight">{t('title')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed max-w-xl font-medium">{t('tagline')}</p>
        </div>

        {/* Multi-Theme Selection Menu */}
        <div className="space-y-4">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{t('creationThemeLabel')}</label>
            <button 
              onClick={() => {
                if (selectedThemes.length === CREATION_THEMES.length) {
                  setSelectedThemes([CREATION_THEMES[0].value]);
                } else {
                  setSelectedThemes(CREATION_THEMES.map(t => t.value));
                }
              }}
              className="text-[10px] font-black uppercase tracking-widest text-lime-500 hover:text-lime-400 transition-colors"
            >
              {selectedThemes.length === CREATION_THEMES.length ? t('deselectAll') : t('selectAll')}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CREATION_THEMES.map((th) => (
              <button
                key={th.value}
                onClick={() => toggleTheme(th.value)}
                className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 text-center group relative ${
                  selectedThemes.includes(th.value)
                    ? 'bg-lime-400 border-lime-400 text-slate-900 shadow-lg shadow-lime-400/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {selectedThemes.includes(th.value) && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-slate-900 text-lime-400 rounded-full flex items-center justify-center text-[10px] font-black">
                    ✓
                  </div>
                )}
                <span className="text-2xl group-hover:scale-110 transition-transform">{th.emoji}</span>
                <span className="text-[10px] font-black uppercase tracking-tight leading-tight">
                  {t(`themes.${th.value}`)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
          <div className="space-y-4 md:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('character')}</label>
            <div className="relative">
               <input 
                type="text" 
                value={character}
                onChange={(e) => setCharacter(e.target.value)}
                placeholder={t('characterPlaceholder')}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.5rem] px-8 py-6 focus:ring-4 ring-lime-400/20 focus:bg-white dark:focus:bg-slate-800 focus:border-lime-400/50 transition-all text-2xl font-black placeholder:font-bold placeholder:opacity-20 outline-none"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-3xl opacity-20">
                {CREATION_THEMES.find(t => t.value === selectedThemes[0])?.emoji || '🍋'}
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('transcriptionLabel')}</label>
            <textarea 
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              placeholder={t('transcriptionPlaceholder')}
              className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.5rem] px-8 py-6 focus:ring-4 ring-lime-400/20 focus:bg-white dark:focus:bg-slate-800 focus:border-lime-400/50 transition-all text-lg font-bold placeholder:opacity-30 min-h-[120px] outline-none resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('platform')}</label>
            <div className="relative">
              <select 
                value={platform}
                onChange={(e) => setPlatform(e.target.value as VideoPlatform)}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl px-6 py-5 focus:ring-4 ring-lime-400/20 focus:border-lime-400/50 transition-all font-black text-lg cursor-pointer outline-none appearance-none"
              >
                {PLATFORMS.map(p => (
                  <option key={p.value} value={p.value}>{t(p.label)} — {p.duration}{t('seconds')}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('humor')}</label>
            <div className="relative">
              <select 
                value={humor}
                onChange={(e) => setHumor(e.target.value as HumorType)}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl px-6 py-5 focus:ring-4 ring-lime-400/20 focus:border-lime-400/50 transition-all font-black text-lg cursor-pointer outline-none appearance-none"
              >
                {HUMOR_OPTIONS.map(h => (
                  <option key={h.value} value={h.value}>{h.emoji} {t(h.label)}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('targetWords')}</label>
             <div className="relative">
              <select 
                value={targetWordCount}
                onChange={(e) => setTargetWordCount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl px-6 py-5 focus:ring-4 ring-lime-400/20 focus:border-lime-400/50 transition-all font-black text-lg cursor-pointer outline-none appearance-none"
              >
                {WORD_COUNT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{t(opt.label)}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between p-2 pl-6 pr-3 bg-slate-50 dark:bg-slate-800/40 rounded-[1.5rem] border-2 border-transparent transition-all group hover:border-lime-400/20">
              <span className="font-black text-lg tracking-tight">{t('useBaseScript')}</span>
              <button 
                onClick={() => setHasBaseScript(!hasBaseScript)}
                className={`w-20 h-10 rounded-full relative transition-all duration-300 ${hasBaseScript ? 'bg-lime-400 shadow-lg shadow-lime-400/40' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow-md transition-all duration-300 ${hasBaseScript ? 'translate-x-11' : 'translate-x-1'}`} />
              </button>
            </div>
            {hasBaseScript && (
              <textarea 
                value={baseScript}
                onChange={(e) => setBaseScript(e.target.value)}
                placeholder={t('baseScriptPlaceholder')}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-[1.5rem] px-8 py-6 focus:ring-4 ring-lime-400/20 focus:bg-white dark:focus:bg-slate-800 focus:border-lime-400/50 transition-all text-lg font-bold placeholder:opacity-30 min-h-[150px] outline-none resize-none"
              />
            )}
          </div>

          <div className="md:col-span-2 pt-4">
            <div className="flex items-center justify-between p-2 pl-6 pr-3 bg-slate-50 dark:bg-slate-800/40 rounded-[1.5rem] border-2 border-transparent transition-all group hover:border-lime-400/20">
              <span className="font-black text-lg tracking-tight">{t('productToggle')}</span>
              <button 
                onClick={() => setHasProduct(!hasProduct)}
                className={`w-20 h-10 rounded-full relative transition-all duration-300 ${hasProduct ? 'bg-lime-400 shadow-lg shadow-lime-400/40' : 'bg-slate-200 dark:bg-slate-700'}`}
              >
                <div className={`absolute top-1 w-8 h-8 rounded-full bg-white shadow-md transition-all duration-300 ${hasProduct ? 'translate-x-11' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {hasProduct && (
            <div className="space-y-4 md:col-span-2 animate-in zoom-in-95 duration-300">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t('productName')}</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder={t('productPlaceholder')}
                className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl px-8 py-5 focus:ring-4 ring-lime-400/20 focus:border-lime-400/50 focus:bg-white dark:focus:bg-slate-800 transition-all font-black text-xl outline-none"
              />
            </div>
          )}
        </div>

        <button 
          onClick={onSubmit}
          disabled={loading || !character.trim()}
          className="group relative w-full py-8 rounded-[2rem] font-black text-3xl overflow-hidden acid-gradient text-slate-900 shadow-2xl shadow-lime-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-40 disabled:grayscale"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
          {loading ? (
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <span>{t('loading')}</span>
            </div>
          ) : t('generatePains')}
        </button>
      </div>
    </div>
  );
};

export default Step1InitialData;
