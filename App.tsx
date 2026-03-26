
import React, { useState, useEffect } from 'react';
import { 
  LanguageCode, 
  ThemeMode, 
  UserPreferences, 
  VideoPlatform, 
  PainPoint, 
  ScriptResult,
  CreationTheme,
  HumorType
} from './types';
import { 
  SUPPORTED_LANGUAGES, 
  STORAGE_KEYS 
} from './constants';
import { getTranslation } from './i18n';
import Header from './components/Header';
import Step1InitialData from './components/Step1InitialData';
import Step2PainSelection from './components/Step2PainSelection';
import Step3Results from './components/Step3Results';
import SettingsModal from './components/SettingsModal';
import { 
  generatePainSuggestions, 
  generateFullScript,
  regeneratePartial 
} from './services/geminiService';
import {
  generateOpenAIPains,
  generateOpenAIScript,
  regenerateOpenAIPartial
} from './services/openaiService';
import { X } from 'lucide-react';

const App: React.FC = () => {
  const [prefs, setPrefs] = useState<UserPreferences>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (stored) return JSON.parse(stored);

    const browserLang = navigator.language.split('-')[0];
    const matched = SUPPORTED_LANGUAGES.find(l => l.code.startsWith(browserLang))?.code || 'en-US';

    return {
      langUI: matched as LanguageCode,
      langScript: matched as LanguageCode,
      theme: 'system',
      platform: 'VEO3',
      targetWordCount: 80,
      humor: 'sarcastic',
      baseScript: '',
      transcription: '',
      creationTheme: 'natural_health'
    };
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [character, setCharacter] = useState(prefs.lastObject || '');
  const [transcription, setTranscription] = useState(prefs.transcription || '');
  const [platform, setPlatform] = useState<VideoPlatform>(prefs.platform || 'VEO3');
  const [humor, setHumor] = useState<HumorType>(prefs.humor || 'sarcastic');
  const [targetWordCount, setTargetWordCount] = useState(prefs.targetWordCount || 80);
  const [selectedThemes, setSelectedThemes] = useState<CreationTheme[]>(() => {
    if (prefs.creationTheme) return [prefs.creationTheme];
    return ['natural_health'];
  });
  const [hasProduct, setHasProduct] = useState(false);
  const [productName, setProductName] = useState('');
  const [hasBaseScript, setHasBaseScript] = useState(false);
  const [baseScript, setBaseScript] = useState(prefs.baseScript || '');
  
  const [pains, setPains] = useState<PainPoint[]>([]);
  const [selectedPains, setSelectedPains] = useState<PainPoint[]>([]);
  const [results, setResults] = useState<ScriptResult[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify({
      ...prefs,
      lastObject: character,
      platform,
      humor,
      targetWordCount,
      creationTheme: selectedThemes[0],
      baseScript: hasBaseScript ? baseScript : '',
      transcription: transcription
    }));
  }, [prefs, character, platform, targetWordCount, selectedThemes, baseScript, hasBaseScript, transcription]);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = prefs.theme === 'dark' || (prefs.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
  }, [prefs.theme]);

  const handleReset = () => {
    setStep(1);
    setResults([]);
    setSelectedPains([]);
    setPains([]);
    setLoading(false);
  };

  const handleGeneratePains = async () => {
    if (!character.trim() || selectedThemes.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const isOpenAIActive = prefs.openai?.isActive && prefs.openai?.apiKey;
      
      const painPromises = selectedThemes.map(theme => {
        if (isOpenAIActive) {
          return generateOpenAIPains(
            character, 
            prefs.langUI, 
            theme, 
            prefs.openai!.apiKey, 
            prefs.openai!.model,
            transcription
          ).then(pains => pains.map(p => ({ ...p, theme })));
        }
        return generatePainSuggestions(
          character, 
          prefs.langUI, 
          theme, 
          prefs.geminiApiKey,
          transcription
        ).then(pains => pains.map(p => ({ ...p, theme })));
      });
      const allPains = await Promise.all(painPromises);
      setPains(allPains.flat());
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      console.error(e);
      setError(e.message || t('error.pains'));
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateScripts = async (selected: PainPoint[]) => {
    setLoading(true);
    setError(null);
    try {
      const isOpenAIActive = prefs.openai?.isActive && prefs.openai?.apiKey;
      
      let expandedPains: PainPoint[] = [];
      let scriptPromises: Promise<ScriptResult>[] = [];

      if (hasBaseScript) {
        // Create 3 versions for each selected pain
        selected.forEach(pain => {
          for (let i = 0; i < 3; i++) {
            const versionPain = { ...pain, title: `${pain.title} (v${i+1})` };
            expandedPains.push(versionPain);
            
            if (isOpenAIActive) {
              scriptPromises.push(
                generateOpenAIScript(
                  character,
                  versionPain,
                  platform,
                  prefs.langScript,
                  targetWordCount,
                  pain.theme || selectedThemes[0],
                  humor,
                  prefs.openai!.apiKey,
                  prefs.openai!.model,
                  hasProduct ? productName : undefined,
                  baseScript,
                  transcription
                ).then(res => ({ ...res, theme: pain.theme }))
              );
            } else {
              scriptPromises.push(
                generateFullScript(
                  character, 
                  versionPain, 
                  platform, 
                  prefs.langScript, 
                  targetWordCount,
                  pain.theme || selectedThemes[0],
                  humor,
                  hasProduct ? productName : undefined,
                  baseScript,
                  prefs.geminiApiKey,
                  transcription
                ).then(res => ({ ...res, theme: pain.theme }))
              );
            }
          }
        });
      } else {
        expandedPains = [...selected];
        scriptPromises = selected.map(pain => {
              if (isOpenAIActive) {
                return generateOpenAIScript(
                  character,
                  pain,
                  platform,
                  prefs.langScript,
                  targetWordCount,
                  pain.theme || selectedThemes[0],
                  humor,
                  prefs.openai!.apiKey,
                  prefs.openai!.model,
                  hasProduct ? productName : undefined,
                  undefined,
                  transcription
                ).then(res => ({ ...res, theme: pain.theme }));
              }
              return generateFullScript(
                character, 
                pain, 
                platform, 
                prefs.langScript, 
                targetWordCount,
                pain.theme || selectedThemes[0],
                humor,
                hasProduct ? productName : undefined,
                undefined,
                prefs.geminiApiKey,
                transcription
              ).then(res => ({ ...res, theme: pain.theme }));
            });
      }

      setSelectedPains(expandedPains);
      const allResults = await Promise.all(scriptPromises);
      setResults(allResults);
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      console.error(e);
      setError(e.message || t('error.scripts'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegeneratePart = async (type: 'script' | 'image' | 'scenes', index: number) => {
    if (results.length === 0 || !selectedPains[index]) return;
    setLoading(true);
    setError(null);
    try {
      const currentResult = results[index];
      const isOpenAIActive = prefs.openai?.isActive && prefs.openai?.apiKey;

      let partial;
      if (isOpenAIActive) {
        partial = await regenerateOpenAIPartial(
          type,
          currentResult,
          character,
          selectedPains[index],
          prefs.langScript,
          targetWordCount,
          currentResult.theme || selectedThemes[0],
          humor,
          prefs.openai!.apiKey,
          prefs.openai!.model,
          hasProduct ? productName : undefined,
          transcription
        );
      } else {
        partial = await regeneratePartial(
          type,
          currentResult,
          character,
          selectedPains[index],
          prefs.langScript,
          targetWordCount,
          currentResult.theme || selectedThemes[0],
          humor,
          hasProduct ? productName : undefined,
          prefs.geminiApiKey,
          transcription
        );
      }

      setResults(prev => {
        const newResults = [...prev];
        const current = newResults[index];
        if (!current) return prev;

        if (type === 'script') {
          newResults[index] = { ...current, script: partial.script, provocativeTitle: partial.provocativeTitle };
        } else if (type === 'image') {
          newResults[index] = { ...current, initialImagePrompt: partial.initialImagePrompt };
        } else if (type === 'scenes') {
          newResults[index] = { ...current, scenes: partial.scenes };
        }
        return newResults;
      });
    } catch (e: any) {
      console.error(e);
      setError(e.message || t('error.regenerate'));
    } finally {
      setLoading(false);
    }
  };

  const t = (key: string) => getTranslation(prefs.langUI, key);

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-50 selection:bg-lime-400 selection:text-slate-900 transition-colors duration-500">
      <Header prefs={prefs} setPrefs={setPrefs} t={t} onOpenSettings={() => setIsSettingsOpen(true)} onHome={handleReset} />

      <main className="max-w-6xl mx-auto pt-32 pb-24 px-6">
        {error && (
          <div className="mb-8 p-6 bg-red-500/10 border-2 border-red-500/20 rounded-[2rem] flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shrink-0">
                <X size={20} strokeWidth={3} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 opacity-60">{t('error.api')}</span>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="flex flex-col items-center mb-16 space-y-4">
          <div className="flex items-center gap-3">
             {[1, 2, 3].map(s => (
                <div key={s} className="flex items-center">
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all duration-500 transform ${
                      step === s 
                        ? 'bg-lime-400 text-slate-900 scale-125 shadow-xl shadow-lime-400/40 rotate-6' 
                        : step > s 
                          ? 'bg-green-500 text-white shadow-lg' 
                          : 'bg-slate-200 dark:bg-slate-800 opacity-40'
                    }`}
                  >
                    {step > s ? '✓' : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-8 sm:w-16 h-1.5 rounded-full mx-2 transition-colors duration-500 ${step > s ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-800 opacity-20'}`} />
                  )}
                </div>
              ))}
          </div>
          <div className="text-[11px] font-black uppercase tracking-[0.4em] opacity-40">
            {t('currentStage')} {t(`step${step}`)}
          </div>
        </div>

        <div className="transition-all duration-500 ease-out">
          {step === 1 && (
            <Step1InitialData 
              character={character} setCharacter={setCharacter}
              transcription={transcription} setTranscription={setTranscription}
              platform={platform} setPlatform={setPlatform}
              humor={humor} setHumor={setHumor}
              targetWordCount={targetWordCount} setTargetWordCount={setTargetWordCount}
              selectedThemes={selectedThemes} setSelectedThemes={setSelectedThemes}
              hasProduct={hasProduct} setHasProduct={setHasProduct}
              productName={productName} setProductName={setProductName}
              hasBaseScript={hasBaseScript} setHasBaseScript={setHasBaseScript}
              baseScript={baseScript} setBaseScript={setBaseScript}
              onSubmit={handleGeneratePains} loading={loading} t={t}
            />
          )}

          {step === 2 && (
            <Step2PainSelection 
              pains={pains} 
              setPains={setPains}
              onSelect={(pain) => handleGenerateScripts([pain])}
              onSelectMultiple={handleGenerateScripts}
              onBack={() => setStep(1)}
              loading={loading}
              t={t}
            />
          )}

          {step === 3 && results.length > 0 && (
            <Step3Results 
              results={results}
              onRegenerate={() => handleGenerateScripts(selectedPains)}
              onRegeneratePart={handleRegeneratePart}
              onReset={handleReset}
              onChooseAnother={() => {
                setStep(2);
                setResults([]);
                setSelectedPains([]);
              }}
              selectedPains={selectedPains}
              character={character}
              loading={loading}
              t={t}
            />
          )}
        </div>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        prefs={prefs} 
        setPrefs={setPrefs} 
        t={t} 
      />

      {loading && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pb-12 pointer-events-none px-6">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-10 py-6 rounded-[2rem] shadow-2xl border border-lime-400/30 flex items-center gap-6 animate-in slide-in-from-bottom-10 pointer-events-auto ring-8 ring-lime-400/5">
            <div className="relative w-10 h-10">
               <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
               <div className="absolute inset-0 rounded-full border-4 border-lime-400 border-t-transparent animate-spin" />
            </div>
            <div className="flex flex-col">
              <span className="font-black uppercase tracking-[0.2em] text-sm text-lime-500">{t('loading')}</span>
              <span className="text-[10px] font-bold opacity-40 uppercase">{t('loadingSubtext')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
