import {
  CalculationResult,
  CostingResult,
  CostingState,
  FormulationState,
  PyramidNote,
} from '../types/perfume';

/**
 * Calculates volume and gravimetric (weight) breakdowns for a perfume batch.
 */
export function calculatePerfumeFormulation(state: FormulationState): CalculationResult {
  const {
    bottleVolumeMl,
    batchCount,
    concentrationPercent,
    waterPercent,
    fixativePercent,
    oilDensity,
    alcoholDensity,
  } = state;

  const validBatchCount = Math.max(1, batchCount || 1);
  const totalBottleMl = Math.max(1, bottleVolumeMl || 50);
  
  // Percentages in formula
  const oilPct = Math.min(100, Math.max(0, concentrationPercent));
  const waterPct = Math.min(100 - oilPct, Math.max(0, waterPercent || 0));
  const fixativePct = Math.min(100 - oilPct - waterPct, Math.max(0, fixativePercent || 0));
  const alcoholPct = Math.max(0, 100 - (oilPct + waterPct + fixativePct));

  // Volumetric (ml) calculation per bottle
  const oilVolumeMl = (totalBottleMl * oilPct) / 100;
  const alcoholVolumeMl = (totalBottleMl * alcoholPct) / 100;
  const waterVolumeMl = (totalBottleMl * waterPct) / 100;
  const fixativeVolumeMl = (totalBottleMl * fixativePct) / 100;

  // Gravimetric (grams) calculation: Mass = Volume * Density
  // Default densities: oil ~0.92 g/ml, alcohol ~0.80 g/ml, water = 1.00 g/ml, fixative ~1.03 g/ml (DPG/IPM)
  const fixativeDensity = 1.02;
  const waterDensity = 1.00;

  const oilWeightGrams = oilVolumeMl * (oilDensity || 0.92);
  const alcoholWeightGrams = alcoholVolumeMl * (alcoholDensity || 0.80);
  const waterWeightGrams = waterVolumeMl * waterDensity;
  const fixativeWeightGrams = fixativeVolumeMl * fixativeDensity;

  const totalWeightGrams = oilWeightGrams + alcoholWeightGrams + waterWeightGrams + fixativeWeightGrams;

  // Batch totals
  const batchTotalVolumeMl = totalBottleMl * validBatchCount;
  const batchTotalOilGrams = oilWeightGrams * validBatchCount;
  const batchTotalAlcoholGrams = alcoholWeightGrams * validBatchCount;

  return {
    oilVolumeMl,
    oilWeightGrams,
    oilPercent: oilPct,
    
    alcoholVolumeMl,
    alcoholWeightGrams,
    alcoholPercent: alcoholPct,
    
    waterVolumeMl,
    waterWeightGrams,
    waterPercent: waterPct,
    
    fixativeVolumeMl,
    fixativeWeightGrams,
    fixativePercent: fixativePct,
    
    totalVolumeMl: totalBottleMl,
    totalWeightGrams,
    
    batchTotalVolumeMl,
    batchTotalOilGrams,
    batchTotalAlcoholGrams,
  };
}

/**
 * Calculates the exact amount of distilled water and starting alcohol needed
 * to dilute high-proof alcohol (e.g., 96% or 99.9%) to target proof (e.g., 80% or 85%).
 * Formula: C1 * V1 = C2 * V2
 */
export function calculateAlcoholDilution(
  initialPurityPercent: number, // e.g. 96
  targetPurityPercent: number, // e.g. 80
  desiredFinalVolumeMl: number // e.g. 1000 ml
): {
  pureAlcoholVolumeNeeded: number;
  distilledWaterVolumeNeeded: number;
  dilutionFactor: number;
  isValid: boolean;
  errorMessage?: string;
} {
  if (targetPurityPercent >= initialPurityPercent) {
    return {
      pureAlcoholVolumeNeeded: 0,
      distilledWaterVolumeNeeded: 0,
      dilutionFactor: 1,
      isValid: false,
      errorMessage: 'تركيز الكحول الابتدائي يجب أن يكون أعلى من التركيز المستهدف.',
    };
  }

  if (targetPurityPercent <= 0 || initialPurityPercent <= 0 || desiredFinalVolumeMl <= 0) {
    return {
      pureAlcoholVolumeNeeded: 0,
      distilledWaterVolumeNeeded: 0,
      dilutionFactor: 1,
      isValid: false,
      errorMessage: 'يرجى إدخال قيم موجبة صالحة.',
    };
  }

  // V1 = (C2 * V2) / C1
  const pureAlcoholVolumeNeeded = (targetPurityPercent * desiredFinalVolumeMl) / initialPurityPercent;
  // Water to add (approximate volumetric due to volume contraction upon mixing water and ethanol ~2-3%)
  const distilledWaterVolumeNeeded = desiredFinalVolumeMl - pureAlcoholVolumeNeeded;
  const dilutionFactor = initialPurityPercent / targetPurityPercent;

  return {
    pureAlcoholVolumeNeeded,
    distilledWaterVolumeNeeded,
    dilutionFactor,
    isValid: true,
  };
}

