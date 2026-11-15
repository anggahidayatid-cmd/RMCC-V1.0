import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../i18n';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'buttons';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'dropdown', className = '' }) => {
  const { language, setLanguage } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

      if (variant === 'buttons') {
    return (
      <div className={`flex items-center space-x-2 bg-background p-1.5 rounded-xl border border-border ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage('id')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
            language === 'id'
              ? 'bg-primary text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-dark hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
          }`}
        >
          <span>🇮🇩</span>
          <span>Bahasa Indonesia</span>
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
            language === 'en'
              ? 'bg-primary text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:text-dark hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
          }`}
        >
          <span>🇺🇸</span>
          <span>English</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 bg-background hover:bg-slate-100 dark:hover:bg-slate-800 border border-border px-3 py-1.5 rounded-full text-xs font-bold text-dark transition-all shadow-2xs group"
        aria-label="Language Selector"
      >
        <Globe className="w-3.5 h-3.5 text-primary group-hover:rotate-12 transition-transform" />
        <span className="flex items-center space-x-1">
          <span>{language === 'id' ? '🇮🇩 ID' : '🇺🇸 EN'}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-2xl shadow-xl z-50 py-1.5 text-xs text-dark animate-fadeIn">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-muted border-b border-border">
            Select Language / Bahasa
          </div>
          <button
            type="button"
            onClick={() => {
              setLanguage('id');
              setOpen(false);
            }}
            className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-background transition-colors ${
              language === 'id' ? 'font-bold text-primary bg-primary/5' : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm">🇮🇩</span>
              <span>Bahasa Indonesia</span>
            </div>
            {language === 'id' && <Check className="w-4 h-4 text-primary shrink-0" />}
          </button>

          <button
            type="button"
            onClick={() => {
              setLanguage('en');
              setOpen(false);
            }}
            className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-background transition-colors ${
              language === 'en' ? 'font-bold text-primary bg-primary/5' : 'text-slate-700 dark:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm">🇺🇸</span>
              <span>English</span>
            </div>
            {language === 'en' && <Check className="w-4 h-4 text-primary shrink-0" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
