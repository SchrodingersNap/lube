import React, { useState } from 'react';
import { 
  MapPin, 
  Flame, 
  Cylinder, 
  Package, 
  Database, 
  Truck, 
  Boxes, 
  Zap, 
  Building2, 
  AlertOctagon, 
  ArrowRight,
  ShieldCheck,
  Eye,
  Layers,
  Compass,
  Navigation
} from 'lucide-react';
import { PLANT_ZONES, PPE_ITEMS } from '../translations';
import { PlantZone, PlantZoneId, Language } from '../types';
import { AudioNarrationButton } from './AudioNarrationButton';
import { soundEngine } from '../services/soundEngine';
import { speechNarrator } from '../services/speechNarrator';

interface PlantMap30AcreProps {
  selectedZone: PlantZoneId;
  onSelectZone: (zoneId: PlantZoneId) => void;
  onLaunchHazardHunt: (zoneId: PlantZoneId) => void;
  language: Language;
}

export const PlantMap30Acre: React.FC<PlantMap30AcreProps> = ({
  selectedZone,
  onSelectZone,
  onLaunchHazardHunt,
  language
}) => {
  // Modeled directly on the 2 satellite photos of the IOCL LOBP 30-acre facility
  const [activeComplex, setActiveComplex] = useState<'complex_a' | 'complex_b' | 'overview'>('overview');

  const activeZone = PLANT_ZONES.find((z) => z.id === selectedZone) || PLANT_ZONES[0];

  const handleZoneClick = (zone: PlantZone) => {
    soundEngine.playClick();
    onSelectZone(zone.id);
    const voiceText =
      language === 'bn'
        ? `${zone.name.bn}। আয়তন: ${zone.acreage}। ${zone.description.bn}। প্রধান ঝুঁকি: ${zone.primaryHazards.bn.join(', ')}।`
        : language === 'hi'
        ? `${zone.name.hi}। क्षेत्रफल: ${zone.acreage}। ${zone.description.hi}। प्रमुख खतरे: ${zone.primaryHazards.hi.join(', ')}।`
        : `${zone.name.en}. Area: ${zone.acreage}. ${zone.description.en}. Hazards: ${zone.primaryHazards.en.join(', ')}.`;
    speechNarrator.speak(voiceText, language);
  };

  const getZoneIcon = (id: PlantZoneId, className: string = 'w-5 h-5') => {
    switch (id) {
      case 'kettles':
        return <Flame className={className} />;
      case 'barrel_filling':
        return <Cylinder className={className} />;
      case 'smallpack_filling':
        return <Package className={className} />;
      case 'tank_farm':
        return <Database className={className} />;
      case 'truck_loading':
        return <Truck className={className} />;
      case 'warehouse':
        return <Boxes className={className} />;
      case 'supply_block':
        return <Zap className={className} />;
      case 'canteen_admin':
        return <Building2 className={className} />;
    }
  };

  const mapIntroVoice =
    language === 'bn'
      ? 'আমাদের ৩০ একরের আইওসিএল লুব্রিকেন্ট প্ল্যান্টের স্যাটেলাইট লেআউটে স্বাগতম। কারখানাটি দুটি মূল অংশে বিস্তৃত: গ্রাম রোডের প্রধান ব্লেন্ডিং ও ফিলিং হল, এবং বিশাল বেস অয়েল স্টোরেজ ট্যাঙ্ক ফার্ম চত্বর। যেকোনো এলাকায় চাপ দিয়ে নিরাপত্তা তথ্য দেখুন।'
      : language === 'hi'
      ? 'हमारे 30 एकड़ के आईओसीएल ल्यूब प्लांट के सैटेलाइट मैप में आपका स्वागत है। यह दो मुख्य भागों में है: ग्राम रोड का मुख्य ब्लेंडिंग हॉल और दूसरा विशाल बेस ऑयल टैंक फार्म टर्मिनल।'
      : 'Welcome to the 30-acre IOCL Lube Oil Blending Plant satellite layout. Explore Complex A (Gram Road Blending & Packaging Hall) and Complex B (Heavy Base Oil Storage Tank Farm).';

  return (
    <div className="space-y-6">
      {/* Header with Plant Identity */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'স্যাটেলাইট ভিউ ও প্ল্যান্ট ম্যাপ' : language === 'hi' ? 'सैटेलाइट व्यू व प्लांट मैप' : 'Satellite Plant Layout'}</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 text-xs font-medium">
              {language === 'bn' ? 'আইওসিএল লব (IOCL LOBP) ৩০ একর' : language === 'hi' ? 'आईओसीएल ल्यूब 30 एकड़' : 'IOCL LOBP 30 Acres'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {language === 'bn'
              ? 'আইওসিএল লুব প্ল্যান্টের ৩০ একর দ্বি-কমপ্লেক্স ম্যাপ'
              : language === 'hi'
              ? 'आईओसीएल ल्यूब प्लांट 30 एकड़ सैटेलाइट मैप'
              : 'IOCL LOBP 30-Acre Twin-Complex Map'}
          </h1>
          <p className="text-slate-300 text-sm">
            {language === 'bn'
              ? 'উপগ্রহ মানচিত্র অনুসারে গ্রাম রোডের মূল ব্লেন্ডিং হল এবং বেস অয়েল ট্যাঙ্ক ফার্মের যেকোনো জোনে চাপ দিয়ে পরিদর্শন করুন।'
              : language === 'hi'
              ? 'सैटेलाइट नक्शे के अनुसार ग्राम रोड मुख्य ब्लेंडिंग हॉल और बेस ऑयल टैंक फार्म के किसी भी क्षेत्र पर क्लिक करें।'
              : 'Interactive facility layout modeled directly on the satellite imagery of our 30-acre lube manufacturing and storage plant.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioNarrationButton
            textToSpeak={mapIntroVoice}
            lang={language}
            size="md"
            label={language === 'bn' ? 'ম্যাপের বিবরণ শুনুন' : language === 'hi' ? 'नक्शा सुनें' : 'Listen'}
          />
        </div>
      </div>

      {/* Complex View Switcher (Matching the 2 Uploaded Satellite Photos) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveComplex('overview');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeComplex === 'overview'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>
              {language === 'bn' ? 'উভয় চত্বর (৩০ একর সমন্বিত)' : language === 'hi' ? 'दोनों परिसर (30 एकड़)' : 'Both Complexes (30 Acres)'}
            </span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveComplex('complex_a');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeComplex === 'complex_a'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>
              {language === 'bn' ? 'কমপ্লেক্স ১: গ্রাম রোড মূল ব্লেন্ডিং হল' : language === 'hi' ? 'परिसर 1: ग्राम रोड मुख्य ब्लेंडिंग हॉल' : 'Complex 1: Gram Road Blending Wing'}
            </span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveComplex('complex_b');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeComplex === 'complex_b'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>
              {language === 'bn' ? 'কমপ্লেক্স ২: বেস অয়েল ট্যাঙ্ক ফার্ম' : language === 'hi' ? 'परिसर 2: बेस ऑयल टैंक फार्म' : 'Complex 2: Heavy Tank Farm'}
            </span>
          </button>
        </div>

        <div className="text-[11px] text-amber-400 font-semibold px-2">
          {language === 'bn' ? 'আইওসিএল লব চত্বর' : language === 'hi' ? 'आईओसीएल ल्यूब परिसर' : 'IOCL LOBP Facility'}
        </div>
      </div>

      {/* Main Map + Zone Info Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Architectural Satellite SVG Layout */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          {/* Top Status Badge */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-slate-300">
                {activeComplex === 'complex_a'
                  ? language === 'bn' ? 'গ্রাম রোড লুব ব্লেন্ডিং ও ফিলিং প্ল্যান্ট (ছবি ১)' : language === 'hi' ? 'ग्राम रोड मुख्य ल्यूब प्लांट (फोटो 1)' : 'Gram Road Main Lube Hall (Photo 1)'
                  : activeComplex === 'complex_b'
                  ? language === 'bn' ? 'বেস অয়েল স্টোরেজ ট্যাঙ্ক ফার্ম টার্মিনাল (ছবি ২)' : language === 'hi' ? 'बेस ऑयल स्टोरेज टैंक फार्म (फोटो 2)' : 'Heavy Tank Farm Terminal (Photo 2)'
                  : language === 'bn' ? '৩০ একর প্ল্যান্ট সম্পূর্ণ মানচিত্র' : language === 'hi' ? '30 एकड़ प्लांट संपूर्ण नक्शा' : '30-Acre Integrated Plant Map'}
              </span>
            </div>

            <div className="text-[11px] text-amber-400 font-semibold animate-pulse">
              👆 {language === 'bn' ? 'জোনে চাপ দিয়ে তথ্য দেখুন' : language === 'hi' ? 'क्लिक करके जानकारी देखें' : 'Click to inspect zone'}
            </div>
          </div>

          {/* SVG Map Canvas modeled on the 2 satellite photos */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800/80 p-2 overflow-hidden shadow-inner">
            <svg
              viewBox="0 0 1000 580"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.6))' }}
            >
              {/* Outer Boundary with natural tree perimeter */}
              <defs>
                <linearGradient id="groundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0b1320" />
                  <stop offset="50%" stopColor="#08101a" />
                  <stop offset="100%" stopColor="#050a12" />
                </linearGradient>
                <pattern id="treePattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="15" cy="15" r="8" fill="#064e3b" opacity="0.4" />
                </pattern>
              </defs>

              <rect x="5" y="5" width="990" height="570" rx="16" fill="url(#groundGrad)" stroke="#1e293b" strokeWidth="2" />
              {/* Surrounding tree vegetation border */}
              <rect x="5" y="5" width="990" height="570" rx="16" fill="url(#treePattern)" />

              {/* VIEW: COMPLEX A or OVERVIEW (The Gram Road Main LOBP Hall) */}
              {(activeComplex === 'overview' || activeComplex === 'complex_a') && (
                <g>
                  {/* Gram Road & Rail Siding on Top */}
                  <path d="M 40 40 L 960 40" stroke="#334155" strokeWidth="14" />
                  <path d="M 40 40 L 960 40" stroke="#f59e0b" strokeWidth="2" strokeDasharray="16,12" />
                  <text x="60" y="30" fill="#94a3b8" fontSize="11" fontWeight="bold">
                    GRAM ROAD (গ্রাম রোড / গ্রাম সড়ক)
                  </text>
                  <text x="750" y="30" fill="#38bdf8" fontSize="11" fontWeight="bold">
                    IOCL LOBP LUBE BLENDING PLANT
                  </text>

                  {/* Internal Perimeter Asphalt Road */}
                  <path
                    d="M 60 70 L 940 70 L 940 540 L 60 540 Z"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="12"
                  />

                  {/* 1. CENTRAL ELONGATED BUILDING: Main Lube Blending & Packaging Hall (from Photo 1) */}
                  <g
                    onClick={() => handleZoneClick(PLANT_ZONES.find((z) => z.id === 'barrel_filling')!)}
                    className="cursor-pointer group"
                  >
                    {/* The Long Silver/Blue Central Hall angled like in satellite */}
                    <polygon
                      points="380,100 740,100 660,340 300,340"
                      fill="#334155"
                      stroke={selectedZone === 'barrel_filling' ? '#38bdf8' : '#64748b'}
                      strokeWidth={selectedZone === 'barrel_filling' ? 3 : 1.5}
                      opacity={0.9}
                    />
                    {/* Roof skylight monitors / linear panels (exactly as in photo) */}
                    <line x1="410" y1="140" x2="630" y2="140" stroke="#94a3b8" strokeWidth="4" />
                    <line x1="390" y1="180" x2="610" y2="180" stroke="#94a3b8" strokeWidth="4" />
                    <line x1="370" y1="220" x2="590" y2="220" stroke="#94a3b8" strokeWidth="4" />
                    <line x1="350" y1="260" x2="570" y2="260" stroke="#94a3b8" strokeWidth="4" />
                    <line x1="330" y1="300" x2="550" y2="300" stroke="#94a3b8" strokeWidth="4" />

                    {/* Central Plant Label */}
                    <text x="390" y="210" fill="#ffffff" fontSize="14" fontWeight="bold">
                      {PLANT_ZONES.find((z) => z.id === 'barrel_filling')!.shortName[language]} & {PLANT_ZONES.find((z) => z.id === 'smallpack_filling')!.shortName[language]}
                    </text>
                    <text x="420" y="235" fill="#38bdf8" fontSize="10">
                      MAIN LOBP PACKAGING & FILLING HALL
                    </text>
                  </g>

                  {/* 2. BLENDING KETTLE SECTION (Inside/Adjacent to Central Hall) */}
                  <g
                    onClick={() => handleZoneClick(PLANT_ZONES.find((z) => z.id === 'kettles')!)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="680"
                      y="110"
                      width="180"
                      height="120"
                      rx="8"
                      fill="#581c87"
                      fillOpacity={selectedZone === 'kettles' ? 0.6 : 0.3}
                      stroke={selectedZone === 'kettles' ? '#c084fc' : '#a855f7'}
                      strokeWidth={selectedZone === 'kettles' ? 3 : 1.5}
                    />
                    <circle cx="730" cy="150" r="16" fill="#334155" stroke="#c084fc" strokeWidth="2" />
                    <circle cx="770" cy="150" r="16" fill="#334155" stroke="#c084fc" strokeWidth="2" />
                    <circle cx="810" cy="150" r="16" fill="#334155" stroke="#c084fc" strokeWidth="2" />
                    <text x="700" y="200" fill="#f3e8ff" fontSize="12" fontWeight="bold">
                      {PLANT_ZONES.find((z) => z.id === 'kettles')!.shortName[language]}
                    </text>
                  </g>

                  {/* 3. WAREHOUSE & RED DRUM STORAGE YARDS (Left side of Photo 1) */}
                  <g
                    onClick={() => handleZoneClick(PLANT_ZONES.find((z) => z.id === 'warehouse')!)}
                    className="cursor-pointer"
                  >
                    {/* Warehouse Shed 1 */}
                    <rect
                      x="80"
                      y="180"
                      width="180"
                      height="130"
                      rx="6"
                      fill="#134e4a"
                      fillOpacity={selectedZone === 'warehouse' ? 0.6 : 0.3}
                      stroke={selectedZone === 'warehouse' ? '#2dd4bf' : '#14b8a6'}
                      strokeWidth={selectedZone === 'warehouse' ? 3 : 1.5}
                    />
                    <line x1="90" y1="210" x2="250" y2="210" stroke="#5eead4" strokeWidth="2" />
                    <line x1="90" y1="250" x2="250" y2="250" stroke="#5eead4" strokeWidth="2" />
                    <line x1="90" y1="290" x2="250" y2="290" stroke="#5eead4" strokeWidth="2" />
                    {/* Red Drum Staging Bays (as clearly visible in Photo 1 satellite image) */}
                    <rect x="80" y="330" width="180" height="90" fill="#7f1d1d" fillOpacity="0.5" stroke="#ef4444" strokeWidth="1" />
                    <circle cx="110" cy="355" r="6" fill="#dc2626" />
                    <circle cx="130" cy="355" r="6" fill="#dc2626" />
                    <circle cx="150" cy="355" r="6" fill="#dc2626" />
                    <circle cx="170" cy="355" r="6" fill="#dc2626" />
                    <circle cx="190" cy="355" r="6" fill="#dc2626" />
                    <circle cx="210" cy="355" r="6" fill="#dc2626" />
                    <text x="100" y="240" fill="#ffffff" fontSize="13" fontWeight="bold">
                      {PLANT_ZONES.find((z) => z.id === 'warehouse')!.shortName[language]}
                    </text>
                    <text x="95" y="400" fill="#fca5a5" fontSize="10">
                      RED DRUM STAGING YARD
                    </text>
                  </g>

                  {/* 4. GRAM ROAD DECANTING GANTRY (Top Center) */}
                  <g
                    onClick={() => handleZoneClick(PLANT_ZONES.find((z) => z.id === 'truck_loading')!)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="440"
                      y="50"
                      width="180"
                      height="40"
                      rx="4"
                      fill="#c2410c"
                      fillOpacity={selectedZone === 'truck_loading' ? 0.7 : 0.4}
                      stroke={selectedZone === 'truck_loading' ? '#fb923c' : '#ea580c'}
                      strokeWidth="2"
                    />
                    <text x="460" y="75" fill="#ffffff" fontSize="11" fontWeight="bold">
                      {PLANT_ZONES.find((z) => z.id === 'truck_loading')!.shortName[language]} (GANTRY)
                    </text>
                  </g>
                </g>
              )}

              {/* VIEW: COMPLEX B (The Massive Base Oil Storage Tank Farm - from Photo 2) */}
              {(activeComplex === 'overview' || activeComplex === 'complex_b') && (
                <g transform={activeComplex === 'overview' ? 'translate(30, 360) scale(0.68, 0.42)' : 'translate(0, 40)'}>
                  {/* Outer Dike Boundary for Complex B */}
                  <rect
                    x="40"
                    y="40"
                    width="880"
                    height="460"
                    rx="14"
                    fill="#064e3b"
                    fillOpacity="0.25"
                    stroke="#10b981"
                    strokeWidth="2.5"
                  />
                  <text x="60" y="30" fill="#34d399" fontSize="13" fontWeight="bold">
                    COMPLEX B: HEAVY BASE OIL TANK FARM & BULK STORAGE (ছবি ২)
                  </text>

                  {/* 1. GIANT CENTRAL CYLINDRICAL TANK in square bund (exact match to center of Photo 2) */}
                  <g
                    onClick={() => handleZoneClick(PLANT_ZONES.find((z) => z.id === 'tank_farm')!)}
                    className="cursor-pointer"
                  >
                    {/* Square Bunded Dike Wall */}
                    <rect x="260" y="80" width="260" height="230" fill="#1e293b" stroke="#ca8a04" strokeWidth="4" />
                    {/* The Giant White Tank */}
                    <circle cx="390" cy="195" r="85" fill="#e2e8f0" stroke="#64748b" strokeWidth="5" />
                    <circle cx="390" cy="195" r="28" fill="#cbd5e1" />
                    {/* Spiral stairs mark */}
                    <path d="M 310 195 A 80 80 0 0 1 390 115" stroke="#f59e0b" strokeWidth="4" fill="none" />
                    <text x="330" y="200" fill="#0f172a" fontSize="13" fontWeight="bold">
                      GIANT TANK #1
                    </text>
                    <text x="350" y="215" fill="#475569" fontSize="10">
                      5,000 KL BASE OIL
                    </text>
                  </g>

                  {/* 2. SURROUNDING CYLINDRICAL TANKS in partitioned bunds (Left side of Photo 2) */}
                  <g
                    onClick={() => handleZoneClick(PLANT_ZONES.find((z) => z.id === 'tank_farm')!)}
                    className="cursor-pointer"
                  >
                    {/* Left Partitioned Dike */}
                    <rect x="60" y="80" width="180" height="380" fill="#1e293b" stroke="#ca8a04" strokeWidth="3" />
                    {/* Tank 2 */}
                    <circle cx="150" cy="150" r="48" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
                    {/* Tank 3 */}
                    <circle cx="150" cy="270" r="42" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
                    {/* Tank 4 */}
                    <circle cx="110" cy="390" r="34" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />
                    <circle cx="190" cy="390" r="34" fill="#e2e8f0" stroke="#64748b" strokeWidth="3" />

                    <text x="80" y="105" fill="#fbbf24" fontSize="11" fontWeight="bold">
                      BUND DIKE WALL (ডাইক)
                    </text>
                  </g>

                  {/* 3. BULK WAREHOUSE / CORRUGATED TERMINAL SHED (Right side of Photo 2) */}
                  <g
                    onClick={() => handleZoneClick(PLANT_ZONES.find((z) => z.id === 'supply_block')!)}
                    className="cursor-pointer"
                  >
                    <polygon
                      points="560,160 840,160 780,400 500,400"
                      fill="#334155"
                      stroke="#94a3b8"
                      strokeWidth="3"
                    />
                    {/* Linear roof ribs as visible in Photo 2 */}
                    <line x1="580" y1="200" x2="800" y2="200" stroke="#cbd5e1" strokeWidth="3" />
                    <line x1="560" y1="240" x2="780" y2="240" stroke="#cbd5e1" strokeWidth="3" />
                    <line x1="540" y1="280" x2="760" y2="280" stroke="#cbd5e1" strokeWidth="3" />
                    <line x1="520" y1="320" x2="740" y2="320" stroke="#cbd5e1" strokeWidth="3" />
                    <text x="590" y="270" fill="#ffffff" fontSize="13" fontWeight="bold">
                      {PLANT_ZONES.find((z) => z.id === 'supply_block')!.shortName[language]} & PUMPS
                    </text>
                    <text x="610" y="290" fill="#93c5fd" fontSize="10">
                      BULK DECANTING TERMINAL
                    </text>
                  </g>
                </g>
              )}

              {/* CANTEEN & ADMIN / MAIN GATE MUSTER POINT (Bottom Center) */}
              <g
                onClick={() => handleZoneClick(PLANT_ZONES.find((z) => z.id === 'canteen_admin')!)}
                className="cursor-pointer"
              >
                <rect
                  x="680"
                  y="460"
                  width="250"
                  height="75"
                  rx="10"
                  fill="#0f172a"
                  stroke={selectedZone === 'canteen_admin' ? '#38bdf8' : '#334155'}
                  strokeWidth="2"
                />
                <circle cx="715" cy="497" r="18" fill="#14532d" stroke="#22c55e" strokeWidth="2" />
                <text x="708" y="502" fill="#ffffff" fontSize="13" fontWeight="bold">▲</text>
                <text x="745" y="490" fill="#ffffff" fontSize="12" fontWeight="bold">
                  {PLANT_ZONES.find((z) => z.id === 'canteen_admin')!.shortName[language]}
                </text>
                <text x="745" y="510" fill="#94a3b8" fontSize="10">
                  {language === 'bn' ? 'জরুরী জমায়েত স্থান ও অফিস' : language === 'hi' ? 'आपातकालीन असेंबली पॉइंट' : 'Emergency Muster Point'}
                </text>
              </g>
            </svg>
          </div>
        </div>

        {/* Right 4 Cols: Selected Zone Inspection Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  {getZoneIcon(activeZone.id, 'w-6 h-6')}
                </div>
                <div>
                  <div className="text-xs text-amber-400 font-semibold">
                    {activeZone.acreage} · {language === 'bn' ? 'আইওসিএল প্ল্যান্ট এলাকা' : language === 'hi' ? 'आईओसीएल प्लांट क्षेत्र' : 'IOCL Facility Zone'}
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight mt-0.5">
                    {activeZone.name[language]}
                  </h3>
                </div>
              </div>

              <AudioNarrationButton
                textToSpeak={
                  language === 'bn'
                    ? `${activeZone.name.bn}। ${activeZone.description.bn}। প্রধান সম্ভাব্য বিপদ: ${activeZone.primaryHazards.bn.join(', ')}।`
                    : language === 'hi'
                    ? `${activeZone.name.hi}। ${activeZone.description.hi}। प्रमुख खतरे: ${activeZone.primaryHazards.hi.join(', ')}।`
                    : `${activeZone.name.en}. ${activeZone.description.en}.`
                }
                lang={language}
                size="sm"
                variant="subtle"
              />
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeZone.description[language]}
            </p>

            {/* Primary Hazards List */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'এই জোনের প্রধান বিপদ:' : language === 'hi' ? 'इस क्षेत्र के मुख्य खतरे:' : 'Primary Hazards:'}</span>
              </div>
              <ul className="space-y-1.5">
                {activeZone.primaryHazards[language].map((hazard, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-800/40 p-2 rounded-lg border border-slate-800">
                    <span className="text-rose-400 font-bold shrink-0">!</span>
                    <span>{hazard}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Required PPE to enter */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {language === 'bn' ? 'প্রবেশের জন্য আবশ্যক পিপিই:' : language === 'hi' ? 'प्रवेश हेतु आवश्यक पीपीई:' : 'Mandatory PPE for Entry:'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeZone.requiredPPE.map((ppeId) => {
                  const ppe = PPE_ITEMS.find((p) => p.id === ppeId);
                  if (!ppe) return null;
                  return (
                    <span
                      key={ppeId}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-300 font-medium"
                    >
                      {ppe.name[language].split(' ')[0]}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Launch Hazard Hunt Game for this Zone */}
            <button
              onClick={() => {
                soundEngine.playSuccess();
                onLaunchHazardHunt(activeZone.id);
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer mt-2"
            >
              <Eye className="w-4 h-4" />
              <span>
                {language === 'bn'
                  ? 'এই জোনে বিপদ খুঁজে বের করার খেলা শুরু করুন'
                  : language === 'hi'
                  ? 'इस जोन में खतरा खोजो गेम खेलें'
                  : 'Start Hazard Spotting Game in this Zone'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
