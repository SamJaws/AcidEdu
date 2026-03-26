import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Key, Cpu, ToggleLeft, ToggleRight, Save, Info } from 'lucide-react';
import { UserPreferences } from '../types';
import { OPENAI_MODELS } from '../constants';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefs: UserPreferences;
  setPrefs: React.Dispatch<React.SetStateAction<UserPreferences>>;
  t: (key: string) => string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, prefs, setPrefs, t }) => {
  const [openaiKey, setOpenaiKey] = useState(prefs.openai?.apiKey || '');
  const [geminiKey, setGeminiKey] = useState(prefs.geminiApiKey || '');
  const [model, setModel] = useState(prefs.openai?.model || 'gpt-4o-mini');
  const [isActive, setIsActive] = useState(prefs.openai?.isActive || false);

  // Sync local state with prefs when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setOpenaiKey(prefs.openai?.apiKey || '');
      setGeminiKey(prefs.geminiApiKey || '');
      setModel(prefs.openai?.model || 'gpt-4o-mini');
      setIsActive(prefs.openai?.isActive || false);
    }
  }, [isOpen, prefs]);

  const handleSave = () => {
    setPrefs(prev => ({
      ...prev,
      geminiApiKey: geminiKey,
      openai: {
        apiKey: openaiKey,
        model,
        isActive
      }
    }));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 md:p-10 pb-4 flex items-center justify-between shrink-0">
              <div>
                <span className="text-lime-500 font-black text-[10px] uppercase tracking-[0.3em] mb-1 block">
                  {t('settings.title')}
                </span>
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  {t('settings.apiConfig')}
                </h2>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all hover:rotate-90"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-8 md:p-10 pt-0 space-y-8 overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                {/* Gemini Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Key size={14} strokeWidth={3} />
                    <label className="text-[11px] font-black uppercase tracking-[0.2em]">
                      {t('settings.geminiKeyOptional')}
                    </label>
                  </div>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      placeholder="AIza..."
                      className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl px-6 py-4 focus:ring-4 ring-lime-400/20 focus:bg-white dark:focus:bg-slate-800 focus:border-lime-400/50 transition-all font-bold text-sm outline-none"
                    />
                  </div>
                  <div className="flex items-start gap-2 px-1">
                    <Info size={12} className="text-slate-400 mt-0.5" />
                    <p className="text-[10px] text-slate-400 italic">
                      {t('settings.geminiKeyHelp')}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />

                {/* OpenAI Section */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Key size={14} strokeWidth={3} />
                      <label className="text-[11px] font-black uppercase tracking-[0.2em]">
                        {t('settings.openaiKey')}
                      </label>
                    </div>
                    <input 
                      type="password" 
                      value={openaiKey}
                      onChange={(e) => setOpenaiKey(e.target.value)}
                      placeholder={t('settings.apiKeyPlaceholder')}
                      className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl px-6 py-4 focus:ring-4 ring-lime-400/20 focus:bg-white dark:focus:bg-slate-800 focus:border-lime-400/50 transition-all font-bold text-sm outline-none"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Cpu size={14} strokeWidth={3} />
                      <label className="text-[11px] font-black uppercase tracking-[0.2em]">
                        {t('settings.selectedModel')}
                      </label>
                    </div>
                    <div className="relative">
                      <select 
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl px-6 py-4 focus:ring-4 ring-lime-400/20 focus:border-lime-400/50 transition-all font-black text-sm cursor-pointer outline-none appearance-none"
                      >
                        {OPENAI_MODELS.map(m => (
                          <option key={m.value} value={m.value}>{t(m.label)}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={() => setIsActive(!isActive)}
                      className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all group ${
                        isActive 
                          ? 'bg-lime-400/5 border-lime-400/30' 
                          : 'bg-slate-50 dark:bg-slate-800/40 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className={`font-black text-sm tracking-tight transition-colors ${isActive ? 'text-lime-500' : ''}`}>
                          {t('settings.activateOpenAI')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {t('settings.useInsteadOfGemini')}
                        </span>
                      </div>
                      <div className={`transition-all duration-300 ${isActive ? 'text-lime-500 scale-110' : 'text-slate-300'}`}>
                        {isActive ? <ToggleRight size={32} strokeWidth={2.5} /> : <ToggleLeft size={32} strokeWidth={2.5} />}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 md:p-10 pt-4 shrink-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={handleSave}
                className="w-full py-5 rounded-2xl bg-lime-400 text-slate-900 font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-lime-400/30 flex items-center justify-center gap-3"
              >
                <Save size={18} strokeWidth={3} />
                {t('settings.saveKeys')}
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-4 font-bold uppercase tracking-widest">
                {t('settings.saveLocalInfo')}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
