export type DefectType = "Crack" | "Moisture" | "Surface Damage" | "Paint Peeling";
export type SeverityLevel = "Critical" | "Moderate" | "Low";
export type RiskLevel = "Low" | "Moderate" | "High" | "Requires Expert Review";
export type BuyerItemStatus = "VERIFIED" | "AI DETECTED" | "NOT INSPECTED" | "INCOMPLETE";

export interface EvidenceFrame {
  id: string;
  frameUrl: string;
  thumbnailUrl: string;
  timestampSec: number;
  timestampFormatted: string;
  confidence: number;
  cameraAngle: string;
  roomArea: string;
  detectedBox?: {
    x: number; // percentage 0-100
    y: number;
    w: number;
    h: number;
    label: string;
  };
  notes?: string;
}

export interface Finding {
  id: number;
  type: DefectType;
  area: string;
  severity: SeverityLevel;
  conf: number; // 0 - 100
  frames: number;
  verified: boolean;
  isResolved: boolean;
  evidence: EvidenceFrame[];
  description: string;
  recommendation: string;
  detectedAt: string;
  title?: string;
  titleArabic?: string;
  descriptionArabic?: string;
  location?: string;
}

export interface CoverageArea {
  id: string;
  area: string;
  areaArabic: string;
  pct: number; // 0 - 100
  expectedFrames: number;
  capturedFrames: number;
  lastInspected: string;
  status: "Complete" | "Partial" | "Incomplete" | "Not Inspected";
  isPrimaryBlocker?: boolean;
  sqm?: number;
  level?: string;
  levelArabic?: string;
  icon?: string;
}

export type SLAStatus = "OVERDUE" | "EXPIRING_SOON" | "ON_TRACK" | "ESCALATED" | "RESOLVED";
export type SLATier = "Tier 1 (Critical SBC)" | "Tier 2 (Municipal/Legal)" | "Tier 3 (MEP/Thermal)";

export interface SLAAlertItem {
  id: string;
  actionId: string;
  title: string;
  titleArabic: string;
  zone: string;
  tier: SLATier;
  slaStatus: SLAStatus;
  deadlineHoursRemaining: number; // negative if overdue, e.g. -4.5
  totalSlaHours: number; // e.g. 24 or 48
  assignee: string;
  assigneeRole: string;
  assigneeRoleArabic: string;
  valueAtRiskSar: number;
  gainNum: number;
  breachPenaltyDesc: string;
  breachPenaltyDescArabic: string;
  acknowledged?: boolean;
  dispatchedAt?: string;
}

export interface ActionItem {
  id: string;
  n: number;
  action: string;
  actionArabic: string;
  impact: "High" | "Medium" | "Low";
  effort: "High" | "Medium" | "Low";
  cost: "High" | "Medium" | "Low";
  gain: string;
  gainNum: number;
  targetArea: string;
  completed?: boolean;
  details: string;
  sla?: SLAAlertItem;
}

export interface ScenarioComparison {
  key: string;
  label: string;
  labelArabic: string;
  score: number;
  conditionIndex: number;
  coveragePct: number;
  unresolvedCount: number;
  missingFieldsCount: number;
  color: string;
  description: string;
}

export interface BuyerVerificationItem {
  id: string;
  label: string;
  labelArabic: string;
  category: "Structure" | "Systems" | "Finishes" | "Legal & Compliance";
  status: BuyerItemStatus;
  statusDetails: string;
  statusDetailsArabic: string;
  lastVerifiedBy?: string;
  evidenceCount: number;
  color: string;
}

export interface IoTSensorReading {
  id: string;
  name: string;
  nameArabic: string;
  zone: string;
  type: "strain" | "vibration" | "thermal_sbc601" | "moisture" | "energy_kwh";
  currentValue: number;
  unit: string;
  threshold: number;
  status: "NORMAL" | "WARNING" | "CRITICAL";
  sbcStandard: string; // e.g. "SBC 304 (Concrete)" or "SBC 601 (Energy)"
  lastPulseTime: string;
  history: number[]; // last 12 readings for sparkline
}

