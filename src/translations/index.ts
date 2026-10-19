import { WorkerRole, PPEItem, PlantZone, ConsequenceScenario, HazardItem, SupervisorCheckItem, WorkOrder, RoleChallengeTask } from '../types';

export const WORKER_ROLES: WorkerRole[] = [
  {
    id: 'barrel_filling',
    title: {
      bn: 'ব্যারেল ফিলিং অপারেটর',
      hi: 'बैरल फिलिंग ऑपरेटर',
      en: '200L Drum Filling Operator'
    },
    subtitle: {
      bn: '২০০ লিটার ড্রাম তেল ফিলিং, ওজন ও সিলিং',
      hi: '200 लीटर ड्रम तेल भराई, वजन और सीलिंग',
      en: '200L Drum oil filling, weighing & bung sealing'
    },
    icon: 'barrel',
    badge: {
      bn: 'প্যাকেজিং লাইন',
      hi: 'पैकेजिंग लाइन',
      en: 'Packaging Bay'
    },
    color: 'from-blue-600 to-indigo-700',
    requiredPPE: ['helmet', 'goggles', 'gloves_nitrile', 'boots', 'vest'],
    primaryPlantZone: 'barrel_filling'
  },
  {
    id: 'smallpack_filling',
    title: {
      bn: 'স্মলপ্যাক ও ক্যাপ ফিলিং',
      hi: 'स्मॉलपैक एवं कैपिंग ऑपरेटर',
      en: 'Smallpack & Capping Line (1L/5L)'
    },
    subtitle: {
      bn: '১ ও ৫ লিটার ক্যান ফিলিং, ক্যাপ সিলিং ও কার্টন প্যাকিং',
      hi: '1 और 5 लीटर कैन भराई, कैप सीलिंग और कार्टन पैकिंग',
      en: '1L & 5L bottles filling, automatic capping & carton packing'
    },
    icon: 'bottle',
    badge: {
      bn: 'স্মলপ্যাক উইং',
      hi: 'स्मॉलपैक विंग',
      en: 'Smallpack Wing'
    },
    color: 'from-amber-600 to-orange-700',
    requiredPPE: ['helmet', 'gloves_nitrile', 'boots', 'vest', 'ear_protection'],
    primaryPlantZone: 'smallpack_filling'
  },
  {
    id: 'material_handling',
    title: {
      bn: 'ম্যাটেরিয়াল হ্যান্ডলিং ও ফর্কলিফট',
      hi: 'मटेरियल हैंडलिंग और फोर्कलिफ्ट',
      en: 'Material Handling & Forklift'
    },
    subtitle: {
      bn: 'প্যালেট সরানো, ব্যারেল লোডিং ও গুদামজাতকরণ',
      hi: 'पैलेट मूवमेंट, ड्रम लोडिंग और वेयरहाउस स्टैकिंग',
      en: 'Moving pallets, drum loading & high-bay rack storage'
    },
    icon: 'forklift',
    badge: {
      bn: 'লজিস্টিকস ও ফ্লিট',
      hi: 'लॉजिस्टिक्स एवं फ्लीट',
      en: 'Logistics'
    },
    color: 'from-emerald-600 to-teal-700',
    requiredPPE: ['helmet', 'gloves_heavy', 'boots', 'vest'],
    primaryPlantZone: 'warehouse'
  },
  {
    id: 'blending_kettle',
    title: {
      bn: 'লুব ব্লেন্ডিং কেটলি অপারেটর',
      hi: 'ल्यूब ब्लेंडिंग केतली ऑपरेटर',
      en: 'Lube Blending Kettle Operator'
    },
    subtitle: {
      bn: 'বেস অয়েল ও অ্যাডিটিভ মিক্সিং, তাপমাত্রা ও স্যাম্পলিং',
      hi: 'बेस ऑयल और एडिटिव मिक्सिंग, तापमान नियंत्रण और सैंपलिंग',
      en: 'Base oil & additive mixing, steam heating & lab sampling'
    },
    icon: 'kettle',
    badge: {
      bn: 'কোর ব্লেন্ডিং প্ল্যান্ট',
      hi: 'कोर ब्लेंडिंग प्लांट',
      en: 'Core Blending'
    },
    color: 'from-purple-600 to-violet-800',
    requiredPPE: ['helmet', 'goggles', 'gloves_nitrile', 'boots', 'respirator', 'vest'],
    primaryPlantZone: 'kettles'
  },
  {
    id: 'general_plant',
    title: {
      bn: 'জেনারেল প্ল্যান্ট ও পাইপ রক্ষণাবেক্ষণ',
      hi: 'जनरल प्लांट एवं यूटिलिटी रखरखाव',
      en: 'General Plant Maintenance & Utility'
    },
    subtitle: {
      bn: 'পাম্প, পাইপলাইন, মোটর ও সাধারণ মেরামত কাজ',
      hi: 'पंप, पाइपलाइन, मोटर और सामान्य मरम्मत कार्य',
      en: 'Pumps, pipelines, valves, motors and utility checks'
    },
    icon: 'wrench',
    badge: {
      bn: 'প্ল্যান্ট ইউটিলিটি',
      hi: 'प्लांट यूटिलिटी',
      en: 'Plant Utility'
    },
    color: 'from-cyan-600 to-blue-800',
    requiredPPE: ['helmet', 'goggles', 'gloves_heavy', 'boots', 'vest', 'ear_protection'],
    primaryPlantZone: 'supply_block'
  },
  {
    id: 'supervisor',
    title: {
      bn: 'প্ল্যান্ট সেফটি সুপারভাইজার',
      hi: 'प्लांट सेफ्टी सुपरवाइजर',
      en: 'Plant Safety Supervisor (EHS In-Charge)'
    },
    subtitle: {
      bn: 'পুরো ৩০ একর প্ল্যান্টের সুরক্ষা অডিট, পিপিই নজরদারি ও অনুমতিপত্র',
      hi: 'पूरे 30 एकड़ प्लांट का सुरक्षा ऑडिट, पीपीई जांच और वर्क परमिट',
      en: 'Full 30-acre plant audit, PPE compliance & safety permits'
    },
    icon: 'clipboard',
    badge: {
      bn: 'সেফটি ইন-চার্জ',
      hi: 'सेफ्टी इन-चार्ज',
      en: 'Safety Lead'
    },
    color: 'from-rose-600 to-red-800',
    requiredPPE: ['helmet', 'goggles', 'boots', 'vest'],
    primaryPlantZone: 'canteen_admin'
  }
];

export const PPE_ITEMS: PPEItem[] = [
  {
    id: 'helmet',
    name: {
      bn: 'সুরক্ষা হেলমেট (চিন স্ট্র্যাপ সহ)',
      hi: 'सुरक्षा हेलमेट (चिन स्ट्रैप सहित)',
      en: 'Safety Helmet (with chin strap)'
    },
    purpose: {
      bn: 'ওপর থেকে ভারী নাট-বল্টু বা পাইপ পড়ে মাথায় আঘাত থেকে বাঁচায়',
      hi: 'ऊंचाई से नट-बोल्ट या औजार गिरने पर सिर को चोट से बचाता है',
      en: 'Protects head from falling bolts, tools & overhead gantry impacts'
    },
    category: 'head',
    icon: 'HardHat',
    requiredFor: ['barrel_filling', 'smallpack_filling', 'material_handling', 'blending_kettle', 'general_plant', 'supervisor']
  },
  {
    id: 'goggles',
    name: {
      bn: 'কেমিক্যাল স্প্ল্যাশ গগলস / চশমা',
      hi: 'केमिकल स्प्लैश चश्मा / गॉगल्स',
      en: 'Chemical Splash Safety Goggles'
    },
    purpose: {
      bn: 'গরম তেল ও রাসায়নিক অ্যাডিটিভ ছিটকে চোখে পড়া রোধ করে',
      hi: 'गर्म तेल और केमिकल एडिटिव्स के छींटों से आंखों की सुरक्षा',
      en: 'Prevents hot oil & chemical additives from splashing into eyes'
    },
    category: 'face',
    icon: 'Glasses',
    requiredFor: ['blending_kettle', 'barrel_filling', 'general_plant', 'supervisor']
  },
  {
    id: 'gloves_nitrile',
    name: {
      bn: 'নাইট্রিল কেমিক্যাল প্রতিরোধী গ্লাভস',
      hi: 'नाइट्राइल केमिकल रोधी दस्ताने',
      en: 'Nitrile Chemical Resistant Gloves'
    },
    purpose: {
      bn: 'অ্যাডিটিভ ও লুব অয়েল ত্বকে সরাসরি লাগলে চামড়া ক্ষয় থেকে রক্ষা করে',
      hi: 'केमिकल और तेल से हाथों की त्वचा जलने व कटने से बचाता है',
      en: 'Shields skin from harsh base oils, solvent & corrosive additives'
    },
    category: 'hands',
    icon: 'Hand',
    requiredFor: ['barrel_filling', 'smallpack_filling', 'blending_kettle']
  },
  {
    id: 'gloves_heavy',
    name: {
      bn: 'ভারী লেদার হ্যান্ডলিং গ্লাভস',
      hi: 'मजबूत लेदर ग्रिप दस्ताने',
      en: 'Heavy Leather Handling Gloves'
    },
    purpose: {
      bn: 'লোহার ভারী ড্রাম ও প্যালেট তোলার সময় হাত কাটা ও ঘর্ষণ আটকায়',
      hi: 'लोहे के ड्रम और भारी पैलेट पकड़ते समय हाथ छिलने से बचाता है',
      en: 'Prevents pinches, cuts & friction when rolling heavy steel drums'
    },
    category: 'hands',
    icon: 'Shield',
    requiredFor: ['material_handling', 'general_plant']
  },
  {
    id: 'boots',
    name: {
      bn: 'স্টিল-টো অ্যান্টিস্ট্যাটিক সেফটি বুট',
      hi: 'स्टील-टो एंटीस्टैटिक सेफ्टी बूट',
      en: 'Steel-Toe Antistatic Safety Boots'
    },
    purpose: {
      bn: 'ভারী ড্রাম পায়ের ওপর পড়লে এবং সুইচবোর্ডের ইলেকট্রিক শক থেকে বাঁচায়',
      hi: 'भारी ड्रम पैर पर गिरने से और बिजली के झटके (इलेक्ट्रिक शॉक) से बचाव',
      en: 'Protects toes from falling drums & provides antistatic grounding against shocks'
    },
    category: 'feet',
    icon: 'Footprints',
    requiredFor: ['barrel_filling', 'smallpack_filling', 'material_handling', 'blending_kettle', 'general_plant', 'supervisor']
  },
  {
    id: 'vest',
    name: {
      bn: 'হাই-ভিজ ফ্লোরোসেন্ট ভেস্ট',
      hi: 'हाई-विज फ्लोरोसेंट रिफ्लेक्टिव वेस्ट',
      en: 'High-Visibility Reflective Vest'
    },
    purpose: {
      bn: 'ফর্কলিফট ও ট্রাক ড্রাইভাররা দূর থেকেই আপনাকে স্পষ্ট দেখতে পায়',
      hi: 'फोर्कलिफ्ट और ट्रक चालकों को दूर से ही आप साफ दिखाई देते हैं',
      en: 'Ensures forklift operators & tanker drivers can see you clearly in all bays'
    },
    category: 'body',
    icon: 'Shirt',
    requiredFor: ['barrel_filling', 'smallpack_filling', 'material_handling', 'blending_kettle', 'general_plant', 'supervisor']
  },
  {
    id: 'ear_protection',
    name: {
      bn: 'ইয়ার মাফ / শব্দ নিরোধক প্লাগ',
      hi: 'ईयर मफ / कान का सुरक्षा प्लग',
      en: 'Noise Cancelling Ear Muffs / Plugs'
    },
    purpose: {
      bn: 'উচ্চ শব্দের কম্প্রেশার ও ফিলিং নজলের শব্দ থেকে কানের শ্রবণশক্তি বাঁচায়',
      hi: 'तेज आवाज वाले कंप्रेसर और फिलिंग मशीन के शोर से कान का बचाव',
      en: 'Guards hearing against high decibel compressors, pumps & packaging noise'
    },
    category: 'ears',
    icon: 'Headphones',
    requiredFor: ['smallpack_filling', 'general_plant']
  },
  {
    id: 'respirator',
    name: {
      bn: 'ভেপার ও ফিউম রেসপিরেটর মাস্ক',
      hi: 'वेपर व फ्यूम रेस्पिरेटर मास्क',
      en: 'Vapor & Fume Respirator Mask'
    },
    purpose: {
      bn: 'কেটলিতে গরম তেল ও অ্যাডিটিভের ক্ষতিকর বাষ্প ফুসফুসে যেতে দেয় না',
      hi: 'केतली में गर्म तेल और एडिटिव की जहरीली भाप सांस में जाने से रोकता है',
      en: 'Filters organic vapors and additive chemical fumes during heating'
    },
    category: 'lungs',
    icon: 'Wind',
    requiredFor: ['blending_kettle']
  }
];

