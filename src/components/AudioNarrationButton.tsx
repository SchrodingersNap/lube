import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { speechNarrator } from '../services/speechNarrator';
import { soundEngine } from '../services/soundEngine';
import { Language } from '../types';

interface AudioNarrationButtonProps {
  textToSpeak: string;
  lang: Language;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'subtle' | 'pill';
  label?: string;
  className?: string;
  autoSpeakOnMount?: boolean;
}

export const AudioNarrationButton: React.FC<AudioNarrationButtonProps> = ({
  textToSpeak,
  lang,
  size = 'md',
  variant = 'primary',
  label,
  className = '',
  autoSpeakOnMount = false
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = speechNarrator.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (autoSpeakOnMount && textToSpeak) {
      const timer = setTimeout(() => {
        speechNarrator.speak(textToSpeak, lang);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [textToSpeak, lang, autoSpeakOnMount]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playClick();
    if (isSpeaking) {
      speechNarrator.stop();
    } else {
      speechNarrator.speak(textToSpeak, lang);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base'
  };

  const getAriaLabel = () => {
    if (lang === 'bn') return 'কথা শুনুন';
    if (lang === 'hi') return 'आवाज सुनें';
    return 'Listen to voice';
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={getAriaLabel()}
      title={getAriaLabel()}
      className={`inline-flex items-center gap-2 font-medium rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
        isSpeaking
          ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400 animate-pulse'
          : variant === 'primary'
          ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40'
          : variant === 'subtle'
          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
          : 'bg-slate-900/90 text-amber-400 border border-amber-500/30 hover:border-amber-400'
      } ${sizeClasses[size]} ${className}`}
    >
      {isSpeaking ? (
        <span className="flex items-center gap-1">
          <span className="w-1 h-3 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1 h-4 bg-slate-950 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1 h-2.5 bg-slate-950 rounded-full animate-bounce" />
        </span>
      ) : (
        <Volume2 className={size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} />
      )}
      {label && <span>{label}</span>}
      {!label && (
        <span className="font-semibold text-xs tracking-wide">
          {lang === 'bn' ? (isSpeaking ? 'থামান' : 'শুনুন') : lang === 'hi' ? (isSpeaking ? 'रोकें' : 'सुनें') : isSpeaking ? 'Stop' : 'Listen'}
        </span>
      )}
    </button>
  );
};
