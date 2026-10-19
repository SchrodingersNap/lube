import React from 'react';
import { Award, Sparkles, CheckCircle2, ShieldCheck, X, RotateCcw } from 'lucide-react';
import { Language, WorkerRoleId } from '../types';
import { WORKER_ROLES } from '../translations';
import { soundEngine } from '../services/soundEngine';
import { AudioNarrationButton } from './AudioNarrationButton';

interface SafetyScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  safetyScore: number;
  selectedRole: WorkerRoleId;
  language: Language;
}

export const SafetyScoreModal: React.FC<SafetyScoreModalProps> = ({
  isOpen,
  onClose,
  safetyScore,
  selectedRole,
  language
}) => {
  if (!isOpen) return null;

  const currentRole = WORKER_ROLES.find((r) => r.id === selectedRole) || WORKER_ROLES[0];

  const celebrationVoice =
    language === 'bn'
      ? `অভিনন্দন! আপনি আজকের শিফটের সুরক্ষা চ্যাম্পিয়ন ব্যাজ অর্জন করেছেন! আপনার মোট সুরক্ষা স্কোর ${safetyScore} পয়েন্ট। আপনার সতর্কতার কারণে ৩০ একর প্ল্যান্ট ও ১০০ জন সহকর্মী আজ সুরক্ষিত!`
      : language === 'hi'
      ? `बधाई हो! आपने आज का सुरक्षा चैंपियन बैज हासिल कर लिया है! आपका कुल सुरक्षा स्कोर ${safetyScore} अंक है। आपकी सतर्कता से पूरा 30 एकड़ प्लांट सुरक्षित रहा!`
      : `Congratulations! You have earned the Safety Champion badge with ${safetyScore} points today! Zero incidents achieved across the 30-acre plant!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center overflow-hidden">
        {/* Amber Glow background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 border border-slate-700/60 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Gold Trophy / Badge */}
        <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 p-1 shadow-xl shadow-amber-500/25">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-amber-400">
            <Award className="w-12 h-12" />
          </div>
          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-300 animate-spin origin-center" />
        </div>

        {/* Title */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            {language === 'bn' ? 'দৈনিক স্বীকৃতি' : language === 'hi' ? 'दैनिक सम्मान' : 'Daily Recognition'}
          </span>
          <h2 className="text-2xl font-bold text-white">
            {language === 'bn'
              ? 'সুরক্ষা চ্যাম্পিয়ন ব্যাজ!'
              : language === 'hi'
              ? 'सुरक्षा चैंपियन बैज!'
              : 'Safety Champion Badge!'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {currentRole.title[language]} · 30-Acre Lube Plant
          </p>
        </div>

        {/* Score Number Display */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-around">
          <div>
            <div className="text-xs text-slate-400">
              {language === 'bn' ? 'মোট স্কোর' : language === 'hi' ? 'कुल स्कोर' : 'Safety Score'}
            </div>
            <div className="text-3xl font-black text-amber-400 tabular-nums">
              {safetyScore}
            </div>
          </div>
          <div className="w-px h-10 bg-slate-800" />
          <div>
            <div className="text-xs text-slate-400">
              {language === 'bn' ? 'দুর্ঘটনা' : language === 'hi' ? 'दुर्घटना' : 'Incidents'}
            </div>
            <div className="text-3xl font-black text-emerald-400 tabular-nums">
              0
            </div>
          </div>
        </div>

        {/* Audio Button */}
        <div className="flex justify-center">
          <AudioNarrationButton
            textToSpeak={celebrationVoice}
            lang={language}
            size="md"
            label={language === 'bn' ? 'প্রশংসা শুনুন' : language === 'hi' ? 'प्रशंसा सुनें' : 'Listen'}
          />
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => {
            soundEngine.playClick();
            onClose();
          }}
          className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
        >
          {language === 'bn' ? 'চালিয়ে যান' : language === 'hi' ? 'जारी रखें' : 'Continue Duty'}
        </button>
      </div>
    </div>
  );
};
