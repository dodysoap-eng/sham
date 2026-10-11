import React, { useState } from 'react';
import {
  FlaskConical,
  Search,
  Copy,
  Check,
  Plus,
  Info,
  ShieldCheck,
  Droplet,
  Beaker,
  Scale,
  Sparkles,
  Layers,
} from 'lucide-react';
import { RAW_MATERIALS_DATABASE, RawMaterialItem } from '../data/rawMaterials';
import { PyramidNote } from '../types/perfume';

interface RawMaterialsEncyclopediaProps {
  onAddMaterialToPyramid: (note: PyramidNote) => void;
}

export const RawMaterialsEncyclopedia: React.FC<RawMaterialsEncyclopediaProps> = ({
  onAddMaterialToPyramid,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'جميع المواد (الكل)' },
    { id: 'solvent', label: 'المذيبات وحوامل العطر' },
    { id: 'fixative', label: 'المثبتات الكيميائية' },
    { id: 'aromachemical', label: 'الجزيئات العطرية الحديثة' },
    { id: 'natural_essential', label: 'الزيوت الطبيعية والمستخلصات' },
    { id: 'natural_resin', label: 'الصموغ وأدهان العود' },
  ];

  const filtered = RAW_MATERIALS_DATABASE.filter((item) => {
    const matchesSearch =
      item.nameAr.toLowerCase().includes(search.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      item.olfactoryFamily.toLowerCase().includes(search.toLowerCase()) ||
      item.scentProfile.toLowerCase().includes(search.toLowerCase()) ||
      (item.casNumber && item.casNumber.includes(search));

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopySpecs = (item: RawMaterialItem) => {
    const text = `🧪 مواصفات المادة: ${item.nameAr} (${item.nameEn})
الفئة: ${item.categoryAr} | العائلة الشمية: ${item.olfactoryFamily}
${item.casNumber ? `رقم كاس (CAS): ${item.casNumber}\n` : ''}الكثافة النوعية: ${item.densityGPerMl} جم/مل
النسبة الموصى بها: ${item.recommendedUsagePercent}
حد الأمان وفق IFRA: ${item.ifraLimitPercent}
الموقع في الهرم: ${item.pyramidPlacementAr}

📌 الوصف والشعور:
${item.scentProfile}

⚙️ الدور الوظيفي في العطر:
${item.roleInPerfume}

🤝 يمتزج ويتوافق مع:
${item.blendingPartners}

⚠️ احتياطات التعامل:
${item.precautions}`;

    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAdd = (item: RawMaterialItem) => {
    const placement =
      item.pyramidPlacement === 'top'
        ? 'top'
        : item.pyramidPlacement === 'heart'
        ? 'heart'
        : 'base';

    const newNote: PyramidNote = {
      id: 'mat-' + Date.now(),
      nameAr: item.nameAr.split('(')[0].trim(),
      nameEn: item.nameEn,
      category: placement,
      percentageOfOil: 15,
      description: `${item.olfactoryFamily} · الكثافة: ${item.densityGPerMl}`,
    };

    onAddMaterialToPyramid(newNote);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200/80 pb-5">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-amber-700" />
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-luxury">
            الموسوعة الشاملة لمواد وصناعة العطور (Raw Materials Encyclopedia)
          </h2>
        </div>
        <p className="text-stone-500 text-sm mt-1">
          دليل كيميائي شامل لجميع المذيبات، المثبتات، الجزيئات العطرية الحديثة، الأدهان الطبيعية، ومعايير الكثافة والسلامة الدولية IFRA.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="ابحث بالاسم أو المركب (مثال: أمبروكسان، إيزو إي سوبر، كحول، هيديون...)"
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

      {/* Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
          >
            {/* Top Identity */}
            <div className="space-y-2 border-b border-stone-100 pb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  {item.categoryAr}
                </span>
                {item.casNumber && (
                  <span className="text-[10px] text-stone-400 font-mono-numbers">
                    CAS: {item.casNumber}
                  </span>
                )}
              </div>

              <h3 className="font-bold text-stone-950 text-base font-serif-luxury">
                {item.nameAr}
              </h3>
              <div className="text-[11px] text-stone-400 font-mono-numbers">
                {item.nameEn}
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-2xl text-xs font-mono-numbers">
              <div>
                <span className="text-[10px] text-stone-400 block font-sans">الكثافة النوعية:</span>
                <span className="font-bold text-stone-900">{item.densityGPerMl} g/ml</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block font-sans">الموقع بالهرم:</span>
                <span className="font-semibold text-stone-800 font-sans">{item.pyramidPlacementAr}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block font-sans">النسبة الموصى بها:</span>
                <span className="font-semibold text-amber-900">{item.recommendedUsagePercent}</span>
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block font-sans">حد أمان IFRA:</span>
                <span className="font-semibold text-emerald-800 font-sans">{item.ifraLimitPercent}</span>
              </div>
            </div>

            {/* Scent & Role */}
            <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
              <div>
                <span className="font-bold text-stone-900 block text-[11px]">الرائحة والشعور:</span>
                <p className="text-[11px] text-stone-600">{item.scentProfile}</p>
              </div>

              <div>
                <span className="font-bold text-stone-900 block text-[11px]">الدور الوظيفي في العطر:</span>
                <p className="text-[11px] text-stone-600">{item.roleInPerfume}</p>
              </div>

              <div>
                <span className="font-bold text-stone-900 block text-[11px]">يتوافق بامتياز مع:</span>
                <p className="text-[11px] text-amber-900/90 font-medium">{item.blendingPartners}</p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              {item.category !== 'solvent' && (
                <button
                  onClick={() => handleAdd(item)}
                  className="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {addedId === item.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">أُضيفت للهرم!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5 text-amber-400" />
                      <span>إضافة للهرم العطري</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => handleCopySpecs(item)}
                className="py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="نسخ مواصفات المادة"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">تم</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ</span>
                  </>
                )}
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
