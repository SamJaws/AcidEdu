
import React, { useState } from 'react';
import { ScriptResult, PainPoint } from '../types';

interface Step3Props {
  results: ScriptResult[]; 
  onRegenerate: () => void;
  onRegeneratePart: (type: 'script' | 'image' | 'scenes', index: number) => void;
  onReset: () => void; 
  onChooseAnother: () => void;
  selectedPains: PainPoint[];
  character: string;
  loading: boolean; 
  t: (k: string) => string;
}

const Step3Results: React.FC<Step3Props> = ({ 
  results, 
  onRegenerate, 
  onRegeneratePart,
  onReset, 
  onChooseAnother, 
  selectedPains, 
  character, 
  loading, 
  t 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'script' | 'image' | 'thumbnail' | 'scenes'>('script');
  const [copied, setCopied] = useState<string | null>(null);

  const result = results[currentIndex];
  const selectedPain = selectedPains[currentIndex];

  if (!result || !selectedPain) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const generateSummaryText = (res: ScriptResult, pain: PainPoint) => {
    return `
${t('summary.title')}
---------------------------------------------------
${t('summary.character')}: ${character}
${t('summary.pain')}: ${pain.title}
${t('summary.provocativeTitle')}: ${res.provocativeTitle}

${t('summary.voiceProfile')}:
${t('summary.name')}: ${res.voiceConfig.personaName}
${t('summary.description')}: ${res.voiceConfig.description}
${t('summary.tone')}: ${res.voiceConfig.tone}
${t('summary.timbre')}: ${res.voiceConfig.timbreDetail}

${t('summary.script')}:
${res.script}

---------------------------------------------------

${t('summary.initialImagePrompt')}:
${res.initialImagePrompt}

---------------------------------------------------

${t('summary.thumbnailPrompt')}:
${res.thumbnailPrompt}

---------------------------------------------------

${t('summary.scenePrompts')}:
${res.scenes.map((s, i) => `${String(i + 1).padStart(2, '0')} - ${s.sentence}

${t('summary.imagePrompt')}: 
${s.imagePrompt}

${t('summary.videoPrompt')}: 
${s.videoPrompt}

---------------------------------------------------`).join('\n\n')}
    `.trim();
  };

  const handleDownloadSummary = () => {
    const summary = generateSummaryText(result, selectedPain);
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.replace(/\s+/g, '_')}_${selectedPain.title.replace(/\s+/g, '_')}_AcidEdu.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    const allSummaries = results.map((res, idx) => {
      const pain = selectedPains[idx];
      return `=== ${t('summary.result')} ${idx + 1}: ${pain.title} ===\n\n${generateSummaryText(res, pain)}\n\n${'='.repeat(40)}\n\n`;
    }).join('\n');

    const blob = new Blob([allSummaries], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${character.replace(/\s+/g, '_')}_ALL_RESULTS_AcidEdu.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const CopyBadge = ({ id }: { id: string }) => (
    <span className={`text-[10px] font-black px-2 py-1 rounded-md bg-lime-400 text-slate-900 animate-in fade-in zoom-in duration-300 ${copied === id ? 'inline-block' : 'hidden'}`}>
      {t('copied')}
    </span>
  );

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-24">
      {/* Multi-result navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {results.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar flex-1">
            {selectedPains.map((pain, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shrink-0 border ${
                  currentIndex === idx 
                    ? 'bg-lime-400 text-slate-900 border-lime-400 shadow-lg shadow-lime-400/20 scale-105' 
                    : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 hover:border-lime-400/50'
                }`}
              >
                {idx + 1}. {pain.title}
              </button>
            ))}
          </div>
        )}
        {results.length > 1 && (
          <button 
            onClick={handleDownloadAll}
            className="px-6 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shrink-0"
          >
            📥 {t('downloadAll')} ({results.length})
          </button>
        )}
      </div>

      {/* Upper Grid Layout */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 items-start">
        
        {/* Main Content Area: Title and Voice Card */}
        <div className="lg:col-span-8 space-y-10 w-full">
          <div className="space-y-4">
            <span className="text-lime-500 font-black text-xs uppercase tracking-[0.3em] block">03 / {t('step3')} {results.length > 1 ? `(${currentIndex + 1}/${results.length})` : ''}</span>
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] acid-text italic max-w-4xl">
              "{result.provocativeTitle}"
            </h2>
            <div className="flex flex-col gap-1 pt-2">
               <p className="text-slate-500 dark:text-slate-100 font-black uppercase text-sm tracking-[0.1em]">{selectedPain.title}</p>
               <p className="text-slate-400 dark:text-slate-500 text-sm font-medium italic max-w-2xl leading-relaxed">"{selectedPain.description}"</p>
            </div>
          </div>
          
          {/* Persona Vocal Card */}
          <div className="bg-white dark:bg-slate-900/40 rounded-[1.5rem] p-8 md:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden backdrop-blur-md">
            
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-500">{t('voice.persona')}</span>
                <div className="h-px w-24 bg-slate-200 dark:bg-slate-800" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 opacity-60 uppercase">{t('consistencyCheck')}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-7">
                <h4 className="text-3xl font-black text-slate-900 dark:text-white mb-6 leading-tight">{result.voiceConfig.personaName}</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                   <span className="px-3 py-1 bg-lime-400/10 text-lime-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-lime-400/20 shadow-sm shadow-lime-400/10">{t('protocolActive')}</span>
                   <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest">{t('lockedScenes')}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-2 border-lime-400/40 pl-6 py-1">
                  {result.voiceConfig.description}
                </p>
              </div>

              <div className="md:col-span-5 space-y-4">
                <div className="flex items-start justify-between gap-6 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest pt-1 leading-none">{t('voice.tone')}</span>
                  <span className="text-[10px] font-black text-lime-400 uppercase text-right leading-tight max-w-[180px]">
                    {result.voiceConfig.tone}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">{t('voice.speed')}</span>
                  <span className="text-[11px] font-black text-slate-300">{result.voiceConfig.speed}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">{t('voice.pitch')}</span>
                  <span className="text-[11px] font-black text-slate-300">{result.voiceConfig.pitch}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">{t('voice.stability')}</span>
                  <span className="text-[11px] font-black text-slate-300">{result.voiceConfig.stability}</span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800/50 flex items-center gap-4">
               <span className="text-lime-500 font-black uppercase tracking-widest text-[9px] shrink-0">{t('voice.timbreFingerprint')}</span>
               <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 leading-relaxed truncate">
                {result.voiceConfig.timbreDetail}
               </p>
            </div>
          </div>
        </div>

        {/* Action Sidebar Block */}
        <div className="lg:col-span-4 w-full flex flex-col gap-4 lg:sticky lg:top-24">
          <button 
            onClick={handleDownloadSummary}
            className="w-full py-6 rounded-2xl bg-lime-400 text-slate-900 font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-lime-400/40 flex items-center justify-center gap-3 group"
          >
            <span className="text-xl group-hover:animate-bounce">💾</span> {t('downloadSummary')}
          </button>
          
          <div className="grid grid-cols-12 gap-3">
            <button 
              onClick={onChooseAnother} 
              className="col-span-9 py-5 rounded-2xl bg-slate-900/60 dark:bg-slate-800/60 text-white font-black text-[11px] hover:bg-slate-800 transition-all border border-slate-700/50 shadow-sm flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              <span className="text-base">🔄</span> {t('chooseAnother')}
            </button>
            <button 
              onClick={onReset} 
              className="col-span-3 py-5 rounded-2xl bg-slate-900/60 dark:bg-slate-800/60 hover:bg-slate-800 transition-all border border-slate-700/50 shadow-sm text-xl flex items-center justify-center"
              title={t('home')}
            >
              🏠
            </button>
          </div>

          <button 
            onClick={onRegenerate} 
            disabled={loading}
            className="w-full py-6 rounded-2xl bg-white text-slate-900 font-black text-sm hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-xl border border-slate-200"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                {t('loading')}
              </div>
            ) : t('regenerate')}
          </button>
        </div>
      </div>

      {/* Detail Tabs Content Area */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 mt-10">
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 overflow-x-auto no-scrollbar">
          {(['script', 'image', 'thumbnail', 'scenes'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[160px] py-10 text-xs font-black uppercase tracking-[0.4em] transition-all relative ${
                activeTab === tab ? 'text-lime-500' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <span className="flex items-center justify-center gap-3">
                {t(`tabs.${tab}`)}
              </span>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-1 acid-gradient shadow-[0_-4px_12px_rgba(190,242,100,0.5)]" />
              )}
            </button>
          ))}
        </div>

        <div className="p-8 md:p-14 min-h-[500px]">
          {activeTab === 'script' && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">{t('narrativeConstruction')}</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onRegeneratePart('script', currentIndex)} 
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 hover:bg-lime-400 hover:text-slate-900 transition-all uppercase tracking-[0.2em] disabled:opacity-50"
                  >
                    🔄 {t('regeneratePart')}
                  </button>
                  <CopyBadge id="full-script" />
                  <button onClick={() => handleCopy(result.script, 'full-script')} className="px-5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-lime-500 hover:bg-lime-400 hover:text-slate-900 transition-all uppercase tracking-[0.2em] shadow-sm">{t('copy')}</button>
                </div>
              </div>
              <div className="font-serif italic text-xl md:text-3xl leading-[2.6] text-slate-800 dark:text-slate-100 max-w-5xl mx-auto">
                {result.script.split('\n').filter(line => line.trim()).map((line, i) => {
                  const words = line.split(' ').filter(w => w.length > 0).length;
                  return (
                    <div key={i} className="mb-10 border-l-4 border-lime-400/20 pl-8 hover:border-lime-400 transition-colors group">
                      <p className="tracking-tight">{line}</p>
                      <div className="flex items-center gap-4 mt-3">
                         <div className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${words >= 20 && words <= 25 ? 'bg-lime-400/10 text-lime-500' : 'bg-red-400/10 text-red-400'}`}>
                           {words} {t('words')} {words >= 20 && words <= 25 ? '✓' : '⚠️'}
                         </div>
                         <div className="h-[1px] flex-1 bg-slate-100 dark:bg-slate-800 opacity-20 group-hover:opacity-100" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'image' && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">{t('identityPrompt')}</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => onRegeneratePart('image', currentIndex)} 
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 hover:bg-lime-400 hover:text-slate-900 transition-all uppercase tracking-[0.2em] disabled:opacity-50"
                  >
                    🔄 {t('regeneratePart')}
                  </button>
                  <CopyBadge id="img-prompt" />
                  <button onClick={() => handleCopy(result.initialImagePrompt, 'img-prompt')} className="px-5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-lime-500 hover:bg-lime-400 hover:text-slate-900 transition-all uppercase tracking-[0.2em] shadow-sm">{t('copy')}</button>
                </div>
              </div>
              <div className="p-12 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-800/20 border-2 border-dashed border-slate-200 dark:border-slate-800 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-lime-400 opacity-20"></div>
                <p className="text-2xl font-medium leading-relaxed italic opacity-80 text-center relative z-10 px-8">"{result.initialImagePrompt}"</p>
                <div className="mt-8 flex items-center justify-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-ping"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-lime-500">{t('staringMode')}</span>
                </div>
              </div>
              <div className="relative group max-w-4xl mx-auto pt-10">
                <div className="absolute -inset-4 bg-lime-400/5 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
                  <img src={`https://picsum.photos/seed/${result.initialImagePrompt}/1600/900`} alt="Vibe Preview" className="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-105 group-hover:scale-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'thumbnail' && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">{t('thumbnailPromptLabel')}</span>
                <div className="flex items-center gap-3">
                  <CopyBadge id="thumb-prompt" />
                  <button onClick={() => handleCopy(result.thumbnailPrompt, 'thumb-prompt')} className="px-5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-lime-500 hover:bg-lime-400 hover:text-slate-900 transition-all uppercase tracking-[0.2em] shadow-sm">{t('copy')}</button>
                </div>
              </div>
              <div className="p-12 rounded-[2.5rem] bg-lime-400/5 dark:bg-lime-400/5 border-2 border-dashed border-lime-400/30 relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-lime-400"></div>
                <p className="text-2xl font-black leading-relaxed italic text-slate-800 dark:text-slate-100 text-center relative z-10 px-8">
                  "{result.thumbnailPrompt}"
                </p>
                <div className="mt-8 flex items-center justify-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-lime-400"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-lime-500">{t('exaggeratedLogic')}</span>
                </div>
              </div>
              <div className="relative group max-w-4xl mx-auto pt-10">
                <div className="absolute -inset-4 bg-lime-400/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <div className="relative aspect-[16/9] bg-slate-200 dark:bg-slate-800 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-lime-400/20">
                  <img src={`https://picsum.photos/seed/${result.thumbnailPrompt}/1600/900`} alt="Thumbnail Preview" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-10 left-10 right-10">
                    <h3 className="text-4xl font-black text-white italic tracking-tighter drop-shadow-2xl uppercase">
                      {result.provocativeTitle}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'scenes' && (
            <div className="space-y-10 animate-in fade-in duration-700">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30">{t('sceneVisualLogic')}</span>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => onRegeneratePart('scenes', currentIndex)} 
                    disabled={loading}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 hover:bg-lime-400 hover:text-slate-900 transition-all uppercase tracking-[0.2em] disabled:opacity-50"
                  >
                    🔄 {t('regeneratePart')}
                  </button>
                  <CopyBadge id="all-scenes" />
                  <button onClick={() => handleCopy(result.scenes.map(s => `[${s.time}] ${s.sentence}\nIMAGE PROMPT: ${s.imagePrompt}`).join('\n\n'), 'all-scenes')} className="text-[11px] font-black text-lime-500 hover:underline uppercase tracking-[0.3em]">{t('copyAll')}</button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-10">
                {result.scenes.map((scene, idx) => (
                  <div key={idx} className="group flex flex-col items-stretch gap-8 p-10 md:p-14 rounded-[3rem] bg-slate-50/30 dark:bg-slate-800/20 border border-slate-100 dark:border-slate-800 hover:border-lime-400/40 transition-all hover:shadow-3xl hover:-translate-y-1">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-10">
                       <div className="flex items-center gap-8">
                         <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center font-black text-2xl text-slate-400 group-hover:bg-lime-400 group-hover:text-slate-900 transition-all shrink-0 shadow-lg border border-slate-100 dark:border-slate-700">
                           {idx + 1}
                         </div>
                         <div className="flex flex-col gap-2">
                           <span className="text-[11px] font-black uppercase tracking-widest text-lime-500">{t('macroCinematic')}</span>
                           <span className="px-4 py-1.5 bg-lime-400/10 text-lime-600 dark:text-lime-400 rounded-full text-[10px] font-black tracking-widest uppercase border border-lime-400/20">{t('sceneSync')}: {scene.time}</span>
                         </div>
                       </div>
                       <div className="flex items-center gap-4">
                         <button 
                          onClick={() => handleCopy(`${scene.sentence}\n\n${t('summary.imagePromptEnglish')}:\n${scene.imagePrompt}\n\n${t('summary.videoPromptEnglish')}:\n${scene.videoPrompt}`, `scene-${idx}`)}
                          className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black text-lime-500 hover:bg-lime-400 hover:text-slate-900 transition-all uppercase tracking-[0.2em] shadow-xl active:scale-95"
                        >
                          {copied === `scene-${idx}` ? `✓ ${t('copied')}` : t('copyAllPrompts')}
                        </button>
                       </div>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <span className="text-lime-500 font-black uppercase text-[10px] tracking-[0.3em] block mb-3">{t('narrativeSentence')}:</span>
                        <p className="text-xl font-serif italic text-slate-800 dark:text-slate-100">{scene.sentence}</p>
                      </div>

                      <div className="p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border-l-4 border-lime-400">
                        <span className="text-lime-500 font-black uppercase text-[10px] tracking-[0.3em] block mb-3">{t('imagePromptLabel')}:</span>
                        <p className="text-sm font-medium leading-relaxed opacity-80">{scene.imagePrompt}</p>
                      </div>

                      <div className="bg-slate-100/50 dark:bg-slate-950/40 p-10 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800/50 relative">
                        <div className="absolute top-8 left-8 bottom-8 w-[2px] bg-lime-400/20 rounded-full" />
                        <span className="text-lime-500 font-black uppercase text-[10px] tracking-[0.3em] block mb-3 pl-10">{t('videoPromptLabel')}:</span>
                        <p className="text-base leading-relaxed font-semibold text-slate-700 dark:text-slate-200 whitespace-pre-wrap pl-10">
                          {scene.videoPrompt.split(' | ').map((part, pIdx) => {
                            const [label, ...content] = part.split(':');
                            return (
                              <span key={pIdx} className="block mb-4 last:mb-0 hover:bg-white dark:hover:bg-white/5 p-3 rounded-xl transition-all cursor-default group/part">
                                <span className="text-lime-500 font-black uppercase text-[9px] tracking-[0.3em] block mb-1 opacity-60 group-hover/part:opacity-100">{label}:</span>
                                <span className="opacity-80 text-md group-hover/part:opacity-100 transition-opacity">{content.join(':')}</span>
                              </span>
                            );
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3Results;