/**
 * Calculates the BOM cost and profitability for a perfume product.
 */
export function calculatePerfumeCosting(
  formulation: CalculationResult,
  costing: CostingState
): CostingResult {
  const {
    oilCostPerKg,
    alcoholCostPerLiter,
    bottleUnitCost,
    packagingUnitCost,
    laborAndOverheadPerUnit,
    batchSize,
    targetMarginPercent,
  } = costing;

  const validBatchSize = Math.max(1, batchSize || 1);

  // Oil cost per bottle: (oil grams / 1000) * cost per kg
  const oilCostPerBottle = (formulation.oilWeightGrams / 1000) * (oilCostPerKg || 0);

  // Alcohol cost per bottle: (alcohol volume ml / 1000) * cost per liter
  const alcoholCostPerBottle = (formulation.alcoholVolumeMl / 1000) * (alcoholCostPerLiter || 0);

  // Total packaging: bottle + box + seal + labels
  const packagingCostPerBottle = (bottleUnitCost || 0) + (packagingUnitCost || 0);

  // Labor & overhead per bottle
  const laborCostPerBottle = laborAndOverheadPerUnit || 0;

  // Total cost per bottle
  const totalCostPerBottle =
    oilCostPerBottle + alcoholCostPerBottle + packagingCostPerBottle + laborCostPerBottle;

  // Margin calculation: Price = Cost / (1 - Margin%) OR Cost * (1 + Markup)
  // We use standard retail markup: Retail Price = TotalCost * (1 + (margin/100))
  // Wholesale Price typically markup of 35-50%
  const markupMultiplier = 1 + (targetMarginPercent || 50) / 100;
  const suggestedRetailPrice = totalCostPerBottle * markupMultiplier;
  const suggestedWholesalePrice = totalCostPerBottle * (1 + (targetMarginPercent * 0.4) / 100);

  const profitPerBottleRetail = suggestedRetailPrice - totalCostPerBottle;

  // Batch totals
  const totalBatchCost = totalCostPerBottle * validBatchSize;
  const totalBatchRevenueRetail = suggestedRetailPrice * validBatchSize;
  const totalBatchProfitRetail = profitPerBottleRetail * validBatchSize;

  return {
    oilCostPerBottle,
    alcoholCostPerBottle,
    packagingCostPerBottle,
    laborCostPerBottle,
    totalCostPerBottle,
    
    suggestedWholesalePrice,
    suggestedRetailPrice,
    profitPerBottleRetail,
    
    totalBatchCost,
    totalBatchRevenueRetail,
    totalBatchProfitRetail,
  };
}

/**
 * Calculates weight and volume for each note in the fragrance pyramid
 */
export function calculatePyramidBreakdown(
  pyramidNotes: PyramidNote[],
  totalOilWeightGrams: number,
  totalOilVolumeMl: number
): {
  notesWithQuantities: (PyramidNote & { weightGrams: number; volumeMl: number })[];
  totalPercentage: number;
  topPct: number;
  heartPct: number;
  basePct: number;
} {
  let totalPercentage = 0;
  let topPct = 0;
  let heartPct = 0;
  let basePct = 0;

  pyramidNotes.forEach((note) => {
    totalPercentage += note.percentageOfOil || 0;
    if (note.category === 'top') topPct += note.percentageOfOil || 0;
    if (note.category === 'heart') heartPct += note.percentageOfOil || 0;
    if (note.category === 'base') basePct += note.percentageOfOil || 0;
  });

  const notesWithQuantities = pyramidNotes.map((note) => {
    const fraction = (note.percentageOfOil || 0) / 100;
    return {
      ...note,
      weightGrams: totalOilWeightGrams * fraction,
      volumeMl: totalOilVolumeMl * fraction,
    };
  });

  return {
    notesWithQuantities,
    totalPercentage,
    topPct,
    heartPct,
    basePct,
  };
}

/**
 * Formats numbers gracefully with fixed decimals and tabular digits.
 */
export function formatNum(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0.00';
  return val.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
