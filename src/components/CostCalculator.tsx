import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Package,
  Layers,
  HelpCircle,
  FileSpreadsheet,
  PieChart,
} from 'lucide-react';
import { CalculationResult, CostingState, FormulationState } from '../types/perfume';
import { CURRENCY_OPTIONS } from '../data/presets';
import { calculatePerfumeCosting, formatNum } from '../utils/calculations';

interface CostCalculatorProps {
  formulation: FormulationState;
  calculationResult: CalculationResult;
}

export const CostCalculator: React.FC<CostCalculatorProps> = ({
  formulation,
  calculationResult,
}) => {
  const [costing, setCosting] = useState<CostingState>({
    oilCostPerKg: 650, // default SAR per kg for premium French/Oriental oil
    alcoholCostPerLiter: 35, // default SAR per liter
    bottleUnitCost: 18, // bottle + atomizer + cap
    packagingUnitCost: 12, // luxury outer box + cellophane + labels
    laborAndOverheadPerUnit: 6, // labor & blending
    batchSize: 50, // default batch of 50 bottles
    targetMarginPercent: 80, // 80% markup
    currency: 'SAR',
  });

  const costResult = calculatePerfumeCosting(calculationResult, costing);

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-stone-200/80 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-luxury">
          حاسبة التكاليف الصناعية وهوامش الأرباح والتسعير
        </h2>
        <p className="text-stone-500 text-sm mt-1">
          احسب التكلفة المباشرة للزجاجة والكرتونة، وحدد سعر الجملة وسعر البيع المقترح للمستهلك مع هوامش أرباح التشغيلة.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cost Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-700" />
                <span>تكاليف المواد الأولية والتعبئة</span>
              </span>
              <div className="flex items-center gap-1">
                <label className="text-xs text-stone-500">العملة:</label>
                <select
                  value={costing.currency}
                  onChange={(e) =>
                    setCosting((prev) => ({ ...prev, currency: e.target.value }))
                  }
                  className="px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-semibold text-stone-800"
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Fragrance Oil Cost */}
              <div>
                <label className="text-xs font-medium text-stone-700 mb-1 block">
                  سعر الزيت العطري الخام ({costing.currency} / كجم)
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={costing.oilCostPerKg}
                  onChange={(e) =>
                    setCosting((prev) => ({
                      ...prev,
                      oilCostPerKg: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm font-mono-numbers text-stone-900 focus:outline-none focus:border-amber-700"
                />
                <span className="text-[10px] text-stone-400">
                  (الكيلو = 1,000 جرام)
                </span>
              </div>

              {/* Alcohol Cost */}
              <div>
                <label className="text-xs font-medium text-stone-700 mb-1 block">
                  سعر الكحول الإيثيلي ({costing.currency} / لتر)
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={costing.alcoholCostPerLiter}
                  onChange={(e) =>
                    setCosting((prev) => ({
                      ...prev,
                      alcoholCostPerLiter: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm font-mono-numbers text-stone-900 focus:outline-none focus:border-amber-700"
                />
                <span className="text-[10px] text-stone-400">
                  (اللتر = 1,000 مل)
                </span>
              </div>

              {/* Bottle & Atomizer */}
              <div>
                <label className="text-xs font-medium text-stone-700 mb-1 block">
                  تكلفة الزجاجة + البخاخ + الغطاء ({costing.currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={costing.bottleUnitCost}
                  onChange={(e) =>
                    setCosting((prev) => ({
                      ...prev,
                      bottleUnitCost: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm font-mono-numbers text-stone-900 focus:outline-none focus:border-amber-700"
                />
              </div>

              {/* Outer Box & Packaging */}
              <div>
                <label className="text-xs font-medium text-stone-700 mb-1 block">
                  تكلفة العلبة الفاخرة والملصقات ({costing.currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={costing.packagingUnitCost}
                  onChange={(e) =>
                    setCosting((prev) => ({
                      ...prev,
                      packagingUnitCost: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm font-mono-numbers text-stone-900 focus:outline-none focus:border-amber-700"
                />
              </div>

              {/* Labor & Overhead */}
              <div>
                <label className="text-xs font-medium text-stone-700 mb-1 block">
                  مصاريف التشغيل والخلط لكل زجاجة ({costing.currency})
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={costing.laborAndOverheadPerUnit}
                  onChange={(e) =>
                    setCosting((prev) => ({
                      ...prev,
                      laborAndOverheadPerUnit: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm font-mono-numbers text-stone-900 focus:outline-none focus:border-amber-700"
                />
              </div>

              {/* Batch Size */}
              <div>
                <label className="text-xs font-medium text-stone-700 mb-1 block">
                  حجم دفعة الإنتاج (عدد الزجاجات)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  step="10"
                  value={costing.batchSize}
                  onChange={(e) =>
                    setCosting((prev) => ({
                      ...prev,
                      batchSize: Math.max(1, parseInt(e.target.value) || 1),
                    }))
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm font-mono-numbers text-stone-900 focus:outline-none focus:border-amber-700"
                />
              </div>
            </div>

            {/* Profit Margin Slider */}
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-stone-800">
                  هامش الربح المستهدف للتجزئة (Retail Markup Margin)
                </span>
                <span className="font-mono-numbers font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded">
                  {costing.targetMarginPercent}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="5"
                value={costing.targetMarginPercent}
                onChange={(e) =>
                  setCosting((prev) => ({
                    ...prev,
                    targetMarginPercent: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-amber-800 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-mono-numbers">
                <span>30% (اقتصادي)</span>
                <span>80% (متوسط تجاري)</span>
                <span>150% (براند نيش فاخر)</span>
                <span>300% (حصري)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Pricing & ROI Dashboard */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-md space-y-6">
            <div className="border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                مؤشرات التسعير والأرباح للزجاجة ({formulation.bottleVolumeMl} مل)
              </span>
              <h3 className="text-lg font-bold text-stone-950 mt-0.5">
                تكلفة الإنتاج: {formatNum(costResult.totalCostPerBottle)} {costing.currency}
              </h3>
            </div>

            {/* Breakdown per Bottle */}
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-stone-700">
                تفاصيل تكلفة الزجاجة الواحدة:
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1.5 border-b border-stone-100 text-stone-600">
                  <span>الزيت العطري ({formatNum(calculationResult.oilWeightGrams)} جم)</span>
                  <span className="font-mono-numbers font-medium text-stone-900">
                    {formatNum(costResult.oilCostPerBottle)} {costing.currency}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100 text-stone-600">
                  <span>الكحول والمذيبات ({formatNum(calculationResult.alcoholVolumeMl)} مل)</span>
                  <span className="font-mono-numbers font-medium text-stone-900">
                    {formatNum(costResult.alcoholCostPerBottle)} {costing.currency}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100 text-stone-600">
                  <span>الزجاجة والعلبة والتغليف</span>
                  <span className="font-mono-numbers font-medium text-stone-900">
                    {formatNum(costResult.packagingCostPerBottle)} {costing.currency}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-stone-100 text-stone-600">
                  <span>المصاريف التشغيلية والعمالة</span>
                  <span className="font-mono-numbers font-medium text-stone-900">
                    {formatNum(costResult.laborCostPerBottle)} {costing.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Recommended Pricing Targets */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                <span className="text-[11px] text-stone-500 font-medium block">سعر الجملة المقترح</span>
                <div className="text-base font-extrabold text-stone-900 font-mono-numbers">
                  {formatNum(costResult.suggestedWholesalePrice)} {costing.currency}
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <span className="text-[11px] text-amber-900 font-medium block">سعر التجزئة المقترح (RRP)</span>
                <div className="text-lg font-extrabold text-amber-950 font-mono-numbers">
                  {formatNum(costResult.suggestedRetailPrice)} {costing.currency}
                </div>
                <div className="text-[10px] text-amber-700">
                  صافي الربح: +{formatNum(costResult.profitPerBottleRetail)} {costing.currency}
                </div>
              </div>
            </div>

            {/* Batch Totals Summary */}
            <div className="p-4 bg-stone-900 text-white rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-800">
                <span className="text-stone-300 font-medium">
                  عوائد التشغيلة الإجمالية ({costing.batchSize} عبوة):
                </span>
                <span className="text-amber-400 font-mono-numbers font-bold">
                  +{costing.targetMarginPercent}% ربح
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-[10px] text-stone-400">رأس المال المطلوب</div>
                  <div className="text-xs sm:text-sm font-bold font-mono-numbers text-stone-200 mt-0.5">
                    {formatNum(costResult.totalBatchCost)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400">إجمالي المبيعات</div>
                  <div className="text-xs sm:text-sm font-bold font-mono-numbers text-white mt-0.5">
                    {formatNum(costResult.totalBatchRevenueRetail)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-amber-400">صافي الأرباح</div>
                  <div className="text-xs sm:text-sm font-bold font-mono-numbers text-amber-400 mt-0.5">
                    +{formatNum(costResult.totalBatchProfitRetail)}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
