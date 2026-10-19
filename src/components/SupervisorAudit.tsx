import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  ShieldCheck, 
  Plus, 
  UserCheck, 
  Clock, 
  Send,
  FileText,
  Building2,
  Filter
} from 'lucide-react';
import { SUPERVISOR_CHECKLIST, PLANT_ZONES, WORKER_ROLES, HAZARD_ITEMS } from '../translations';
import { SupervisorCheckItem, WorkOrder, WorkerRoleId, PlantZoneId, Language } from '../types';
import { AudioNarrationButton } from './AudioNarrationButton';
import { soundEngine } from '../services/soundEngine';
import { speechNarrator } from '../services/speechNarrator';

interface SupervisorAuditProps {
  workOrders: WorkOrder[];
  onUpdateWorkOrder: (order: WorkOrder) => void;
  onCreateWorkOrder: (order: WorkOrder) => void;
  language: Language;
  onAddScore: (points: number) => void;
}

export const SupervisorAudit: React.FC<SupervisorAuditProps> = ({
  workOrders,
  onUpdateWorkOrder,
  onCreateWorkOrder,
  language,
  onAddScore
}) => {
  const [activeTab, setActiveTab] = useState<'checkpoints' | 'work_orders'>('work_orders');
  const [checklist, setChecklist] = useState<SupervisorCheckItem[]>(SUPERVISOR_CHECKLIST);
  const [activeCheckId, setActiveCheckId] = useState<string>(SUPERVISOR_CHECKLIST[0].id);

  // New Work Order Creator Form State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newOrderZone, setNewOrderZone] = useState<PlantZoneId>('tank_farm');
  const [newOrderRole, setNewOrderRole] = useState<WorkerRoleId>('general_plant');
  const [newOrderPriority, setNewOrderPriority] = useState<'critical' | 'high' | 'medium'>('high');
  const [newOrderTitleBn, setNewOrderTitleBn] = useState<string>('');
  const [newOrderTitleHi, setNewOrderTitleHi] = useState<string>('');
  const [newOrderTitleEn, setNewOrderTitleEn] = useState<string>('');
  const [selectedHazardPreset, setSelectedHazardPreset] = useState<string>('');

  // Status Filter for Work Orders
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');

  const activeItem = checklist.find((c) => c.id === activeCheckId) || checklist[0];
  const relatedZone = PLANT_ZONES.find((z) => z.id === activeItem.zone);

  const handleAuditAction = (itemId: string, status: 'pass' | 'violation') => {
    if (status === 'pass') {
      soundEngine.playSuccess();
      onAddScore(30);
    } else {
      soundEngine.playWarning();
      onAddScore(15);
    }

    setChecklist((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status } : item))
    );

    const voiceFeedback =
      status === 'pass'
        ? language === 'bn'
          ? `${activeItem.title.bn}। নিরীক্ষা সম্পন্ন। নিরাপত্তা মান পূরণ হয়েছে (পাস)!`
          : language === 'hi'
          ? `${activeItem.title.hi}। जांच पूरी। सुरक्षा मानक सही पाया गया (पास)!`
          : `${activeItem.title.en}. Audit verified. Standard passed!`
        : language === 'bn'
        ? `${activeItem.title.bn}। সুরক্ষা ব্যত্যয় চিহ্নিত! অবিলম্বে সংশোধনীয় নির্দেশ জারি করা হলো।`
        : language === 'hi'
        ? `${activeItem.title.hi}। सुरक्षा में चूक मिली! तुरंत सुधार का आदेश दिया गया।`
        : `${activeItem.title.en}. Violation recorded. Corrective order dispatched!`;

    speechNarrator.speak(voiceFeedback, language);
  };

  const handleStatusChange = (order: WorkOrder, nextStatus: 'open' | 'in_progress' | 'resolved') => {
    if (nextStatus === 'resolved') {
      soundEngine.playSuccess();
      onAddScore(order.rewardPoints);
    } else {
      soundEngine.playClick();
    }

    const updated: WorkOrder = {
      ...order,
      status: nextStatus,
      resolvedAt: nextStatus === 'resolved' ? 'Just Now' : undefined
    };
    onUpdateWorkOrder(updated);

    const assignedRole = WORKER_ROLES.find((r) => r.id === order.assignedRoleId);
    const roleTitle = assignedRole ? assignedRole.title[language] : '';

    const voiceMsg =
      nextStatus === 'resolved'
        ? language === 'bn'
          ? `ওয়ার্ক অর্ডার ${order.id} সমাধান সম্পন্ন হিসেবে চিহ্নিত করা হলো! ${roleTitle} দায়িত্ব সফলভাবে সম্পন্ন করেছেন। +${order.rewardPoints} পয়েন্ট!`
          : language === 'hi'
          ? `वर्क ऑर्डर ${order.id} को हल (सुलझाया हुआ) चिह्नित किया गया! ${roleTitle} ने कार्य पूरा किया। +${order.rewardPoints} अंक!`
          : `Work order ${order.id} verified and marked resolved by supervisor! +${order.rewardPoints} pts!`
        : language === 'bn'
        ? `ওয়ার্ক অর্ডার ${order.id} এর কাজ চলছে হিসেবে নথিভুক্ত হলো।`
        : language === 'hi'
        ? `वर्क ऑर्डर ${order.id} पर काम प्रगति पर है।`
        : `Work order ${order.id} set to in progress.`;

    speechNarrator.speak(voiceMsg, language);
  };

  const handleHazardPresetSelect = (hazardId: string) => {
    setSelectedHazardPreset(hazardId);
    const item = HAZARD_ITEMS.find((h) => h.id === hazardId);
    if (item) {
      setNewOrderZone(item.zoneId);
      setNewOrderTitleBn(item.correction.bn);
      setNewOrderTitleHi(item.correction.hi);
      setNewOrderTitleEn(item.correction.en);
      if (item.zoneId === 'barrel_filling') setNewOrderRole('barrel_filling');
      else if (item.zoneId === 'warehouse') setNewOrderRole('material_handling');
      else if (item.zoneId === 'kettles') setNewOrderRole('blending_kettle');
      else setNewOrderRole('general_plant');
    }
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playSuccess();

    const titleBn = newOrderTitleBn.trim() || 'জরুরী প্ল্যান্ট সুরক্ষা মেরামত';
    const titleHi = newOrderTitleHi.trim() || 'आपातकालीन प्लांट सुरक्षा मरम्मत';
    const titleEn = newOrderTitleEn.trim() || 'Emergency Plant Safety Rectification';

    const newOrder: WorkOrder = {
      id: `WO-${Math.floor(205 + Math.random() * 800)}`,
      title: {
        bn: titleBn,
        hi: titleHi,
        en: titleEn
      },
      description: {
        bn: `সুপারভাইজার দ্বারা জারি করা কাজের নির্দেশ। নির্ধারিত সময়ের মধ্যে সুরক্ষা ব্যবস্থা গ্রহণ করুন।`,
        hi: `सुपरवाइजर द्वारा जारी कार्य आदेश। सुरक्षा मानकों का पालन करते हुए कार्य पूरा करें।`,
        en: `Direct work order dispatched from supervisor walkthrough inspection.`
      },
      zoneId: newOrderZone,
      assignedRoleId: newOrderRole,
      priority: newOrderPriority,
      status: 'open',
      createdAt: 'Just Now',
      reportedBy: 'Safety Supervisor In-Charge',
      requiredPPE: ['helmet', 'boots', 'vest'],
      rewardPoints: newOrderPriority === 'critical' ? 120 : newOrderPriority === 'high' ? 80 : 50
    };

    onCreateWorkOrder(newOrder);
    setShowCreateModal(false);
    onAddScore(40);

    const assignedRoleObj = WORKER_ROLES.find((r) => r.id === newOrderRole);
    const assignedRoleName = assignedRoleObj ? assignedRoleObj.title[language] : '';

    const voiceNotice =
      language === 'bn'
        ? `নতুন ওয়ার্ক অর্ডার ${newOrder.id} তৈরি করে ${assignedRoleName}-কে সফলভাবে হস্তান্তর করা হলো!`
        : language === 'hi'
        ? `नया वर्क ऑर्डर ${newOrder.id} जारी कर ${assignedRoleName} को सौंपा गया!`
        : `New Work Order ${newOrder.id} issued and dispatched to ${assignedRoleName}!`;

    speechNarrator.speak(voiceNotice, language);
  };

  const filteredOrders = workOrders.filter((wo) => {
    if (statusFilter === 'all') return true;
    return wo.status === statusFilter;
  });

  const completedChecksCount = checklist.filter((c) => c.status !== undefined).length;
  const openOrdersCount = workOrders.filter((wo) => wo.status === 'open').length;
  const resolvedOrdersCount = workOrders.filter((wo) => wo.status === 'resolved').length;

  const supervisorVoice =
    language === 'bn'
      ? 'প্ল্যান্ট সেফটি সুপারভাইজার ম্যানেজমেন্ট মোড। এখানে আপনি কারখানার বিপদ চিহ্নিত করে শ্রমিকদের জন্য সংশোধনমূলক ওয়ার্ক অর্ডার জারি করতে পারেন এবং কাজ সম্পন্ন হলে সমাধান যাচাই করতে পারেন।'
      : language === 'hi'
      ? 'प्लांट सेफ्टी सुपरवाइजर मैनेजमेंट मोड। यहां आप खतरा देखकर मजदूरों को वर्क ऑर्डर जारी कर सकते हैं और कार्य पूरा होने पर अप्रूव कर सकते हैं।'
      : 'Plant Safety Supervisor Command Mode. Create and assign corrective work orders to worker roles and verify hazard resolutions.';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-rose-400 font-semibold text-xs tracking-wider uppercase">
              {language === 'bn' ? 'সুপারভাইজার কমান্ড সেন্টার' : language === 'hi' ? 'सुपरवाइजर कमांड सेंटर' : 'Supervisor Command'}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-300 text-xs font-medium">
              {language === 'bn' ? '৩০ একর প্ল্যান্ট ও ১০০+ শ্রমিক' : language === 'hi' ? '30 एकड़ प्लांट व 100+ मजदूर' : '30-Acre Workforce'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {language === 'bn'
              ? 'সুরক্ষা পরিদর্শন ও ওয়ার্ক অর্ডার ব্যবস্থাপনা'
              : language === 'hi'
              ? 'सुरक्षा निरीक्षण एवं वर्क ऑर्डर प्रबंधन'
              : 'EHS Inspection & Work Order Center'}
          </h1>
          <p className="text-slate-300 text-sm">
            {language === 'bn'
              ? 'প্ল্যান্ট পর্যবেক্ষণ করে কর্মীদের জন্য কাজের নির্দেশ (ওয়ার্ক অর্ডার) জারি করুন এবং সমাধান চিহ্নিত করুন।'
              : language === 'hi'
              ? 'प्लांट का निरीक्षण करें, मजदूरों को सुधार कार्य सौंपें और काम पूरा होने पर मार्क करें।'
              : 'Conduct inspections, issue actionable work orders to worker roles, and certify hazard resolutions.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioNarrationButton
            textToSpeak={supervisorVoice}
            lang={language}
            size="md"
            label={language === 'bn' ? 'মোডের কথা শুনুন' : language === 'hi' ? 'मोड सुनें' : 'Listen'}
          />
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">{language === 'bn' ? 'মোট ওয়ার্ক অর্ডার' : language === 'hi' ? 'कुल वर्क ऑर्डर' : 'Total Orders'}</div>
          <div className="text-2xl font-bold text-white mt-1 tabular-nums">{workOrders.length}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">{language === 'bn' ? 'চলমান / অমীমাংসিত' : language === 'hi' ? 'अधूरा / जारी' : 'Open Orders'}</div>
          <div className="text-2xl font-bold text-amber-400 mt-1 tabular-nums">{openOrdersCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">{language === 'bn' ? 'সমাধান সম্পন্ন' : language === 'hi' ? 'हल किया गया' : 'Resolved'}</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1 tabular-nums">{resolvedOrdersCount}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">{language === 'bn' ? 'অডিট চেকপয়েন্ট' : language === 'hi' ? 'ऑडिट चेकपॉइंट' : 'Audit Checks'}</div>
          <div className="text-2xl font-bold text-rose-400 mt-1 tabular-nums">
            {completedChecksCount} / {checklist.length}
          </div>
        </div>
      </div>

      {/* Sub-Tabs: Work Orders Dispatch vs Checkpoints Audit */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('work_orders');
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'work_orders'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? 'ওয়ার্ক অর্ডার সেন্টার' : language === 'hi' ? 'वर्क ऑर्डर सेंटर' : 'Work Order Center'} ({workOrders.length})
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('checkpoints');
            }}
            className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'checkpoints'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'bn' ? '৫-দফা সেফটি অডিট' : language === 'hi' ? '5-बिंदु सेफ्टी ऑडिट' : '5-Point Safety Audit'}
          </button>
        </div>

        {activeTab === 'work_orders' && (
          <button
            onClick={() => {
              soundEngine.playClick();
              setShowCreateModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>
              {language === 'bn' ? '+ নতুন ওয়ার্ক অর্ডার জারি করুন' : language === 'hi' ? '+ नया वर्क ऑर्डर जारी करें' : '+ Issue Work Order'}
            </span>
          </button>
        )}
      </div>

      {/* VIEW 1: WORK ORDER DISPATCH CENTER */}
      {activeTab === 'work_orders' && (
        <div className="space-y-4">
          {/* Status Filter buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium mr-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ফিল্টার:' : language === 'hi' ? 'फ़िल्टर:' : 'Filter:'}</span>
            </span>

            {(['all', 'open', 'in_progress', 'resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => {
                  soundEngine.playClick();
                  setStatusFilter(st);
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800'
                }`}
              >
                {st === 'all'
                  ? language === 'bn'
                    ? 'সকল অর্ডার'
                    : language === 'hi'
                    ? 'सभी ऑर्डर'
                    : 'All'
                  : st === 'open'
                  ? language === 'bn'
                    ? 'খোলা / নতুন'
                    : language === 'hi'
                    ? 'लंबित'
                    : 'Open'
                  : st === 'in_progress'
                  ? language === 'bn'
                    ? 'কাজ চলছে'
                    : language === 'hi'
                    ? 'प्रगति पर'
                    : 'In Progress'
                  : language === 'bn'
                  ? 'সমাধান সম্পন্ন'
                  : language === 'hi'
                  ? 'हल किया गया'
                  : 'Resolved'}
              </button>
            ))}
          </div>

          {/* Work Orders List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOrders.map((order) => {
              const assignedRole = WORKER_ROLES.find((r) => r.id === order.assignedRoleId);
              const zone = PLANT_ZONES.find((z) => z.id === order.zoneId);

              const orderVoiceText =
                language === 'bn'
                  ? `ওয়ার্ক অর্ডার ${order.id}। এলাকা: ${zone?.name.bn}। দায়িত্বপ্রাপ্ত: ${assignedRole?.title.bn}। কাজ: ${order.title.bn}। অবস্থা: ${
                      order.status === 'resolved' ? 'সমাধান সম্পন্ন' : order.status === 'in_progress' ? 'চলমান' : 'নতুন'
                    }।`
                  : language === 'hi'
                  ? `वर्क ऑर्डर ${order.id}। क्षेत्र: ${zone?.name.hi}। सौंपा गया: ${assignedRole?.title.hi}। कार्य: ${order.title.hi}। स्थिति: ${
                      order.status === 'resolved' ? 'हल किया गया' : order.status === 'in_progress' ? 'प्रगति पर' : 'लंबित'
                    }।`
                  : `Work Order ${order.id}. Zone: ${zone?.name.en}. Assigned to: ${assignedRole?.title.en}. Task: ${order.title.en}.`;

              return (
                <div
                  key={order.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                    order.status === 'resolved'
                      ? 'bg-slate-900/40 border-emerald-500/30 text-slate-300'
                      : order.priority === 'critical'
                      ? 'bg-slate-900 border-rose-500/50 ring-1 ring-rose-500/30'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Row: ID, Priority, and Audio */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                          {order.id}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                            order.priority === 'critical'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : order.priority === 'high'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          }`}
                        >
                          {order.priority}
                        </span>
                      </div>

                      <AudioNarrationButton
                        textToSpeak={orderVoiceText}
                        lang={language}
                        size="sm"
                        variant="subtle"
                      />
                    </div>

                    {/* Order Title */}
                    <div>
                      <h3 className="text-base font-bold text-white leading-snug">
                        {order.title[language]}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                        {order.description[language]}
                      </p>
                    </div>

                    {/* Assigned Worker and Zone Strip */}
                    <div className="grid grid-cols-2 gap-2 text-xs bg-slate-800/50 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <div className="text-[10px] text-slate-400">
                          {language === 'bn' ? 'কারখানা এলাকা:' : language === 'hi' ? 'प्लांट क्षेत्र:' : 'Zone:'}
                        </div>
                        <div className="font-semibold text-white truncate">
                          {zone?.shortName[language]}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">
                          {language === 'bn' ? 'দায়িত্বপ্রাপ্ত কর্মী:' : language === 'hi' ? 'सौंपा गया पद:' : 'Assigned Role:'}
                        </div>
                        <div className="font-semibold text-amber-300 truncate">
                          {assignedRole?.title[language].split(' ')[0]}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions: Status Transition */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs">
                      {order.status === 'resolved' ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {language === 'bn' ? 'সমাধান সম্পন্ন' : language === 'hi' ? 'हल किया गया' : 'Resolved'}
                        </span>
                      ) : order.status === 'in_progress' ? (
                        <span className="flex items-center gap-1 text-blue-400 font-bold bg-blue-950/60 border border-blue-500/30 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3.5 h-3.5 animate-spin" />
                          {language === 'bn' ? 'কাজ চলছে' : language === 'hi' ? 'प्रगति पर' : 'In Progress'}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {language === 'bn' ? 'খোলা (অপেক্ষমাণ)' : language === 'hi' ? 'लंबित' : 'Pending'}
                        </span>
                      )}
                    </div>

                    {/* Change Status Buttons */}
                    <div className="flex items-center gap-1.5">
                      {order.status !== 'resolved' && (
                        <button
                          onClick={() => handleStatusChange(order, 'resolved')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{language === 'bn' ? 'সমাধান সম্পন্ন করুন' : language === 'hi' ? 'हल करें' : 'Mark Resolved'}</span>
                        </button>
                      )}

                      {order.status === 'open' && (
                        <button
                          onClick={() => handleStatusChange(order, 'in_progress')}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors cursor-pointer"
                        >
                          {language === 'bn' ? 'কাজ শুরু' : language === 'hi' ? 'शुरू करें' : 'Start'}
                        </button>
                      )}

                      {order.status === 'resolved' && (
                        <button
                          onClick={() => handleStatusChange(order, 'open')}
                          className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
                        >
                          {language === 'bn' ? 'পুনরায় খুলুন' : language === 'hi' ? 'पुनः खोलें' : 'Reopen'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: 5-POINT SAFETY AUDIT CHECKPOINTS */}
      {activeTab === 'checkpoints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 6 Cols: Checkpoints List */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-1">
              <span>{language === 'bn' ? 'চেকপয়েন্টের তালিকা' : language === 'hi' ? 'चेकपॉइंट सूची' : 'Inspection Checkpoints'}</span>
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setChecklist(SUPERVISOR_CHECKLIST.map((item) => ({ ...item, status: undefined })));
                }}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'পুনরায় শুরু' : language === 'hi' ? 'रीसेट' : 'Reset'}</span>
              </button>
            </div>

            {checklist.map((item, idx) => {
              const isSelected = item.id === activeCheckId;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveCheckId(item.id);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-800 border-amber-400 shadow-md ring-1 ring-amber-400/40'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300 shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {item.title[language]}
                      </h4>
                      <div className="text-xs text-slate-400 mt-1">
                        {PLANT_ZONES.find((z) => z.id === item.zone)?.shortName[language]}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {item.status === 'pass' && (
                      <span className="p-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-5 h-5" />
                      </span>
                    )}
                    {item.status === 'violation' && (
                      <span className="p-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        <XCircle className="w-5 h-5" />
                      </span>
                    )}
                    {item.status === undefined && (
                      <span className="w-3 h-3 rounded-full border border-slate-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 6 Cols: Decision Action Card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                    {relatedZone?.name[language]}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 leading-snug">
                    {activeItem.title[language]}
                  </h3>
                </div>

                <AudioNarrationButton
                  textToSpeak={
                    language === 'bn'
                      ? `${activeItem.title.bn}। প্রয়োজনীয় নিরাপত্তা মান: ${activeItem.standard.bn}।`
                      : language === 'hi'
                      ? `${activeItem.title.hi}। सुरक्षा मानक: ${activeItem.standard.hi}।`
                      : `${activeItem.title.en}. Standard: ${activeItem.standard.en}.`
                  }
                  lang={language}
                  size="sm"
                  variant="subtle"
                />
              </div>

              {/* Standard Box */}
              <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 space-y-1.5">
                <div className="text-xs font-semibold text-slate-300">
                  {language === 'bn' ? 'প্রয়োজনীয় সুরক্ষা নিয়ম (স্ট্যান্ডার্ড):' : language === 'hi' ? 'अनिवार्य सुरक्षा मानक:' : 'Prescribed Standard:'}
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {activeItem.standard[language]}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleAuditAction(activeItem.id, 'pass')}
                  className={`py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeItem.status === 'pass'
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400'
                      : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/40'
                  }`}
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>{language === 'bn' ? 'পাস (সুরক্ষিত)' : language === 'hi' ? 'पास (सुरक्षित)' : 'Mark Pass'}</span>
                </button>

                <button
                  onClick={() => handleAuditAction(activeItem.id, 'violation')}
                  className={`py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    activeItem.status === 'violation'
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400'
                      : 'bg-rose-950/60 text-rose-300 hover:bg-rose-900/60 border border-rose-500/40'
                  }`}
                >
                  <XCircle className="w-5 h-5 text-rose-400" />
                  <span>{language === 'bn' ? 'নিয়মভঙ্গ' : language === 'hi' ? 'उल्लंघन' : 'Violation'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW WORK ORDER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  {language === 'bn' ? 'সুপারভাইজার অ্যাকশন' : language === 'hi' ? 'सुपरवाइजर एक्शन' : 'Supervisor Action'}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {language === 'bn' ? 'নতুন সংশোধন ওয়ার্ক অর্ডার তৈরি' : language === 'hi' ? 'नया वर्क ऑर्डर जारी करें' : 'Create Safety Work Order'}
                </h3>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
              {/* Quick Preset Selector from Identified Hazards */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {language === 'bn' ? 'শনাক্ত বিপদ থেকে দ্রুত নির্বাচন (ঐচ্ছিক):' : language === 'hi' ? 'पहचाने गए खतरे से चुनें (वैकल्पिक):' : 'Select from Identified Hazards:'}
                </label>
                <select
                  value={selectedHazardPreset}
                  onChange={(e) => handleHazardPresetSelect(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="">-- {language === 'bn' ? 'বিপদ বেছে নিন' : language === 'hi' ? 'खतरा चुनें' : 'Choose a hazard'} --</option>
                  {HAZARD_ITEMS.map((h) => (
                    <option key={h.id} value={h.id}>
                      [{PLANT_ZONES.find((z) => z.id === h.zoneId)?.shortName[language]}] {h.title[language]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Task Title Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {language === 'bn' ? 'কাজের নাম / নির্দেশ:' : language === 'hi' ? 'कार्य का नाम:' : 'Task Title / Order Action:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    language === 'bn'
                      ? 'উদা: ড্রাম রোলের পিচ্ছিল তেল পরিষ্কার করা'
                      : language === 'hi'
                      ? 'उदा: कन्वेयर पर गिरा तेल साफ करना'
                      : 'e.g. Deploy spill kit at barrel bay'
                  }
                  value={language === 'bn' ? newOrderTitleBn : language === 'hi' ? newOrderTitleHi : newOrderTitleEn}
                  onChange={(e) => {
                    if (language === 'bn') setNewOrderTitleBn(e.target.value);
                    else if (language === 'hi') setNewOrderTitleHi(e.target.value);
                    else setNewOrderTitleEn(e.target.value);
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Zone and Assigned Worker Role Dual Column */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {language === 'bn' ? 'প্ল্যান্ট এলাকা:' : language === 'hi' ? 'क्षेत्र:' : 'Plant Zone:'}
                  </label>
                  <select
                    value={newOrderZone}
                    onChange={(e) => setNewOrderZone(e.target.value as PlantZoneId)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {PLANT_ZONES.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name[language]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    {language === 'bn' ? 'দায়িত্বপ্রাপ্ত কর্মী পদ:' : language === 'hi' ? 'जिम्मेदार पद:' : 'Assign Worker Role:'}
                  </label>
                  <select
                    value={newOrderRole}
                    onChange={(e) => setNewOrderRole(e.target.value as WorkerRoleId)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {WORKER_ROLES.filter((r) => r.id !== 'supervisor').map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title[language]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Priority Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {language === 'bn' ? 'অগ্রাধিকার স্তর:' : language === 'hi' ? 'प्राथमिकता स्तर:' : 'Priority Level:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['critical', 'high', 'medium'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewOrderPriority(p)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                        newOrderPriority === p
                          ? p === 'critical'
                            ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                            : p === 'high'
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-400'
                            : 'bg-blue-600 text-white ring-2 ring-blue-400'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20 active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>
                  {language === 'bn'
                    ? 'ওয়ার্ক অর্ডার জারি ও প্রেরণ করুন'
                    : language === 'hi'
                    ? 'वर्क ऑर्डर जारी करें और भेजें'
                    : 'Dispatch Work Order'}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
