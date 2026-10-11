import React from 'react';
import { Printer, X, CheckCircle, Calendar, Hash, User, ShieldCheck } from 'lucide-react';
import {
  CalculationResult,
  FormulationState,
  PyramidNote,
  SavedFormula,
} from '../types/perfume';
import { calculatePyramidBreakdown, formatNum } from '../utils/calculations';

import { UserDetailedAddress, FACILITY_TYPE_LABELS } from '../types/address';

interface ManufacturingSpecSheetProps {
  formulaTitle: string;
  author: string;
  batchCode: string;
  notes: string;
  macerationDays: number;
  formulation: FormulationState;
  pyramidNotes: PyramidNote[];
  calculationResult: CalculationResult;
  detailedAddress?: UserDetailedAddress;
  onClose: () => void;
}

export const ManufacturingSpecSheet: React.FC<ManufacturingSpecSheetProps> = ({
  formulaTitle,
  author,
  batchCode,
  notes,
  macerationDays,
  formulation,
  pyramidNotes,
  calculationResult,
  detailedAddress,
  onClose,
}) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const targetDate = new Date(Date.now() + macerationDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  const breakdown = calculatePyramidBreakdown(
    pyramidNotes,
    calculationResult.oilWeightGrams,
    calculationResult.oilVolumeMl
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900 print:border-none print:shadow-none print:rounded-none">
        
        {/* Top Modal Controls (Hidden in Print) */}
        <div className="p-4 bg-stone-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-sm font-bold">بطاقة مواصفات تصنيع العطر الرسمية (Manufacturing Batch Spec)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة المستند (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-10 space-y-8 bg-white print:p-0">
          
          {/* Header Brand Lockup */}
          <div className="flex justify-between items-start border-b-2 border-stone-900 pb-6">
            <div>
              <div className="text-2xl font-bold tracking-tight text-stone-950 font-serif-luxury">
                صمم عطرك مع شام · مختبر وحاسبة العطور
              </div>
              <div className="text-xs text-stone-500 mt-1">
                وثيقة تصنيع وتشغيلة إنتاج عطرية معتمدة وفق معايير الجودة والتعتيق
              </div>
            </div>
            <div className="text-left font-mono-numbers text-xs space-y-1">
              <div>
                <span className="text-stone-400">رقم التشغيلة: </span>
                <span className="font-bold text-stone-900">{batchCode || 'SHAM-BATCH-01'}</span>
              </div>
              <div>
                <span className="text-stone-400">تاريخ الإصدار: </span>
                <span>{currentDate}</span>
              </div>
              <div>
                <span className="text-stone-400">اكتمال التعتيق: </span>
                <span className="font-semibold text-amber-900">{targetDate} ({macerationDays} يوم)</span>
              </div>
            </div>
          </div>

          {/* Perfume Identity Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px]">اسم العطر</span>
              <span className="font-bold text-stone-900 text-sm">{formulaTitle || 'عطر مخصص'}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px]">مصمم العطر / المعمل</span>
              <span className="font-semibold text-stone-900">{author || 'معمل شام'}</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px]">حجم الزجاجة والكمية</span>
              <span className="font-semibold text-stone-900 font-mono-numbers">
                {formulation.bottleVolumeMl} مل × {formulation.batchCount} عبوة
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[10px]">فئة التركيز</span>
              <span className="font-bold text-amber-900 font-mono-numbers">
                {formulation.concentrationPercent}% ({formulation.concentrationType.toUpperCase()})
              </span>
            </div>
          </div>

          {/* Perfume Atelier Facility & Detailed Address Lockup */}
          {detailedAddress && (
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/80 text-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">📍</span>
                <span className="font-bold text-stone-900">
                  {detailedAddress.labOrFacilityName || 'مقر المعمل العطري'}:
                </span>
                <span className="text-stone-600">
                  {detailedAddress.city}
                  {detailedAddress.district ? `، ${detailedAddress.district}` : ''}
                  {detailedAddress.street ? `، ${detailedAddress.street}` : ''}
                  {` — ${detailedAddress.countryNameAr}`}
                </span>
              </div>
              <div className="flex items-center gap-3 text-stone-500 font-mono text-[11px]">
                {detailedAddress.postalCode && (
                  <span>الرمز البريدي: {detailedAddress.postalCode}</span>
                )}
                {detailedAddress.phoneNumber && (
                  <span>الهاتف: {detailedAddress.phoneNumber}</span>
                )}
              </div>
            </div>
          )}

          {/* Primary Formula Breakdown Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              1. جدول المقادير الكيميائية الأساسية (Formulation Breakdown)
            </h4>
            <div className="border border-stone-200 rounded-xl overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-4">المكون الكيميائي</th>
                    <th className="py-2.5 px-4">النسبة المئوية</th>
                    <th className="py-2.5 px-4 font-mono-numbers">الوزن للعبوة (جم)</th>
                    <th className="py-2.5 px-4 font-mono-numbers">الحجم للعبوة (مل)</th>
                    <th className="py-2.5 px-4 font-mono-numbers">إجمالي التشغيلة ({formulation.batchCount})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono-numbers">
                  <tr>
                    <td className="py-2.5 px-4 font-sans font-medium text-stone-900">
                      مركب الزيت العطري الخام (Fragrance Oil)
                    </td>
                    <td className="py-2.5 px-4">{formatNum(calculationResult.oilPercent, 1)}%</td>
                    <td className="py-2.5 px-4 font-bold text-amber-900">{formatNum(calculationResult.oilWeightGrams)} g</td>
                    <td className="py-2.5 px-4">{formatNum(calculationResult.oilVolumeMl)} ml</td>
                    <td className="py-2.5 px-4 font-bold">{formatNum(calculationResult.batchTotalOilGrams)} g</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-4 font-sans font-medium text-stone-900">
                      الكحول الإيثيلي الطبي (Ethanol Alcohol)
                    </td>
                    <td className="py-2.5 px-4">{formatNum(calculationResult.alcoholPercent, 1)}%</td>
                    <td className="py-2.5 px-4 font-bold">{formatNum(calculationResult.alcoholWeightGrams)} g</td>
                    <td className="py-2.5 px-4">{formatNum(calculationResult.alcoholVolumeMl)} ml</td>
                    <td className="py-2.5 px-4 font-bold">{formatNum(calculationResult.batchTotalAlcoholGrams)} g</td>
                  </tr>
                  {calculationResult.waterPercent > 0 && (
                    <tr>
                      <td className="py-2.5 px-4 font-sans font-medium text-stone-900">
                        ماء مقطر نقي (Pure Distilled Water)
                      </td>
                      <td className="py-2.5 px-4">{formatNum(calculationResult.waterPercent, 1)}%</td>
                      <td className="py-2.5 px-4">{formatNum(calculationResult.waterWeightGrams)} g</td>
                      <td className="py-2.5 px-4">{formatNum(calculationResult.waterVolumeMl)} ml</td>
                      <td className="py-2.5 px-4 font-bold">{formatNum(calculationResult.waterWeightGrams * formulation.batchCount)} g</td>
                    </tr>
                  )}
                  {calculationResult.fixativePercent > 0 && (
                    <tr>
                      <td className="py-2.5 px-4 font-sans font-medium text-stone-900">
                        مثبت عطري (DPG / IPM / Iso E Super)
                      </td>
                      <td className="py-2.5 px-4">{formatNum(calculationResult.fixativePercent, 1)}%</td>
                      <td className="py-2.5 px-4">{formatNum(calculationResult.fixativeWeightGrams)} g</td>
                      <td className="py-2.5 px-4">{formatNum(calculationResult.fixativeVolumeMl)} ml</td>
                      <td className="py-2.5 px-4 font-bold">{formatNum(calculationResult.fixativeWeightGrams * formulation.batchCount)} g</td>
                    </tr>
                  )}
                  <tr className="bg-stone-50/80 font-bold text-stone-950">
                    <td className="py-3 px-4 font-sans">الصافي الإجمالي للعبوة</td>
                    <td className="py-3 px-4">100%</td>
                    <td className="py-3 px-4">{formatNum(calculationResult.totalWeightGrams)} g</td>
                    <td className="py-3 px-4">{calculationResult.totalVolumeMl} ml</td>
                    <td className="py-3 px-4">{formatNum(calculationResult.batchTotalVolumeMl / 1000, 2)} L</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pyramid Breakdown Table (if notes present) */}
          {breakdown.notesWithQuantities.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                2. تفاصيل وتوزيع الهرم العطري (Olfactory Notes Spec)
              </h4>
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="py-2.5 px-4">اسم النوتة / الزيت</th>
                      <th className="py-2.5 px-4">الطبقة الهرمية</th>
                      <th className="py-2.5 px-4">النسبة من الزيت</th>
                      <th className="py-2.5 px-4 font-mono-numbers">الوزن للعبوة (جم)</th>
                      <th className="py-2.5 px-4 font-mono-numbers">إجمالي التشغيلة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono-numbers">
                    {breakdown.notesWithQuantities.map((note) => (
                      <tr key={note.id}>
                        <td className="py-2.5 px-4 font-sans font-medium text-stone-900">
                          {note.nameAr}
                        </td>
                        <td className="py-2.5 px-4 font-sans text-stone-600">
                          {note.category === 'top'
                            ? 'قمة (Top)'
                            : note.category === 'heart'
                            ? 'قلب (Heart)'
                            : 'قاعدة (Base)'}
                        </td>
                        <td className="py-2.5 px-4">{note.percentageOfOil}%</td>
                        <td className="py-2.5 px-4 font-semibold text-amber-900">
                          {formatNum(note.weightGrams)} g
                        </td>
                        <td className="py-2.5 px-4 font-bold">
                          {formatNum(note.weightGrams * formulation.batchCount)} g
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Laboratory Instructions & Quality Protocols */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <span className="font-bold text-stone-900 block">بروتوكول الخلط في المعمل:</span>
              <ul className="space-y-1 list-disc list-inside text-stone-600 text-[11px] leading-relaxed">
                <li>استخدام ميزان رقمي بدقة 0.01 جرام.</li>
                <li>خلط نوتات الزيوت العطرية أولاً في درجة حرارة 20°C - 24°C.</li>
                <li>إضافة الكحول المصفى والإغلاق المحكم الفوري لمنع تبخر النوتات العلوية.</li>
                <li>ترج الزجاجة بلطف لمدة دقيقة واحدة حتى تمام التجانس.</li>
              </ul>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 space-y-2">
              <span className="font-bold text-stone-900 block">شروط التعتيق والحفظ:</span>
              <ul className="space-y-1 list-disc list-inside text-stone-600 text-[11px] leading-relaxed">
                <li>الحفظ في مكان مظلم تماماً بعيداً عن أشعة الشمس والحرارة.</li>
                <li>درجة حرارة التخزين المثالية: 15°C إلى 18°C.</li>
                <li>التعتيق المستهدف: {macerationDays} يوماً لإتمام استقرار الروابط الجزيئية.</li>
                <li>إجراء اختبار الفلترة (Filtration) قبل التعبئة النهائية عند اللزوم.</li>
              </ul>
            </div>
          </div>

          {/* Signatures Footer */}
          <div className="pt-8 border-t border-stone-200 grid grid-cols-2 gap-8 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px]">مسؤول التركيب والتصنيع:</span>
              <div className="mt-4 border-b border-stone-300 w-48" />
              <span className="text-[11px] text-stone-600 mt-1 block">التوقيع والاعتماد</span>
            </div>
            <div className="text-left">
              <span className="text-stone-400 block text-[10px]">مراقبة الجودة وفحص المعمل:</span>
              <div className="mt-4 border-b border-stone-300 w-48 mr-auto" />
              <span className="text-[11px] text-stone-600 mt-1 block">ختم التشغيلة</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
