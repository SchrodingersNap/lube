import React from 'react';
import { 
  Cylinder, 
  Package, 
  Truck, 
  Flame, 
  Wrench, 
  ClipboardCheck, 
  ArrowRight, 
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { WORKER_ROLES, PPE_ITEMS } from '../translations';
import { WorkerRole, WorkerRoleId, Language } from '../types';
import { AudioNarrationButton } from './AudioNarrationButton';
import { soundEngine } from '../services/soundEngine';
import { speechNarrator } from '../services/speechNarrator';

interface RoleSelectorProps {
  selectedRole: WorkerRoleId;
  onSelectRole: (roleId: WorkerRoleId) => void;
  onConfirmRole: () => void;
  language: Language;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelectRole,
  onConfirmRole,
  language
}) => {
  const getRoleIcon = (iconName: string, className: string = 'w-7 h-7') => {
    switch (iconName) {
      case 'barrel':
        return <Cylinder className={className} />;
      case 'bottle':
        return <Package className={className} />;
      case 'forklift':
        return <Truck className={className} />;
      case 'kettle':
        return <Flame className={className} />;
      case 'wrench':
        return <Wrench className={className} />;
      case 'clipboard':
        return <ClipboardCheck className={className} />;
      default:
        return <UserCheck className={className} />;
    }
  };

  const currentRoleObj = WORKER_ROLES.find((r) => r.id === selectedRole) || WORKER_ROLES[0];

  const handleCardClick = (role: WorkerRole) => {
    soundEngine.playClick();
    onSelectRole(role.id);
    const voiceText =
      language === 'bn'
        ? `আপনি বেছে নিয়েছেন ${role.title.bn}। ${role.subtitle.bn}।`
        : language === 'hi'
        ? `आपने चुना है ${role.title.hi}। ${role.subtitle.hi}।`
        : `Selected ${role.title.en}. ${role.subtitle.en}.`;
    speechNarrator.speak(voiceText, language);
  };

  const headerVoiceText =
    language === 'bn'
      ? 'আজকের প্ল্যান্ট ডিউটি বেছে নিন। আপনি কি ব্যারেল ফিলিং, স্মলপ্যাক, ফর্কলিফট, কেটলি অপারেটর নাকি সেফটি সুপারভাইজার হিসেবে কাজ করছেন?'
      : language === 'hi'
      ? 'आज की प्लांट ड्यूटी चुनें। क्या आपकी ड्यूटी आज बैरल फिलिंग, स्मॉलपैक, फोर्कलिफ्ट, केतली ऑपरेटर या सेफ्टी सुपरवाइजर की है?'
      : 'Select your duty for today. Choose your operational role across our 30-acre lube blending facility.';

  return (
    <div className="space-y-6">
      {/* Visual Header with Voice Prompt */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase">
                {language === 'bn' ? 'ধাপ ১ : ডিউটি নির্বাচন' : language === 'hi' ? 'चरण 1 : ड्यूटी चयन' : 'Step 1: Shift Duty'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400 text-xs">
                {language === 'bn' ? '১০০+ কর্মী ও সুপারভাইজার' : language === 'hi' ? '100+ कामगार व सुपरवाइजर' : '100+ Workers & Supervisors'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {language === 'bn' ? 'আজকের প্ল্যান্ট ডিউটি বেছে নিন' : language === 'hi' ? 'आज की प्लांट ड्यूटी चुनें' : 'Choose Your Shift Duty for Today'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {language === 'bn'
                ? 'আপনার কাজের ওপর নির্ভর করে সঠিক পিপিই পোশাক এবং সম্ভাব্য বিপদ নির্ধারিত হবে।'
                : language === 'hi'
                ? 'आपके काम के अनुसार ही जरूरी सुरक्षा उपकरण (पीपीई) और खतरे तय होंगे।'
                : 'Select your assigned task today to customize PPE requirements and hazard simulations.'}
            </p>
          </div>
          <div className="shrink-0">
            <AudioNarrationButton
              textToSpeak={headerVoiceText}
              lang={language}
              size="lg"
              label={language === 'bn' ? 'নির্দেশ শুনুন' : language === 'hi' ? 'निर्देश सुनें' : 'Listen'}
            />
          </div>
        </div>
      </div>

      {/* Role Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {WORKER_ROLES.map((role) => {
          const isSelected = role.id === selectedRole;
          const cardVoiceText =
            language === 'bn'
              ? `${role.title.bn}। ${role.subtitle.bn}। প্রয়োজনীয় পিপিই সংখ্যা: ${role.requiredPPE.length}টি।`
              : language === 'hi'
              ? `${role.title.hi}। ${role.subtitle.hi}। आवश्यक पीपीई: ${role.requiredPPE.length} वस्तुएं।`
              : `${role.title.en}. ${role.subtitle.en}. Required PPE: ${role.requiredPPE.length} items.`;

          return (
            <div
              key={role.id}
              onClick={() => handleCardClick(role)}
              className={`group relative rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-800/95 border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-amber-500/10 -translate-y-1'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="space-y-4">
                {/* Header row with Icon and Audio button */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${role.color} shadow-md group-hover:scale-105 transition-transform`}
                  >
                    {getRoleIcon(role.icon, 'w-7 h-7')}
                  </div>
                  <div className="flex items-center gap-2">
                    <AudioNarrationButton
                      textToSpeak={cardVoiceText}
                      lang={language}
                      size="sm"
                      variant="subtle"
                    />
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'border-amber-400 bg-amber-400 text-slate-950 font-bold text-xs'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      {isSelected && '✓'}
                    </div>
                  </div>
                </div>

                {/* Role Titles */}
                <div>
                  <div className="text-xs font-medium text-amber-400 mb-1">
                    {role.badge[language]}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                    {role.title[language]}
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm mt-1.5 line-clamp-2">
                    {role.subtitle[language]}
                  </p>
                </div>

                {/* Required PPE icons miniature preview */}
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[11px] text-slate-400 font-medium mb-1.5 flex items-center justify-between">
                    <span>
                      {language === 'bn' ? 'জরুরী পিপিই সরঞ্জাম:' : language === 'hi' ? 'अनिवार्य पीपीई सामान:' : 'Mandatory PPE:'}
                    </span>
                    <span className="text-amber-400 font-semibold">{role.requiredPPE.length}টি</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {role.requiredPPE.map((ppeId) => {
                      const ppe = PPE_ITEMS.find((p) => p.id === ppeId);
                      if (!ppe) return null;
                      return (
                        <span
                          key={ppeId}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300"
                        >
                          {ppe.name[language].split(' ')[0]}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom selection indicator */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className={isSelected ? 'text-amber-400 font-semibold' : 'text-slate-400'}>
                  {isSelected
                    ? language === 'bn'
                      ? 'বাছাই সম্পন্ন'
                      : language === 'hi'
                      ? 'चयनित'
                      : 'Selected'
                    : language === 'bn'
                    ? 'বাছাই করতে চাপুন'
                    : language === 'hi'
                    ? 'चुनने के लिए दबाएं'
                    : 'Click to select'}
                </span>
                <span className={`transition-transform ${isSelected ? 'translate-x-1 text-amber-400' : 'text-slate-500'}`}>
                  →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Action Button (Proceed to PPE Station) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            {getRoleIcon(currentRoleObj.icon, 'w-5 h-5')}
          </div>
          <div>
            <div className="text-xs text-slate-400">
              {language === 'bn' ? 'নির্বাচিত ডিউটি:' : language === 'hi' ? 'चुनी गई ड्यूटी:' : 'Active Duty:'}
            </div>
            <div className="text-base font-bold text-white">
              {currentRoleObj.title[language]}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playSuccess();
            onConfirmRole();
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer whitespace-nowrap"
        >
          <span>
            {language === 'bn'
              ? 'পিপিই লকার রুমে চলুন'
              : language === 'hi'
              ? 'पीपीई लॉकर रूम में जाएं'
              : 'Proceed to PPE Locker Room'}
          </span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