export const PLANT_ZONES: PlantZone[] = [
  {
    id: 'kettles',
    name: {
      bn: 'লুব ব্লেন্ডিং কেটলি প্ল্যান্ট',
      hi: 'ल्यूब ब्लेंडिंग केतली प्लांट',
      en: 'Lube Blending Kettles Area'
    },
    shortName: {
      bn: 'কেটলি ইউনিট',
      hi: 'केतली प्लांट',
      en: 'Kettles'
    },
    description: {
      bn: 'উত্তপ্ত স্টিম কেটলি, অ্যাডিটিভ ডজিং ও মোটর চালিত মিক্সার',
      hi: 'गर्म भाप केतली, एडिटिव मिश्रण और मोटर मिक्सर',
      en: 'Large automated blending kettles with steam coils & top-drive agitators'
    },
    acreage: '৪ একর',
    primaryHazards: {
      bn: ['গরম তেল ছিটকে আসা', 'স্টিম লাইনের তাপ', 'ঘূর্ণায়মান মিক্সার ব্লেড'],
      hi: ['गर्म तेल के छींटे', 'भाप पाइपलाइन का ताप', 'घूमता हुआ मिक्सर ब्लेड'],
      en: ['Hot oil thermal splash', 'High pressure steam pipes', 'Rotating agitator shaft']
    },
    requiredPPE: ['helmet', 'goggles', 'gloves_nitrile', 'boots', 'respirator', 'vest'],
    badgeColor: 'bg-purple-900/60 text-purple-200 border-purple-500/30',
    mapCoords: { x: 260, y: 70, width: 230, height: 160 }
  },
  {
    id: 'barrel_filling',
    name: {
      bn: '২০০ লিটার ব্যারেল ফিলিং বে',
      hi: '200 लीटर बैरल फिलिंग बे',
      en: '200L Drum / Barrel Filling Bay'
    },
    shortName: {
      bn: 'ব্যারেল লাইন',
      hi: 'बैरल लाइन',
      en: 'Barrel Bay'
    },
    description: {
      bn: 'ভারী ২০০ লিটার ড্রাম ফিলিং ল্যান্স, কনভেয়ার রোলার ও ওজন কাঁটা',
      hi: 'भारी 200 लीटर ड्रम भराई, रोलर कन्वेयर और कांटा',
      en: 'Heavy 200L drum filling nozzles, roller tracks & weighing scales'
    },
    acreage: '৫ একর',
    primaryHazards: {
      bn: ['ভারী ড্রাম পায়ে পড়া', 'মেঝেতে তেল পড়ে পিচ্ছিল হওয়া', 'ড্রাম পিনচ পয়েন্ট'],
      hi: ['पैर पर भारी ड्रम गिरना', 'फर्श पर तेल से फिसलन', 'हाथ दबने का खतरा'],
      en: ['Heavy drum slipping on toes', 'Oily floor slip hazard', 'Conveyor pinch points']
    },
    requiredPPE: ['helmet', 'goggles', 'gloves_nitrile', 'boots', 'vest'],
    badgeColor: 'bg-blue-900/60 text-blue-200 border-blue-500/30',
    mapCoords: { x: 520, y: 70, width: 220, height: 160 }
  },
  {
    id: 'smallpack_filling',
    name: {
      bn: 'স্মলপ্যাক (১লি/৫লি) বোতল ফিলিং লাইন',
      hi: 'स्मॉलपैक (1L/5L) बॉटल फिलिंग लाइन',
      en: 'Smallpack (1L/5L) Bottling & Capping Line'
    },
    shortName: {
      bn: 'স্মলপ্যাক',
      hi: 'स्मॉलपैक',
      en: 'Smallpack'
    },
    description: {
      bn: 'দ্রুতগতির রোটারি বোতল ফিলিং, স্বয়ংক্রিয় ক্যাপ সিলিং ও কার্টনার',
      hi: 'तेज गति बॉटल फिलिंग मशीन, कैप सीलिंग और कार्टन पैकिंग',
      en: 'High-speed rotary filler, torque capping machine & auto boxing'
    },
    acreage: '৩ একর',
    primaryHazards: {
      bn: ['ক্যাপিং মেশিনে আঙুল আটকানো', 'উচ্চ শব্দে কানের সমস্যা', 'ভাঙা প্লাস্টিক ক্যান'],
      hi: ['कैपिंग मशीन में उंगली फंसना', 'मशीन के तेज शोर से कान का दर्द', 'फिसलन भरा फर्श'],
      en: ['Machine finger entrapment', 'High decibel noise exposure', 'Repetitive conveyor jams']
    },
    requiredPPE: ['helmet', 'gloves_nitrile', 'boots', 'vest', 'ear_protection'],
    badgeColor: 'bg-amber-900/60 text-amber-200 border-amber-500/30',
    mapCoords: { x: 760, y: 70, width: 220, height: 160 }
  },
  {
    id: 'tank_farm',
    name: {
      bn: 'বেস অয়েল ও অ্যাডিটিভ ট্যাঙ্ক ফার্ম',
      hi: 'बेस ऑयल एवं एडिटिव टैंक फार्म',
      en: 'Base Oil & Additives Storage Tank Farm'
    },
    shortName: {
      bn: 'ট্যাঙ্ক ফার্ম',
      hi: 'टैंक फार्म',
      en: 'Tank Farm'
    },
    description: {
      bn: 'বিশাল উল্লম্ব স্টোরেজ ট্যাঙ্ক, নিরাপত্তা বাঁধ (ডাইক ওয়াল) ও পাইপিং ম্যানিফোল্ড',
      hi: 'विशाल स्टोरेज टैंक, सुरक्षा बांध (डाइक) और पाइपिंग मैनिफोल्ड',
      en: 'Massive vertical oil tanks, containment dikes, spiral stairs & manifolds'
    },
    acreage: '৮ একর',
    primaryHazards: {
      bn: ['সিঁড়ি থেকে পড়ে যাওয়া', 'স্ট্যাটিক স্পার্কের আগুন', 'তেল উপচে পড়া'],
      hi: ['ऊंचाई से फिसलना', 'स्टैटिक चिंगारी से आग', 'तेल रिसाव'],
      en: ['Fall from tank height', 'Static discharge ignition', 'Overflow into dike']
    },
    requiredPPE: ['helmet', 'goggles', 'boots', 'vest'],
    badgeColor: 'bg-emerald-900/60 text-emerald-200 border-emerald-500/30',
    mapCoords: { x: 20, y: 70, width: 220, height: 230 }
  },
  {
    id: 'truck_loading',
    name: {
      bn: 'রোড ট্যাঙ্কার লোডিং ও ডিক্যান্টিং গ্যান্ট্রি',
      hi: 'रोड टैंकर लोडिंग व खाली करने की गैंट्री',
      en: 'Road Tanker Loading & Decanting Gantry'
    },
    shortName: {
      bn: 'ট্যাঙ্কার গ্যান্ট্রি',
      hi: 'टैंकर गैंट्री',
      en: 'Gantry'
    },
    description: {
      bn: 'কাঁচা তেল ডিক্যান্টিং, বাল্ক তেল লোডিং আর্মস ও আর্থিং গ্রাউন্ডিং পোস্ট',
      hi: 'कच्चा तेल खाली करना, भारी पाइप आर्म्स और अर्थिंग कनेक्शन',
      en: 'Heavy top/bottom loading arms, overspill sensors & static grounding reels'
    },
    acreage: '৩ একর',
    primaryHazards: {
      bn: ['আর্থিং ছাড়া অগ্নিকাণ্ড', 'ট্রাক চাকা গড়িয়ে চলা', 'হাই প্রেশার হোস লিক'],
      hi: ['बिना अर्थिंग चिंगारी व आग', 'ट्रक पीछे खिसकना', 'पाइप फटने का खतरा'],
      en: ['Static spark without ground clamp', 'Truck rollaway (no chocks)', 'High pressure hose whip']
    },
    requiredPPE: ['helmet', 'goggles', 'gloves_nitrile', 'boots', 'vest'],
    badgeColor: 'bg-orange-900/60 text-orange-200 border-orange-500/30',
    mapCoords: { x: 20, y: 320, width: 220, height: 180 }
  },
  {
    id: 'warehouse',
    name: {
      bn: 'ফিনিশড গুডস ওয়্যারহাউস ও র‍্যাক এরিয়া',
      hi: 'वेयरहाउस एवं हाई-बे रैक क्षेत्र',
      en: 'Finished Goods Warehouse & High Racks'
    },
    shortName: {
      bn: 'ওয়্যারহাউস',
      hi: 'वेयरहाउस',
      en: 'Warehouse'
    },
    description: {
      bn: 'উঁচু র‍্যাকে সাজানো অয়েল প্যালেট, ফর্কলিফট চলাচল লেন ও শিপিং ডক',
      hi: 'ऊंची रैक पर सजाया गया माल, फोर्कलिफ्ट लेन और शिपिंग डॉक',
      en: 'Multi-tier pallet racks, designated forklift traffic aisles & shipping docks'
    },
    acreage: '৪ একর',
    primaryHazards: {
      bn: ['ফর্কলিফটের ধাক্কা লাগা', 'ওপর থেকে প্যালেট খসে পড়া', 'অন্ধ মোড়ে সংঘর্ষ'],
      hi: ['फोर्कलिफ्ट की टक्कर', 'ऊपर से डिब्बा गिरना', 'ब्लाइंड कॉर्नर पर भिड़ंत'],
      en: ['Forklift collision with worker', 'Falling pallet load from height', 'Blind corner blindspots']
    },
    requiredPPE: ['helmet', 'gloves_heavy', 'boots', 'vest'],
    badgeColor: 'bg-teal-900/60 text-teal-200 border-teal-500/30',
    mapCoords: { x: 260, y: 250, width: 480, height: 170 }
  },
  {
    id: 'supply_block',
    name: {
      bn: 'সাপ্লাই ব্লক, বয়লার ও ইলেকট্রিক্যাল সাবস্টেশন',
      hi: 'सप्लाई ब्लॉक, बॉयलर और इलेक्ट्रिकल सबस्टेशन',
      en: 'Supply Block, Steam Boiler & Substation'
    },
    shortName: {
      bn: 'সাপ্লাই ব্লক',
      hi: 'सप्लाई ब्लॉक',
      en: 'Supply'
    },
    description: {
      bn: 'উচ্চ ভোল্টেজ সুইচবোর্ড প্যানেল, এয়ার কম্প্রেশার ও স্টিম বয়লার',
      hi: 'हाई वोल्टेज बिजली पैनल, एयर कंप्रेसर और स्टीम बॉयलर',
      en: 'High-voltage switchgear panels, industrial air compressors & boilers'
    },
    acreage: '২ একর',
    primaryHazards: {
      bn: ['বিদ্যুৎস্পৃষ্ট (ইলেকট্রিক শক)', 'স্টিম বার্ন', 'উচ্চ শব্দের কম্প্রেশার'],
      hi: ['बिजली का झटका (इलेक्ट्रिक शॉक)', 'भाप से जलना', 'कंप्रेसर का तेज शोर'],
      en: ['High voltage electrocution', 'Steam pipe rupture burn', 'Arc flash hazard']
    },
    requiredPPE: ['helmet', 'goggles', 'boots', 'vest', 'ear_protection'],
    badgeColor: 'bg-red-900/60 text-red-200 border-red-500/30',
    mapCoords: { x: 760, y: 250, width: 220, height: 170 }
  },
  {
    id: 'canteen_admin',
    name: {
      bn: 'ক্যান্টিন, অ্যাডমিন ও এমার্জেন্সি অ্যাসেম্বলি পয়েন্ট',
      hi: 'कैंटीन, एडमिन व आपातकालीन असेंबली पॉइंट',
      en: 'Canteen, Admin & Emergency Assembly Point'
    },
    shortName: {
      bn: 'অ্যাডমিন/ক্যান্টিন',
      hi: 'एडमिन/कैंटीन',
      en: 'Admin'
    },
    description: {
      bn: 'জরুরী ফার্স্ট এইড রুম, ফায়ার কন্ট্রোল প্যানেল ও খোলা জমায়েত প্রাঙ্গণ',
      hi: 'प्राथमिक चिकित्सा कक्ष, फायर कंट्रोल और सुरक्षित खुला मैदान',
      en: 'Occupational health clinic, fire alarm board & designated evacuation muster point'
    },
    acreage: '১ একর',
    primaryHazards: {
      bn: ['জরুরী পথ আটকে থাকা', 'আইওয়াশ স্টেশনে বাধা', 'অগ্নি নির্বাপক ব্লকেজ'],
      hi: ['इमरजेंसी गेट पर रुकावट', 'आंख धोने के नल पर डिब्बे', 'फायर सिलेंडर ब्लॉक होना'],
      en: ['Blocked emergency egress exit', 'Obstructed safety eyewash shower', 'Delayed evacuation']
    },
    requiredPPE: ['vest', 'boots'],
    badgeColor: 'bg-slate-800 text-slate-200 border-slate-600',
    mapCoords: { x: 260, y: 440, width: 720, height: 80 }
  }
];

