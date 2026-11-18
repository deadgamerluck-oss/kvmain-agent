import React from 'react';
import { LANGUAGES } from '@/data/sampleData';
import { SupportedLanguage } from '@/types/models';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  variant?: 'compact' | 'full';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  variant = 'compact',
  className
}) => {
  return (
    <div className={cn('relative inline-flex items-center gap-1.5', className)}>
      <Globe className="w-4 h-4 text-slate-500 pointer-events-none" />
      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
          className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg pl-2.5 pr-7 py-1.5 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer shadow-sm"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name} ({lang.nativeName})
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400">
          <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
      {variant === 'full' && (
        <span className="text-[11px] text-slate-400 font-normal">
          UI Language Preview
        </span>
      )}
    </div>
  );
};
