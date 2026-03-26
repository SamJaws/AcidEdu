
import { LanguageOption, VideoPlatform, CreationTheme, HumorType } from './types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'pt-BR', label: 'Português (BR)', flag: '🇧🇷', countryCode: 'br' },
  { code: 'en-US', label: 'English (US)', flag: '🇺🇸', countryCode: 'us' },
  { code: 'en-GB', label: 'English (UK)', flag: '🇬🇧', countryCode: 'gb' },
  { code: 'es-ES', label: 'Español (ES)', flag: '🇪🇸', countryCode: 'es' },
  { code: 'es-MX', label: 'Español (MX)', flag: '🇲🇽', countryCode: 'mx' },
  { code: 'de-DE', label: 'Deutsch', flag: '🇩🇪', countryCode: 'de' },
  { code: 'it-IT', label: 'Italiano', flag: '🇮🇹', countryCode: 'it' },
  { code: 'fr-FR', label: 'Français', flag: '🇫🇷', countryCode: 'fr' },
  { code: 'pl-PL', label: 'Polski', flag: '🇵🇱', countryCode: 'pl' },
];

export const HUMOR_OPTIONS: { value: HumorType; label: string; emoji: string }[] = [
  { value: 'normal', label: 'humor.normal', emoji: '😐' },
  { value: 'funny', label: 'humor.funny', emoji: '😂' },
  { value: 'dramatic', label: 'humor.dramatic', emoji: '🎭' },
  { value: 'sarcastic', label: 'humor.sarcastic', emoji: '😏' },
  { value: 'aggressive', label: 'humor.aggressive', emoji: '😤' },
  { value: 'ironic', label: 'humor.ironic', emoji: '🙃' },
  { value: 'cynical', label: 'humor.cynical', emoji: '🙄' },
  { value: 'mocking', label: 'humor.mocking', emoji: '😜' },
  { value: 'stoic', label: 'humor.stoic', emoji: '🗿' },
  { value: 'nihilistic', label: 'humor.nihilistic', emoji: '🌌' },
];

export const PLATFORMS: { value: VideoPlatform; label: string; duration: string }[] = [
  { value: 'VEO3', label: 'platform.veo3', duration: '8' },
  { value: 'Sora2-15', label: 'platform.sora2', duration: '15' },
  { value: 'Sora2-25', label: 'platform.sora2', duration: '25' },
  { value: 'Grok-6', label: 'platform.grok', duration: '6' },
  { value: 'SuperGrok-10', label: 'platform.supergrok', duration: '10' },
];

export const WORD_COUNT_OPTIONS = [
  { value: 80, label: 'wordCount.80' },
  { value: 110, label: 'wordCount.110' },
  { value: 170, label: 'wordCount.170' },
  { value: 370, label: 'wordCount.370' },
];

export const CREATION_THEMES: { value: CreationTheme; label: string; emoji: string }[] = [
  { value: 'natural_health', label: 'theme.natural_health', emoji: '🌿' },
  { value: 'finance', label: 'theme.finance', emoji: '📉' },
  { value: 'tech_dev', label: 'theme.tech_dev', emoji: '⌨️' },
  { value: 'dating', label: 'theme.dating', emoji: '💔' },
  { value: 'fitness', label: 'theme.fitness', emoji: '🏋️' },
  { value: 'career', label: 'theme.career', emoji: '🏢' },
];

export const OPENAI_MODELS = [
  { value: 'gpt-4o-mini', label: 'openai.gpt4omini' },
  { value: 'gpt-4o', label: 'openai.gpt4o' },
  { value: 'gpt-4-turbo', label: 'openai.gpt4turbo' },
  { value: 'gpt-3.5-turbo', label: 'openai.gpt35turbo' },
];

export const STORAGE_KEYS = {
  PREFERENCES: 'acid_edu_v1_prefs',
};