export const CONSEQUENCE_SCENARIOS: ConsequenceScenario[] = [
  {
    id: 'bolt_fall',
    title: {
      bn: 'ওপর থেকে লোহার বোল্ট মাথায় পড়া',
      hi: 'ऊंचाई से लोहे का बोल्ट सिर पर गिरना',
      en: 'Heavy Bolt Dropped from High Gantry'
    },
    relatedPPE: 'helmet',
    zone: 'kettles',
    soundEffect: 'bolt',
    description: {
      bn: 'কেটলির ওপরের পাইপলাইন মেরামতের সময় উঁচু প্ল্যাটফর্ম থেকে এক কর্মীর হাত থেকে একটি ভারী লোহার বোল্ট নিচে খসে পড়ল!',
      hi: 'केतली के ऊपर पाइप ठीक करते समय एक भारी लोहे का बोल्ट ऊपर से नीचे गिर गया!',
      en: 'During upper pipeline maintenance above the blending kettles, a heavy steel bolt slips and plummets towards the walkway!'
    },
    withoutPPEOutcome: {
      bn: 'ভয়ানক দুর্ঘটনা! মাথায় হেলমেট না থাকায় বোল্টটি সরাসরি মাথায় আঘাত করল। রক্তক্ষরণ এবং গুরুতর মাথায় চোট হল! হাসপাতালে পাঠাতে হল।',
      hi: 'भयंकर दुर्घटना! सिर पर हेलमेट न होने के कारण बोल्ट सीधे सिर पर लगा। गहरा घाव और खून बहने लगा, अस्पताल ले जाना पड़ा!',
      en: 'Severe Trauma! Without a safety helmet, the bolt struck directly onto the bare skull causing severe laceration, concussion, and emergency hospitalization!'
    },
    withPPEOutcome: {
      bn: 'সুরক্ষিত! শক্ত হেলমেটের ওপর বোল্টটি আছড়ে পড়ে নিরাপদে ছিটকে গেল। চিন স্ট্র্যাপ থাকায় হেলমেট নড়েনি। কর্মী পুরোপুরি সুরক্ষিত রইল!',
      hi: 'सुरक्षित! मजबूत हेलमेट पर बोल्ट लगा और टकराकर दूर गिर गया। चिन स्ट्रैप के कारण हेलमेट सिर पर रहा और ऑपरेटर बिल्कुल सुरक्षित बच गया!',
      en: 'Saved by Helmet! The heavy steel bolt struck the impact-absorbing helmet shell and deflected away safely. Zero head injury!'
    }
  },
  {
    id: 'electric_shock',
    title: {
      bn: 'তেল পাম্পের ভেজা সুইচে ইলেকট্রিক শক',
      hi: 'तेल पंप के गीले स्विच पर बिजली का झटका',
      en: 'Electric Shock at Wet Pump Switchboard'
    },
    relatedPPE: 'boots',
    zone: 'supply_block',
    soundEffect: 'shock',
    description: {
      bn: 'সাপ্লাই ব্লকে মোটর চালুর সময় ভেজা মেঝেতে দাঁড়িয়ে কর্মী ধাতব সুইচবোর্ড হাত দিয়ে চাপতে গেল। পাম্পে ইন্টারনাল কারেন্ট লিক ছিল!',
      hi: 'सप्लाई ब्लॉक में मोटर चालू करते समय गीले फर्श पर खड़े होकर ऑपरेटर ने स्विच दबाया। पंप में बिजली का करंट लीक था!',
      en: 'While starting the transfer pump on a damp floor, the worker touches the metal control panel which had an undetected phase leakage!'
    },
    withoutPPEOutcome: {
      bn: 'মারাত্মক বিদ্যুৎস্পৃষ্ট! সাধারণ চটি বা সাধারণ জুতো থাকায় বিদ্যুৎ শরীর দিয়ে মাটিতে চলে গেল। তীব্র শক খেয়ে মাটিতে লুটিয়ে পড়ল কর্মী!',
      hi: 'खतरनाक बिजली का झटका! सामान्य चप्पल या जूते पहने होने से करंट सीधे शरीर में दौड़ गया। ऑपरेटर तड़पकर जमीन पर गिर पड़ा!',
      en: 'Severe Electrocution! Wearing ordinary slippers or conductive shoes, the current passed straight through the heart to the ground, causing paralysis and burns!'
    },
    withPPEOutcome: {
      bn: 'বিদ্যুৎ প্রতিরোধ! সার্টিফাইড অ্যান্টিস্ট্যাটিক রাবার সোলের সেফটি বুট বিদ্যুৎকে মাটিতে সার্কিট তৈরি করতে দিল না। কর্মী পুরোপুরি সুরক্ষিত রইল!',
      hi: 'सुरक्षित! शॉक-प्रूफ एंटीस्टैटिक सेफ्टी बूट ने करंट को जमीन तक नहीं जाने दिया। ऑपरेटर पूरी तरह सुरक्षित रहा!',
      en: 'Shock Prevented! Certified antistatic insulating safety boots broke the electrical ground path. The worker felt no lethal voltage and stepped back safely!'
    }
  },
  {
    id: 'chemical_splash',
    title: {
      bn: 'গরম কেটলি ম্যানহোল থেকে তেল ও কেমিক্যাল ছিটকে আসা',
      hi: 'गर्म केतली से तेल व केमिकल के छींटे चेहरे पर पड़ना',
      en: 'Hot Additive & Lube Oil Splash to Eyes'
    },
    relatedPPE: 'goggles',
    zone: 'kettles',
    soundEffect: 'splash',
    description: {
      bn: '৭০ ডিগ্রি সেলসিয়াসে উত্তপ্ত কেটলিতে সান্দ্রতা বৃদ্ধির অ্যাডিটিভ ঢালার সময় হঠাৎ বুদবুদ ফেটে গরম রাসায়নিক মিশ্রণ মুখে ছিটকে এল!',
      hi: '70 डिग्री पर गर्म केतली में एडिटिव डालते समय अचानक झाग के साथ गर्म केमिकल का छींटा चेहरे की ओर उछला!',
      en: 'While pouring a performance additive drum into a 70°C agitated blending kettle, a sudden vapor pocket erupted hot viscous oil upward!'
    },
    withoutPPEOutcome: {
      bn: 'চোখে রাসায়নিক ক্ষত! সুরক্ষা চশমা না থাকায় গরম এসিডিক রাসায়নিক সরাসরি চোখে ঢুকল। তীব্র জ্বালা ও দৃষ্টিশক্তি হারানোর ঝুঁকি দেখা দিল!',
      hi: 'आंखों को नुकसान! सुरक्षा चश्मा न पहनने से गर्म केमिकल सीधे आंखों में चला गया। भयंकर जलन हुई और हमेशा के लिए रोशनी जाने का खतरा बन गया!',
      en: 'Chemical Eye Burn! Without splash goggles, the caustic additive burned the corneal tissue causing excruciating pain and potential blindness!'
    },
    withPPEOutcome: {
      bn: 'চোখ অক্ষত! কেমিক্যাল স্প্ল্যাশ গগলস পুরো ছিটকে আসা তরল আটকে দিল। দ্রুত আইওয়াশে মুখ ধুয়ে কর্মী সুস্থভাবে কাজে ফিরল!',
      hi: 'आंखें सुरक्षित! केमिकल स्प्लैश गॉगल्स ने सारे छींटों को रोक लिया। ऑपरेटर की आंखें बिल्कुल सुरक्षित रहीं!',
      en: 'Eyes Protected! The sealed splash visor took the full blast of hot droplets. The worker flushed with eyewash and suffered zero optical damage!'
    }
  },
  {
    id: 'drum_toe_crush',
    title: {
      bn: '২০০ কেজির লোহার ব্যারেল পায়ের ওপর খসে পড়া',
      hi: '200 किलो का भारी ड्रम पैर पर खिसकना',
      en: '200kg Steel Drum Dropped on Toes'
    },
    relatedPPE: 'boots',
    zone: 'barrel_filling',
    soundEffect: 'crush',
    description: {
      bn: 'কনভেয়ার রোলার থেকে প্যালেটে ২০০ লিটার লুব অয়েল ভর্তি ড্রাম সরানোর সময় হাত ফসকে ২০০ কেজির ভারী ড্রামটি নিচে খসে পড়ল!',
      hi: 'कन्वेयर से भारी 200 लीटर तेल से भरा ड्रम हटाते समय हाथ फिसल गया और 200 किलो का ड्रम पैर पर गिर पड़ा!',
      en: 'While tilting a freshly filled 200kg lube barrel off the roller conveyor, the rim slips and crashes down toward the worker\'s foot!'
    },
    withoutPPEOutcome: {
      bn: 'হাড় ভাঙা চোট! সাধারণ ক্যানভাস বা পাতলা জুতো থাকায় ২০০ কেজির ভারে পায়ের আঙুলের হাড় গুঁড়িয়ে গেল! ৩ মাস কর্মহীন ও অসহ্য যন্ত্রণা!',
      hi: 'पैर की हड्डी टूटी! सामान्य जूते पहनने से 200 किलो के भारी वजन ने पैर की उंगलियां कुचल दीं। महीनों तक अस्पताल में रहना पड़ा!',
      en: 'Crushed Foot! In canvas shoes, the 200kg steel rim instantly crushed multiple metatarsal toe bones, requiring surgical pins and months of disability!'
    },
    withPPEOutcome: {
      bn: 'স্টিল ক্যাপে সুরক্ষা! সেফটি বুটের ভেতর স্টিল টো ক্যাপ ড্রামের সমস্ত ভার সহ্য করল। এক ফোঁটাও চোট লাগেনি পায়ের আঙুলে!',
      hi: 'स्टील-टो ने बचाया! सेफ्टी बूट की स्टील टो ने ड्रम का सारा वजन झेल लिया। उंगलियों पर खरोंच तक नहीं आई!',
      en: 'Protected by Steel-Toe! The reinforced steel toe cap supported the 200kg impact without deforming. The operator walked away unharmed!'
    }
  },
  {
    id: 'forklift_collision',
    title: {
      bn: 'গুদাম গলিতে ফর্কলিফটের ধাক্কা লাগা',
      hi: 'वेयरहाउस में फोर्कलिफ्ट की टक्कर से बाल-बाल बचना',
      en: 'Forklift Near-Miss in Warehouse Aisle'
    },
    relatedPPE: 'vest',
    zone: 'warehouse',
    soundEffect: 'horn',
    description: {
      bn: 'ওয়্যারহাউসের ড্রাম র‍্যাকের অন্ধ মোড় দিয়ে ফর্কলিফট ব্যাক গিয়ার দিয়ে বের হচ্ছিল। অন্ধকারাচ্ছন্ন করিডোরে কর্মী হেঁটে যাচ্ছিল!',
      hi: 'वेयरहाउस में ड्रम रैक के मोड़ से फोर्कलिफ्ट पीछे आ रही थी। सामने ऑपरेटर चल रहा था!',
      en: 'A laden 3-ton forklift reverses out from high-bay pallet racking into the cross aisle where a worker is walking!'
    },
    withoutPPEOutcome: {
      bn: 'অন্ধকার পোশাকের কারণে চালক কর্মীকে দেখতে পেল না! ফর্কলিফটের কোনা লেগে কর্মী ছিটকে ড্রাম র‍্যাকে ধাক্কা খেল এবং পিঠে চোট পেল!',
      hi: 'ड्राइवर को ऑपरेटर दिखा ही नहीं! फोर्कलिफ्ट से जोरदार टक्कर हुई और ऑपरेटर रैक पर जा गिरा!',
      en: 'Unseen Collision! Dressed in dark clothes, the worker was invisible in the shadow of the rack. The forklift clipped him, causing severe pelvic trauma!'
    },
    withPPEOutcome: {
      bn: 'উজ্জ্বল ফ্লোরোসেন্ট ভেস্ট দূর থেকেই আলো প্রতিফলিত করল! চালক ১৫ ফুট দূর থেকেই কর্মীকে দেখে সজোরে ব্রেক কষে হর্ন দিল। দুর্ঘটনা এড়ানো গেল!',
      hi: 'रिफ्लेक्टिव वेस्ट की चमक दूर से ही दिखी! ड्राइवर ने तुरंत ब्रेक लगाया और हॉर्न बजा दिया। कोई दुर्घटना नहीं हुई!',
      en: 'Instant Visibility! The fluorescent reflective strips caught the forklift headlights from 15 meters away. The driver braked smoothly!'
    }
  },
  {
    id: 'ear_damage',
    title: {
      bn: 'স্মলপ্যাক ও কম্প্রেশারের উচ্চ শব্দে কানের ক্ষতি',
      hi: 'कंप्रेसर और मशीनों के तेज शोर से कान की खराबी',
      en: 'High Noise Exposure Hearing Damage'
    },
    relatedPPE: 'ear_protection',
    zone: 'smallpack_filling',
    soundEffect: 'ringing',
    description: {
      bn: 'স্মলপ্যাক লাইনে এয়ার জেট ড্রায়ার এবং ক্যাপিং মেশিনের একটানা ৯০ ডেসিবেলের তীব্র কর্কশ শব্দ ৮ ঘণ্টা ধরে চলছে!',
      hi: 'स्मॉलपैक लाइन पर तेज एयर जेट और मशीन का 90 डेसिबल का कान फाड़ू शोर लगातार गूंज रहा है!',
      en: 'Continuous high decibel (92 dBA) exhaust and pneumatic capping jets vibrate throughout the high-speed filling bay!'
    },
    withoutPPEOutcome: {
      bn: 'স্থায়ী শ্রবণশক্তি হ্রাস! ইয়ার প্লাগ না পরায় কানের পর্দা মারাত্মক ক্ষতিগ্রস্ত হল। মাথায় একটানা ভোঁ-ভোঁ আওয়াজ এবং বধিরতা দেখা দিল!',
      hi: 'बहरापन! कान में सुरक्षा प्लग न लगाने से कानों में सीटी की आवाज (टिनिटस) शुरू हो गई और सुनने की शक्ति कम हो गई!',
      en: 'Permanent Acoustic Trauma! Repeated exposure without ear muffs destroyed delicate cochlea hair cells, causing irreversible hearing loss and tinnitus!'
    },
    withPPEOutcome: {
      bn: 'কান সুরক্ষিত! ইয়ার মাফ বা প্লাগ ক্ষতিকর উচ্চ শব্দ কমিয়ে মাত্র ৭০ ডেসিবেলে নামিয়ে আনল। কাজের নির্দেশও শুনতে পাওয়া গেল এবং কান সুস্থ রইল!',
      hi: 'कान सुरक्षित! ईयर मफ ने शोर को कम कर दिया। मशीन की आवाज कान को नुकसान नहीं पहुंचा सकी!',
      en: 'Hearing Saved! Certified ear muffs attenuated the noise level to a safe 70 dBA while still allowing speech communication!'
    }
  }
];

