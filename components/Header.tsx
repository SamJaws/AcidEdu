
import React, { useState, useRef, useEffect } from 'react';
import { UserPreferences, LanguageCode, ThemeMode, LanguageOption } from '../types';
import { SUPPORTED_LANGUAGES } from '../constants';

interface HeaderProps {
  prefs: UserPreferences;
  setPrefs: React.Dispatch<React.SetStateAction<UserPreferences>>;
  t: (key: string) => string;
  onOpenSettings: () => void;
  onHome: () => void;
}

const CustomDropdown: React.FC<{
  label: string;
  value: LanguageCode;
  onChange: (code: LanguageCode) => void;
  options: LanguageOption[];
}> = ({ label, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.code === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col items-center gap-1.5" ref={dropdownRef}>
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800/80 border-none py-2 px-3 rounded-xl focus:ring-2 ring-lime-400/50 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
        >
          {selectedOption && (
            <img 
              src={`https://flagcdn.com/w40/${selectedOption.countryCode}.png`} 
              className="w-7 h-5 object-cover rounded-md shadow-sm flag-icon"
              alt={selectedOption.code}
            />
          )}
          <div className="text-slate-400">
            <svg className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute top-full mt-3 right-0 md:left-1/2 md:-translate-x-1/2 w-56 bg-white dark:bg-slate-900 rounded-[1.5rem] py-3 z-50 custom-select-shadow border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="max-h-64 overflow-y-auto no-scrollbar px-2 space-y-1">
              {options.map((opt) => (
                <button
                  key={opt.code}
                  onClick={() => {
                    onChange(opt.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black transition-all text-left ${
                    value === opt.code 
                      ? 'bg-lime-400 text-slate-900 shadow-md shadow-lime-400/20' 
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <img 
                    src={`https://flagcdn.com/w40/${opt.countryCode}.png`} 
                    className="w-6 h-4 object-cover rounded-sm shadow-sm" 
                    alt={opt.code} 
                  />
                  <div className="flex flex-col">
                    <span className="uppercase tracking-widest">{opt.code}</span>
                    <span className="text-[9px] opacity-40 font-bold">{opt.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ prefs, setPrefs, t, onOpenSettings, onHome }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-40 glass border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onHome}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-lime-300 to-green-500 flex items-center justify-center shadow-lg shadow-lime-400/30 transform hover:rotate-6 transition-transform cursor-pointer border-none"
            title={t('home')}
          >
            <span className="text-2xl font-black text-slate-900">A</span>
          </button>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight leading-none">
              AcidEdu <span className="text-lime-500">Persona</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40 hidden sm:block mt-1">{t('version')}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-10">
          <div className="flex items-center gap-6 sm:gap-10">
            <CustomDropdown 
              label={t('uiLanguage')} 
              value={prefs.langUI} 
              onChange={(code) => setPrefs(p => ({ ...p, langUI: code }))} 
              options={SUPPORTED_LANGUAGES}
            />
            <CustomDropdown 
              label={t('scriptLanguage')} 
              value={prefs.langScript} 
              onChange={(code) => setPrefs(p => ({ ...p, langScript: code }))} 
              options={SUPPORTED_LANGUAGES}
            />
          </div>

          <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block" />

          <div className="flex items-center gap-3">
            <button 
              onClick={onOpenSettings}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-lime-400 dark:hover:bg-lime-400 hover:text-slate-900 transition-all active:scale-90 shadow-sm group"
              title={t('settings.title')}
            >
              <span className="text-xl group-hover:rotate-90 transition-transform">⚙️</span>
            </button>

            <button 
              onClick={() => {
                const modes: ThemeMode[] = ['light', 'dark', 'system'];
                const next = modes[(modes.indexOf(prefs.theme) + 1) % modes.length];
                setPrefs(p => ({ ...p, theme: next }));
              }}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-lime-400 dark:hover:bg-lime-400 hover:text-slate-900 transition-all active:scale-90 shadow-sm group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {prefs.theme === 'light' ? '🌞' : prefs.theme === 'dark' ? '🌙' : '💻'}
              </span>
            </button>

            <div className="relative group cursor-pointer hidden md:block">
              <div className="w-12 h-12 rounded-2xl border-2 border-lime-400/50 p-1 overflow-hidden transform hover:scale-105 transition-transform shadow-lg shadow-lime-400/10">
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=AcidPersona&backgroundColor=b6e3f4" alt="User" className="w-full h-full object-cover rounded-xl" />
              </div>
              <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
