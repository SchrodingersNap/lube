import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  ShieldCheck, 
  ArrowRight,
  Flame,
  Cylinder,
  Database,
  Boxes,
  Zap,
  Building2,
  Eye,
  Check,
  MousePointerClick,
  ListOrdered
} from 'lucide-react';
import { HAZARD_ITEMS, PLANT_ZONES } from '../translations';
import { HazardItem, PlantZoneId, Language } from '../types';
import { AudioNarrationButton } from './AudioNarrationButton';
import { soundEngine } from '../services/soundEngine';
import { speechNarrator } from '../services/speechNarrator';

interface HazardHuntingGameProps {
  initialZone: PlantZoneId;
  onSelectZone: (zoneId: PlantZoneId) => void;
  onAddScore: (points: number) => void;
  language: Language;
}

export const HazardHuntingGame: React.FC<HazardHuntingGameProps> = ({
  initialZone,
  onSelectZone,
  onAddScore,
  language
}) => {
  const [activeZone, setActiveZone] = useState<PlantZoneId>(initialZone);
  const [foundHazards, setFoundHazards] = useState<Set<string>>(new Set());
  const [selectedHazard, setSelectedHazard] = useState<HazardItem | null>(null);
  const [showVisualCues, setShowVisualCues] = useState<boolean>(true);
  const [selectionMode, setSelectionMode] = useState<'both' | 'canvas' | 'list'>('both');

  const zoneObj = PLANT_ZONES.find((z) => z.id === activeZone) || PLANT_ZONES[0];
  const zoneHazards = HAZARD_ITEMS.filter((h) => h.zoneId === activeZone);

  const handleSpotHazard = (hazard: HazardItem) => {
    setSelectedHazard(hazard);

    if (!foundHazards.has(hazard.id)) {
      soundEngine.playWarning();
      const updated = new Set(foundHazards);
      updated.add(hazard.id);
      setFoundHazards(updated);
      onAddScore(50); // 50 points per hazard spotted!

      // Play voice explanation in selected language
      const voiceText =
        language === 'bn'
          ? `বিপদ শনাক্ত হয়েছে! ${hazard.title.bn}। কারণ: ${hazard.description.bn}। সঠিক সমাধান: ${hazard.correction.bn}।`
          : language === 'hi'
          ? `खतरा पहचाना गया! ${hazard.title.hi}। कारण: ${hazard.description.hi}। सही समाधान: ${hazard.correction.hi}।`
          : `Hazard Identified! ${hazard.title.en}. Danger: ${hazard.description.en}. Safe Action: ${hazard.correction.en}.`;

      speechNarrator.speak(voiceText, language);
    } else {
      soundEngine.playClick();
    }
  };

  const handleFixHazard = (hazard: HazardItem) => {
    soundEngine.playSuccess();
    onAddScore(30); // Bonus for applying fix

    const fixVoice =
      language === 'bn'
        ? `বিপদ সফলভাবে দূর করা হয়েছে! ${hazard.correction.bn}। আপনি সুরক্ষিত কারখানার জন্য আরও ৩০ পয়েন্ট পেয়েছেন!`
        : language === 'hi'
        ? `खतरा सुरक्षित रूप से ठीक कर दिया गया है! ${hazard.correction.hi}। आपको 30 अंक और मिले!`
        : `Hazard safely resolved! ${hazard.correction.en}. Additional safety points awarded!`;

    speechNarrator.speak(fixVoice, language);
  };

  const isZoneCleared = zoneHazards.length > 0 && zoneHazards.every((h) => foundHazards.has(h.id));

  const gameVoicePrompt =
    language === 'bn'
      ? `বিপদ সন্ধান গেম। ${zoneObj.name.bn} এলাকায় চোখ রাখুন। আপনি দৃশ্যের ওপর সরাসরি চাপ দিয়ে অথবা নিচের তালিকা থেকে বেছে নিয়ে বিপদ শনাক্ত করতে পারেন।`
      : language === 'hi'
      ? `खतरा पहचानो गेम। ${zoneObj.name.hi} में ध्यान से देखें। आप चित्र पर क्लिक करके या नीचे दी गई सूची से चुनकर खतरा पहचान सकते हैं।`
      : `Hazard Spotting Game. Inspect ${zoneObj.name.en}. You can identify hazards by clicking directly on the scene or by selecting them from the intuitive list below.`;

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase">
              {language === 'bn' ? 'ইন্টারেক্টিভ হ্যাজার্ড আইডেন্টিফিকেশন' : language === 'hi' ? 'खतरा पहचानो गेम' : 'Interactive Hazard Identification'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 text-xs font-medium">
              {zoneObj.name[language]}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {language === 'bn'
              ? 'লুব ব্লেন্ডিং প্ল্যান্টের লুকানো বিপদ শনাক্তকরণ'
              : language === 'hi'
              ? 'ल्यूब प्लांट में खतरे की पहचान'
              : 'Spot Hazards in Lube Blending Plant'}
          </h1>
          <p className="text-slate-300 text-sm">
            {language === 'bn'
              ? 'কারখানার দৃশ্যের ওপর চাপ দিয়ে অথবা নিচের তালিকা থেকে সম্ভাব্য বিপদ নির্বাচন করুন।'
              : language === 'hi'
              ? 'प्लांट के चित्र पर क्लिक करके अथवा नीचे दी गई सूची में से चुनकर खतरे की पहचान करें।'
              : 'Select identified hazards directly by clicking hotspots on the scene canvas or from the visual list below.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Visual Cues Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowVisualCues(!showVisualCues);
            }}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showVisualCues
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>
              {language === 'bn'
                ? showVisualCues ? 'ভিজ্যুয়াল সংকেত: চালু' : 'ভিজ্যুয়াল সংকেত: বন্ধ'
                : language === 'hi'
                ? showVisualCues ? 'दृश्य संकेत: चालू' : 'दृश्य संकेत: बंद'
                : showVisualCues ? 'Visual Cues: ON' : 'Visual Cues: OFF'}
            </span>
          </button>

          <AudioNarrationButton
            textToSpeak={gameVoicePrompt}
            lang={language}
            size="md"
            label={language === 'bn' ? 'নিয়ম শুনুন' : language === 'hi' ? 'नियम सुनें' : 'Listen'}
          />
        </div>
      </div>

      {/* Zone Switcher Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {PLANT_ZONES.map((zone) => {
          const isCurrent = zone.id === activeZone;
          const hazardsInThisZone = HAZARD_ITEMS.filter((h) => h.zoneId === zone.id);
          const foundInThisZone = hazardsInThisZone.filter((h) => foundHazards.has(h.id)).length;

          return (
            <button
              key={zone.id}
              onClick={() => {
                soundEngine.playClick();
                setActiveZone(zone.id);
                onSelectZone(zone.id);
                setSelectedHazard(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isCurrent
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{zone.shortName[language]}</span>
              {hazardsInThisZone.length > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    foundInThisZone === hazardsInThisZone.length
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-slate-950 text-amber-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {foundInThisZone}/{hazardsInThisZone.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Interactive Game Arena Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Illustrated Interactive Scene */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col justify-between">
          {/* Top HUD */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">
                {language === 'bn' ? 'শনাক্তকৃত বিপদ:' : language === 'hi' ? 'पहचाने गए खतरे:' : 'Hazards Spotted:'}
              </span>
              <span className="text-xs font-bold text-amber-400">
                {zoneHazards.filter((h) => foundHazards.has(h.id)).length} / {zoneHazards.length}
              </span>
            </div>

            {isZoneCleared && (
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full animate-bounce">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {language === 'bn' ? 'এই জোনের সব বিপদ সুরক্ষিত!' : language === 'hi' ? 'इस क्षेत्र के सभी खतरे हल!' : 'Zone Cleared!'}
              </span>
            )}
          </div>

          {/* Interactive Scene Canvas */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 overflow-hidden">
            {/* Visual SVG Scene for Active Zone */}
            <svg viewBox="0 0 600 340" className="w-full h-full select-none">
              {/* Background Factory Walls and Lights */}
              <rect x="0" y="0" width="600" height="240" fill="#0f172a" />
              <line x1="0" y1="240" x2="600" y2="240" stroke="#334155" strokeWidth="4" />
              {/* Floor */}
              <rect x="0" y="240" width="600" height="100" fill="#1e293b" />
              {/* Girders */}
              <line x1="100" y1="0" x2="100" y2="240" stroke="#334155" strokeWidth="6" />
              <line x1="300" y1="0" x2="300" y2="240" stroke="#334155" strokeWidth="6" />
              <line x1="500" y1="0" x2="500" y2="240" stroke="#334155" strokeWidth="6" />
              <line x1="0" y1="40" x2="600" y2="40" stroke="#334155" strokeWidth="8" />

              {/* Tank Farm Area Scene */}
              {activeZone === 'tank_farm' && (
                <g>
                  {/* Large Tank */}
                  <rect x="60" y="60" width="220" height="180" fill="#334155" stroke="#64748b" strokeWidth="3" />
                  <ellipse cx="170" cy="60" rx="110" ry="25" fill="#475569" stroke="#64748b" strokeWidth="3" />
                  {/* Tank Dike Bund Wall */}
                  <rect x="30" y="230" width="280" height="30" fill="#1e293b" stroke="#ca8a04" strokeWidth="3" />
                  
                  {/* Tanker truck */}
                  <rect x="340" y="140" width="180" height="90" rx="10" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                  <rect x="470" y="150" width="60" height="80" rx="6" fill="#cbd5e1" />
                  <circle cx="380" cy="240" r="18" fill="#0f172a" />
                  <circle cx="440" cy="240" r="18" fill="#0f172a" />
                  <circle cx="510" cy="240" r="18" fill="#0f172a" />

                  {/* VISUAL CUE 1: Sparking ungrounded tanker clamp if enabled */}
                  {showVisualCues && !foundHazards.has('tank_ungrounded') && (
                    <g className="animate-pulse">
                      <line x1="210" y1="180" x2="210" y2="240" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4,4" />
                      <circle cx="210" cy="210" r="14" fill="#ef4444" opacity="0.4" className="animate-ping" />
                      <text x="215" y="200" fill="#fbbf24" fontSize="14" fontWeight="bold">⚡ SPARK</text>
                    </g>
                  )}

                  {/* VISUAL CUE 2: Shimmering open valve leak on dike */}
                  {showVisualCues && !foundHazards.has('tank_valve_leak') && (
                    <g>
                      <circle cx="450" cy="265" r="12" fill="#eab308" opacity="0.5" className="animate-ping" />
                      <path d="M 445 250 L 455 250 L 450 265 Z" fill="#d97706" />
                    </g>
                  )}
                </g>
              )}

              {/* Kettles Area Scene */}
              {activeZone === 'kettles' && (
                <g>
                  {/* Blending Kettle */}
                  <rect x="180" y="70" width="240" height="170" rx="14" fill="#334155" stroke="#64748b" strokeWidth="3" />
                  <circle cx="300" cy="50" r="28" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="300" y1="78" x2="300" y2="180" stroke="#eab308" strokeWidth="6" />
                  {/* Steam heating pipe line */}
                  <path d="M 50 110 L 180 110" stroke="#ef4444" strokeWidth="10" />
                  <circle cx="110" cy="110" r="12" fill="#b91c1c" />

                  {/* VISUAL CUE: Live steam leak cloud */}
                  {showVisualCues && !foundHazards.has('kettle_steam_leak') && (
                    <g className="animate-pulse">
                      <ellipse cx="370" cy="140" rx="25" ry="18" fill="#ffffff" opacity="0.5" />
                      <ellipse cx="380" cy="130" rx="18" ry="14" fill="#ffffff" opacity="0.4" />
                      <text x="350" y="125" fill="#f87171" fontSize="12" fontWeight="bold">♨ 180°C STEAM</text>
                    </g>
                  )}

                  {/* VISUAL CUE: Chemical additive drums without drip tray */}
                  {showVisualCues && !foundHazards.has('kettle_drip_missing') && (
                    <g>
                      <rect x="70" y="200" width="45" height="70" rx="4" fill="#0284c7" />
                      <rect x="125" y="200" width="45" height="70" rx="4" fill="#0284c7" />
                      <ellipse cx="120" cy="275" rx="30" ry="8" fill="#d97706" opacity="0.8" />
                      <text x="80" y="290" fill="#fcd34d" fontSize="9" fontWeight="bold">NO DRIP TRAY</text>
                    </g>
                  )}
                </g>
              )}

              {/* Barrel Filling Scene */}
              {activeZone === 'barrel_filling' && (
                <g>
                  {/* Roller Conveyor */}
                  <rect x="40" y="160" width="450" height="30" fill="#475569" />
                  <line x1="40" y1="175" x2="490" y2="175" stroke="#94a3b8" strokeWidth="4" />
                  {/* 200L Blue Steel Drums */}
                  <rect x="100" y="100" width="60" height="90" rx="4" fill="#0284c7" />
                  <rect x="190" y="100" width="60" height="90" rx="4" fill="#0284c7" />
                  <rect x="280" y="100" width="60" height="90" rx="4" fill="#0284c7" />

                  {/* VISUAL CUE: Shimmering oil puddle on walkway */}
                  {showVisualCues && !foundHazards.has('barrel_oil_puddle') && (
                    <g className="animate-pulse">
                      <ellipse cx="290" cy="220" rx="45" ry="15" fill="#b45309" opacity="0.85" />
                      <ellipse cx="280" cy="218" rx="20" ry="6" fill="#fcd34d" opacity="0.5" />
                      <text x="250" y="245" fill="#fcd34d" fontSize="11" fontWeight="bold">⚠️ SLIP HAZARD</text>
                    </g>
                  )}
                </g>
              )}

              {/* Warehouse Scene */}
              {activeZone === 'warehouse' && (
                <g>
                  {/* Racking */}
                  <rect x="50" y="30" width="280" height="210" fill="#1e293b" stroke="#475569" strokeWidth="3" />
                  <line x1="50" y1="100" x2="330" y2="100" stroke="#475569" strokeWidth="3" />
                  <line x1="50" y1="170" x2="330" y2="170" stroke="#475569" strokeWidth="3" />
                  <rect x="70" y="55" width="80" height="40" fill="#b45309" />
                  <rect x="180" y="55" width="90" height="40" fill="#0284c7" />
                  <rect x="70" y="125" width="90" height="40" fill="#0284c7" />

                  {/* Forklift */}
                  <rect x="400" y="180" width="100" height="60" rx="8" fill="#eab308" />
                  <circle cx="430" cy="245" r="16" fill="#0f172a" />
                  <circle cx="485" cy="245" r="16" fill="#0f172a" />

                  {/* VISUAL CUE: Leaning tilt pallet on 3rd tier */}
                  {showVisualCues && !foundHazards.has('warehouse_leaning_stack') && (
                    <g transform="translate(330, 115) rotate(12)" className="animate-bounce">
                      <rect x="-35" y="-20" width="70" height="40" fill="#b45309" stroke="#ef4444" strokeWidth="3" />
                      <text x="-30" y="5" fill="#ffffff" fontSize="10" fontWeight="bold">TILTING 10°</text>
                    </g>
                  )}
                </g>
              )}

              {/* Supply Block Scene */}
              {activeZone === 'supply_block' && (
                <g>
                  {/* 415V Switchboard */}
                  <rect x="120" y="70" width="220" height="170" rx="8" fill="#334155" stroke="#64748b" strokeWidth="3" />
                  <polygon points="175,100 165,120 185,120" fill="#ef4444" />
                  <rect x="380" y="110" width="160" height="130" rx="10" fill="#475569" />

                  {/* VISUAL CUE: Water pipe leak dripping next to 415V switchboard */}
                  {showVisualCues && !foundHazards.has('substation_water_leak') && (
                    <g className="animate-pulse">
                      <ellipse cx="420" cy="170" rx="35" ry="12" fill="#0284c7" opacity="0.7" />
                      <line x1="330" y1="120" x2="390" y2="160" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4,4" />
                      <text x="360" y="195" fill="#ef4444" fontSize="12" fontWeight="bold">⚡ 415V ARC RISK</text>
                    </g>
                  )}
                </g>
              )}

              {/* Canteen & Admin Scene */}
              {activeZone === 'canteen_admin' && (
                <g>
                  <rect x="180" y="120" width="40" height="120" fill="#059669" />
                  <circle cx="200" cy="120" r="20" fill="#10b981" />
                  <rect x="360" y="80" width="90" height="160" rx="4" fill="#14532d" stroke="#22c55e" strokeWidth="3" />

                  {/* VISUAL CUE: Blocked Eyewash Station */}
                  {showVisualCues && !foundHazards.has('admin_eyewash_blocked') && (
                    <g>
                      <rect x="225" y="190" width="35" height="35" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
                      <rect x="245" y="170" width="35" height="35" fill="#78350f" stroke="#f59e0b" strokeWidth="2" />
                      <text x="210" y="240" fill="#ef4444" fontSize="11" fontWeight="bold">BLOCKED ACCESS</text>
                    </g>
                  )}
                </g>
              )}
            </svg>

            {/* Clickable Hotspots on Canvas */}
            {zoneHazards.map((hazard) => {
              const isFound = foundHazards.has(hazard.id);
              const isSelected = selectedHazard?.id === hazard.id;

              return (
                <div
                  key={hazard.id}
                  onClick={() => handleSpotHazard(hazard)}
                  style={{ left: `${hazard.x}%`, top: `${hazard.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform active:scale-95 group`}
                  title={hazard.title[language]}
                >
                  <div
                    className={`relative w-12 h-12 flex items-center justify-center rounded-full transition-all ${
                      isFound
                        ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400'
                        : isSelected
                        ? 'bg-rose-500/30 border-2 border-rose-400 text-rose-400 ring-4 ring-rose-400/40 animate-pulse'
                        : 'bg-amber-500/20 border-2 border-amber-400 text-amber-400 animate-ping group-hover:scale-110'
                    }`}
                  >
                    {isFound ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Instructional Overlay */}
            <div className="absolute bottom-2 left-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300 pointer-events-none">
              👆 {language === 'bn' ? 'দৃশ্য অথবা নিচের তালিকা থেকে বিপদে চাপুন' : language === 'hi' ? 'चित्र या सूची से खतरे पर क्लिक करें' : 'Click on scene or select from list below'}
            </div>
          </div>

          {/* DUAL INTERACTION: Visual Hazard Selection List Directly Below the Scene */}
          <div className="bg-slate-900 border-t border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-amber-400" />
                <span>{language === 'bn' ? 'এই এলাকার সম্ভাব্য বিপদের তালিকা (তালিকা থেকে বাছুন):' : language === 'hi' ? 'खतरों की सूची (सूची से चुनें):' : 'Hazards in this Zone (Select from list):'}</span>
              </span>
              <span className="text-amber-400 font-bold">{zoneHazards.length} {language === 'bn' ? 'টি বিপদ' : language === 'hi' ? 'खतरे' : 'hazards'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {zoneHazards.map((hazard) => {
                const isFound = foundHazards.has(hazard.id);
                const isSelected = selectedHazard?.id === hazard.id;

                return (
                  <div
                    key={hazard.id}
                    onClick={() => handleSpotHazard(hazard)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-amber-950/20 border-amber-400 ring-2 ring-amber-400/30'
                        : isFound
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isFound
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : isSelected
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isFound ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white line-clamp-1">
                          {hazard.title[language]}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                          {hazard.severity} {language === 'bn' ? 'ঝুঁকি' : language === 'hi' ? 'जोखिम' : 'Risk'}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <AudioNarrationButton
                        textToSpeak={`${hazard.title[language]}. ${hazard.description[language]}`}
                        lang={language}
                        size="sm"
                        variant="subtle"
                      />
                      <span className="text-xs font-semibold text-amber-400">
                        {isFound ? '✓' : '→'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Hazard Inspection & Correction Card */}
        <div className="lg:col-span-4 space-y-4">
          {selectedHazard ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      foundHazards.has(selectedHazard.id)
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                      {selectedHazard.severity} {language === 'bn' ? 'বিপদ' : language === 'hi' ? 'खतरा' : 'Hazard'}
                    </span>
                    <h3 className="text-sm font-bold text-white leading-tight">
                      {selectedHazard.title[language]}
                    </h3>
                  </div>
                </div>

                <AudioNarrationButton
                  textToSpeak={
                    language === 'bn'
                      ? `${selectedHazard.title.bn}। ${selectedHazard.description.bn}। সমাধান: ${selectedHazard.correction.bn}।`
                      : language === 'hi'
                      ? `${selectedHazard.title.hi}। ${selectedHazard.description.hi}। समाधान: ${selectedHazard.correction.hi}।`
                      : `${selectedHazard.title.en}. ${selectedHazard.description.en}. Fix: ${selectedHazard.correction.en}.`
                  }
                  lang={language}
                  size="sm"
                  variant="subtle"
                />
              </div>

              {/* Danger Explanation */}
              <div className="space-y-1.5 bg-rose-950/20 border border-rose-500/30 rounded-xl p-3">
                <div className="text-xs font-semibold text-rose-300">
                  {language === 'bn' ? 'কেন এটি বিপজ্জনক?' : language === 'hi' ? 'यह खतरनाक क्यों है?' : 'Why is this dangerous?'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedHazard.description[language]}
                </p>
              </div>

              {/* Corrective Action */}
              <div className="space-y-1.5 bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3">
                <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'bn' ? 'সঠিক পদক্ষেপ (সমাধান):' : language === 'hi' ? 'सही कदम (समाधान):' : 'Corrective Action:'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedHazard.correction[language]}
                </p>
              </div>

              {/* Fix Action Button */}
              <button
                onClick={() => handleFixHazard(selectedHazard)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {language === 'bn'
                    ? 'বিপদ দূর করুন (+৩০ পয়েন্ট)'
                    : language === 'hi'
                    ? 'खतरा ठीक करें (+30 अंक)'
                    : 'Apply Safety Fix (+30 pts)'}
                </span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">
                {language === 'bn' ? 'বিপদ চিহ্নিত করতে চাপুন' : language === 'hi' ? 'खतरे पर क्लिक करें' : 'Select a Hazard'}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {language === 'bn'
                  ? 'বামে কারখানার চিত্রে যেখানে ত্রুটি দেখতে পাচ্ছেন, সেই গোল চিহ্নে অথবা নিচের তালিকা থেকে যেকোনো বিপদে চাপ দিন।'
                  : language === 'hi'
                  ? 'बाएं दिए गए प्लांट के चित्र पर अथवा नीचे दी गई सूची से किसी भी खतरे पर क्लिक करें।'
                  : 'Tap any glowing marker in the plant scene or choose from the list below to inspect.'}
              </p>
            </div>
          )}

          {/* Quick Zone Stats Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
            <div className="flex items-center justify-between">
              <span>{language === 'bn' ? 'কারখানা এলাকা:' : language === 'hi' ? 'प्लांट क्षेत्र:' : 'Area:'}</span>
              <span className="text-white font-semibold">{zoneObj.name[language]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{language === 'bn' ? 'প্ল্যান্টের আকার:' : language === 'hi' ? 'क्षेत्रफल:' : 'Size:'}</span>
              <span className="text-white font-semibold">{zoneObj.acreage}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