export const HAZARD_ITEMS: HazardItem[] = [
  {
    id: 'tank_ungrounded',
    zoneId: 'tank_farm',
    title: {
      bn: 'ট্যাঙ্কারে স্ট্যাটিক গ্রাউন্ডিং আর্থিং ক্ল্যাম্প লাগানো নেই',
      hi: 'टैंकर पर स्टैटिक अर्थिंग क्लैंप नहीं लगा है',
      en: 'Missing Static Grounding Clamp on Road Tanker'
    },
    description: {
      bn: 'তেল স্থানান্তরের সময় ঘর্ষণে তৈরি স্থির বিদ্যুৎ (স্ট্যাটিক স্পার্ক) থেকে ভয়াবহ অগ্নিকাণ্ড ঘটতে পারে!',
      hi: 'तेल खाली करते समय स्टैटिक चिंगारी से भीषण आग लग सकती है!',
      en: 'Flowing base oil creates static charge. Without the grounding clamp, a spark will ignite volatile vapors!'
    },
    correction: {
      bn: 'অবিলম্বে আর্থিং কেবল ক্ল্যাম্প ট্যাঙ্কারের খাঁটি ধাতব বডিতে আটকে সবুজ বাতি নিশ্চিত করুন।',
      hi: 'तुरंत अर्थिंग क्लैंप को टैंकर की बॉडी पर लगाएं और हरी बत्ती की पुष्टि करें।',
      en: 'Attach the copper grounding bonding clamp to bare vehicle chassis before connecting hoses.'
    },
    severity: 'critical',
    x: 35,
    y: 62
  },
  {
    id: 'tank_valve_leak',
    zoneId: 'tank_farm',
    title: {
      bn: 'ডাইক ওয়ালের ড্রেন ভালভ খোলা রাখা হয়েছে',
      hi: 'सुरक्षा बांध (डाइक) का ड्रेन वाल्व खुला छोड़ा गया',
      en: 'Containment Dike Drain Valve Left Open'
    },
    description: {
      bn: 'ট্যাঙ্ক ফেটে তেল বের হলে ডাইক বাঁধ আটকে রাখতে পারবে না, সরাসরি মাটির নর্দমায় বিষাক্ত তেল ভেসে যাবে!',
      hi: 'टैंक से तेल रिसाव होने पर बांध तेल को रोक नहीं पाएगा और तेल सीधे नाले में बह जाएगा!',
      en: 'If a tank fails, the open dike drain will dump thousands of liters of oil into soil and storm drains.'
    },
    correction: {
      bn: 'ড্রেন ভালভ সর্বদা বন্ধ এবং লক করে রাখুন। শুধুমাত্র জমে থাকা পরিষ্কার বৃষ্টির জল বের করার সময় উপস্থিত থেকে খুলুন।',
      hi: 'ड्रेन वाल्व हमेशा बंद और लॉक रखें। केवल बारिश का पानी निकालने के बाद तुरंत बंद करें।',
      en: 'Keep dike valve closed and padlocked in normal operating condition.'
    },
    severity: 'high',
    x: 75,
    y: 78
  },
  {
    id: 'kettle_steam_leak',
    zoneId: 'kettles',
    title: {
      bn: 'কেটলির স্টিম পাইপলাইনের ইনসুলেশন ছেঁড়া ও বাষ্প বের হচ্ছে',
      hi: 'केतली की भाप पाइपलाइन से गर्म भाप लीक हो रही है',
      en: 'Damaged Thermal Insulation & Live Steam Leak'
    },
    description: {
      bn: '১৮০ ডিগ্রি সেলসিয়াস উত্তপ্ত লাইভ স্টিম পাইপে হাত লাগলে চামড়া সাথে সাথে ঝলসে যাবে!',
      hi: '180 डिग्री की गर्म भाप छूने पर हाथ की चमड़ी तुरंत जल जाएगी!',
      en: 'Uninsulated high pressure steam line poses severe third-degree thermal contact burn hazard.'
    },
    correction: {
      bn: 'লাইন আইসোলেট করে মেরামত দলের মাধ্যমে সিরামিক থার্মাল জ্যাকেট দিয়ে মুড়িয়ে দিন।',
      hi: 'तुरंत मेंटेनेंस को बुलाएं और इंसुलेशन ठीक करवाएं।',
      en: 'Report for LOTO isolation and wrap with high-temperature thermal jacketing.'
    },
    severity: 'critical',
    x: 62,
    y: 42
  },
  {
    id: 'kettle_drip_missing',
    zoneId: 'kettles',
    title: {
      bn: 'কেমিক্যাল অ্যাডিটিভ ড্রাম ড্রিপ ট্রে ছাড়া রাখা',
      hi: 'केमिकल ड्रम के नीचे ड्रिप ट्रे नहीं रखी गई',
      en: 'Additive Chemical Drums Stored Without Drip Tray'
    },
    description: {
      bn: 'নজল থেকে ক্ষয়কারী রাসায়নিক চুইয়ে মেঝেতে পড়ছে, যে কেউ পা পিছলে পড়তে পারে!',
      hi: 'केमिकल टपक कर फर्श पर गिर रहा है जिससे पैर फिसलने का गंभीर खतरा है!',
      en: 'Corrosive additive drips onto the concrete walkway causing severe slip hazard and floor erosion.'
    },
    correction: {
      bn: 'ড্রামের নিচে চার-ব্যারেল বিশিষ্ট হলুদ স্পিল কনটেইনমেন্ট ট্রে রাখুন।',
      hi: 'ड्रम के नीचे चार बैरल वाली पीली ड्रिप ट्रे तुरंत लगाएं।',
      en: 'Place drums on certified secondary containment spill pallets.'
    },
    severity: 'medium',
    x: 28,
    y: 70
  },
  {
    id: 'barrel_oil_puddle',
    zoneId: 'barrel_filling',
    title: {
      bn: 'কনভেয়ারের সামনে মেঝেতে পিচ্ছিল লুব অয়েল জমে আছে',
      hi: 'कन्वेयर के सामने फर्श पर फिसलन भरा तेल फैला है',
      en: 'Fresh Lube Oil Puddle on Walkway Aisle'
    },
    description: {
      bn: 'ড্রাম টানার সময় পা হড়কালে ২০০ কেজির ড্রাম কর্মীর ওপর ভেঙে পড়বে!',
      hi: 'पैर फिसलने पर भारी 200 किलो का ड्रम ऑपरेटर के ऊपर गिर सकता है!',
      en: 'Friction coefficient drops to near zero. High probability of worker slipping under loaded drums.'
    },
    correction: {
      bn: 'অবিলম্বে হলুদ স্পিল কিট প্যাড ও কাঠের গুঁড়ো/শুকনো বালি দিয়ে তেল মুছে শুকিয়ে ফেলুন।',
      hi: 'तुरंत स्पिल किट और सूखी बालू डालकर तेल को साफ करें।',
      en: 'Deploy oil-absorbent pads and degreaser from the yellow spill response kit immediately.'
    },
    severity: 'high',
    x: 48,
    y: 65
  },
  {
    id: 'warehouse_leaning_stack',
    zoneId: 'warehouse',
    title: {
      bn: 'উঁচু র‍্যাকে কাত হয়ে থাকা বিপজ্জনক ড্রাম প্যালেট',
      hi: 'ऊंची रैक पर टेढ़ा रखा खतरनाक ड्रम पैलेट',
      en: 'Unstable / Tilting Pallet on 3rd Tier High-Bay Rack'
    },
    description: {
      bn: 'সামান্য কম্পন হলেই ওপর থেকে ১০০০ কেজির প্যালেট নিচে হেঁটে চলা মানুষের ওপর ভেঙে পড়বে!',
      hi: 'जरा सा झटका लगने पर 1000 किलो का पैलेट नीचे चल रहे कामगारों पर गिर जाएगा!',
      en: 'Improperly shrink-wrapped drums leaning at height. Catastrophic crushing danger to anyone beneath.'
    },
    correction: {
      bn: 'করিডোর লাল ফিতা দিয়ে বন্ধ করে ফর্কলিফট দিয়ে সাবধানে প্যালেট নিচে নামিয়ে পুনরায় সাজান।',
      hi: 'एरिया बंद करें और फोर्कलिफ्ट से पैलेट को सुरक्षित नीचे उतारें।',
      en: 'Cordon off aisle with caution tape and lower the pallet using reach truck for restacking.'
    },
    severity: 'critical',
    x: 55,
    y: 35
  },
  {
    id: 'substation_water_leak',
    zoneId: 'supply_block',
    title: {
      bn: 'ইলেকট্রিক্যাল প্যানেলের ঠিক পাশে জলের পাইপ লিক',
      hi: 'बिजली के पैनल के पास पानी की पाइपलाइन से लीकेज',
      en: 'Water Pipe Leaking Near 415V Switchboard'
    },
    description: {
      bn: 'জল ইলেকট্রিক প্যানেলে পৌঁছালে বিস্ফোরণ, শর্ট সার্কিট ও বিশাল আর্ট ফ্ল্যাশ আগুন লাগবে!',
      hi: 'पानी बिजली के पैनल में जाने से बड़ा धमाका, आग और करंट फैलने का खतरा है!',
      en: 'Water contact with energized busbars causes instantaneous electrical arc flash explosion!'
    },
    correction: {
      bn: 'জরুরী ভালভ বন্ধ করে ইলেকট্রিক্যাল টিমকে ডেকে প্যানেল সুরক্ষিত করুন।',
      hi: 'पानी की लाइन का मुख्य वाल्व तुरंत बंद करें और बिजली टीम को बुलाएं।',
      en: 'Shut off upstream water supply valve and isolate electrical feeds.'
    },
    severity: 'critical',
    x: 70,
    y: 50
  },
  {
    id: 'admin_eyewash_blocked',
    zoneId: 'canteen_admin',
    title: {
      bn: 'জরুরী আইওয়াশ শাওয়ারের সামনে খালি কার্টন ফেলে পথ বন্ধ',
      hi: 'आपातकालीन आईवॉश नल के सामने खाली गत्ते रखकर रास्ता बंद',
      en: 'Emergency Eyewash & Safety Shower Blocked by Boxes'
    },
    description: {
      bn: 'চোখে অ্যাসিড বা গরম তেল ঢুকলে কর্মী ১০ সেকেন্ডের মধ্যে জল খুঁজে পাবে না!',
      hi: 'आंख में केमिकल जाने पर कर्मचारी 10 सेकंड में नल तक नहीं पहुंच पाएगा!',
      en: 'OSHA/EHS violation: In a chemical splash event, blocked access delays critical eye flushing.'
    },
    correction: {
      bn: 'আইওয়াশ স্টেশনের চারপাশের ৩ ফুট এলাকা সর্বদা ফাঁকা এবং পরিষ্কার রাখুন।',
      hi: 'आईवॉश के आसपास का 3 फीट का दायरा हमेशा खाली और साफ रखें।',
      en: 'Immediately clear all clutter. Maintain a 3-foot clearance zone with yellow floor markings.'
    },
    severity: 'high',
    x: 40,
    y: 60
  }
];

