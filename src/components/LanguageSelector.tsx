import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { SupportedLanguage, SUPPORTED_LANGUAGES, LanguageConfig } from '../types/i18n';

interface LanguageSelectorProps {
  currentLang: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onSelectLanguage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-200 hover:border-stone-300 bg-white text-stone-700 text-xs font-medium transition-all shadow-2xs cursor-pointer"
        title="تغيير لغة الموقع / Change Language"
      >
        <span className="text-sm">{activeConfig.flag}</span>
        <span className="hidden sm:inline font-semibold">{activeConfig.nativeName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1.5 left-0 sm:right-0 sm:left-auto z-50 w-56 rounded-2xl bg-white border border-stone-200 shadow-xl overflow-hidden py-1.5 animate-in fade-in zoom-in-95 text-xs text-stone-800">
          <div className="px-3 py-2 border-b border-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-700" />
              <span>اختر لغة الموقع</span>
            </span>
            <span>10 لغات</span>
          </div>

          <div className="max-h-72 overflow-y-auto py-1">
            {SUPPORTED_LANGUAGES.map((lang: LanguageConfig) => {
              const isSelected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 flex items-center justify-between transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{lang.flag}</span>
                    <div className="text-right">
                      <div className="font-medium">{lang.nativeName}</div>
                      <div className="text-[10px] text-stone-400">{lang.name} ({lang.dir.toUpperCase()})</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-700" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
