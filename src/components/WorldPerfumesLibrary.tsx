import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Copy,
  Check,
  ArrowRight,
  Printer,
  Layers,
  Clock,
  Flame,
  Award,
  Compass,
} from 'lucide-react';
import { WORLD_PERFUMES, WorldPerfumeRecipe } from '../data/worldPerfumes';
import { FormulationState, PyramidNote } from '../types/perfume';
import { formatNum } from '../utils/calculations';

interface WorldPerfumesLibraryProps {
  onLoadWorldFormula: (recipe: WorldPerfumeRecipe) => void;
  onPrintWorldFormula: (recipe: WorldPerfumeRecipe) => void;
}

export const WorldPerfumesLibrary: React.FC<WorldPerfumesLibraryProps> = ({
  onLoadWorldFormula,
  onPrintWorldFormula,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'جميع العطور العالمية (10)' },
    { id: 'oriental', label: 'شرقي وعنبر (Oriental)' },
    { id: 'woody', label: 'خشبي وعود (Woody)' },
    { id: 'citrus', label: 'حمضيات وأروماتيك (Citrus)' },
    { id: 'gourmand', label: 'جورماند وتوابل (Gourmand)' },
    { id: 'floral', label: 'زهري وألدهيدي (Floral)' },
  ];

  const filtered = WORLD_PERFUMES.filter((perfume) => {
    const matchesSearch =
      perfume.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      perfume.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      perfume.brand.toLowerCase().includes(search.toLowerCase()) ||
      perfume.pyramidNotes.some((n) => n.nameAr.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || perfume.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopyRecipe = (recipe: WorldPerfumeRecipe) => {
    const notesText = recipe.pyramidNotes
      .map(
        (n) =>
          `• [${n.category === 'top' ? 'قمة' : n.category === 'heart' ? 'قلب' : 'قاعدة'}] ${n.nameAr}: ${n.percentageOfOil}% (${n.description || ''})`
      )
      .join('\n');

    const text = `👑 تركيبة: ${recipe.nameAr}
الدار الأصلية: ${recipe.brand} (${recipe.year})
التصنيف: ${recipe.categoryAr} | التركيز المقترح: ${recipe.targetConcentration}% (${recipe.concentrationTypeAr})
الثبات: ${recipe.longevity} | الفوحان: ${recipe.sillage}
مدة التعتيق: ${recipe.macerationDays} يوماً

🔺 توزيع الهرم العطري لمركب الزيت (100%):
${notesText}

💡 نصيحة الخبير شاهين:
${recipe.compoundingTips}`;

    navigator.clipboard.writeText(text);
    setCopiedId(recipe.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200/80 pb-5">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-amber-700" />
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-luxury">
            مكتبة أشهر التركيبات العالمية (World Iconic Perfumes)
          </h2>
        </div>
        <p className="text-stone-500 text-sm mt-1">
          الأكوردات والهياكل العطرية لأعظم العطور العالمية (بكرات روج 540، كريد أفينتوس، توم فورد توباكو فانيلا، ديور سوفاج، بلاك أفغانو...) مع نسب المكونات الدقيقة للتحميل في حاسبة المعمل بضغطة زر.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث بالاسم (مثال: بكرات روج، أفينتوس، توم فورد، زعفران...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-9 pl-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-700 shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-stone-100 rounded-xl text-xs no-scrollbar">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-stone-900 text-white font-semibold shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Famous Perfumes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filtered.map((perfume) => (
          <div
            key={perfume.id}
            className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            {/* Card Body */}
            <div className="p-6 space-y-5">
              
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-800 font-semibold mb-1">
                    <span>{perfume.brand}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-numbers">{perfume.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{perfume.categoryAr}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-stone-950 font-serif-luxury">
                    {perfume.nameAr}
                  </h3>
                  <div className="text-xs text-stone-400 font-mono-numbers mt-0.5">
                    {perfume.nameEn}
                  </div>
                </div>

                <div className="text-left shrink-0 font-mono-numbers bg-stone-50 border border-stone-200/80 p-2.5 rounded-xl">
                  <div className="text-sm font-bold text-amber-900">
                    {perfume.targetConcentration}%
                  </div>
                  <div className="text-[10px] text-stone-500">{perfume.concentrationType.toUpperCase()}</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {perfume.descriptionAr}
              </p>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-stone-50 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block">الثبات على الملابس:</span>
                  <span className="font-semibold text-stone-900">{perfume.longevity}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">قوة الفوحان:</span>
                  <span className="font-semibold text-stone-900">{perfume.sillage}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">مدة التعتيق المثالية:</span>
                  <span className="font-bold text-amber-900 font-mono-numbers">{perfume.macerationDays} يوماً</span>
                </div>
              </div>

              {/* Pyramid Breakdown Table */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-stone-900 flex items-center justify-between">
                  <span>جدول توزيع النوتات العطرية لمركب الزيت (100%):</span>
                  <span className="text-[11px] text-stone-500 font-mono-numbers">
                    {perfume.pyramidNotes.length} مكونات
                  </span>
                </div>

                <div className="border border-stone-200/80 rounded-xl overflow-hidden divide-y divide-stone-100 text-xs">
                  {perfume.pyramidNotes.map((note) => (
                    <div
                      key={note.id}
                      className="px-3.5 py-2 flex items-center justify-between hover:bg-stone-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            note.category === 'top'
                              ? 'bg-amber-500'
                              : note.category === 'heart'
                              ? 'bg-stone-600'
                              : 'bg-stone-950'
                          }`}
                        />
                        <span className="font-medium text-stone-900 truncate">
                          {note.nameAr}
                        </span>
                        <span className="text-[10px] text-stone-400 hidden sm:inline">
                          ({note.category === 'top' ? 'قمة' : note.category === 'heart' ? 'قلب' : 'قاعدة'})
                        </span>
                      </div>
                      <div className="font-mono-numbers font-bold text-amber-900 shrink-0 text-left">
                        {note.percentageOfOil}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Master Compounding Advice */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-1">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>نصيحة الخبير شاهين لضبط المركب:</span>
                </span>
                <p className="text-[11px] text-stone-700 leading-relaxed">
                  {perfume.compoundingTips}
                </p>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-stone-50/80 border-t border-stone-200 flex items-center justify-between gap-3">
              <button
                onClick={() => onLoadWorldFormula(perfume)}
                className="flex-1 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <span>تحميل التركيبة في حاسبة المعمل</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleCopyRecipe(perfume)}
                className="py-2.5 px-3 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="نسخ التركيبة كاملة"
              >
                {copiedId === perfume.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onPrintWorldFormula(perfume)}
                className="p-2.5 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl transition-colors cursor-pointer"
                title="طباعة بطاقة التشغيلة"
              >
                <Printer className="w-4 h-4 text-amber-800" />
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