export const SUPERVISOR_CHECKLIST: SupervisorCheckItem[] = [
  {
    id: 'check_tank_earthing',
    zone: 'tank_farm',
    title: {
      bn: 'ট্যাঙ্ক ফার্ম আর্থিং গ্রাউন্ডিং রেজিস্ট্যান্স পরীক্ষা (< ৪ ওহম)',
      hi: 'टैंक फार्म अर्थिंग व बॉन्डिंग जांच (< 4 ओम)',
      en: 'Tank Farm Static Grounding Resistance (< 4 Ohms)'
    },
    standard: {
      bn: 'প্রতিটি স্টোরেজ ট্যাঙ্ক ও পাম্প স্কিডে দ্বৈত কপার আর্থিং স্ট্রিপ সংযুক্ত থাকতে হবে।',
      hi: 'प्रत्येक स्टोरेज टैंक पर दोहरी कॉपर अर्थिंग पट्टी मजबूती से जुड़ी होनी चाहिए।',
      en: 'Dual independent copper earthing bonds attached to earthing grid pits.'
    }
  },
  {
    id: 'check_kettle_loto',
    zone: 'kettles',
    title: {
      bn: 'কেটলি রক্ষণাবেক্ষণ লকআউট/ট্যাগআউট (LOTO) পারমিট',
      hi: 'केतली रखरखाव लॉकआउट/टैगआउट (LOTO) वर्क परमिट',
      en: 'Agitator Kettle Lockout/Tagout (LOTO) Compliance'
    },
    standard: {
      bn: 'মিক্সার কেটলির ভেতরে নামার আগে মোটর ব্রেকার অফ করে নিজস্ব তালা ও লাল ট্যাগ লাগাতে হবে।',
      hi: 'केतली में काम करने से पहले मोटर का मुख्य स्विच बंद कर ताला और लाल टैग लगाना जरूरी है।',
      en: 'Motor circuit breakers padlocked with personal danger tag and zero voltage verification.'
    }
  },
  {
    id: 'check_barrel_line_ppe',
    zone: 'barrel_filling',
    title: {
      bn: '২০০ লিটার ড্রাম ফিলিং লাইনে শতভাগ পিপিই পরিধান',
      hi: 'बैरल फिलिंग लाइन पर सभी कामगारों का पीपीई जांच',
      en: '100% PPE Enforcement on 200L Drum Packaging Line'
    },
    standard: {
      bn: 'সকল কর্মীকে স্টিল-টো বুট, কেমিক্যাল গ্লাভস, গগলস ও হেলমেটের ফিতা বাঁধা অবস্থায় থাকতে হবে।',
      hi: 'सभी कामगार स्टील-टो बूट, केमिकल दस्ताने, चश्मा और हेलमेट का फीता बांधकर काम करें।',
      en: 'All operators wearing chin-strapped hard hats, steel-toe boots & nitrile gloves.'
    }
  },
  {
    id: 'check_forklift_speed',
    zone: 'warehouse',
    title: {
      bn: 'গুদামে ফর্কলিফটের গতিসীমা (< ৮ কিমি/ঘণ্টা) ও বিপরীত হর্ন',
      hi: 'वेयरहाउस में फोर्कलिफ्ट की गति सीमा (< 8 किमी/घंटा) व रिवर्स हॉर्न',
      en: 'Warehouse Forklift Speed Limit (< 8 km/h) & Reverse Alarm'
    },
    standard: {
      bn: 'ফর্কলিফটের ফ্ল্যাশিং অ্যাম্বার লাইট জ্বলতে হবে এবং পথচারী আইল অতিক্রমের সময় হর্ন বাজাতে হবে।',
      hi: 'फोर्कलिफ्ट की पीली बत्ती चालू हो और मोड़ पर हॉर्न बजाना अनिवार्य है।',
      en: 'Flashing strobe operational, speed governor calibrated, reverse beeper active.'
    }
  },
  {
    id: 'check_eyewash_function',
    zone: 'canteen_admin',
    title: {
      bn: 'জরুরী আইওয়াশ ও বডি শাওয়ারের সাপ্তাহিক টেস্ট ফ্ল্যাশ',
      hi: 'इमरजेंसी आईवॉश और शावर का साप्ताहिक जल परीक्षण',
      en: 'Weekly Functional Flush of Safety Showers & Eyewashes'
    },
    standard: {
      bn: 'হাতে পুশ প্লেট চাপলে ১ সেকেন্ডে পরিষ্কার ঠাণ্ডা জলের জোড়া ধারা বের হতে হবে।',
      hi: 'पुश प्लेट दबाते ही 1 सेकंड में साफ पानी का तेज फव्वारा निकलना चाहिए।',
      en: 'Water must spray at 20-25°C within 1 second of pushing the panic activation paddle.'
    }
  }
];

