export type SupportedLanguage =
  | 'ar' // العربية
  | 'en' // English
  | 'fr' // Français
  | 'es' // Español
  | 'it' // Italiano
  | 'de' // Deutsch
  | 'ru' // Русский
  | 'zh' // 中文
  | 'tr' // Türkçe
  | 'fa'; // فارسی

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  dir: 'rtl' | 'ltr';
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr', flag: '🇪🇸' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr', flag: '🇮🇹' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr', flag: '🇨🇳' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr', flag: '🇹🇷' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', dir: 'rtl', flag: '🇮🇷' },
];

export type TranslationKey =
  | 'brand_name'
  | 'brand_subtitle'
  | 'tagline'
  | 'nav_home'
  | 'nav_calc'
  | 'nav_news'
  | 'nav_world_perfumes'
  | 'nav_raw_materials'
  | 'nav_pyramid'
  | 'nav_alcohol'
  | 'nav_costing'
  | 'nav_ai_master'
  | 'nav_library'
  | 'nav_guide'
  | 'print_spec'
  | 'sign_in'
  | 'sign_up'
  | 'account'
  | 'logout'
  | 'privacy_data'
  | 'regional_env'
  | 'climate_environment'
  | 'hot_arid'
  | 'mediterranean'
  | 'cold_temperate'
  | 'tropical_humid'
  | 'hero_title'
  | 'hero_desc'
  | 'hero_btn_calc'
  | 'hero_btn_news'
  | 'hero_btn_ai'
  | 'bottle_volume'
  | 'target_concentration'
  | 'oil_weight'
  | 'alcohol_weight'
  | 'water_weight'
  | 'fixative_weight'
  | 'maceration_days'
  | 'save_formula'
  | 'load_formula'
  | 'copy'
  | 'copied';
