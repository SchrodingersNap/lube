import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { RoleSelector } from './components/RoleSelector';
import { RoleChallengeStation } from './components/RoleChallengeStation';
import { PPEStation } from './components/PPEStation';
import { ConsequenceTheater } from './components/ConsequenceTheater';
import { PlantMap30Acre } from './components/PlantMap30Acre';
import { HazardHuntingGame } from './components/HazardHuntingGame';
import { SupervisorAudit } from './components/SupervisorAudit';
import { SafetyScoreModal } from './components/SafetyScoreModal';
import { Language, WorkerRoleId, PPEItemId, PlantZoneId, WorkOrder } from './types';
import { WORKER_ROLES, PLANT_ZONES, INITIAL_WORK_ORDERS } from './translations';
import { soundEngine } from './services/soundEngine';
import { speechNarrator } from './services/speechNarrator';
import { Award, ShieldAlert, Sparkles, Volume2, ShieldCheck, MapPin, FileText, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('roles');
  const [language, setLanguage] = useState<Language>('bn'); // Default to Bengali as requested
  const [selectedRole, setSelectedRole] = useState<WorkerRoleId>('barrel_filling');
  const [equippedPPE, setEquippedPPE] = useState<Set<PPEItemId>>(
    new Set(['helmet', 'boots'])
  );
  const [selectedZone, setSelectedZone] = useState<PlantZoneId>('barrel_filling');
  const [safetyScore, setSafetyScore] = useState<number>(120);
  const [isScoreModalOpen, setIsScoreModalOpen] = useState<boolean>(false);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);

  const currentRoleObj = WORKER_ROLES.find((r) => r.id === selectedRole) || WORKER_ROLES[0];
  const currentZoneObj = PLANT_ZONES.find((z) => z.id === selectedZone) || PLANT_ZONES[0];

  const handleSelectRole = (roleId: WorkerRoleId) => {
    setSelectedRole(roleId);
    const roleObj = WORKER_ROLES.find((r) => r.id === roleId);
    if (roleObj) {
      setSelectedZone(roleObj.primaryPlantZone);
    }
  };

  const handleTogglePPE = (ppeId: PPEItemId) => {
    setEquippedPPE((prev) => {
      const next = new Set(prev);
      if (next.has(ppeId)) {
        next.delete(ppeId);
      } else {
        next.add(ppeId);
        setSafetyScore((s) => s + 15);
      }
      return next;
    });
  };

  const handleEquipAllRequired = () => {
    const required = currentRoleObj.requiredPPE;
    setEquippedPPE(new Set(required));
    setSafetyScore((s) => s + 50);
  };

  const handleResetPPE = () => {
    setEquippedPPE(new Set());
  };

  const handleAddScore = (points: number) => {
    setSafetyScore((prev) => prev + points);
  };

  const handleLaunchHazardHuntFromMap = (zoneId: PlantZoneId) => {
    setSelectedZone(zoneId);
    setCurrentTab('hazards');
  };

  const handleUpdateWorkOrder = (updatedOrder: WorkOrder) => {
    setWorkOrders((prev) =>
      prev.map((wo) => (wo.id === updatedOrder.id ? updatedOrder : wo))
    );
  };

  const handleCreateWorkOrder = (newOrder: WorkOrder) => {
    setWorkOrders((prev) => [newOrder, ...prev]);
  };

  const handleCompleteChallenge = (roleId: WorkerRoleId, bonus: number) => {
    setSafetyScore((s) => s + bonus);
    // Equip the mandatory PPE for that role automatically upon passing challenge
    const roleObj = WORKER_ROLES.find((r) => r.id === roleId);
    if (roleObj) {
      setEquippedPPE(new Set(roleObj.requiredPPE));
    }
  };

  const activeWorkOrdersForRole = workOrders.filter(
    (wo) => wo.assignedRoleId === selectedRole && wo.status !== 'resolved'
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* 3-Zone Top Navigation */}
      <TopNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        language={language}
        onLanguageChange={setLanguage}
        safetyScore={safetyScore}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Tab 1: Role Selection */}
        {currentTab === 'roles' && (
          <RoleSelector
            selectedRole={selectedRole}
            onSelectRole={handleSelectRole}
            onConfirmRole={() => setCurrentTab('challenge')}
            language={language}
          />
        )}

        {/* Tab 2: Role-Specific Challenge Station */}
        {currentTab === 'challenge' && (
          <RoleChallengeStation
            selectedRole={selectedRole}
            onSelectRole={handleSelectRole}
            onCompleteChallenge={handleCompleteChallenge}
            onGoToWorkOrders={() => setCurrentTab('supervisor')}
            language={language}
          />
        )}

        {/* Tab 3: PPE Locker Room */}
        {currentTab === 'ppe' && (
          <PPEStation
            selectedRole={selectedRole}
            equippedPPE={equippedPPE}
            onTogglePPE={handleTogglePPE}
            onEquipAllRequired={handleEquipAllRequired}
            onResetPPE={handleResetPPE}
            onGoToConsequences={() => setCurrentTab('consequences')}
            language={language}
          />
        )}

        {/* Tab 4: Consequence Demonstration Theater */}
        {currentTab === 'consequences' && (
          <ConsequenceTheater
            language={language}
            onExploreMap={() => setCurrentTab('map')}
          />
        )}

        {/* Tab 5: 30-Acre Plant Map */}
        {currentTab === 'map' && (
          <PlantMap30Acre
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            onLaunchHazardHunt={handleLaunchHazardHuntFromMap}
            language={language}
          />
        )}

        {/* Tab 6: Hazard Hunting Game (Dual Canvas + List) */}
        {currentTab === 'hazards' && (
          <HazardHuntingGame
            initialZone={selectedZone}
            onSelectZone={setSelectedZone}
            onAddScore={handleAddScore}
            language={language}
          />
        )}

        {/* Tab 7: Supervisor Safety Audit & Work Orders */}
        {currentTab === 'supervisor' && (
          <SupervisorAudit
            workOrders={workOrders}
            onUpdateWorkOrder={handleUpdateWorkOrder}
            onCreateWorkOrder={handleCreateWorkOrder}
            language={language}
            onAddScore={handleAddScore}
          />
        )}
      </main>

      {/* Sticky Bottom Status & Action Strip */}
      <footer className="sticky bottom-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          {/* Active Shift Indicator */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-slate-400 hidden sm:inline">
                {language === 'bn' ? 'বর্তমান ডিউটি:' : language === 'hi' ? 'मौजूदा ड्यूटी:' : 'Duty:'}
              </span>
              <span className="text-white font-bold truncate">
                {currentRoleObj.title[language].split(' ')[0]}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-slate-400 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentZoneObj.shortName[language]}</span>
            </div>

            {/* Role's Active Work Orders Alert */}
            {activeWorkOrdersForRole.length > 0 && (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setCurrentTab('supervisor');
                }}
                className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold cursor-pointer shrink-0"
              >
                <FileText className="w-3 h-3 text-rose-400" />
                <span>
                  {activeWorkOrdersForRole.length}{' '}
                  {language === 'bn' ? 'টি ওয়ার্ক অর্ডার অমীমাংসিত' : language === 'hi' ? 'वर्क ऑर्डर लंबित' : 'Work Orders Open'}
                </span>
              </button>
            )}

            <div className="hidden lg:flex items-center gap-1.5 text-slate-400 shrink-0">
              <span>{language === 'bn' ? 'পিপিই:' : language === 'hi' ? 'पीपीई:' : 'PPE:'}</span>
              <span className="text-amber-400 font-semibold">{equippedPPE.size} items</span>
            </div>
          </div>

          {/* Claim Safety Champion Badge */}
          <button
            onClick={() => {
              soundEngine.playSuccess();
              setIsScoreModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-bold flex items-center gap-2 transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>
              {language === 'bn'
                ? 'সুরক্ষা ব্যাজ দেখুন'
                : language === 'hi'
                ? 'सुरक्षा बैज देखें'
                : 'View Safety Badge'}
            </span>
          </button>
        </div>
      </footer>

      {/* Safety Score / Champion Modal */}
      <SafetyScoreModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
        safetyScore={safetyScore}
        selectedRole={selectedRole}
        language={language}
      />
    </div>
  );
}
