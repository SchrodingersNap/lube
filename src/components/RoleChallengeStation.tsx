import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Play, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  HardHat, 
  Eye, 
  Hand, 
  Footprints, 
  Shirt, 
  Headphones, 
  Wind,
  Shield,
  Zap,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import { ROLE_CHALLENGE_TASKS, PPE_ITEMS, WORKER_ROLES } from '../translations';
import { WorkerRoleId, PPEItemId, Language, RoleChallengeTask } from '../types';
import { AudioNarrationButton } from './AudioNarrationButton';
import { soundEngine } from '../services/soundEngine';
import { speechNarrator } from '../services/speechNarrator';

interface RoleChallengeStationProps {
  selectedRole: WorkerRoleId;
  onSelectRole: (role: WorkerRoleId) => void;
  onCompleteChallenge: (roleId: WorkerRoleId, scoreBonus: number) => void;
  onGoToWorkOrders: () => void;
  language: Language;
}

export const RoleChallengeStation: React.FC<RoleChallengeStationProps> = ({
  selectedRole,
  onSelectRole,
  onCompleteChallenge,
  onGoToWorkOrders,
  language
}) => {
  const currentTask: RoleChallengeTask =
    ROLE_CHALLENGE_TASKS[selectedRole] || ROLE_CHALLENGE_TASKS.barrel_filling;

  const currentRoleObj =
    WORKER_ROLES.find((r) => r.id === selectedRole) || WORKER_ROLES[0];

  const [selectedGear, setSelectedGear] = useState<Set<PPEItemId>>(new Set());
  const [submissionState, setSubmissionState] = useState<'idle' | 'success' | 'failed'>('idle');
  const [missingGearList, setMissingGearList] = useState<PPEItemId[]>([]);
  const [isSimulatingConsequence, setIsSimulatingConsequence] = useState<boolean>(false);

  const handleToggleItem = (id: PPEItemId) => {
    soundEngine.playClick();
    setSelectedGear((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    // Reset submission state on new edit
    if (submissionState !== 'idle') {
      setSubmissionState('idle');
      setIsSimulatingConsequence(false);
    }
  };

  const handleVerifyChallenge = () => {
    const required = currentTask.mandatoryPPE;
    const missing = required.filter((ppeId) => !selectedGear.has(ppeId));

    if (missing.length === 0) {
      // 100% Correct PPE selected!
      soundEngine.playSuccess();
      setSubmissionState('success');
      setMissingGearList([]);
      setIsSimulatingConsequence(false);
      onCompleteChallenge(selectedRole, 60);

      const successVoice =
        language === 'bn'
          ? `চমৎকার! আপনি সমস্ত প্রয়োজনীয় পিপিই সঠিকভাবে পরিধান করেছেন। আপনি এই কাজের জন্য ১০০% প্রস্তুত ও সুরক্ষিত। +৬০ পয়েন্ট অর্জিত!`
          : language === 'hi'
          ? `बहुत बढ़िया! आपने सभी आवश्यक पीपीई बिल्कुल सही पहने हैं। आप इस कार्य के लिए 100% सुरक्षित हैं। +60 अंक मिले!`
          : `Excellent! All mandatory protective equipment properly verified. You are 100% safe for today's assignment!`;

      speechNarrator.speak(successVoice, language);
    } else {
      // Missing mandatory PPE! Trigger realistic consequence demonstration
      setSubmissionState('failed');
      setMissingGearList(missing);
      setIsSimulatingConsequence(true);

      const firstMissing = PPE_ITEMS.find((p) => p.id === missing[0]);
      const missingName = firstMissing ? firstMissing.name[language] : '';

      // Trigger realistic sound based on missing gear
      if (missing.includes('boots')) {
        soundEngine.playDrumCrush();
        setTimeout(() => soundEngine.playElectricShock(), 250);
      } else if (missing.includes('helmet')) {
        soundEngine.playBoltClatter();
      } else if (missing.includes('goggles')) {
        soundEngine.playChemicalSplash();
      } else if (missing.includes('vest')) {
        soundEngine.playForkliftHorn();
      } else if (missing.includes('ear_protection')) {
        soundEngine.playEarRinging();
      } else {
        soundEngine.playWarning();
      }

      const warningVoice =
        language === 'bn'
          ? `সতর্কতা! আপনি ভুল বা অসম্পূর্ণ পিপিই পরেছেন। আপনার ${missingName} পরিধান করা হয়নি! ${currentTask.hazardRisk.bn} অনুগ্রহ করে সঠিক পিপিই পরিধান করে পুনরায় চেষ্টা করুন!`
          : language === 'hi'
          ? `सावधान! आपका पीपीई अधूरा है। आपने ${missingName} नहीं पहना! ${currentTask.hazardRisk.hi} कृपया सही उपकरण पहनें और दोबारा प्रयास करें!`
          : `Warning! Incomplete PPE selection. Missing ${missingName}! ${currentTask.hazardRisk.en} Please select all required equipment and try again.`;

      speechNarrator.speak(warningVoice, language);
    }
  };

  const handleReset = () => {
    soundEngine.playClick();
    setSelectedGear(new Set());
    setSubmissionState('idle');
    setIsSimulatingConsequence(false);
    setMissingGearList([]);
  };

  const getPPEIcon = (iconName: string) => {
    switch (iconName) {
      case 'HardHat':
        return <HardHat className="w-5 h-5" />;
      case 'Glasses':
        return <Eye className="w-5 h-5" />;
      case 'Hand':
        return <Hand className="w-5 h-5" />;
      case 'Shield':
        return <Shield className="w-5 h-5" />;
      case 'Footprints':
        return <Footprints className="w-5 h-5" />;
      case 'Shirt':
        return <Shirt className="w-5 h-5" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5" />;
      case 'Wind':
        return <Wind className="w-5 h-5" />;
      default:
        return <ShieldCheck className="w-5 h-5" />;
    }
  };

  const challengeIntroVoice =
    language === 'bn'
      ? `ভূমিকা ভিত্তিক দৈনিক চ্যালেঞ্জ। আপনার আজকের দায়িত্ব: ${currentRoleObj.title.bn}। কাজ: ${currentTask.taskTitle.bn}। ${currentTask.taskScenario.bn}। এই ঝুঁকিপূর্ণ কাজের জন্য সঠিক পিপিই বাছাই করুন।`
      : language === 'hi'
      ? `रोल-आधारित दैनिक चुनौती। आज की ड्यूटी: ${currentRoleObj.title.hi}। कार्य: ${currentTask.taskTitle.hi}। ${currentTask.taskScenario.hi}। इस काम के लिए सही पीपीई चुनें।`
      : `Role-Specific Daily Challenge for ${currentRoleObj.title.en}. Task: ${currentTask.taskTitle.en}. Equip all mandatory PPE to proceed safely.`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-semibold text-xs tracking-wider uppercase">
              {language === 'bn' ? 'দৈনিক ভূমিকা চ্যালেঞ্জ' : language === 'hi' ? 'दैनिक रोल चुनौती' : 'Daily Role Challenge'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 text-xs font-medium">
              {currentRoleObj.title[language]}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {language === 'bn'
              ? 'শিফট কাজের জন্য সঠিক পিপিই নির্বাচন পরীক্ষা'
              : language === 'hi'
              ? 'कार्य के लिए सही पीपीई चयन चुनौती'
              : 'Role PPE Verification Challenge'}
          </h1>
          <p className="text-slate-300 text-sm">
            {language === 'bn'
              ? 'কাজের পরিস্থিতি পড়ে শরীরের জন্য সঠিক সরঞ্জাম বেছে নিন। ভুল হলে সরাসরি পরিণাম ও শক দৃশ্যমান হবে!'
              : language === 'hi'
              ? 'कार्य की परिस्थिति देखकर सही सुरक्षा उपकरण चुनें। गलती होने पर तुरंत परिणाम का सिमुलेशन दिखेगा!'
              : 'Evaluate today\'s high-risk task scenario and equip the mandatory protective items.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioNarrationButton
            textToSpeak={challengeIntroVoice}
            lang={language}
            size="md"
            label={language === 'bn' ? 'কাজের নির্দেশ শুনুন' : language === 'hi' ? 'निर्देश सुनें' : 'Listen'}
          />
        </div>
      </div>

      {/* Role Switcher strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {WORKER_ROLES.map((role) => {
          const isSelected = role.id === selectedRole;
          return (
            <button
              key={role.id}
              onClick={() => {
                soundEngine.playClick();
                onSelectRole(role.id);
                setSelectedGear(new Set());
                setSubmissionState('idle');
                setIsSimulatingConsequence(false);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{role.title[language].split(' ')[0]}</span>
              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
            </button>
          );
        })}
      </div>

      {/* Main Grid: Task Scenario Card + Interactive Gear Picker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Task Scenario & Real-time Consequence Canvas */}
        <div className="lg:col-span-6 space-y-4">
          {/* Daily Task Assignment Brief */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                {language === 'bn' ? 'আজকের নির্ধারিত শিফট টাস্ক' : language === 'hi' ? 'आज का असाइनमेंट' : 'Assigned Shift Task'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                {currentRoleObj.badge[language]}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white leading-snug">
              {currentTask.taskTitle[language]}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-800/50 border border-slate-800 p-3.5 rounded-xl">
              {currentTask.taskScenario[language]}
            </p>

            {/* Potential Hazard Warning */}
            <div className="flex items-start gap-2.5 bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-400">
                  {language === 'bn' ? 'সম্ভাব্য ঝুঁকি:' : language === 'hi' ? 'संभावित जोखिम:' : 'Specific Hazard:'}
                </span>{' '}
                {currentTask.hazardRisk[language]}
              </div>
            </div>
          </div>

          {/* Consequence Simulation Box if Failed */}
          {submissionState === 'failed' && isSimulatingConsequence && (
            <div className="bg-rose-950/40 border-2 border-rose-500 rounded-2xl p-5 space-y-3 animate-fade-in shadow-2xl relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <XCircle className="w-5 h-5 text-rose-500 animate-bounce" />
                  <span>
                    {language === 'bn' ? 'ভুল পিপিই! দুর্ঘটনা সিমুলেশন' : language === 'hi' ? 'गलत पीपीई! दुर्घटना सिमुलेशन' : 'Incorrect PPE! Incident Simulated'}
                  </span>
                </div>
                <span className="text-xs text-rose-300 font-semibold bg-rose-900/60 px-2 py-0.5 rounded-full">
                  {missingGearList.length} {language === 'bn' ? 'টি পিপিই অনুপস্থিত' : language === 'hi' ? 'उपकरण गायब' : 'Items Missing'}
                </span>
              </div>

              {/* Consequence Graphic Animation */}
              <div className="w-full h-36 bg-slate-950/80 rounded-xl border border-rose-500/30 flex items-center justify-center p-3 relative">
                {currentTask.consequenceScenarioId === 'electric_shock' && (
                  <div className="flex items-center justify-center gap-3 animate-pulse">
                    <Zap className="w-12 h-12 text-amber-400 animate-ping" />
                    <div className="text-center">
                      <div className="text-base font-bold text-amber-400">⚡ 415V ELECTRIC SHOCK!</div>
                      <div className="text-xs text-slate-300">
                        {language === 'bn' ? 'অ্যান্টিস্ট্যাটিক বুট ছাড়া বিদ্যুৎ প্রবাহিত হলো!' : language === 'hi' ? 'इंसुलेटेड बूट के बिना करंट लगा!' : 'Lethal phase voltage grounded through shoes!'}
                      </div>
                    </div>
                  </div>
                )}

                {currentTask.consequenceScenarioId === 'drum_toe_crush' && (
                  <div className="flex items-center justify-center gap-3">
                    <Footprints className="w-12 h-12 text-rose-400" />
                    <div className="text-center">
                      <div className="text-base font-bold text-rose-400">💥 200KG DRUM TOE CRUSH!</div>
                      <div className="text-xs text-slate-300">
                        {language === 'bn' ? 'স্টিল-টো বুট না থাকায় পায়ের আঙুল গুঁড়িয়ে গেল!' : language === 'hi' ? 'स्टील टो न होने से उंगलियां कुचली गईं!' : 'Toe bones fractured without reinforced steel cap!'}
                      </div>
                    </div>
                  </div>
                )}

                {currentTask.consequenceScenarioId === 'chemical_splash' && (
                  <div className="flex items-center justify-center gap-3">
                    <Eye className="w-12 h-12 text-sky-400 animate-bounce" />
                    <div className="text-center">
                      <div className="text-base font-bold text-sky-400">🔥 75°C CHEMICAL EYE SPLASH!</div>
                      <div className="text-xs text-slate-300">
                        {language === 'bn' ? 'গগলস ছাড়া চোখে গরম অ্যাসিডিক অ্যাডিটিভ ঢুকল!' : language === 'hi' ? 'चश्मे के बिना गर्म केमिकल आंखों में गया!' : 'Caustic hot additive caused severe corneal trauma!'}
                      </div>
                    </div>
                  </div>
                )}

                {currentTask.consequenceScenarioId === 'forklift_collision' && (
                  <div className="flex items-center justify-center gap-3">
                    <Shirt className="w-12 h-12 text-yellow-400" />
                    <div className="text-center">
                      <div className="text-base font-bold text-yellow-400">🚨 FORKLIFT BLIND SPOT IMPACT!</div>
                      <div className="text-xs text-slate-300">
                        {language === 'bn' ? 'হাই-ভিজ ভেস্ট ছাড়া চালক কর্মীকে দেখতে পায়নি!' : language === 'hi' ? 'रिफ्लेक्टिव वेस्ट के बिना ड्राइवर देख नहीं सका!' : 'Driver failed to see unvested worker in aisle!'}
                      </div>
                    </div>
                  </div>
                )}

                {currentTask.consequenceScenarioId === 'ear_damage' && (
                  <div className="flex items-center justify-center gap-3">
                    <Headphones className="w-12 h-12 text-rose-400" />
                    <div className="text-center">
                      <div className="text-base font-bold text-rose-400">🔊 92 dBA ACOUSTIC TRAUMA!</div>
                      <div className="text-xs text-slate-300">
                        {language === 'bn' ? 'ইয়ার মাফ ছাড়া একটানা তীব্র শব্দে কানের ক্ষতি হলো!' : language === 'hi' ? 'ईयर मफ के बिना कान में सीटी और बहरापन!' : 'Cochlea nerve damage from pneumatic noise!'}
                      </div>
                    </div>
                  </div>
                )}

                {currentTask.consequenceScenarioId === 'bolt_fall' && (
                  <div className="flex items-center justify-center gap-3">
                    <HardHat className="w-12 h-12 text-amber-400" />
                    <div className="text-center">
                      <div className="text-base font-bold text-amber-400">⚠️ OVERHEAD GANTRY BOLT FALL!</div>
                      <div className="text-xs text-slate-300">
                        {language === 'bn' ? 'হেলমেট না থাকায় ওপরের নাট-বল্টু সরাসরি মাথায় লাগল!' : language === 'hi' ? 'हेलमेट के बिना बोल्ट सिर पर लगा!' : 'Direct cranial laceration from dropped tool!'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Missing PPE Reminder */}
              <div className="text-xs text-slate-300">
                <span className="font-bold text-rose-300">
                  {language === 'bn' ? 'যে সরঞ্জামগুলি বাদ পড়েছে:' : language === 'hi' ? 'जो उपकरण छूट गए:' : 'Missing items to equip:'}
                </span>{' '}
                {missingGearList
                  .map((id) => PPE_ITEMS.find((p) => p.id === id)?.name[language])
                  .join(', ')}
              </div>
            </div>
          )}

          {/* Success Banner */}
          {submissionState === 'success' && (
            <div className="bg-emerald-950/40 border-2 border-emerald-500 rounded-2xl p-5 space-y-3 animate-fade-in shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>
                    {language === 'bn' ? '১০০% সঠিক পিপিই পরিধান সম্পন্ন!' : language === 'hi' ? '100% सही पीपीई प्रमाणित!' : '100% Correct PPE Verified!'}
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-900/60 px-2.5 py-0.5 rounded-full">
                  +60 pts
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'bn'
                  ? 'আপনার সুরক্ষা পোশাক নিখুঁত হয়েছে। আপনি এখন নিশ্চিন্তে এই বিপজ্জনক কাজে নামতে পারেন।'
                  : language === 'hi'
                  ? 'आपकी सुरक्षा तैयारी पूरी है। आप इस कार्य को सुरक्षित रूप से पूरा कर सकते हैं।'
                  : 'All mandatory personal protective equipment verified. Ready for safe execution.'}
              </p>

              <button
                onClick={() => {
                  soundEngine.playSuccess();
                  onGoToWorkOrders();
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/20"
              >
                <FileText className="w-4 h-4" />
                <span>
                  {language === 'bn'
                    ? 'ওয়ার্ক অর্ডার ও কারখানার কাজে চলুন'
                    : language === 'hi'
                    ? 'वर्क ऑर्डर और काम शुरू करें'
                    : 'Proceed to Work Orders & Plant Duty'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Right 6 Cols: Interactive PPE Gear Selector */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>
              {language === 'bn' ? 'এই কাজের জন্য প্রয়োজনীয় পিপিই বেছে নিন:' : language === 'hi' ? 'इस कार्य हेतु सही पीपीई चुनें:' : 'Select PPE for this Task:'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">
                {selectedGear.size} {language === 'bn' ? 'টি নির্বাচিত' : language === 'hi' ? 'चुने गए' : 'selected'}
              </span>
              <button
                onClick={handleReset}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                title="Reset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid of PPE Items to pick */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PPE_ITEMS.map((item) => {
              const isSelected = selectedGear.has(item.id);
              const isRequiredForThisTask = currentTask.mandatoryPPE.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleItem(item.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-950/20 border-amber-400 ring-2 ring-amber-400/40 text-white shadow-md'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {getPPEIcon(item.icon)}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">
                        {item.name[language]}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'border-amber-400 bg-amber-400 text-slate-950'
                        : 'border-slate-600 bg-slate-800 text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verification CTA Button */}
          <button
            onClick={handleVerifyChallenge}
            disabled={selectedGear.size === 0}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
              selectedGear.size === 0
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20 active:scale-98'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>
              {language === 'bn'
                ? 'পিপিই যাচাই করুন ও কাজে প্রবেশ করুন'
                : language === 'hi'
                ? 'पीपीई सत्यापित करें और कार्य शुरू करें'
                : 'Verify PPE & Test Safety Compliance'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
