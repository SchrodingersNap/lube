import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  RotateCcw, 
  ArrowRight, 
  Sparkles,
  Zap,
  HardHat,
  Eye,
  Hand,
  Footprints,
  Shirt,
  Headphones,
  Wind,
  Shield
} from 'lucide-react';
import { PPE_ITEMS, WORKER_ROLES } from '../translations';
import { PPEItemId, WorkerRoleId, Language } from '../types';
import { AudioNarrationButton } from './AudioNarrationButton';
import { soundEngine } from '../services/soundEngine';
import { speechNarrator } from '../services/speechNarrator';

interface PPEStationProps {
  selectedRole: WorkerRoleId;
  equippedPPE: Set<PPEItemId>;
  onTogglePPE: (ppeId: PPEItemId) => void;
  onEquipAllRequired: () => void;
  onResetPPE: () => void;
  onGoToConsequences: () => void;
  language: Language;
}

export const PPEStation: React.FC<PPEStationProps> = ({
  selectedRole,
  equippedPPE,
  onTogglePPE,
  onEquipAllRequired,
  onResetPPE,
  onGoToConsequences,
  language
}) => {
  const [activePreviewPPE, setActivePreviewPPE] = useState<PPEItemId | null>(null);

  const currentRole = WORKER_ROLES.find((r) => r.id === selectedRole) || WORKER_ROLES[0];
  const requiredPPEList = currentRole.requiredPPE;

  // Check missing mandatory PPE
  const missingRequired = requiredPPEList.filter((id) => !equippedPPE.has(id));
  const isFullyCompliant = missingRequired.length === 0;

  const handleItemClick = (id: PPEItemId) => {
    soundEngine.playClick();
    onTogglePPE(id);
    setActivePreviewPPE(id);

    const item = PPE_ITEMS.find((p) => p.id === id);
    if (!item) return;

    const isNowEquipped = !equippedPPE.has(id);
    const voiceText = isNowEquipped
      ? language === 'bn'
        ? `${item.name.bn} পরা হয়েছে। উদ্দেশ্য: ${item.purpose.bn}।`
        : language === 'hi'
        ? `${item.name.hi} पहना गया। उद्देश्य: ${item.purpose.hi}।`
        : `${item.name.en} equipped. Purpose: ${item.purpose.en}.`
      : language === 'bn'
      ? `${item.name.bn} খুলে ফেলা হয়েছে! সাবধান, এটি ছাড়া কাজ বিপজ্জনক!`
      : language === 'hi'
      ? `${item.name.hi} हटा दिया गया! ध्यान दें, इसके बिना काम खतरनाक है!`
      : `${item.name.en} removed. Warning, dangerous without it!`;

    speechNarrator.speak(voiceText, language);
  };

  const getPPEIcon = (iconName: string) => {
    switch (iconName) {
      case 'HardHat':
        return <HardHat className="w-6 h-6" />;
      case 'Glasses':
        return <Eye className="w-6 h-6" />;
      case 'Hand':
        return <Hand className="w-6 h-6" />;
      case 'Shield':
        return <Shield className="w-6 h-6" />;
      case 'Footprints':
        return <Footprints className="w-6 h-6" />;
      case 'Shirt':
        return <Shirt className="w-6 h-6" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6" />;
      case 'Wind':
        return <Wind className="w-6 h-6" />;
      default:
        return <ShieldCheck className="w-6 h-6" />;
    }
  };

  const introVoiceText =
    language === 'bn'
      ? `পিপিই লকার রুমে স্বাগতম। আপনি ${currentRole.title.bn} হিসেবে কাজ করছেন। ডিউটিতে নামার আগে আপনার প্রয়োজনীয় সমস্ত সুরক্ষা সরঞ্জাম শরীরে পরিধান করুন। সরঞ্জামগুলিতে চাপ দিয়ে পরে নিন।`
      : language === 'hi'
      ? `पीपीई लॉकर रूम में आपका स्वागत है। आपकी आज की ड्यूटी ${currentRole.title.hi} है। काम शुरू करने से पहले सभी सुरक्षा उपकरण पहनें। उपकरण पर क्लिक करके पहनें।`
      : `Welcome to the PPE Locker Room. Equip all mandatory personal protective equipment for your role as ${currentRole.title.en}.`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase">
              {language === 'bn' ? 'ধাপ ২ : সুরক্ষা পোশাক পরিধান' : language === 'hi' ? 'चरण 2 : सुरक्षा उपकरण पहनें' : 'Step 2: PPE Gear Up'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 text-xs font-medium">
              {currentRole.title[language]}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {language === 'bn' ? 'ব্যক্তিগত সুরক্ষা সরঞ্জাম (পিপিই) লকার রুম' : language === 'hi' ? 'पीपीई लॉकर रूम - उपकरण पहनें' : 'PPE Locker Room & Gear Up'}
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl">
            {language === 'bn'
              ? 'নিচের প্রতিটি পিপিইতে চাপ দিয়ে শরীরে পরিধান করুন। আপনার ডিউটির জন্য সব সরঞ্জাম পরা আবশ্যক।'
              : language === 'hi'
              ? 'नीचे दिए गए प्रत्येक उपकरण पर क्लिक करके पहनें। काम पर जाने से पहले पूर्ण सुरक्षा आवश्यक है।'
              : 'Click on each protective gear item to equip your avatar. All items must be verified before shift starts.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioNarrationButton
            textToSpeak={introVoiceText}
            lang={language}
            size="md"
            label={language === 'bn' ? 'নির্দেশ শুনুন' : language === 'hi' ? 'निर्देश सुनें' : 'Listen'}
          />
        </div>
      </div>

      {/* Main Grid: Avatar + Interactive Locker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 Cols: Visual Worker Avatar Graphic */}
        <div className="lg:col-span-5 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between shadow-xl relative">
          <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {language === 'bn' ? 'কর্মী সুরক্ষা রূপরেখা' : language === 'hi' ? 'वर्कर सुरक्षा स्थिति' : 'Worker Avatar'}
            </div>
            <div className="flex items-center gap-1.5">
              {isFullyCompliant ? (
                <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {language === 'bn' ? '১০০% সুরক্ষিত' : language === 'hi' ? '100% सुरक्षित' : '100% Safe'}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-400 text-xs font-bold bg-rose-950/60 border border-rose-500/30 px-2.5 py-1 rounded-lg animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {missingRequired.length} {language === 'bn' ? 'টি বাকি' : language === 'hi' ? 'बाकी है' : 'Missing'}
                </span>
              )}
            </div>
          </div>

          {/* SVG Worker Avatar with dynamic PPE layers */}
          <div className="relative w-64 h-80 flex items-center justify-center my-2">
            <svg viewBox="0 0 200 260" className="w-full h-full drop-shadow-2xl">
              {/* Background Glow */}
              <defs>
                <radialGradient id="avatarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={isFullyCompliant ? '#10b981' : '#f59e0b'} stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="130" r="95" fill="url(#avatarGlow)" />

              {/* Legs */}
              <rect x="75" y="150" width="18" height="65" rx="5" fill="#1e293b" />
              <rect x="107" y="150" width="18" height="65" rx="5" fill="#1e293b" />

              {/* Feet / Boots */}
              {equippedPPE.has('boots') ? (
                <g className="transition-all duration-300">
                  {/* Steel-toe Boots */}
                  <path d="M 67 210 L 95 210 L 98 225 L 63 225 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
                  <path d="M 105 210 L 133 210 L 137 225 L 102 225 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
                  {/* Steel toe cap highlights */}
                  <rect x="63" y="218" width="12" height="7" rx="2" fill="#94a3b8" />
                  <rect x="125" y="218" width="12" height="7" rx="2" fill="#94a3b8" />
                  <circle cx="80" cy="217" r="1.5" fill="#fef08a" />
                  <circle cx="120" cy="217" r="1.5" fill="#fef08a" />
                </g>
              ) : (
                <g opacity="0.6">
                  {/* Ordinary Slippers/Shoes (Unprotected) */}
                  <ellipse cx="80" cy="218" rx="14" ry="4" fill="#475569" />
                  <ellipse cx="120" cy="218" rx="14" ry="4" fill="#475569" />
                </g>
              )}

              {/* Body / Torso */}
              <rect x="68" y="90" width="64" height="65" rx="8" fill="#334155" />

              {/* Arms */}
              <rect x="48" y="94" width="16" height="55" rx="6" fill="#334155" />
              <rect x="136" y="94" width="16" height="55" rx="6" fill="#334155" />

              {/* Vest (High-Vis) */}
              {equippedPPE.has('vest') && (
                <g className="transition-all duration-300">
                  <path
                    d="M 68 90 L 85 90 L 93 115 L 100 115 L 107 115 L 115 90 L 132 90 L 132 152 L 68 152 Z"
                    fill="#eab308"
                    stroke="#ca8a04"
                    strokeWidth="1.5"
                  />
                  {/* Silver reflective strips */}
                  <rect x="70" y="118" width="60" height="6" fill="#f8fafc" />
                  <rect x="70" y="136" width="60" height="6" fill="#f8fafc" />
                  <line x1="86" y1="92" x2="86" y2="150" stroke="#f8fafc" strokeWidth="4" />
                  <line x1="114" y1="92" x2="114" y2="150" stroke="#f8fafc" strokeWidth="4" />
                </g>
              )}

              {/* Gloves */}
              {equippedPPE.has('gloves_nitrile') ? (
                <g className="transition-all duration-300">
                  {/* Blue Nitrile Gloves */}
                  <rect x="46" y="145" width="18" height="18" rx="6" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
                  <rect x="136" y="145" width="18" height="18" rx="6" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />
                </g>
              ) : equippedPPE.has('gloves_heavy') ? (
                <g className="transition-all duration-300">
                  {/* Heavy Leather Gloves */}
                  <rect x="46" y="145" width="18" height="18" rx="6" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
                  <rect x="136" y="145" width="18" height="18" rx="6" fill="#d97706" stroke="#b45309" strokeWidth="1.5" />
                </g>
              ) : (
                <g opacity="0.8">
                  {/* Bare Hands */}
                  <circle cx="55" cy="154" r="8" fill="#fcd34d" />
                  <circle cx="145" cy="154" r="8" fill="#fcd34d" />
                </g>
              )}

              {/* Head / Face */}
              <circle cx="100" cy="62" r="22" fill="#fcd34d" />
              {/* Eyes */}
              <circle cx="93" cy="60" r="2.5" fill="#0f172a" />
              <circle cx="107" cy="60" r="2.5" fill="#0f172a" />
              {/* Mouth */}
              <path d="M 95 72 Q 100 76 105 72" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />

              {/* Safety Goggles / Visor */}
              {equippedPPE.has('goggles') && (
                <g className="transition-all duration-300">
                  <rect x="85" y="53" width="30" height="14" rx="4" fill="#38bdf8" fillOpacity="0.8" stroke="#0284c7" strokeWidth="2" />
                  <line x1="78" y1="60" x2="85" y2="60" stroke="#0f172a" strokeWidth="2" />
                  <line x1="115" y1="60" x2="122" y2="60" stroke="#0f172a" strokeWidth="2" />
                  <circle cx="92" cy="58" r="3" fill="#ffffff" fillOpacity="0.5" />
                </g>
              )}

              {/* Respirator / Dust Mask */}
              {equippedPPE.has('respirator') && (
                <g className="transition-all duration-300">
                  <path d="M 88 66 L 112 66 L 108 78 L 92 78 Z" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
                  <circle cx="100" cy="72" r="3" fill="#cbd5e1" />
                </g>
              )}

              {/* Ear Muffs */}
              {equippedPPE.has('ear_protection') && (
                <g className="transition-all duration-300">
                  <path d="M 77 62 Q 100 36 123 62" stroke="#dc2626" strokeWidth="4" fill="none" strokeLinecap="round" />
                  <rect x="73" y="55" width="8" height="15" rx="3" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                  <rect x="119" y="55" width="8" height="15" rx="3" fill="#ef4444" stroke="#991b1b" strokeWidth="1.5" />
                </g>
              )}

              {/* Helmet */}
              {equippedPPE.has('helmet') ? (
                <g className="transition-all duration-300">
                  {/* Yellow Hardhat Dome */}
                  <path d="M 74 50 C 74 30, 126 30, 126 50 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
                  {/* Brim */}
                  <rect x="70" y="47" width="60" height="6" rx="3" fill="#eab308" stroke="#ca8a04" strokeWidth="1.5" />
                  {/* Chin strap */}
                  <path d="M 76 52 Q 100 84 124 52" stroke="#475569" strokeWidth="1.5" fill="none" />
                </g>
              ) : (
                <g>
                  {/* Hair (Unprotected) */}
                  <path d="M 78 52 C 78 38, 122 38, 122 52 Z" fill="#1e293b" />
                </g>
              )}
            </svg>
          </div>

          {/* Quick Avatar Status */}
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center">
            <div className="text-xs text-slate-400">
              {language === 'bn' ? 'পোশাকের স্থিতি:' : language === 'hi' ? 'कपड़ों की स्थिति:' : 'Equipped Status:'}
            </div>
            <div className={`text-sm font-bold mt-0.5 ${isFullyCompliant ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isFullyCompliant
                ? language === 'bn'
                  ? 'সব সুরক্ষা সরঞ্জাম পরা হয়েছে!'
                  : language === 'hi'
                  ? 'सभी सुरक्षा उपकरण पहने जा चुके हैं!'
                  : 'All Required PPE Equipped!'
                : language === 'bn'
                ? `আরও ${missingRequired.length}টি সুরক্ষা সরঞ্জাম প্রয়োজন`
                : language === 'hi'
                ? `${missingRequired.length} आवश्यक उपकरण अभी बाकी हैं`
                : `${missingRequired.length} Mandatory Items Missing`}
            </div>
          </div>
        </div>

        {/* Right 7 Cols: Interactive PPE Locker Grid */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>{language === 'bn' ? 'লকার আলমারি' : language === 'hi' ? 'पीपीई अलमारी' : 'PPE Locker Items'}</span>
              <span className="text-xs text-slate-400 font-normal">
                ({PPE_ITEMS.length} {language === 'bn' ? 'টি আইটেম' : language === 'hi' ? 'सामान' : 'items'})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundEngine.playSuccess();
                  onEquipAllRequired();
                  speechNarrator.speak(
                    language === 'bn'
                      ? 'ডিউটির প্রয়োজনীয় সমস্ত পিপিই একবারে পরে নেওয়া হলো!'
                      : language === 'hi'
                      ? 'ड्यूटी के सभी आवश्यक पीपीई पहन लिए गए!'
                      : 'Equipped all mandatory PPE for your duty!',
                    language
                  );
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'সব আবশ্যক পরুন' : language === 'hi' ? 'सभी जरूरी पहनें' : 'Equip All Required'}
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  onResetPPE();
                }}
                className="p-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                title="Reset All"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* PPE Item Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PPE_ITEMS.map((item) => {
              const isEquipped = equippedPPE.has(item.id);
              const isRequired = requiredPPEList.includes(item.id);
              const cardVoiceText =
                language === 'bn'
                  ? `${item.name.bn}। ${item.purpose.bn}। ${isRequired ? 'এই ডিউটির জন্য আবশ্যক।' : 'ঐচ্ছিক।'}`
                  : language === 'hi'
                  ? `${item.name.hi}। ${item.purpose.hi}। ${isRequired ? 'इस ड्यूटी के लिए जरूरी।' : 'वैकल्पिक।'}`
                  : `${item.name.en}. ${item.purpose.en}. ${isRequired ? 'Mandatory for this duty.' : 'Optional.'}`;

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isEquipped
                      ? 'bg-amber-950/20 border-amber-400/80 shadow-md ring-1 ring-amber-400/30'
                      : isRequired
                      ? 'bg-slate-900/90 border-rose-500/40 hover:border-rose-400'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                          isEquipped
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {getPPEIcon(item.icon)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          {isRequired && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              {language === 'bn' ? 'আবশ্যক' : language === 'hi' ? 'अनिवार्य' : 'Required'}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">
                            {item.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-0.5 leading-snug">
                          {item.name[language]}
                        </h4>
                      </div>
                    </div>

                    <AudioNarrationButton
                      textToSpeak={cardVoiceText}
                      lang={language}
                      size="sm"
                      variant="subtle"
                    />
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {item.purpose[language]}
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold ${
                        isEquipped ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      {isEquipped
                        ? language === 'bn'
                          ? '✓ পরা আছে'
                          : language === 'hi'
                          ? '✓ पहना हुआ'
                          : '✓ Equipped'
                        : language === 'bn'
                        ? '+ পরতে চাপুন'
                        : language === 'hi'
                        ? '+ पहनने के लिए दबाएं'
                        : '+ Click to Equip'}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {isEquipped ? 'Click to remove' : 'Click to equip'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Consequence Demonstration Banner */}
          <div className="bg-gradient-to-r from-rose-950/40 via-amber-950/30 to-slate-900 border border-amber-500/30 rounded-2xl p-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                <Zap className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {language === 'bn'
                    ? 'পিপিই না পরলে কি হবে? দুর্ঘটনা পরীক্ষা করুন!'
                    : language === 'hi'
                    ? 'पीपीई न पहनने पर क्या होगा? दुर्घटना सिमुलेशन देखें!'
                    : 'What Happens Without PPE? Test Incident Simulator!'}
                </div>
                <div className="text-xs text-slate-300">
                  {language === 'bn'
                    ? 'ইলেকট্রিক শক, মাথায় ভারী বোল্ট পড়া, চোখে তেল ছিটকে আসার জীবন্ত অ্যানিমেশন'
                    : language === 'hi'
                    ? 'इलेक्ट्रिक शॉक, सिर पर बोल्ट गिरना और केमिकल छलकने का एनिमेटेड डेमो'
                    : 'Watch animated live demonstrations of electric shocks, falling bolts, and eye burns'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onGoToConsequences();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <span>
                {language === 'bn'
                  ? 'দুর্ঘটনা প্রদর্শন দেখুন'
                  : language === 'hi'
                  ? 'दुर्घटना सिमुलेशन देखें'
                  : 'Launch Incident Demo'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