export const UI_STRINGS = {
  appName: {
    bn: 'লুবসেফ ৩৬০ - প্ল্যান্ট সেফটি গেম',
    hi: 'ल्यूबसेफ 360 - प्लांट सेफ्टी गेम',
    en: 'LubeSafe 360 - Plant Safety Gamification'
  },
  subtitle: {
    bn: '৩০ একর লুব্রিকেন্ট প্ল্যান্টের সুরক্ষা ও পিপিই প্রশিক্ষণ',
    hi: '30 एकड़ ल्यूब प्लांट सुरक्षा एवं पीपीई प्रशिक्षण',
    en: '30-Acre Lube Blending Plant Safety & PPE Training'
  },
  voiceNarrator: {
    bn: 'ভয়েস ওভার (বাংলা)',
    hi: 'आवाज सहायता (हिन्दी)',
    en: 'Voice Guide (English)'
  },
  speakingNow: {
    bn: 'কথা বলছেন...',
    hi: 'बोल रहे हैं...',
    en: 'Speaking...'
  },
  tapToListen: {
    bn: 'কথা শুনতে এখানে চাপুন',
    hi: 'आवाज सुनने के लिए यहां दबाएं',
    en: 'Tap to listen to instructions'
  },
  nav: {
    roles: {
      bn: 'আমার ডিউটি বেছে নিন',
      hi: 'मेरी ड्यूटी चुनें',
      en: 'Choose Duty'
    },
    ppe: {
      bn: 'পিপিই লকার রুম',
      hi: 'पीपीई लॉकर रूम',
      en: 'Gear Up (PPE)'
    },
    consequence: {
      bn: 'পিপিই না পরলে কি হবে?',
      hi: 'पीपीई न पहनने पर क्या होगा?',
      en: 'PPE Impact Sandbox'
    },
    map: {
      bn: '৩০ একর প্ল্যান্ট ম্যাপ',
      hi: '30 एकड़ प्लांट नक्शा',
      en: '30-Acre Map'
    },
    hazards: {
      bn: 'বিপদ খুঁজে বের করুন',
      hi: 'खतरा पहचानो (गेम)',
      en: 'Spot Hazards'
    },
    supervisor: {
      bn: 'সুপারভাইজার অডিট',
      hi: 'सुपरवाइजर ऑडिट',
      en: 'Supervisor Audit'
    }
  },
  badges: {
    safetyChampion: {
      bn: 'সুরক্ষা চ্যাম্পিয়ন',
      hi: 'सुरक्षा चैंपियन',
      en: 'Safety Champion'
    },
    zeroAccident: {
      bn: 'শূন্য দুর্ঘটনা লক্ষ্য',
      hi: 'शून्य दुर्घटना लक्ष्य',
      en: 'Zero Incident Goal'
    }
  }
};

