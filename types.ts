
export type LanguageCode = 'pt-BR' | 'en-US' | 'en-GB' | 'es-ES' | 'es-MX' | 'de-DE' | 'it-IT' | 'fr-FR' | 'pl-PL';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
  countryCode: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type VideoPlatform = 'VEO3' | 'Sora2-15' | 'Sora2-25' | 'Grok-6' | 'SuperGrok-10';

export type CreationTheme = 'natural_health' | 'finance' | 'tech_dev' | 'dating' | 'fitness' | 'career';

export type HumorType = 'sarcastic' | 'aggressive' | 'ironic' | 'cynical' | 'mocking' | 'normal' | 'funny' | 'dramatic' | 'stoic' | 'nihilistic';

export interface UserPreferences {
  langUI: LanguageCode;
  langScript: LanguageCode;
  theme: ThemeMode;
  lastObject?: string;
  platform?: VideoPlatform;
  targetWordCount?: number;
  humor?: HumorType;
  baseScript?: string;
  transcription?: string;
  creationTheme?: CreationTheme;
  openai?: {
    apiKey: string;
    model: string;
    isActive: boolean;
  };
  geminiApiKey?: string;
}

export interface PainPoint {
  id: string;
  title: string;
  description: string;
  theme?: CreationTheme;
}

export interface ScriptResult {
  theme?: CreationTheme;
  humor?: HumorType;
  provocativeTitle: string;
  script: string;
  initialImagePrompt: string;
  thumbnailPrompt: string;
  scenes: {
    sentence: string;
    imagePrompt: string;
    videoPrompt: string;
    time: string;
  }[];
  voiceConfig: {
    personaName: string;
    description: string;
    tone: string;
    speed: string;
    stability: string;
    pitch: string;
    timbreDetail: string;
  };
}
