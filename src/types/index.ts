export type Language = 'bn' | 'hi' | 'en';

export type WorkerRoleId =
  | 'barrel_filling'
  | 'smallpack_filling'
  | 'material_handling'
  | 'blending_kettle'
  | 'general_plant'
  | 'supervisor';

export interface WorkerRole {
  id: WorkerRoleId;
  title: {
    bn: string;
    hi: string;
    en: string;
  };
  subtitle: {
    bn: string;
    hi: string;
    en: string;
  };
  icon: string;
  badge: {
    bn: string;
    hi: string;
    en: string;
  };
  color: string;
  requiredPPE: PPEItemId[];
  primaryPlantZone: PlantZoneId;
}

export type PPEItemId =
  | 'helmet'
  | 'goggles'
  | 'gloves_nitrile'
  | 'gloves_heavy'
  | 'boots'
  | 'vest'
  | 'ear_protection'
  | 'respirator';

export interface PPEItem {
  id: PPEItemId;
  name: {
    bn: string;
    hi: string;
    en: string;
  };
  purpose: {
    bn: string;
    hi: string;
    en: string;
  };
  category: 'head' | 'face' | 'hands' | 'feet' | 'body' | 'ears' | 'lungs';
  icon: string;
  requiredFor: WorkerRoleId[];
}

export type PlantZoneId =
  | 'kettles'
  | 'barrel_filling'
  | 'smallpack_filling'
  | 'tank_farm'
  | 'truck_loading'
  | 'warehouse'
  | 'supply_block'
  | 'canteen_admin';

export interface PlantZone {
  id: PlantZoneId;
  name: {
    bn: string;
    hi: string;
    en: string;
  };
  shortName: {
    bn: string;
    hi: string;
    en: string;
  };
  description: {
    bn: string;
    hi: string;
    en: string;
  };
  acreage: string;
  primaryHazards: {
    bn: string[];
    hi: string[];
    en: string[];
  };
  requiredPPE: PPEItemId[];
  badgeColor: string;
  mapCoords: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export type ConsequenceScenarioId =
  | 'bolt_fall'
  | 'electric_shock'
  | 'chemical_splash'
  | 'drum_toe_crush'
  | 'forklift_collision'
  | 'ear_damage';

export interface ConsequenceScenario {
  id: ConsequenceScenarioId;
  title: {
    bn: string;
    hi: string;
    en: string;
  };
  relatedPPE: PPEItemId;
  zone: PlantZoneId;
  description: {
    bn: string;
    hi: string;
    en: string;
  };
  withoutPPEOutcome: {
    bn: string;
    hi: string;
    en: string;
  };
  withPPEOutcome: {
    bn: string;
    hi: string;
    en: string;
  };
  soundEffect: 'shock' | 'bolt' | 'splash' | 'crush' | 'horn' | 'ringing';
}

export interface HazardItem {
  id: string;
  zoneId: PlantZoneId;
  title: {
    bn: string;
    hi: string;
    en: string;
  };
  description: {
    bn: string;
    hi: string;
    en: string;
  };
  correction: {
    bn: string;
    hi: string;
    en: string;
  };
  severity: 'high' | 'critical' | 'medium';
  x: number; // percentage in scene 0-100
  y: number; // percentage in scene 0-100
}

export interface SupervisorCheckItem {
  id: string;
  zone: PlantZoneId;
  title: {
    bn: string;
    hi: string;
    en: string;
  };
  standard: {
    bn: string;
    hi: string;
    en: string;
  };
  status?: 'pass' | 'violation' | 'pending';
  violationReason?: {
    bn: string;
    hi: string;
    en: string;
  };
}

export interface WorkOrder {
  id: string;
  hazardId?: string;
  title: {
    bn: string;
    hi: string;
    en: string;
  };
  description: {
    bn: string;
    hi: string;
    en: string;
  };
  zoneId: PlantZoneId;
  assignedRoleId: WorkerRoleId;
  priority: 'critical' | 'high' | 'medium';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  resolvedAt?: string;
  reportedBy: string;
  requiredPPE: PPEItemId[];
  rewardPoints: number;
}

export interface RoleChallengeTask {
  id: string;
  roleId: WorkerRoleId;
  taskTitle: {
    bn: string;
    hi: string;
    en: string;
  };
  taskScenario: {
    bn: string;
    hi: string;
    en: string;
  };
  targetZone: PlantZoneId;
  mandatoryPPE: PPEItemId[];
  hazardRisk: {
    bn: string;
    hi: string;
    en: string;
  };
  consequenceScenarioId: ConsequenceScenarioId;
}