export interface BIMDeviationItem {
  id: string;
  elementName: string;
  elementNameArabic: string;
  category: "Structural" | "MEP" | "Architectural" | "Insulation";
  asDesignedSpec: string;
  asBuiltActual: string;
  deviationMm: number;
  toleranceLimitMm: number;
  status: "PASS" | "MINOR_DEVIATION" | "CRITICAL_CLASH";
  costToRectifySar: number;
  savingsByEarlyDetectionSar: number;
}

export interface PredictiveLifecycleItem {
  id: string;
  subsystem: string;
  subsystemArabic: string;
  installedYear: number;
  nominalLifespanYears: number;
  currentHealthPct: number;
  predictedDegradationHorizonMonths: number;
  climateVulnerabilityFactor: "High" | "Moderate" | "Low"; // Riyadh climate / UV exposure
  recommendedPreventiveActionArabic: string;
  estimatedPreventiveCostSar: number;
  preventedDamageCostSar: number;
}

export interface BlockchainNationalRegistryRecord {
  chainNetwork: string; // "Saudi Real Estate Blockchain (SRE-Chain)"
  contractAddress: string;
  tokenDeedId: string;
  nationalRegistryId: string; // e.g. "SA-REG-2026-89412B"
  blockHeight: number;
  immutableHashSha256: string;
  timestamp: string;
  verifiedAuditor: string;
  status: "IMMUTABLE_VERIFIED" | "PENDING_BLOCK_CONSENSUS";
  certifiedAuditsCount: number;
}

export interface DynamicAVMAnalysis {
  baselinePricePerSqm: number;
  currentCalculatedValuationSar: number;
  readinessMultiplier: number; // dynamically adjusts based on readiness score
  potentialMaxValuationSar: number; // when readiness is 100%
  districtAveragePriceSqm: number;
  recentCompsCount: number;
  confidenceScorePct: number;
  valuationTrendPercentage: number;
}

export interface LegalComplianceAuditItem {
  id: string;
  title: string;
  titleArabic: string;
  authority: "MOMRAH / Balady" | "Saudi Building Code National Committee" | "Ministry of Justice" | "Civil Defense";
  documentReference: string;
  status: "COMPLIANT" | "UNDER_REVIEW" | "CONDITIONAL_APPROVAL";
  complianceScore: number;
  liquidationImpact: "ZERO_FRICTION" | "MINOR_DELAY" | "BLOCKER";
  notesArabic: string;
}

export interface AssetRecord {
  id: string;
  name: string;
  nameArabic: string;
  type: "Residential Villa" | "Commercial Tower" | "Residential Compound" | "Logistics Warehouse";
  typeArabic: string;
  location: string;
  locationArabic: string;
  city: string;
  district: string;
  sizeSqm: number;
  buildYear: number;
  valuationSar: number;
  missingFieldsCount: number;
  missingFieldsList: string[];
  findings: Finding[];
  coverageAreas: CoverageArea[];
  buyerItems: BuyerVerificationItem[];
  actions: ActionItem[];
  inspectionDate: string;
  inspectorName: string;
  inspectorLicense: string;
  heroImage: string;
  iotSensors?: IoTSensorReading[];
  bimDeviations?: BIMDeviationItem[];
  predictiveLifecycles?: PredictiveLifecycleItem[];
  blockchainRegistry?: BlockchainNationalRegistryRecord;
  avmAnalysis?: DynamicAVMAnalysis;
  legalAudits?: LegalComplianceAuditItem[];
}

export type NotificationType =
  | "HIGH_RISK_FINDING"
  | "DEADLINE_APPROACHING"
  | "OVERDUE_ACTION"
  | "SBC_COMPLIANCE_ALERT"
  | "SYSTEM";

export type NotificationSeverity = "critical" | "warning" | "info";

export interface AppNotification {
  id: string;
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  titleArabic: string;
  message: string;
  messageArabic: string;
  timestamp: string;
  read: boolean;
  assetId: string;
  assetName: string;
  assetNameArabic: string;
  targetTab: "findings" | "actions" | "passport" | "coverage";
  targetFindingId?: number;
  targetActionId?: string;
  metadata?: {
    findingType?: DefectType;
    severityLevel?: SeverityLevel;
    sbcClause?: string;
    confidence?: number;
    hoursRemaining?: number;
    valueAtRiskSar?: number;
    area?: string;
    assignee?: string;
  };
}
