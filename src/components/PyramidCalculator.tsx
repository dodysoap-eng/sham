import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  Sparkles,
  Info,
  Beaker,
  AlertCircle,
  CheckCircle2,
  ListPlus,
} from 'lucide-react';
import { CalculationResult, FormulationState, PyramidNote } from '../types/perfume';
import { CURATED_FORMULA_PRESETS, POPULAR_NOTES_DIRECTORY } from '../data/presets';
import { calculatePyramidBreakdown, formatNum } from '../utils/calculations';
import compoundingImg from '../assets/images/perfume_lab_compounding_1791692420116.jpg';

interface PyramidCalculatorProps {
  formulation: FormulationState;
  pyramidNotes: PyramidNote[];
  setPyramidNotes: React.Dispatch<React.SetStateAction<PyramidNote[]>>;
  result: CalculationResult;
}

export const PyramidCalculator: React.FC<PyramidCalculatorProps> = ({
  formulation,
  pyramidNotes,
  setPyramidNotes,
  result,
}) => {
  const [selectedDirectoryCategory, setSelectedDirectoryCategory] = useState<'all' | 'top' | 'heart' | 'base'>('all');
  const [newNoteName, setNewNoteName] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'top' | 'heart' | 'base'>('top');
  const [newNotePct, setNewNotePct] = useState(15);

  const breakdown = calculatePyramidBreakdown(
    pyramidNotes,
    result.oilWeightGrams,
    result.oilVolumeMl
  );

  const handleAddCustomNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteName.trim()) return;

    const newNote: PyramidNote = {
      id: 'custom-' + Date.now(),
      nameAr: newNoteName.trim(),
      nameEn: 'Custom Accord',
      category: newNoteCategory,
      percentageOfOil: newNotePct,
    };

    setPyramidNotes((prev) => [...prev, newNote]);
    setNewNoteName('');
    setNewNotePct(10);
  };

  const handleAddFromDirectory = (item: (typeof POPULAR_NOTES_DIRECTORY)[0]) => {
    const defaultPct = item.category === 'top' ? 20 : item.category === 'heart' ? 40 : 30;
    const newNote: PyramidNote = {
      id: 'dir-' + Date.now() + Math.random(),
      nameAr: item.nameAr,
      nameEn: item.nameEn,
      category: item.category as 'top' | 'heart' | 'base',
      percentageOfOil: defaultPct,
      description: `${item.family} · تبخر: ${item.evaporation}`,
    };
    setPyramidNotes((prev) => [...prev, newNote]);
  };

  const handleUpdateNotePct = (id: string, pct: number) => {
    setPyramidNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, percentageOfOil: Math.max(0, pct) } : n))
    );
  };

  const handleDeleteNote = (id: string) => {
    setPyramidNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleLoadPreset = (formulaId: string) => {
    const target = CURATED_FORMULA_PRESETS.find((f) => f.id === formulaId);
    if (target) {
      setPyramidNotes(target.pyramidNotes);
    }
  };

  const isBalanced100 = Math.abs(breakdown.totalPercentage - 100) < 0.1;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-stone-200/80 pb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif-luxury">
          حاسبة الهرم العطري ومزج الزيوت الخام
        </h2>
        <p className="text-stone-500 text-sm mt-1">
          وزّع إجمالي الزيت العطري ({formatNum(result.oilWeightGrams)} جم) بين نوتات القمة والقلب والقاعدة لتحقيق فوحان وثبات متناسقين.
        </p>
      </div>

      {/* Preset Loader Strip */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>تراكيب وأهرامات عطرية جاهزة للتجربة:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {CURATED_FORMULA_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleLoadPreset(preset.id)}
              className="px-3 py-1.5 text-xs rounded-md bg-stone-50 hover:bg-amber-50 hover:border-amber-400 border border-stone-200 text-stone-700 font-medium transition-all cursor-pointer"
            >
              {preset.title.split('(')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visual Pyramid & Balance Indicator */}
        <div className="lg:col-span-5 space-y-6">

          {/* Graphic Fragrance Pyramid */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                التوزيع الهرمي الحالي
              </span>
              <span
                className={`text-xs font-mono-numbers font-semibold ${
                  isBalanced100 ? 'text-emerald-700' : 'text-amber-700'
                }`}
              >
                المجموع: {formatNum(breakdown.totalPercentage, 1)}%
              </span>
            </div>

            {/* Pyramid Layers */}
            <div className="space-y-2 pt-2">
              {/* 1. Top Layer */}
              <div className="relative group bg-amber-50/90 border border-amber-200 rounded-xl p-4 text-center transition-all">
                <div className="text-[11px] font-semibold text-amber-900 uppercase">
                  قمة العطر (Top Notes)
                </div>
                <div className="text-xl font-extrabold text-amber-950 font-mono-numbers mt-0.5">
                  {formatNum(breakdown.topPct, 1)}%
                </div>
                <div className="text-[11px] text-amber-800/80 mt-1">
                  الوزن: {formatNum((result.oilWeightGrams * breakdown.topPct) / 100)} جم
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  الحمضيات والأعشاب الخفيفة · الفوحان الأولي (15-30 دقيقة)
                </div>
              </div>

              {/* 2. Heart Layer */}
              <div className="relative group bg-stone-100 border border-stone-200 rounded-xl p-4 text-center transition-all">
                <div className="text-[11px] font-semibold text-stone-800 uppercase">
                  قلب العطر (Heart / Middle Notes)
                </div>
                <div className="text-xl font-extrabold text-stone-900 font-mono-numbers mt-0.5">
                  {formatNum(breakdown.heartPct, 1)}%
                </div>
                <div className="text-[11px] text-stone-700 mt-1">
                  الوزن: {formatNum((result.oilWeightGrams * breakdown.heartPct) / 100)} جم
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5">
                  الزهور، التوابل، الفواكه · روح العطر وهوية التركيبة (2-6 ساعات)
                </div>
              </div>

              {/* 3. Base Layer */}
              <div className="relative group bg-stone-900 text-white rounded-xl p-4 text-center transition-all shadow-sm">
                <div className="text-[11px] font-semibold text-amber-400 uppercase">
                  قاعدة العطر (Base Notes)
                </div>
                <div className="text-xl font-extrabold text-white font-mono-numbers mt-0.5">
                  {formatNum(breakdown.basePct, 1)}%
                </div>
                <div className="text-[11px] text-stone-300 mt-1">
                  الوزن: {formatNum((result.oilWeightGrams * breakdown.basePct) / 100)} جم
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  العود، الصندل، العنبر، الفانيليا، المسك · الثبات والعمق (8-24+ ساعة)
                </div>
              </div>
            </div>

            {/* Validation Message */}
            {!isBalanced100 && (
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  مجموع نسب المكونات حالياً هو {formatNum(breakdown.totalPercentage, 1)}%.
                  يُرجى ضبط النسب ليصبح المجموع 100% بدقة.
                </div>
              </div>
            )}

            {isBalanced100 && (
              <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-lg text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>الهرم العطري متكامل بنسبة 100% تماماً.</span>
              </div>
            )}
          </div>

          {/* Compounding Visual Card */}
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-xs relative aspect-[4/3]">
            <img
              src={compoundingImg}
              alt="ميزان معمل العطور الدقيق والقطارات الزجاجية"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-4">
              <div className="text-white text-xs space-y-0.5">
                <span className="font-bold text-amber-300 block">نصيحة الخلط والمزج:</span>
                <p className="text-[11px] text-stone-200 leading-relaxed">
                  امزج نوتات القاعدة أولاً ثم القلب ثم القمة، واترك المزيج الزيتي يرتاح 48 ساعة قبل إضافة الكحول ليتجانس بصورة متكاملة.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Manage Oil Ingredients & Library Directory */}
        <div className="lg:col-span-7 space-y-6">

          {/* Add Custom Ingredient Form */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-3">
            <span className="text-xs font-bold text-stone-900 block">
              إضافة زيت عِطري أو نوتة جديدة:
            </span>
            <form onSubmit={handleAddCustomNote} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5">
                <input
                  type="text"
                  placeholder="اسم الزيت (مثل: دهن عود تراد، ورد طائفي...)"
                  value={newNoteName}
                  onChange={(e) => setNewNoteName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={newNoteCategory}
                  onChange={(e) => setNewNoteCategory(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-amber-700"
                >
                  <option value="top">قمة العطر (Top)</option>
                  <option value="heart">قلب العطر (Heart)</option>
                  <option value="base">قاعدة العطر (Base)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={newNotePct}
                    onChange={(e) => setNewNotePct(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono-numbers text-stone-900 focus:outline-none focus:border-amber-700"
                  />
                  <span className="absolute left-2 top-2 text-xs text-stone-400">%</span>
                </div>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة</span>
                </button>
              </div>
            </form>
          </div>

          {/* Active Ingredients Table */}
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-sm overflow-hidden">
            <div className="p-4 bg-stone-50/70 border-b border-stone-200/70 flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900">
                مكونات الزيت العطري الحالية ({breakdown.notesWithQuantities.length} زيوت)
              </span>
              <button
                type="button"
                onClick={() => setPyramidNotes([])}
                className="text-[11px] text-rose-700 hover:text-rose-900 cursor-pointer"
              >
                تفريغ القائمة
              </button>
            </div>

            {breakdown.notesWithQuantities.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs">
                لا توجد زيوت مضافة حالياً. اختر من التراكيب الجاهزة بالأعلى أو أضف زيوتاً من الدليل بالأسفل.
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {breakdown.notesWithQuantities.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-stone-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          item.category === 'top'
                            ? 'bg-amber-500'
                            : item.category === 'heart'
                            ? 'bg-stone-600'
                            : 'bg-stone-950'
                        }`}
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-stone-900 truncate">
                          {item.nameAr}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {item.category === 'top'
                            ? 'قمة العطر'
                            : item.category === 'heart'
                            ? 'قلب العطر'
                            : 'قاعدة العطر'}
                          {item.description ? ` · ${item.description}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Weight Display */}
                      <div className="text-left font-mono-numbers">
                        <div className="text-xs font-bold text-amber-900">
                          {formatNum(item.weightGrams)} g
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {formatNum(item.volumeMl)} ml
                        </div>
                      </div>

                      {/* Percentage Controller */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={item.percentageOfOil}
                          onChange={(e) =>
                            handleUpdateNotePct(item.id, parseFloat(e.target.value) || 0)
                          }
                          className="w-14 px-2 py-1 bg-stone-50 border border-stone-200 rounded text-xs font-mono-numbers text-center text-stone-900"
                        />
                        <span className="text-[11px] text-stone-500">%</span>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteNote(item.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="حذف"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Add from Common Notes Directory */}
          <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <ListPlus className="w-4 h-4 text-amber-700" />
                <span>دليل أشهر النوتات والمواد العطرية الشائعة (انقر للإضافة):</span>
              </span>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setSelectedDirectoryCategory('all')}
                  className={`px-2 py-0.5 rounded ${
                    selectedDirectoryCategory === 'all'
                      ? 'bg-stone-900 text-white font-medium'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  الكل
                </button>
                <button
                  onClick={() => setSelectedDirectoryCategory('top')}
                  className={`px-2 py-0.5 rounded ${
                    selectedDirectoryCategory === 'top'
                      ? 'bg-stone-900 text-white font-medium'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  قمة
                </button>
                <button
                  onClick={() => setSelectedDirectoryCategory('heart')}
                  className={`px-2 py-0.5 rounded ${
                    selectedDirectoryCategory === 'heart'
                      ? 'bg-stone-900 text-white font-medium'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  قلب
                </button>
                <button
                  onClick={() => setSelectedDirectoryCategory('base')}
                  className={`px-2 py-0.5 rounded ${
                    selectedDirectoryCategory === 'base'
                      ? 'bg-stone-900 text-white font-medium'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  قاعدة
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1 max-h-48 overflow-y-auto">
              {POPULAR_NOTES_DIRECTORY.filter(
                (note) =>
                  selectedDirectoryCategory === 'all' ||
                  note.category === selectedDirectoryCategory
              ).map((note, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddFromDirectory(note)}
                  className="px-2.5 py-1 text-[11px] rounded-md bg-stone-50 hover:bg-amber-100/70 border border-stone-200/60 text-stone-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-amber-800" />
                  <span>{note.nameAr}</span>
                  <span className="text-[9px] text-stone-400">({note.family})</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