export const ROLE_CHALLENGE_TASKS: Record<string, RoleChallengeTask> = {
  barrel_filling: {
    id: 'task_barrel_01',
    roleId: 'barrel_filling',
    taskTitle: {
      bn: '২০০ লিটার হাইড্রোলিক অয়েল ড্রাম ফিলিং ও প্যালেটাইজিং',
      hi: '200 लीटर हाइड्रोलिक तेल ड्रम भराई और पैलेट पर रखना',
      en: '200L Hydraulic Oil Drum Filling & Pallet Loading'
    },
    taskScenario: {
      bn: 'আজকের নির্ধারিত কাজ: ৬০ ডিগ্রি সেলসিয়াস তাপমাত্রার হাইড্রোলিক তেল প্রেসারাইজড নজল দিয়ে ২০০ লিটার ভারী ইস্পাতের ড্রামে ভরতে হবে এবং ম্যানুয়ালি গড়িয়ে প্যালেটে সাজাতে হবে। ড্রাম স্লিপ করা এবং তেল ছিটকে আসার তীব্র ঝুঁকি রয়েছে!',
      hi: 'आज का कार्य: 60 डिग्री गर्म हाइड्रोलिक तेल को 200 लीटर भारी लोहे के ड्रम में प्रेशर नोजल से भरना है और रोल करके पैलेट पर रखना है। पैर पर भारी ड्रम गिरने व गर्म तेल छलकने का खतरा है!',
      en: 'Today\'s Task: Decanting 60°C heated hydraulic oil into 200L heavy steel drums on the roller conveyor, weighing and manually tilting onto transport pallets. Major risk of foot crush and hot oil splash!'
    },
    targetZone: 'barrel_filling',
    mandatoryPPE: ['helmet', 'goggles', 'gloves_nitrile', 'boots', 'vest'],
    hazardRisk: {
      bn: 'স্টিল-টো বুট ছাড়া ২০০ কেজির ভারী ড্রাম পায়ের ওপর পড়লে আঙুলের হাড় ভেঙে যাবে এবং গগলস ছাড়া গরম তেল চোখে ঢুকবে!',
      hi: 'स्टील-टो बूट के बिना 200 किलो का ड्रम पैर कुचल देगा और बिना चश्मे के गर्म तेल आंखों में चला जाएगा!',
      en: 'Without steel-toe boots, the 200kg drum rim will crush toe bones, and eye exposure risks chemical corneal burns!'
    },
    consequenceScenarioId: 'drum_toe_crush'
  },
  material_handling: {
    id: 'task_forklift_01',
    roleId: 'material_handling',
    taskTitle: {
      bn: 'ওয়্যারহাউসের ৩-টায়ার ড্রাম প্যালেট মুভমেন্ট ও ট্রাক লোডিং',
      hi: 'वेयरहाउस 3-टियर ड्रम पैलेट मूवमेंट और ट्रक लोडिंग',
      en: 'Warehouse 3-Tier Pallet Stacking & Shipping Dock Dispatch'
    },
    taskScenario: {
      bn: 'আজকের নির্ধারিত কাজ: ৩ টন ফর্কলিফট দিয়ে সংকীর্ণ ওয়্যারহাউস আইলে ১০০০ কেজির ভারী লুব ড্রাম প্যালেট উঁচু র্যাকে সাজাতে হবে এবং শিপিং ট্রাক লোড করতে হবে। ওপর থেকে লোড খসা ও অন্ধ মোড়ে সংঘর্ষের ঝুঁকি রয়েছে!',
      hi: 'आज का कार्य: 3-टन फोर्कलिफ्ट चलाकर वेयरहाउस के संकरे गलियारों में 1000 किलो का पैलेट ऊंची रैक पर चढ़ाना और ट्रक लोड करना। ऊपर से सामान गिरने और अंधे मोड़ पर टक्कर का खतरा है!',
      en: 'Today\'s Task: Operating 3-ton counterbalanced forklift in narrow high-bay aisles to elevate 1000kg drum pallets and load long-haul trailers. Critical danger of fallen loads and blind-corner pedestrian collision!'
    },
    targetZone: 'warehouse',
    mandatoryPPE: ['helmet', 'gloves_heavy', 'boots', 'vest'],
    hazardRisk: {
      bn: 'হাই-ভিজ ভেস্ট ছাড়া ফর্কলিফট চালক আপনাকে দেখতে পাবে না এবং হেলমেট ছাড়া উঁচু র্যাক থেকে খসে পড়া ভারী মালামালে মাথায় চোট হবে!',
      hi: 'बिना हाई-विज वेस्ट के ड्राइवर आपको देख नहीं पाएगा और बिना हेलमेट के रैक से गिरी वस्तु सिर फाड़ देगी!',
      en: 'Without high-vis vest, drivers have blind-spot collisions, and unhelmeted heads risk lethal blunt force trauma!'
    },
    consequenceScenarioId: 'forklift_collision'
  },
  blending_kettle: {
    id: 'task_kettle_01',
    roleId: 'blending_kettle',
    taskTitle: {
      bn: '৭৫° সে. উত্তপ্ত কেটলিতে পলিমার অ্যাডিটিভ ডজিং',
      hi: '75°C गर्म केतली में पॉलीमर एडिटिव मिश्रण कार्य',
      en: 'Polymer Additive Dosing into 75°C Blending Kettle'
    },
    taskScenario: {
      bn: 'আজকের নির্ধারিত কাজ: কেটলির উঁচু প্ল্যাটফর্মে উঠে ম্যানহোল খুলে সান্দ্রতা বৃদ্ধিকারী ক্ষয়কারী রাসায়নিক অ্যাডিটিভ উত্তপ্ত ঘূর্ণায়মান কেটলিতে ঢালতে হবে। বাষ্প বের হওয়া ও গরম তেল মুখে ছিটকে আসার মারাত্মক ঝুঁকি!',
      hi: 'आज का कार्य: ऊंची केतली पर चढ़कर मैनहोल खोलना और 75 डिग्री गर्म तेल में गाढ़ा केमिकल एडिटिव डालना। जहरीली भाप और गर्म केमिकल के छींटे मुंह पर पड़ने का भारी खतरा है!',
      en: 'Today\'s Task: Ascending kettle upper mezzanine, unbolting manhole cover to dose viscous polymer additive into 75°C agitated oil batch. Severe danger of toxic vapor inhalation and thermal chemical eye splash!'
    },
    targetZone: 'kettles',
    mandatoryPPE: ['helmet', 'goggles', 'gloves_nitrile', 'boots', 'respirator', 'vest'],
    hazardRisk: {
      bn: 'গগলস ও রেসপিরেটর মাস্ক ছাড়া বিষাক্ত গরম রাসায়নিক বাষ্প ও এসিডিক তেল সরাসরি চোখ ও ফুসফুসে ক্ষতিসাধন করবে!',
      hi: 'बिना चश्मा व मास्क के गर्म जहरीली भाप और केमिकल आंखों व फेफड़ों को भारी नुकसान पहुंचाएंगे!',
      en: 'Without splash visor and vapor respirator, caustic fumes cause respiratory tract burns and immediate vision loss!'
    },
    consequenceScenarioId: 'chemical_splash'
  },
  smallpack_filling: {
    id: 'task_smallpack_01',
    roleId: 'smallpack_filling',
    taskTitle: {
      bn: 'হাই-স্পিড ১লি/৫লি বোতল ফিলিং ও রোটারি ক্যাপিং লাইন',
      hi: 'हाई-स्पीड 1L/5L बॉटल फिलिंग और रोटरी कैपिंग लाइन',
      en: 'High-Speed 1L/5L Rotary Filling & Capping Line'
    },
    taskScenario: {
      bn: 'আজকের নির্ধারিত কাজ: প্রতি মিনিটে ৮০টি ক্যান ফিলিং ও টর্ক ক্যাপিং মেশিনের পাশে একটানা পাহারা দেওয়া এবং কনভেয়ার জ্যাম হলে সচল করা। একটানা ৯২ ডেসিবেলের উচ্চ শব্দ ও মেশিনে হাত আটকার ঝুঁকি!',
      hi: 'आज का कार्य: प्रति मिनट 80 डिब्बे भरने वाली तेज आवाज मशीन के पास 8 घंटे काम करना और कन्वेयर की देखरेख। मशीन का 92 डेसिबल का कान फाड़ू शोर और उंगली फंसने का खतरा!',
      en: 'Today\'s Task: Manning high-speed 80 cans/min rotary filling carousel and torque capper. Constant 92 dBA pneumatic exhaust noise and pinch hazard during conveyor bottle clearing!'
    },
    targetZone: 'smallpack_filling',
    mandatoryPPE: ['helmet', 'gloves_nitrile', 'boots', 'vest', 'ear_protection'],
    hazardRisk: {
      bn: 'ইয়ার মাফ না পরলে উচ্চ শব্দে কানের ভেতরের সূক্ষ্ম স্নায়ু ধ্বংস হয়ে স্থায়ী বধিরতা ও টিনিতাস হতে পারে!',
      hi: 'ईयर मफ न लगाने पर तेज आवाज से कानों का पर्दा खराब होकर बहरापन हो सकता है!',
      en: 'Without ear protection, acoustic trauma induces permanent sensorineural hearing loss and chronic tinnitus!'
    },
    consequenceScenarioId: 'ear_damage'
  },
  general_plant: {
    id: 'task_general_01',
    roleId: 'general_plant',
    taskTitle: {
      bn: '৪১৫ ভোল্ট সাবস্টেশনের পাশে পাম্প মোটর মেরামত ও ড্রেন পরিষ্কার',
      hi: '415V सबस्टेशन के पास पंप मोटर मरम्मत और लीकेज चेक',
      en: '415V Pump Motor Flange Overhaul Near Wet Floor'
    },
    taskScenario: {
      bn: 'আজকের নির্ধারিত কাজ: সাপ্লাই ব্লকের ভেজা মেঝের ওপর দাঁড়িয়ে ফেজ লিক থাকা হাই ভোল্টেজ পাম্পের ত্রুটি পরীক্ষা করা ও ভালভ সিল পরিবর্তন করা। মারাত্মক বিদ্যুৎস্পৃষ্ট (ইলেকট্রিক শক) হওয়ার উচ্চ ঝুঁকি!',
      hi: 'आज का कार्य: गीले फर्श पर खड़े होकर 415 वोल्ट पंप मोटर की मरम्मत और पाइप का लीकेज ठीक करना। जानलेवा बिजली का झटका (करंट) लगने का बहुत बड़ा खतरा!',
      en: 'Today\'s Task: Inspecting damp transfer pump switchgear and replacing worn mechanical seals. Water presence adjacent to 415V 3-phase circuits presents catastrophic electrocution and arc-flash risk!'
    },
    targetZone: 'supply_block',
    mandatoryPPE: ['helmet', 'goggles', 'gloves_heavy', 'boots', 'vest', 'ear_protection'],
    hazardRisk: {
      bn: 'সার্টিফাইড অ্যান্টিস্ট্যাটিক বুট ছাড়া ৪১৫ ভোল্টের কারেন্ট সরাসরি শরীর দিয়ে মাটিতে প্রবাহিত হয়ে হৃদযন্ত্র বন্ধ করে দিতে পারে!',
      hi: 'इंसुलेटेड सेफ्टी बूट के बिना 415 वोल्ट का करंट शरीर में दौड़कर दिल का दौरा ला सकता है!',
      en: 'Conductive or damp footwear allows lethal 415V phase current to flow through the heart to earth ground!'
    },
    consequenceScenarioId: 'electric_shock'
  },
  supervisor: {
    id: 'task_supervisor_01',
    roleId: 'supervisor',
    taskTitle: {
      bn: '৩০ একর প্ল্যান্টের সম্পূর্ণ শিফট অডিট ও ওয়ার্ক অর্ডার জারি',
      hi: '30 एकड़ प्लांट का संपूर्ण शिफ्ट ऑडिट और वर्क ऑर्डर जारी करना',
      en: 'Facility 30-Acre Full Shift EHS Audit & Work Order Issuance'
    },
    taskScenario: {
      bn: 'আজকের নির্ধারিত কাজ: ট্যাঙ্ক ফার্মের স্ট্যাটিক আর্থিং, কেটলি LOTO লক, ওয়্যারহাউস ফর্কলিফট লেন এবং ১০০ জন শ্রমিকের পিপিই পরিধান পর্যবেক্ষণ করা এবং বিপদ পেলে ওয়ার্ক অর্ডার ইস্যু করা!',
      hi: 'आज का कार्य: 30 एकड़ परिसर में अर्थिंग, केतली लॉकआउट, फोर्कलिफ्ट स्पीड और 100 मजदूरों के पीपीई की जांच करना और कमियां मिलने पर वर्क ऑर्डर जारी करना!',
      en: 'Today\'s Task: Inspecting all 8 plant zones, evaluating static grounding bonding on tankers, verifying lockout/tagout permits, and creating corrective work orders for line crews.'
    },
    targetZone: 'canteen_admin',
    mandatoryPPE: ['helmet', 'goggles', 'boots', 'vest'],
    hazardRisk: {
      bn: 'সুপারভাইজার হিসেবে নিজেকে ১০০% সুরক্ষিত রেখে অন্যদের সুরক্ষা নিশ্চিত করতে হবে। হেলমেট ও বুট প্রতিটি জোনে বাধ্যতামূলক!',
      hi: 'सुपरवाइजर के रूप में स्वयं 100% सुरक्षित होकर दूसरों की सुरक्षा सुनिश्चित करना आपकी जिम्मेदारी है!',
      en: 'Field leadership requires personal adherence to all zone PPE standards during walkthrough audits.'
    },
    consequenceScenarioId: 'bolt_fall'
  }
};

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-201',
    hazardId: 'tank_ungrounded',
    title: {
      bn: 'ট্যাঙ্কার গ্যান্ট্রি স্ট্যাটিক আর্থিং কেবল ও কপার ক্ল্যাম্প প্রতিস্থাপন',
      hi: 'टैंकर गैंट्री स्टैटिक अर्थिंग क्लैंप रिप्लेसमेंट',
      en: 'Tanker Loading Gantry Static Earthing Clamp Replacement'
    },
    description: {
      bn: 'বেস অয়েল ট্যাঙ্কার ডিক্যান্টিং পয়েন্টে আর্থিং ক্ল্যাম্পের তার ঢিলা রয়েছে। অবিলম্বে নতুন কপার ক্ল্যাম্প সংযুক্ত করতে হবে।',
      hi: 'बेस ऑयल टैंकर खाली करने के स्थान पर अर्थिंग क्लैंप का तार ढीला है। तुरंत नया कॉपर क्लैंप लगाएं।',
      en: 'Static ground bonding cable has frayed copper braid at bay 2. Replace with certified intrinsically safe ground clamp.'
    },
    zoneId: 'tank_farm',
    assignedRoleId: 'general_plant',
    priority: 'critical',
    status: 'open',
    createdAt: 'Today, 07:30 AM',
    reportedBy: 'Safety Supervisor (Amitav Roy)',
    requiredPPE: ['helmet', 'goggles', 'gloves_heavy', 'boots', 'vest'],
    rewardPoints: 100
  },
  {
    id: 'WO-202',
    hazardId: 'barrel_oil_puddle',
    title: {
      bn: 'ব্যারেল ফিলিং কনভেয়ার ওয়াকওয়েতে স্পিল কিট প্রয়োগ ও তেল পরিষ্কার',
      hi: 'बैरल फिलिंग कन्वेयर के पास फैला तेल साफ करना व स्पिल किट डालना',
      en: 'Deploy Oil Absorbent Spill Kit at 200L Drum Roller Conveyor'
    },
    description: {
      bn: 'রোলার ট্র্যাকের পাশে প্রায় ৫ লিটার ইঞ্জিন অয়েল জমা হয়ে পিচ্ছিল ড্রপ জোন তৈরি করেছে। শুকনো কাঠের গুঁড়ো ও প্যাড দিয়ে পরিষ্কার করুন।',
      hi: 'कन्वेयर के पास 5 लीटर तेल फैलने से भारी फिसलन है। तुरंत सूखी बालू व स्पिल पैड डालकर साफ करें।',
      en: '5 liters of ISO VG 68 lube oil pooled at barrel tilting station. Deploy yellow absorbent booms and degreasing agent.'
    },
    zoneId: 'barrel_filling',
    assignedRoleId: 'barrel_filling',
    priority: 'high',
    status: 'open',
    createdAt: 'Today, 08:15 AM',
    reportedBy: 'Packaging Supervisor (Rajesh Sharma)',
    requiredPPE: ['helmet', 'goggles', 'gloves_nitrile', 'boots', 'vest'],
    rewardPoints: 80
  },
  {
    id: 'WO-203',
    hazardId: 'warehouse_leaning_stack',
    title: {
      bn: 'ওয়্যারহাউস ৩ নম্বর র্যাকের বিপজ্জনক কাত হয়ে থাকা ড্রাম প্যালেট রি-স্ট্যাক',
      hi: 'वेयरहाउस रैक नंबर 3 पर टेढ़े ड्रम पैलेट को नीचे उतारकर ठीक करना',
      en: 'Restack Tilting 200kg Drum Pallet on Warehouse Bay 3'
    },
    description: {
      bn: '৩য় তলায় ১০০০ কেজির প্যালেট ১০ ডিগ্রি কাত হয়ে আছে। করিডোর লাল ফিতা দিয়ে বন্ধ করে রিচ ট্রাক দিয়ে সাবধানে নামিয়ে আনুন।',
      hi: 'रैक की 3री मंजिल पर 1000 किलो का पैलेट टेढ़ा हो गया है। एरिया खाली करवाएं और फोर्कलिफ्ट से सुरक्षित उतारें।',
      en: 'Upper tier pallet leaning due to broken bottom runner. Cordon off aisle 4 and lower with reach truck for strap reinforcement.'
    },
    zoneId: 'warehouse',
    assignedRoleId: 'material_handling',
    priority: 'critical',
    status: 'open',
    createdAt: 'Today, 09:00 AM',
    reportedBy: 'Logistics Lead (Suresh Mondal)',
    requiredPPE: ['helmet', 'gloves_heavy', 'boots', 'vest'],
    rewardPoints: 120
  },
  {
    id: 'WO-204',
    hazardId: 'kettle_steam_leak',
    title: {
      bn: 'কেটলি ২-এর উচ্চ তাপীয় স্টিম ভালভের সিরামিক ইনসুলেশন জ্যাকেট মেরামত',
      hi: 'केतली 2 के भाप वाल्व पर थर्मल इंसुलेशन कवर लगाना',
      en: 'Re-insulate 180°C High-Pressure Steam Valve on Kettle #2'
    },
    description: {
      bn: 'উত্তপ্ত স্টিম পাইপের ইনসুলেশন ছিঁড়ে যাওয়ায় কর্মীদের হাত লাগলে থার্ড ডিগ্রি বার্ন হতে পারে। সিরামিক ফাইবার জ্যাকেট লাগান।',
      hi: 'गर्म भाप की पाइप का कवर फट गया है, जिससे कामगारों के हाथ जल सकते हैं। नया इंसुलेशन कवर लगाएं।',
      en: 'Exposed 180°C valve bonnet creating acute contact burn hazard. Install removable silicone fiberglass heat jacket.'
    },
    zoneId: 'kettles',
    assignedRoleId: 'general_plant',
    priority: 'high',
    status: 'open',
    createdAt: 'Today, 09:45 AM',
    reportedBy: 'Process Supervisor (Prabir Das)',
    requiredPPE: ['helmet', 'goggles', 'gloves_heavy', 'boots', 'vest'],
    rewardPoints: 90
  }
];

