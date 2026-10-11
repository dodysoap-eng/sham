export type ConcentrationType =
  | 'extrait'
  | 'edp'
  | 'edt'
  | 'edc'
  | 'mist'
  | 'oil_pure'
  | 'custom';

export interface ConcentrationPreset {
  id: ConcentrationType;
  nameAr: string;
  nameEn: string;
  defaultPercentage: number;
  minPercentage: number;
  maxPercentage: number;
  descriptionAr: string;
  longevity: string;
}

export interface FormulationState {
  bottleVolumeMl: number;
  batchCount: number;
  concentrationPercent: number;
  concentrationType: ConcentrationType;
  alcoholPercentage: number; // e.g. 96 for 96% ethanol
  waterPercent: number; // 0 to 5%
  fixativePercent: number; // 0 to 5%
  oilDensity: number; // g/ml, default ~0.92
  alcoholDensity: number; // g/ml, default ~0.80
  unitMode: 'ml' | 'grams';
}

export interface CalculationResult {
  oilVolumeMl: number;
  oilWeightGrams: number;
  oilPercent: number;
  
  alcoholVolumeMl: number;
  alcoholWeightGrams: number;
  alcoholPercent: number;
  
  waterVolumeMl: number;
  waterWeightGrams: number;
  waterPercent: number;
  
  fixativeVolumeMl: number;
  fixativeWeightGrams: number;
  fixativePercent: number;
  
  totalVolumeMl: number;
  totalWeightGrams: number;
  
  batchTotalVolumeMl: number;
  batchTotalOilGrams: number;
  batchTotalAlcoholGrams: number;
}

export interface PyramidNote {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'top' | 'heart' | 'base';
  percentageOfOil: number; // percentage of the oil phase (must sum to 100)
  description?: string;
  volatilityRate?: string; // e.g. 'سريع جداً (1-15 دقيقة)'
  volatilityRank?: number; // 1 (أسرع تطايراً) إلى 10 (الأعلى ثباتاً)
  qualityGrade?: string; // e.g. 'درجة فاخرة A+', 'نقي طبيعي 100%'
  scentFamily?: string; // e.g. 'حمضيات', 'زهور', 'أخشاب'
  evaporationTime?: string;
  diffusionRadius?: string;
}

export interface SavedFormula {
  id: string;
  title: string;
  author: string;
  dateCreated: string;
  batchCode: string;
  notes: string;
  macerationDays: number;
  formulation: FormulationState;
  pyramidNotes: PyramidNote[];
}

export interface CostingState {
  oilCostPerKg: number; // in user currency (e.g. SAR / USD / AED / EGP)
  alcoholCostPerLiter: number;
  bottleUnitCost: number; // bottle + atomizer + cap
  packagingUnitCost: number; // box, seal, label
  laborAndOverheadPerUnit: number;
  batchSize: number;
  targetMarginPercent: number; // e.g. 60%
  currency: string;
}

export interface CostingResult {
  oilCostPerBottle: number;
  alcoholCostPerBottle: number;
  packagingCostPerBottle: number;
  laborCostPerBottle: number;
  totalCostPerBottle: number;
  
  suggestedWholesalePrice: number;
  suggestedRetailPrice: number;
  profitPerBottleRetail: number;
  
  totalBatchCost: number;
  totalBatchRevenueRetail: number;
  totalBatchProfitRetail: number;
}
