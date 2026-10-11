import React, { useState } from 'react';
import {
  Beaker,
  Scale,
  Sparkles,
  Droplets,
  Layers,
  HelpCircle,
  BookmarkPlus,
  DollarSign,
  Info,
  Check,
} from 'lucide-react';
import {
  CalculationResult,
  ConcentrationType,
  FormulationState,
  SavedFormula,
} from '../types/perfume';
import {
  BOTTLE_SIZE_PRESETS,
  CONCENTRATION_PRESETS,
} from '../data/presets';
import { formatNum } from '../utils/calculations';

interface ConcentrationCalculatorProps {
  formulation: FormulationState;
  setFormulation: React.Dispatch<React.SetStateAction<FormulationState>>;
  result: CalculationResult;
  onSaveFormula: () => void;
  onSendToCosting: () => void;
}

export const ConcentrationCalculator: React.FC<ConcentrationCalculatorProps> = ({
  formulation,
  setFormulation,
  result,
  onSaveFormula,
  onSendToCosting,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Update handlers
  const handleBottleSizeSelect = (ml: number) => {
    setFormulation((prev) => ({ ...prev, bottleVolumeMl: ml }));
  };

  const handleConcentrationTypeSelect = (preset: (typeof CONCENTRATION_PRESETS)[0]) => {
    setFormulation((prev) => ({
      ...prev,
      concentrationType: preset.id,
      concentrationPercent: preset.defaultPercentage,
    }));
  };

  const currentPreset = CONCENTRATION_PRESETS.find(
    (p) => p.id === formulation.concentrationType
  );

  const copyRecipeToClipboard = () => {
    const text = `📌 تركيبة عطرية - معيار
الحجم: ${formulation.bottleVolumeMl} مل | التركيز: ${formulation.concentrationPercent}%
الزيت العطري: ${formatNum(result.oilWeightGrams)} جم (${formatNum(result.oilVolumeMl)} مل)
الكحول الإيثيلي: ${formatNum(result.alcoholWeightGrams)} جم (${formatNum(result.alcoholVolumeMl)} مل)
${result.waterVolumeMl > 0 ? `الماء المقطر: ${formatNum(result.waterWeightGrams)} جم (${formatNum(result.waterVolumeMl)} مل)\n` : ''}${result.fixativeVolumeMl > 0 ? `المثبت: ${formatNum(result.fixativeWeightGrams)} جم (${formatNum(result.fixativeVolumeMl)} مل)\n` : ''}الوزن الإجمالي للزجاجة: ${formatNum(result.totalWeightGrams)} جم`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-stone-200/80 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-luxury">
          حاسبة نسب التركيز وتعبئة الزجاجات
        </h2>
        <p className="text-stone-500 text-sm mt-1">
          حدد حجم الزجاجة ودرجة التركيز المطلوبة للحصول على المقادير الدقيقة بالجرامات والمليلترات مع مراعاة الكثافة النوعية.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Bottle Size Selection */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <Beaker className="w-4 h-4 text-amber-700" />
                <span>حجم زجاجة العطر</span>
              </label>
              <div className="text-xs text-stone-500">
                الحجم الحالي: <span className="font-bold text-stone-900 font-mono-numbers">{formulation.bottleVolumeMl} ml</span>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {BOTTLE_SIZE_PRESETS.map((preset) => (
                <button
                  key={preset.ml}
                  type="button"
                  onClick={() => handleBottleSizeSelect(preset.ml)}
                  className={`py-2 px-1 text-center rounded-lg text-xs font-medium transition-all ${
                    formulation.bottleVolumeMl === preset.ml
                      ? 'bg-stone-900 text-white font-semibold shadow-xs'
                      : 'bg-stone-50 text-stone-700 border border-stone-200/60 hover:bg-stone-100'
                  }`}
                >
                  <div className="font-mono-numbers font-bold text-sm">{preset.ml}</div>
                  <div className="text-[10px] opacity-75">مللي</div>
                </button>
              ))}
            </div>

            {/* Custom Volume & Batch Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 block">
                  حجم مخصص (مل)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  step="1"
                  value={formulation.bottleVolumeMl}
                  onChange={(e) =>
                    setFormulation((prev) => ({
                      ...prev,
                      bottleVolumeMl: Math.max(1, parseFloat(e.target.value) || 1),
                    }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 font-mono-numbers focus:outline-none focus:border-amber-700"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-stone-600 mb-1 block">
                  عدد العبوات في التشغيلة (Batch Count)
                </label>
                <input
                  type="number"
                  min="1"
                  max="50000"
                  step="1"
                  value={formulation.batchCount}
                  onChange={(e) =>
                    setFormulation((prev) => ({
                      ...prev,
                      batchCount: Math.max(1, parseInt(e.target.value) || 1),
                    }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 font-mono-numbers focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>
          </div>

          {/* 2. Concentration Preset Selection */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-700" />
                <span>مستوى تركيز العطر القياسي</span>
              </label>
              <span className="text-xs font-mono-numbers font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded">
                {formulation.concentrationPercent}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CONCENTRATION_PRESETS.map((preset) => {
                const isSelected = formulation.concentrationType === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleConcentrationTypeSelect(preset)}
                    className={`p-3 text-right rounded-lg border text-xs transition-all ${
                      isSelected
                        ? 'border-amber-800 bg-amber-50/50 shadow-xs'
                        : 'border-stone-200 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900">{preset.nameAr}</span>
                      <span className="font-mono-numbers text-stone-600 font-medium">{preset.defaultPercentage}%</span>
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                      الثبات: {preset.longevity}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Slider for Fine Adjustment */}
            <div className="pt-2 space-y-2">
              <div className="flex justify-between items-center text-xs text-stone-600">
                <span>تعديل نسبة الزيت الخام بدقة:</span>
                <span className="font-mono-numbers font-bold text-stone-900">
                  {formulation.concentrationPercent}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="0.5"
                value={formulation.concentrationPercent}
                onChange={(e) =>
                  setFormulation((prev) => ({
                    ...prev,
                    concentrationType: 'custom',
                    concentrationPercent: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-amber-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono-numbers">
                <span>1% (مخفف جداً)</span>
                <span>20% (EDP)</span>
                <span>35% (Extrait)</span>
                <span>100% (زيت خام)</span>
              </div>
            </div>

            {currentPreset && (
              <div className="p-3 bg-stone-50 rounded-lg text-xs text-stone-600 leading-relaxed border border-stone-200/50">
                <span className="font-semibold text-stone-800">وصف التركيز: </span>
                {currentPreset.descriptionAr}
              </div>
            )}
          </div>

          {/* 3. Advanced Ingredients Fine-Tuning */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-sm font-semibold text-stone-900 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-700" />
                <span>إعدادات متقدمة (الكثافة، الماء المقطر، المثبتات)</span>
              </div>
              <span className="text-xs text-amber-800">
                {showAdvanced ? 'إخفاء الإعدادات ▲' : 'تخصيص الإعدادات ▼'}
              </span>
            </button>

            {showAdvanced && (
              <div className="pt-3 border-t border-stone-100 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Water Percentage */}
                  <div>
                    <label className="text-xs font-medium text-stone-700 flex justify-between">
                      <span>ماء مقطر (Distilled Water)</span>
                      <span className="font-mono-numbers text-stone-900">{formulation.waterPercent}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={formulation.waterPercent}
                      onChange={(e) =>
                        setFormulation((prev) => ({
                          ...prev,
                          waterPercent: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-amber-800 cursor-pointer mt-1"
                    />
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      يُفضل 0% إلى 2% في العطور الزيتية والكحولية لمنع التعكر.
                    </p>
                  </div>

                  {/* Fixatives Percentage */}
                  <div>
                    <label className="text-xs font-medium text-stone-700 flex justify-between">
                      <span>مثبت عطري (DPG / IPM / Iso E Super)</span>
                      <span className="font-mono-numbers text-stone-900">{formulation.fixativePercent}%</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={formulation.fixativePercent}
                      onChange={(e) =>
                        setFormulation((prev) => ({
                          ...prev,
                          fixativePercent: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full accent-amber-800 cursor-pointer mt-1"
                    />
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      النسبة النموذجية 0.5% إلى 2% لإبطاء تبخر النوتات الخفيفة.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Oil Density */}
                  <div>
                    <label className="text-xs font-medium text-stone-700 mb-1 block">
                      كثافة الزيت العطري (g/ml)
                    </label>
                    <input
                      type="number"
                      min="0.80"
                      max="1.10"
                      step="0.01"
                      value={formulation.oilDensity}
                      onChange={(e) =>
                        setFormulation((prev) => ({
                          ...prev,
                          oilDensity: parseFloat(e.target.value) || 0.92,
                        }))
                      }
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono-numbers text-stone-900"
                    />
                    <span className="text-[10px] text-stone-400">المتوسط: 0.92 جم/مل للزيوت الفرنسية والشرقية</span>
                  </div>

                  {/* Alcohol Density */}
                  <div>
                    <label className="text-xs font-medium text-stone-700 mb-1 block">
                      كثافة الكحول الإيثيلي (g/ml)
                    </label>
                    <input
                      type="number"
                      min="0.75"
                      max="0.85"
                      step="0.01"
                      value={formulation.alcoholDensity}
                      onChange={(e) =>
                        setFormulation((prev) => ({
                          ...prev,
                          alcoholDensity: parseFloat(e.target.value) || 0.80,
                        }))
                      }
                      className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono-numbers text-stone-900"
                    />
                    <span className="text-[10px] text-stone-400">الكحول 96% كثافته تقريباً 0.80 جم/مل</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Live Results & Spec Card */}
        <div className="lg:col-span-5 space-y-6">

          {/* Results Summary Box */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-md space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-stone-950 text-base">
                  نتائج ومقادير الخلط الدقيقة
                </h3>
                <div className="text-xs text-stone-500 mt-0.5">
                  عبوة {formulation.bottleVolumeMl} مل · تركيز {formulation.concentrationPercent}%
                </div>
              </div>
              <button
                type="button"
                onClick={copyRecipeToClipboard}
                className="px-3 py-1.5 text-xs text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                <span>{copiedSummary ? 'تم النسخ' : 'نسخ المقادير'}</span>
              </button>
            </div>

            {/* Visual Ingredient Breakdown Ratio Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-stone-600">
                <span>توزيع المكونات في الزجاجة</span>
                <span className="font-mono-numbers font-bold text-stone-900">100%</span>
              </div>
              <div className="h-4 rounded-full overflow-hidden flex bg-stone-100 p-0.5 border border-stone-200">
                <div
                  style={{ width: `${result.oilPercent}%` }}
                  className="bg-amber-600 h-full rounded-r-full transition-all"
                  title={`زيت عطري: ${result.oilPercent}%`}
                />
                <div
                  style={{ width: `${result.alcoholPercent}%` }}
                  className="bg-stone-400 h-full transition-all"
                  title={`كحول: ${result.alcoholPercent}%`}
                />
                {result.waterPercent > 0 && (
                  <div
                    style={{ width: `${result.waterPercent}%` }}
                    className="bg-sky-400 h-full transition-all"
                    title={`ماء مقطر: ${result.waterPercent}%`}
                  />
                )}
                {result.fixativePercent > 0 && (
                  <div
                    style={{ width: `${result.fixativePercent}%` }}
                    className="bg-emerald-600 h-full rounded-l-full transition-all"
                    title={`مثبت: ${result.fixativePercent}%`}
                  />
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-stone-500 pt-1">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-600 inline-block" />
                  زيت عطري ({formatNum(result.oilPercent, 1)}%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-stone-400 inline-block" />
                  كحول ({formatNum(result.alcoholPercent, 1)}%)
                </span>
                {result.waterPercent > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-sky-400 inline-block" />
                    ماء ({formatNum(result.waterPercent, 1)}%)
                  </span>
                )}
                {result.fixativePercent > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block" />
                    مثبت ({formatNum(result.fixativePercent, 1)}%)
                  </span>
                )}
              </div>
            </div>

            {/* Detailed Ingredients Table */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-semibold text-stone-900">
                المقادير للزجاجة الواحدة ({formulation.bottleVolumeMl} مل):
              </div>
              <div className="divide-y divide-stone-100 border border-stone-200/70 rounded-xl overflow-hidden bg-stone-50/50">
                
                {/* 1. Fragrance Oil */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-600" />
                      الزيت العطري الخام
                    </div>
                    <div className="text-[11px] text-stone-500">
                      بالمخبار: <span className="font-mono-numbers">{formatNum(result.oilVolumeMl)} مل</span>
                    </div>
                  </div>
                  <div className="text-left font-mono-numbers">
                    <div className="text-base font-bold text-amber-900">
                      {formatNum(result.oilWeightGrams)} g
                    </div>
                    <div className="text-[10px] text-stone-400">وزن الميزان</div>
                  </div>
                </div>

                {/* 2. Ethanol Alcohol */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-stone-400" />
                      الكحول الإيثيلي (Ethanol)
                    </div>
                    <div className="text-[11px] text-stone-500">
                      بالمخبار: <span className="font-mono-numbers">{formatNum(result.alcoholVolumeMl)} مل</span>
                    </div>
                  </div>
                  <div className="text-left font-mono-numbers">
                    <div className="text-base font-bold text-stone-900">
                      {formatNum(result.alcoholWeightGrams)} g
                    </div>
                    <div className="text-[10px] text-stone-400">وزن الميزان</div>
                  </div>
                </div>

                {/* 3. Distilled Water (if any) */}
                {result.waterPercent > 0 && (
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        ماء مقطر نقي
                      </div>
                      <div className="text-[11px] text-stone-500">
                        الحجم: <span className="font-mono-numbers">{formatNum(result.waterVolumeMl)} مل</span>
                      </div>
                    </div>
                    <div className="text-left font-mono-numbers">
                      <div className="text-sm font-bold text-sky-900">
                        {formatNum(result.waterWeightGrams)} g
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Fixative (if any) */}
                {result.fixativePercent > 0 && (
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        مثبت عطري (DPG/IPM)
                      </div>
                      <div className="text-[11px] text-stone-500">
                        الحجم: <span className="font-mono-numbers">{formatNum(result.fixativeVolumeMl)} مل</span>
                      </div>
                    </div>
                    <div className="text-left font-mono-numbers">
                      <div className="text-sm font-bold text-emerald-900">
                        {formatNum(result.fixativeWeightGrams)} g
                      </div>
                    </div>
                  </div>
                )}

                {/* Total Row */}
                <div className="p-3.5 bg-stone-100/80 flex items-center justify-between">
                  <div className="text-xs font-bold text-stone-900">
                    الوزن الصافي الإجمالي للعطر
                  </div>
                  <div className="text-left font-mono-numbers">
                    <div className="text-base font-extrabold text-stone-900">
                      {formatNum(result.totalWeightGrams)} g
                    </div>
                    <div className="text-[10px] text-stone-500">
                      الحجم: {result.totalVolumeMl} مل
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Batch Production Totals (if batchCount > 1) */}
            {formulation.batchCount > 1 && (
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">
                    إجمالي إنتاج التشغيلة ({formulation.batchCount} عبوة):
                  </span>
                  <span className="text-xs font-mono-numbers font-semibold text-amber-900">
                    {formatNum(result.batchTotalVolumeMl / 1000, 2)} لتر
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="bg-white p-2.5 rounded-lg border border-amber-100">
                    <span className="text-stone-500 block text-[11px]">إجمالي الزيت العطري:</span>
                    <span className="font-mono-numbers font-bold text-amber-900 text-sm">
                      {result.batchTotalOilGrams >= 1000
                        ? `${formatNum(result.batchTotalOilGrams / 1000, 3)} كجم`
                        : `${formatNum(result.batchTotalOilGrams)} جم`}
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-amber-100">
                    <span className="text-stone-500 block text-[11px]">إجمالي الكحول الإيثيلي:</span>
                    <span className="font-mono-numbers font-bold text-stone-900 text-sm">
                      {result.batchTotalAlcoholGrams >= 1000
                        ? `${formatNum(result.batchTotalAlcoholGrams / 1000, 3)} كجم`
                        : `${formatNum(result.batchTotalAlcoholGrams)} جم`}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation & Action Buttons */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onSaveFormula}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>حفظ في الوصفات</span>
                </button>

                <button
                  type="button"
                  onClick={onSendToCosting}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>حساب التكلفة والأرباح</span>
                </button>
              </div>

              {/* Direct Bridge to Master Shahin AI */}
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent('open-ai-chat-with-prompt', {
                      detail: `ما رأيك يا شيخ شاهين في هذه التركيبة؟ الحجم ${formulation.bottleVolumeMl} مل، والتركيز ${formulation.concentrationPercent}%، وزن الزيت ${formatNum(result.oilWeightGrams)} جم، والكحول ${formatNum(result.alcoholWeightGrams)} جم. هل تنصح بتعديل المثبت أو النوتات؟`,
                    })
                  );
                }}
                className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>استشارة الخبير شاهين AI حول هذه التركيبة 🧪</span>
              </button>
            </div>

          </div>

          {/* Quick Laboratory Note */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/70 text-xs text-stone-600 space-y-2">
            <div className="font-semibold text-stone-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>نصيحة المعمل الذهبية:</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              استخدام الميزان الرقمي بالغرام أدق بكثير من المخبار المدرج بالمليلتر، لأن الزيوت العطرية تختلف في كثافتها ولزوجتها وتلتصق بجدران الأنابيب الزجاجية.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
