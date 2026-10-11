import { PyramidNote } from '../types/perfume';

export interface NoteVolatilityMetadata {
  volatilityRank: number; // 1 (flies fastest) to 10 (most persistent)
  volatilityRate: string; // textual description
  evaporationTime: string;
  scentFamily: string;
  defaultQuality?: string;
  qualityGrade: string;
  diffusionRadius: string;
  molecularWeightCategory: 'خفيف جداً (Monoterpenes & Aldehydes)' | 'متوسط (Oxygenated Sesquiterpenes)' | 'ثقيل جداً (Diterpenes & Macrocyclics)';
}

// Database of known aromachemicals and natural perfumery materials with empirical volatility rates
export const KNOWN_NOTES_VOLATILITY: Record<string, Partial<NoteVolatilityMetadata>> = {
  // Citrus & Light Aldehydes (Rank 1 - Fastest evaporation)
  'ليمون': { volatilityRank: 1, volatilityRate: 'فائق السرعة (أول 10-15 دقيقة)', evaporationTime: '10-20 دقيقة', scentFamily: 'حمضيات', defaultQuality: 'خلاصة عضوية معصورة على البارد A+', diffusionRadius: 'فوحان فوري نفاث' },
  'lemon': { volatilityRank: 1, volatilityRate: 'فائق السرعة (أول 10-15 دقيقة)', evaporationTime: '10-20 دقيقة', scentFamily: 'حمضيات', defaultQuality: 'خلاصة عضوية معصورة على البارد A+', diffusionRadius: 'فوحان فوري نفاث' },
  'برغموت': { volatilityRank: 1, volatilityRate: 'سريع جداً (15-30 دقيقة)', evaporationTime: '15-30 دقيقة', scentFamily: 'حمضيات أرستقراطية', defaultQuality: 'كالابريا نقي خالي من البرغابتين A+', diffusionRadius: 'إشعاع مضيء واسع' },
  'bergamot': { volatilityRank: 1, volatilityRate: 'سريع جداً (15-30 دقيقة)', evaporationTime: '15-30 دقيقة', scentFamily: 'حمضيات أرستقراطية', defaultQuality: 'كالابريا نقي خالي من البرغابتين A+', diffusionRadius: 'إشعاع مضيء واسع' },
  'يوسفي': { volatilityRank: 2, volatilityRate: 'سريع (20-35 دقيقة)', evaporationTime: '20-35 دقيقة', scentFamily: 'حمضيات فاكهية', defaultQuality: 'زيت ماندرين صقلي خالص', diffusionRadius: 'فوحان منعش مبهج' },
  'mandarin': { volatilityRank: 2, volatilityRate: 'سريع (20-35 دقيقة)', evaporationTime: '20-35 دقيقة', scentFamily: 'حمضيات فاكهية', defaultQuality: 'زيت ماندرين صقلي خالص', diffusionRadius: 'فوحان منعش مبهج' },
  'جريب فروت': { volatilityRank: 2, volatilityRate: 'سريع (20-30 دقيقة)', evaporationTime: '20-30 دقيقة', scentFamily: 'حمضيات لاذعة', defaultQuality: 'خلاصة نقية متلألئة', diffusionRadius: 'فوحان حاد' },
  'نعناع': { volatilityRank: 2, volatilityRate: 'سريع جداً (15 دقيقة)', evaporationTime: '15 دقيقة', scentFamily: 'أروماتيك عشبي', defaultQuality: 'مستخلص نعناع بيبيرمينت مقطر', diffusionRadius: 'برودة متطايرة' },
  'ألدهيدات': { volatilityRank: 1, volatilityRate: 'فوري خاطف (5-15 دقيقة)', evaporationTime: '10 دقائق', scentFamily: 'ألدهيدي برّاق', defaultQuality: 'جزيء ألدهيدي معملي C-11/C-12', diffusionRadius: 'بريق فوار متطاير' },
  'بحر': { volatilityRank: 2, volatilityRate: 'سريع (20-40 دقيقة)', evaporationTime: '20-40 دقيقة', scentFamily: 'أوزوني مائي', defaultQuality: 'كالون نقي عالي النقاء', diffusionRadius: 'نسيم متطاير' },
  'marine': { volatilityRank: 2, volatilityRate: 'سريع (20-40 دقيقة)', evaporationTime: '20-40 دقيقة', scentFamily: 'أوزوني مائي', defaultQuality: 'كالون نقي عالي النقاء', diffusionRadius: 'نسيم متطاير' },
  'تفاح': { volatilityRank: 3, volatilityRate: 'سريع إلى متوسط (30-45 دقيقة)', evaporationTime: '30-45 دقيقة', scentFamily: 'فواكه منعشة', defaultQuality: 'أكورد تفاح أخضر مقطر نقي', diffusionRadius: 'فوحان فاكهي ناعم' },
  'كمثرى': { volatilityRank: 3, volatilityRate: 'سريع إلى متوسط (30 دقيقة)', evaporationTime: '30 دقيقة', scentFamily: 'فواكه مخملية', defaultQuality: 'مستخلص كمثرى عصيرية', diffusionRadius: 'هالة رقيقة' },
  
  // Fresh Spices & Aromatics (Rank 3-4)
  'فلفل وردي': { volatilityRank: 3, volatilityRate: 'سريع إلى متوسط (30-45 دقيقة)', evaporationTime: '30-45 دقيقة', scentFamily: 'توابل منتعشة', defaultQuality: 'تقطير بثاني أكسيد الكربون CO2 فائقة النقاء', diffusionRadius: 'فوحان متألق' },
  'خزامى': { volatilityRank: 3, volatilityRate: 'متوسط السرعة (40-60 دقيقة)', evaporationTime: '40-60 دقيقة', scentFamily: 'أروماتيك زهري', defaultQuality: 'لافندر فرنسي ألبي 100% طبيعي', diffusionRadius: 'انتشار أروماتيك مريح' },
  'lavender': { volatilityRank: 3, volatilityRate: 'متوسط السرعة (40-60 دقيقة)', evaporationTime: '40-60 دقيقة', scentFamily: 'أروماتيك زهري', defaultQuality: 'لافندر فرنسي ألبي 100% طبيعي', diffusionRadius: 'انتشار أروماتيك مريح' },
  'هيل': { volatilityRank: 3, volatilityRate: 'متوسط السرعة (45 دقيقة)', evaporationTime: '45 دقيقة', scentFamily: 'توابل خضراء', defaultQuality: 'مستخلص حب الهيل الأخضر الملكي', diffusionRadius: 'دفء أثيري منعش' },
  'نيرولي': { volatilityRank: 4, volatilityRate: 'متوسط (ساعة إلى ساعتين)', evaporationTime: '1-2 ساعة', scentFamily: 'زهور حمضية نقية', defaultQuality: 'زهر برتقال تونسي مقطر بالبخار', diffusionRadius: 'إشراقة زهرية' },

  // Heart Notes (Rank 4-6)
  'ورد': { volatilityRank: 5, volatilityRate: 'متوسط البقاء (2-4 ساعات)', evaporationTime: '2-4 ساعات', scentFamily: 'زهور أرستقراطية', defaultQuality: 'خلاصة ورد طائفي / دمشقي نقي 100%', diffusionRadius: 'فوحان مخملي أسطوري' },
  'rose': { volatilityRank: 5, volatilityRate: 'متوسط البقاء (2-4 ساعات)', evaporationTime: '2-4 ساعات', scentFamily: 'زهور أرستقراطية', defaultQuality: 'مطلق الورد الفرنسي Grasse Absolute A+', diffusionRadius: 'فوحان مخملي أسطوري' },
  'ياسمين': { volatilityRank: 5, volatilityRate: 'متوسط البقاء (3-5 ساعات)', evaporationTime: '3-5 ساعات', scentFamily: 'زهور بيضاء فاتنة', defaultQuality: 'ياسمين سامباك هندي قطفة ليلية A+', diffusionRadius: 'انتشار زهري مسكر غني' },
  'jasmine': { volatilityRank: 5, volatilityRate: 'متوسط البقاء (3-5 ساعات)', evaporationTime: '3-5 ساعات', scentFamily: 'زهور بيضاء فاتنة', defaultQuality: 'ياسمين سامباك هندي قطفة ليلية A+', diffusionRadius: 'انتشار زهري مسكر غني' },
  'قرفة': { volatilityRank: 6, volatilityRate: 'متوسط دافئ (3-5 ساعات)', evaporationTime: '3-5 ساعات', scentFamily: 'توابل دافئة', defaultQuality: 'لحاء قرفة سيلانية فاخرة', diffusionRadius: 'دفء مغلف جذاب' },
  'زعفران': { volatilityRank: 4, volatilityRate: 'متوسط متألق (2-4 ساعات)', evaporationTime: '2-4 ساعات', scentFamily: 'توابل جلدية ثمينة', defaultQuality: 'زعفران كشميري أحمر نقي (سوبر نقين)', diffusionRadius: 'إشعاع شرقي مترف' },
  'جوزة الطيب': { volatilityRank: 6, volatilityRate: 'متوسط (3 ساعات)', evaporationTime: '3 ساعات', scentFamily: 'توابل خشبية', defaultQuality: 'مقطر جوزة الطيب الطبيعي', diffusionRadius: 'عمق تابلي' },
  'أرز': { volatilityRank: 7, volatilityRate: 'بطيء (4-6 ساعات)', evaporationTime: '4-6 ساعات', scentFamily: 'أخشاب نبيلة', defaultQuality: 'خشب أرز أطلسي مغربي معتق', diffusionRadius: 'ثبات خشبي رصين' },
  'cedar': { volatilityRank: 7, volatilityRate: 'بطيء (4-6 ساعات)', evaporationTime: '4-6 ساعات', scentFamily: 'أخشاب نبيلة', defaultQuality: 'خشب أرز أطلسي مغربي معتق', diffusionRadius: 'ثبات خشبي رصين' },

  // Base Notes (Rank 7-10 - Slowest Evaporation, Maximum Tenacity)
  'باتشولي': { volatilityRank: 7, volatilityRate: 'بطيء متماسك (5-8 ساعات)', evaporationTime: '5-8 ساعات', scentFamily: 'أخشاب ترابية بلسمية', defaultQuality: 'باتشولي إندونيسي منزوع الحديد نقي', diffusionRadius: 'عمق ترابي فواح' },
  'patchouli': { volatilityRank: 7, volatilityRate: 'بطيء متماسك (5-8 ساعات)', evaporationTime: '5-8 ساعات', scentFamily: 'أخشاب ترابية بلسمية', defaultQuality: 'باتشولي إندونيسي منزوع الحديد نقي', diffusionRadius: 'عمق ترابي فواح' },
  'فانيليا': { volatilityRank: 8, volatilityRate: 'بطيء جداً (8-16 ساعة)', evaporationTime: '8-16 ساعة', scentFamily: 'جورماند بلسمي ناعم', defaultQuality: 'فانيليا بوربون مدغشقرية طبيعية Absolute', diffusionRadius: 'هالة بلسمية دافئة' },
  'vanilla': { volatilityRank: 8, volatilityRate: 'بطيء جداً (8-16 ساعة)', evaporationTime: '8-16 ساعة', scentFamily: 'جورماند بلسمي ناعم', defaultQuality: 'فانيليا بوربون مدغشقرية طبيعية Absolute', diffusionRadius: 'هالة بلسمية دافئة' },
  'تونكا': { volatilityRank: 8, volatilityRate: 'بطيء جداً (8-14 ساعة)', evaporationTime: '8-14 ساعة', scentFamily: 'جورماند بلسمي كلاسيكي', defaultQuality: 'حبوب تونكا برازيلية غنية بالكومارين', diffusionRadius: 'ثبات مخملي ناعم' },
  'صندل': { volatilityRank: 9, volatilityRate: 'بالغ الثبات (12-18 ساعة)', evaporationTime: '12-18 ساعة', scentFamily: 'أخشاب كريمية مقدسة', defaultQuality: 'خشب صندل ميسوري هندي عتيق 100%', diffusionRadius: 'ثبات كريمي ملكي' },
  'sandalwood': { volatilityRank: 9, volatilityRate: 'بالغ الثبات (12-18 ساعة)', evaporationTime: '12-18 ساعة', scentFamily: 'أخشاب كريمية مقدسة', defaultQuality: 'خشب صندل ميسوري هندي عتيق 100%', diffusionRadius: 'ثبات كريمي ملكي' },
  'عود': { volatilityRank: 10, volatilityRate: 'أقصى ثبات تاريخي (16-24+ ساعة)', evaporationTime: '18-24+ ساعة', scentFamily: 'أخشاب شرقية أسطورية', defaultQuality: 'دهن عود تراد / هندي حطبي معتق A+ Pure', diffusionRadius: 'بصمة بخورية مهيبة تدوم أياماً' },
  'oud': { volatilityRank: 10, volatilityRate: 'أقصى ثبات تاريخي (16-24+ ساعة)', evaporationTime: '18-24+ ساعة', scentFamily: 'أخشاب شرقية أسطورية', defaultQuality: 'دهن عود تراد / هندي حطبي معتق A+ Pure', diffusionRadius: 'بصمة بخورية مهيبة تدوم أياماً' },
  'عنبر': { volatilityRank: 10, volatilityRate: 'أقصى ثبات وتثبيت (14-24+ ساعة)', evaporationTime: '14-24+ ساعة', scentFamily: 'عنبري بلسمي حار', defaultQuality: 'عنبر حوتي رمادي معتق / عنبر راتنجي نقي', diffusionRadius: 'إشعاع مغناطيسي مستمر' },
  'amber': { volatilityRank: 10, volatilityRate: 'أقصى ثبات وتثبيت (14-24+ ساعة)', evaporationTime: '14-24+ ساعة', scentFamily: 'عنبري بلسمي حار', defaultQuality: 'عنبر حوتي رمادي معتق / عنبر راتنجي نقي', diffusionRadius: 'إشعاع مغناطيسي مستمر' },
  'مسك': { volatilityRank: 10, volatilityRate: 'فائق الثبات ملاصق (12-24+ ساعة)', evaporationTime: '12-24+ ساعة', scentFamily: 'مسك نقي مخملي', defaultQuality: 'مسك أبيض عالي النقاء / ماكروكليك ثابت', diffusionRadius: 'هالة قطنية حسية ملاصقة' },
  'musk': { volatilityRank: 10, volatilityRate: 'فائق الثبات ملاصق (12-24+ ساعة)', evaporationTime: '12-24+ ساعة', scentFamily: 'مسك نقي مخملي', defaultQuality: 'مسك أبيض عالي النقاء / ماكروكليك ثابت', diffusionRadius: 'هالة قطنية حسية ملاصقة' },
  'أمبروكسان': { volatilityRank: 9, volatilityRate: 'فائق الإشعاع والثبات (16-24+ ساعة)', evaporationTime: '16-24+ ساعة', scentFamily: 'عنبري جاف عصري', defaultQuality: 'أمبروكسان نقي بدرجة دوائية 99.8%', diffusionRadius: 'انتشار إشعاعي ثلاثي الأبعاد' },
  'جلد': { volatilityRank: 9, volatilityRate: 'بطيء جداً (12-20 ساعة)', evaporationTime: '12-20 ساعة', scentFamily: 'جلود ترف', defaultQuality: 'أكورد الجلود الإيطالية التوسكانية الفاخرة', diffusionRadius: 'ثبات دافئ عميق' },
};

/**
 * Enriches any PyramidNote with accurate volatility and olfactory parameters
 */
export function enrichPyramidNote(note: PyramidNote): PyramidNote & NoteVolatilityMetadata {
  const lowerName = (note.nameAr + ' ' + (note.nameEn || '')).toLowerCase();
  
  // Find matching keyword in dictionary
  let matchedMeta: Partial<NoteVolatilityMetadata> | null = null;
  for (const [key, meta] of Object.entries(KNOWN_NOTES_VOLATILITY)) {
    if (lowerName.includes(key.toLowerCase())) {
      matchedMeta = meta;
      break;
    }
  }

  // Fallbacks based on category if not in dictionary
  let defaultRank = 2;
  let defaultRate = 'سريع التبخر (15-30 دقيقة)';
  let defaultEvap = '15-30 دقيقة';
  let defaultFamily = 'حمضيات وأعشاب منتعشة';
  let defaultQuality = 'درجة أولى نقية A';
  let defaultDiffusion = 'فوحان متطاير سريع';
  let defaultMol: NoteVolatilityMetadata['molecularWeightCategory'] = 'خفيف جداً (Monoterpenes & Aldehydes)';

  if (note.category === 'heart') {
    defaultRank = 5;
    defaultRate = 'متوسط التبخر (2-4 ساعات)';
    defaultEvap = '2-4 ساعات';
    defaultFamily = 'زهور وتوابل متوازنة';
    defaultQuality = 'مستخلص نقي معتمد A+';
    defaultDiffusion = 'فوحان قلبي متناغم';
    defaultMol = 'متوسط (Oxygenated Sesquiterpenes)';
  } else if (note.category === 'base') {
    defaultRank = 9;
    defaultRate = 'بطيء التبخر عالي الثبات (8-24 ساعة)';
    defaultEvap = '8-24 ساعة';
    defaultFamily = 'أخشاب وراتنجات وعنبر';
    defaultQuality = 'زيت مركز معتق فاخر A+';
    defaultDiffusion = 'ثبات عميق مستمر';
    defaultMol = 'ثقيل جداً (Diterpenes & Macrocyclics)';
  }

  const rank = note.volatilityRank || matchedMeta?.volatilityRank || defaultRank;
  const rate = note.volatilityRate || matchedMeta?.volatilityRate || defaultRate;
  const evap = note.evaporationTime || matchedMeta?.evaporationTime || defaultEvap;
  const family = note.scentFamily || matchedMeta?.scentFamily || defaultFamily;
  const quality = note.qualityGrade || matchedMeta?.defaultQuality || defaultQuality;
  const diffusion = note.diffusionRadius || matchedMeta?.diffusionRadius || defaultDiffusion;
  const mol = matchedMeta?.molecularWeightCategory || defaultMol;

  return {
    ...note,
    volatilityRank: rank,
    volatilityRate: rate,
    evaporationTime: evap,
    scentFamily: family,
    qualityGrade: quality,
    diffusionRadius: diffusion,
    molecularWeightCategory: mol,
  };
}

/**
 * Sorts perfume notes inside each tier strictly from fastest to evaporate (Rank 1) to slowest to evaporate (Rank 10)
 */
export function sortNotesByVolatilityOrder<T extends PyramidNote>(notes: T[]): T[] {
  return [...notes].sort((a, b) => {
    // Top notes first, then Heart, then Base
    const catWeight = { top: 1, heart: 2, base: 3 };
    if (catWeight[a.category] !== catWeight[b.category]) {
      return catWeight[a.category] - catWeight[b.category];
    }
    // Inside same category, sort by volatilityRank ascending (lowest rank = fastest evaporation = flies first)
    const rankA = a.volatilityRank ?? (a.category === 'top' ? 2 : a.category === 'heart' ? 5 : 9);
    const rankB = b.volatilityRank ?? (b.category === 'top' ? 2 : b.category === 'heart' ? 5 : 9);
    return rankA - rankB;
  });
}

/**
 * Imaginary Sensory Evolution Scenario definition
 */
export interface EvolutionScenarioStage {
  id: string;
  timeLabelAr: string;
  timeLabelEn?: string;
  timeMinutes: number;
  stageNameAr: string;
  stageNameEn?: string;
  stageSubtitleAr: string;
  stageSubtitleEn?: string;
  sillageRating: 'فوحان انفجاري نفاث' | 'فوحان واسع ملحوظ' | 'هالة عطرية متوازنة' | 'ثبات حميمي دافئ' | 'أثر عطري ملاصق للبشرة';
  sillageRatingEn?: string;
  sillagePercent: number; // 0 to 100
  skinAdhesionPercent: number; // Remaining essence on skin
  dominantPhase: 'top' | 'heart' | 'base' | 'drydown';
  evaporationStateAr: string;
  evaporationStateEn?: string;
  whatHappensTextAr: string;
  whatHappensTextEn?: string;
  olfactoryPerceptionTextAr: string;
  olfactoryPerceptionTextEn?: string;
  chemicalDynamicTextAr: string;
  chemicalDynamicTextEn?: string;
  adviceForWearerAr: string;
  adviceForWearerEn?: string;
}

/**
 * Generates the rich imaginary scenario customized with the actual ingredients and percentages of the user's formula
 */
export function generateCustomSprayScenario(
  notes: PyramidNote[],
  bottleVolumeMl: number = 100,
  concentrationPercent: number = 20
): {
  stages: EvolutionScenarioStage[];
  summaryStory: string;
  totalNotesCount: number;
  fastestFlyerName: string;
  deepestAnchorName: string;
} {
  const enriched = notes.map(enrichPyramidNote);
  const sorted = sortNotesByVolatilityOrder(enriched);

  const topNotes = sorted.filter((n) => n.category === 'top');
  const heartNotes = sorted.filter((n) => n.category === 'heart');
  const baseNotes = sorted.filter((n) => n.category === 'base');

  const topNamesEn = topNotes.map((n) => `${n.nameEn || n.nameAr} (${n.percentageOfOil}%)`).join(' & ') || 'Citrus & Fresh Aromatics';
  const heartNamesEn = heartNotes.map((n) => `${n.nameEn || n.nameAr} (${n.percentageOfOil}%)`).join(' & ') || 'Florals & Warm Spices';
  const baseNamesEn = baseNotes.map((n) => `${n.nameEn || n.nameAr} (${n.percentageOfOil}%)`).join(' & ') || 'Precious Woods, Amber & Musks';

  const fastestFlyerEn = topNotes[0]?.nameEn || (notes[0]?.nameEn ?? 'Bergamot & Citrus');
  const deepestAnchorEn = baseNotes[baseNotes.length - 1]?.nameEn || (baseNotes[0]?.nameEn ?? 'Oud, Amber & Musks');

  const stages: EvolutionScenarioStage[] = [
    {
      id: 'spray-0',
      timeLabelAr: 'اللحظة 0 : لحظة الرش الأولى (0 - 15 دقيقة)',
      timeLabelEn: 'Moment 0: Initial Spray Flash (0 - 15 minutes)',
      timeMinutes: 0,
      stageNameAr: 'الانفجار العطري والصدمة الشمية الأولى (The Opening Flash)',
      stageNameEn: 'The Opening Flash & Olfactory Burst',
      stageSubtitleAr: 'تطاير الكحول وتحرر الجزيئات الأخف وزناً جزيئياً',
      stageSubtitleEn: 'Ethanol flash vaporization & rapid liberation of light molecules',
      sillageRating: 'فوحان انفجاري نفاث',
      sillageRatingEn: 'Explosive Radiant Projection',
      sillagePercent: 100,
      skinAdhesionPercent: 100,
      dominantPhase: 'top',
      evaporationStateAr: 'الجزيئات الخفيفة (Monoterpenes) تتطاير بسرعة 100% لتملأ المكان',
      evaporationStateEn: 'Light monoterpene molecules vaporize rapidly at 100% to fill the room',
      whatHappensTextAr: `فور ضغط بخاخ العطر، يتفتت السائل إلى ملايين الذرات الميكروية. يتبخر الكحول الحامل في غضون 10 ثوانٍ، لتنطلق أولاً نوتات القمة الأسرع طيراناً: ${topNames}. تتصاعد هذه الجزيئات خفيفة الوزن بسرعة فائقة متجهة مباشرة إلى المستقبلات الشمية لكل من يقف في محيط 3 أمتار.`,
      whatHappensTextEn: `As soon as the atomizer pump is depressed, the liquid disperses into millions of micro-droplets. Carrier ethanol evaporates in 10 seconds, releasing the fastest volatile top notes: ${topNamesEn}. These high vapor-pressure molecules ascend rapidly, reaching olfactory receptors up to 3 meters away.`,
      olfactoryPerceptionTextAr: `انتعاش كهربائي مبهج ونضارة فورية! تشعر بحيوية بالغة كأن العطر يصرخ مرحباً. نوتة «${fastestFlyer}» هي أول ما يعبر الأنف بقوة مبهرة، ممهدة الطريق ومخفية كثافة الزيوت الثقيلة الكامنة بالأسفل.`,
      olfactoryPerceptionTextEn: `Electric, invigorating freshness and instant clarity! Note «${fastestFlyerEn}» leads the opening burst with brilliant lift, preparing the senses for the deeper heart accords below.`,
      chemicalDynamicTextAr: 'ضغط البخار في قمته القصوى؛ طاقة حركية جزيئية سريعة تدفع الروائح للهواء قبل أن تستقر على خلايا الجلد.',
      chemicalDynamicTextEn: 'Peak vapor pressure; rapid molecular kinetic energy pushes volatile odors into air currents before settling on epidermal lipids.',
      adviceForWearerAr: 'لا تحكم على العطر في هذه الدقائق الأولى! انتظر حتى تهدأ فورة القمة لتبدأ هوية العطر الحقيقية بالظهور.',
      adviceForWearerEn: 'Do not judge the perfume in these first few minutes! Allow the opening flare to settle and reveal the true heart signature.',
    },
    {
      id: 'spray-30',
      timeLabelAr: 'بعد 15 إلى 45 دقيقة',
      timeLabelEn: '15 to 45 minutes after spraying',
      timeMinutes: 30,
      stageNameAr: 'انحسار القمة وتفتح قلب العطر (Heart Awakening)',
      stageNameEn: 'Heart Awakening & Floral/Spice Bloom',
      stageSubtitleAr: 'التحام رائع بين آخر نسمات الانتعاش وأولى نفحات الهوية',
      stageSubtitleEn: 'Harmonious fusion of fading top notes and emerging heart character',
      sillageRating: 'فوحان واسع ملحوظ',
      sillageRatingEn: 'Distinct & Noticeable Sillage',
      sillagePercent: 85,
      skinAdhesionPercent: 88,
      dominantPhase: 'heart',
      evaporationStateAr: 'تلاشي 60% من القمة مع بدء التسامي الحراري لجزيئات القلب',
      evaporationStateEn: '60% top volatilization completed with thermal sublimation of mid accords',
      whatHappensTextAr: `تبدأ جزيئات القمة التي استمتعت بها في الهبوط تدريجياً بعدما أدت واجبها الترحيبي. في هذه الأثناء، تدفئ حرارة بشرتك الطبيعية (37° مئوية) نوتات القلب: ${heartNames}. تبدأ جزيئات الزهور والتوابل المتوسطة بالتبخر المتناغم، لتتحول الرائحة من مجرد انتعاش سطحي إلى شخصية آسرة ذات عمق ودفء.`,
      whatHappensTextEn: `Top molecules soften after their initial welcome. Natural skin temperature (37°C) warms the heart notes: ${heartNamesEn}. Moderate volatility florals and spices begin evaporating harmoniously, shifting the scent from bright fresh to a rich, warm identity.`,
      olfactoryPerceptionTextAr: `تخفت حدة الحمضيات وتظهر النعومة المخملية للقلب؛ يلاحظ المحيطون بك رائحة غنية ومتكاملة تميز بصمتك الشخصية.`,
      olfactoryPerceptionTextEn: `Citrus sharpness softens into velvety heart depth; people around you experience an elegant, balanced signature trail.`,
      chemicalDynamicTextAr: 'تفاعل الإسترات والتربينات المتوسطة مع دهون البشرة (Sebum) مكوناً رابطة إشعاعية مستقرة.',
      chemicalDynamicTextEn: 'Mid esters and sesquiterpenes interact with sebum lipids, creating an even diffusion matrix.',
      adviceForWearerAr: 'هذا هو الوقت المثالي للاجتماعات ودخول المناسبات حيث يكون العطر في قمة وضوحه وأناقته الاجتماعية.',
      adviceForWearerEn: 'Prime window for meetings and arriving at social gatherings; projection is at its most sophisticated and clear.',
    },
    {
      id: 'spray-120',
      timeLabelAr: 'بعد ساعتين إلى 4 ساعات',
      timeLabelEn: '2 to 4 hours after spraying',
      timeMinutes: 120,
      stageNameAr: 'ذروة التناغم العطري والفوحان المتزن (The Signature Sillage)',
      stageNameEn: 'The Signature Sillage & Harmonic Climax',
      stageSubtitleAr: 'تلاحم القلب مع طلائع القاعدة الخشبية والبلسمية',
      stageSubtitleEn: 'Core bouquet intertwining with emerging base woods and resins',
      sillageRating: 'هالة عطرية متوازنة',
      sillageRatingEn: 'Harmonious & Balanced Aura',
      sillagePercent: 70,
      skinAdhesionPercent: 72,
      dominantPhase: 'heart',
      evaporationStateAr: 'تبخر القمة بالكامل (100%)، نشاط القلب 80%، وتحرر متصاعد للقاعدة',
      evaporationStateEn: '100% top evaporated, heart 80% active, gradual base emergence',
      whatHappensTextAr: `اختفت نوتات القمة تماماً من الهواء. يسيطر قلب العطر بالتوازي مع صعود طلائع نوتات القاعدة: ${baseNames}. يتناغم ${heartNames} مع دفء القاعدة ليعطي هالة دائرية حولك تمتد إلى متر كامل.`,
      whatHappensTextEn: `Top notes have completely evaporated. The heart reigns supreme as baseline notes begin their ascent: ${baseNamesEn}. Heart accords harmonize with base warmth to project a beautiful 1-meter scent bubble.`,
      olfactoryPerceptionTextAr: `رائحة فخمة وجذابة تثير إعجاب كل من يقترب منك؛ العطر لم يعد صاخباً بل أصبح هادئاً وواثقاً وممتلئاً بالنضج والأصالة.`,
      olfactoryPerceptionTextEn: `Rich, alluring, and confident; the fragrance is no longer loud, but centered, mature, and deeply magnetic.`,
      chemicalDynamicTextAr: 'عمل المثبتات العطرية والروابط الهيدروجينية يمنع تسارع تبخر النوتات العطرية ويضمن تدفقاً انسيابياً متزناً.',
      chemicalDynamicTextEn: 'Fixatives and hydrogen bonding slow evaporation velocity, ensuring smooth continuous sillage.',
      adviceForWearerAr: 'حركة يديك وتدفق الهواء من حولك ينشران نفحات عطرية غير متوقعة تجعل حضورك لافتاً دون إزعاج.',
      adviceForWearerEn: 'Your movements and natural airflow disperse subtle wafts that create a captivating yet refined presence.',
    },
    {
      id: 'spray-360',
      timeLabelAr: 'بعد 5 إلى 8 ساعات',
      timeLabelEn: '5 to 8 hours after spraying',
      timeMinutes: 360,
      stageNameAr: 'مرحلة الجفاف والاستقرار الحميمي (The Drydown & Anchorage)',
      stageNameEn: 'The Drydown & Anchorage Phase',
      stageSubtitleAr: 'رسو الجزيئات الثقيلة وثبات القاعدة الأسطوري',
      stageSubtitleEn: 'Deep molecular anchoring and foundational longevity',
      sillageRating: 'ثبات حميمي دافئ',
      sillageRatingEn: 'Warm & Intimate Persistence',
      sillagePercent: 45,
      skinAdhesionPercent: 55,
      dominantPhase: 'base',
      evaporationStateAr: 'تلاشي نوتات القلب وبقاء الجزيئات الثقيلة الملتصقة بالبشرة والملابس',
      evaporationStateEn: 'Heart accords fade; heavy molecules remain anchored to keratin and fabric',
      whatHappensTextAr: `وصل العطر إلى مرحلة الجفاف (Drydown). لم يبقَ في الميدان سوى أقوى الجزيئات وأثقلها وزناً جزيئياً: ${baseNames}. النوتة الأساسية «${deepestAnchor}» تندمج مع كيمياء جلدك لتخلق رائحة حصرية لا تتكرر مع أي شخص آخر.`,
      whatHappensTextEn: `The fragrance enters the true drydown. Only the heaviest, high molecular-weight components remain: ${baseNamesEn}. Anchor note «${deepestAnchorEn}» fuses with personal skin chemistry to create a one-of-a-kind scent imprint.`,
      olfactoryPerceptionTextAr: `دفء أخشاب، نعومة بلسمية، وفخامة هادئة تلازمك. الرائحة أصبحت شخصية وحميمية، يشعر بها من يقترب منك أو يعانقك أو عندما ترفع معصمك.`,
      olfactoryPerceptionTextEn: `Noble woods, velvety balsamic warmth, and understated luxury. Close-to-skin intimacy perceived in close embrace or wrist elevation.`,
      chemicalDynamicTextAr: 'التصاق كامل للراتنجات والجزيئات الكبيرة (Macrocyclics & Sesquiterpene Alcohols) بأنسجة الكيراتين والملابس.',
      chemicalDynamicTextEn: 'Full substantive bonding of macrocyclics, resins, and sesquiterpene alcohols to epidermal keratin and textile fibers.',
      adviceForWearerAr: 'على الملابس ستستمر هذه المرحلة لأيام، خصوصاً على الأقمشة الصوفية والقطنية.',
      adviceForWearerEn: 'On clothing, this drydown will endure for several days, especially on wool and cotton fabrics.',
    },
    {
      id: 'spray-720',
      timeLabelAr: 'بعد 10 إلى 24+ ساعة',
      timeLabelEn: '10 to 24+ hours after spraying',
      timeMinutes: 720,
      stageNameAr: 'البصمة العطرية الخالدة والأثر الأخير (Lingering Skin Aura)',
      stageNameEn: 'Lingering Skin Aura & Eternal Sillage',
      stageSubtitleAr: 'أقصى درجات الثبات ونقاء جزيئات التثبيت والعود والعنبر',
      stageSubtitleEn: 'Ultimate tenacity of amber, oud, clean musks, and heavy fixatives',
      sillageRating: 'أثر عطري ملاصق للبشرة',
      sillageRatingEn: 'Skin-Close Velvet Aura',
      sillagePercent: 25,
      skinAdhesionPercent: 35,
      dominantPhase: 'drydown',
      evaporationStateAr: 'ثبات عميق لأثقل 10% من الزيت العطري ومثبتات الصيغة',
      evaporationStateEn: 'Deep substantive anchor of heaviest 10% essential oil and fixative matrix',
      whatHappensTextAr: `حتى بعد الاستحمام أو مرور يوم كامل، يظل أثر «${deepestAnchor}» والمثبتات ومكونات القاعدة مطبوعاً على الجلد كوشم عطري فاخر وناعم.`,
      whatHappensTextEn: `Even after an entire day, subtle traces of «${deepestAnchorEn}» and base fixatives linger on skin like a luxurious olfactory tattoo.`,
      olfactoryPerceptionTextAr: `رائحة نظافة فارهة، مسك ناعم، ودفء خشبي معتق يجعلك تبتسم في الصباح التالي عندما تستنشق قميصك أو معصمك.`,
      olfactoryPerceptionTextEn: `Pristine warmth, soft skin musks, and aged precious woods greeting you on your collar or wrist the next morning.`,
      chemicalDynamicTextAr: 'الثبات النهائي والـ Substantivity العالية للمركبات الطبيعية الثقيلة.',
      chemicalDynamicTextEn: 'Final substantive tenacity of high-boiling aromachemicals and natural heavy resins.',
      adviceForWearerAr: 'دليل قاطع على جودة الزيوت الخام ونقاء التركيب وحسن موازنة الهرم العطري!',
      adviceForWearerEn: 'Definitive proof of raw material purity, gravimetric formulation accuracy, and a masterfully balanced pyramid!',
    },
  ];

  const summaryStory = `يبدأ هذا العطر برحلة ساحرة تفتتحها أسرع الجزيئات طيراناً «${fastestFlyer}»، لتسحر الأنف في أول 15 دقيقة، ثم تسلم الراية بسلاسة إلى قلب العطر الزاخر بـ «${heartNames}» ليدوم الفوحان المتزن لعدة ساعات، وأخيراً ترسو التركيبة على قاعدة راسخة من «${deepestAnchor}» لتضمن ثباتاً أسطورياً يمتد لـ 24 ساعة.`;
  const summaryStoryEn = `This perfume embarks on a captivating olfactory journey initiated by the fastest volatile note «${fastestFlyerEn}», dazzling for the first 15 minutes before gracefully handing over to the rich heart bouquet of «${heartNamesEn}», and finally resting upon an anchor of «${deepestAnchorEn}» for 24+ hours of royal tenacity.`;

  return {
    stages,
    summaryStory,
    summaryStoryEn,
    totalNotesCount: notes.length,
    fastestFlyerName: fastestFlyer,
    fastestFlyerNameEn,
    deepestAnchorName: deepestAnchor,
    deepestAnchorNameEn,
  };
}

/**
 * Calculates note real-time evaporation and active olfactory presence percentage at a specific minute
 */
export function getNoteActivityAtMinute(rank: number, minutes: number): {
  activePercent: number; // 0 to 100
  evaporatedPercent: number; // 0 to 100
  statusTextAr: string;
  statusBadgeClass: string;
} {
  // Rank 1-2 (Ultra-fast citrus / aldehydes)
  if (rank <= 2) {
    if (minutes <= 5) return { activePercent: 100, evaporatedPercent: 0, statusTextAr: 'في قمة الانطلاق والتطاير 💨', statusBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (minutes <= 15) return { activePercent: 70, evaporatedPercent: 30, statusTextAr: 'تطاير سريع ونشط ⚡', statusBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (minutes <= 30) return { activePercent: 30, evaporatedPercent: 70, statusTextAr: 'تلاشي تدريجي للقمة 🍃', statusBadgeClass: 'bg-stone-100 text-stone-600 border-stone-200' };
    if (minutes <= 60) return { activePercent: 10, evaporatedPercent: 90, statusTextAr: 'أثر طفيف متلاشٍ', statusBadgeClass: 'bg-stone-100 text-stone-400 border-stone-200' };
    return { activePercent: 0, evaporatedPercent: 100, statusTextAr: 'تبخر بالكامل في الهواء ✓', statusBadgeClass: 'bg-stone-50 text-stone-400 border-stone-200' };
  }

  // Rank 3-4 (Fresh aromatics, spices, light florals)
  if (rank <= 4) {
    if (minutes <= 15) return { activePercent: 85, evaporatedPercent: 15, statusTextAr: 'ظهور واعد خلف القمة 🌿', statusBadgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    if (minutes <= 45) return { activePercent: 100, evaporatedPercent: 0, statusTextAr: 'في ذروة الفوحان والأناقة ✨', statusBadgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
    if (minutes <= 90) return { activePercent: 65, evaporatedPercent: 35, statusTextAr: 'تبخر متزن نشط 🌸', statusBadgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (minutes <= 180) return { activePercent: 25, evaporatedPercent: 75, statusTextAr: 'تسليم الراية للقلب والقاعدة', statusBadgeClass: 'bg-stone-100 text-stone-600 border-stone-200' };
    return { activePercent: 0, evaporatedPercent: 100, statusTextAr: 'تبخر بالكامل ✓', statusBadgeClass: 'bg-stone-50 text-stone-400 border-stone-200' };
  }

  // Rank 5-6 (True Heart florals, warm spices, woods transition)
  if (rank <= 6) {
    if (minutes <= 20) return { activePercent: 30, evaporatedPercent: 5, statusTextAr: 'تتفتح وتدفأ بالحرارة 🌸', statusBadgeClass: 'bg-sky-50 text-sky-800 border-sky-200' };
    if (minutes <= 60) return { activePercent: 80, evaporatedPercent: 10, statusTextAr: 'تصاعد قوي لقلب العطر 🌺', statusBadgeClass: 'bg-sky-100 text-sky-900 border-sky-300' };
    if (minutes <= 180) return { activePercent: 100, evaporatedPercent: 20, statusTextAr: 'ذروة البصمة وهوية العطر 🌟', statusBadgeClass: 'bg-rose-100 text-rose-950 border-rose-300' };
    if (minutes <= 300) return { activePercent: 60, evaporatedPercent: 50, statusTextAr: 'تناغم دافئ مع القاعدة ⏳', statusBadgeClass: 'bg-stone-100 text-stone-700 border-stone-200' };
    if (minutes <= 480) return { activePercent: 20, evaporatedPercent: 80, statusTextAr: 'أثر قلبي رقيق متبقٍ', statusBadgeClass: 'bg-stone-100 text-stone-500 border-stone-200' };
    return { activePercent: 0, evaporatedPercent: 100, statusTextAr: 'اكتملت دورة القلب ✓', statusBadgeClass: 'bg-stone-50 text-stone-400 border-stone-200' };
  }

  // Rank 7-8 (Deep woods, vanilla, amber foundation)
  if (rank <= 8) {
    if (minutes <= 30) return { activePercent: 15, evaporatedPercent: 0, statusTextAr: 'مرساة كامنة بالخلفية ⚓', statusBadgeClass: 'bg-stone-100 text-stone-600 border-stone-200' };
    if (minutes <= 120) return { activePercent: 50, evaporatedPercent: 5, statusTextAr: 'صعود دفء الأخشاب والبلسم 🪵', statusBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (minutes <= 360) return { activePercent: 100, evaporatedPercent: 20, statusTextAr: 'سيادة تامة وقوة ثبات هائلة 🛡️', statusBadgeClass: 'bg-amber-200 text-amber-950 border-amber-400 font-bold' };
    if (minutes <= 600) return { activePercent: 65, evaporatedPercent: 40, statusTextAr: 'جفاف ناعم ثابت على الجلد', statusBadgeClass: 'bg-amber-100 text-amber-900 border-amber-300' };
    return { activePercent: 35, evaporatedPercent: 65, statusTextAr: 'ثبات مخملي مستمر 12+ ساعة ⏳', statusBadgeClass: 'bg-stone-900 text-amber-300 border-stone-700' };
  }

  // Rank 9-10 (Oud, Ambergris, Musk, Heavy Resins)
  if (minutes <= 45) return { activePercent: 10, evaporatedPercent: 0, statusTextAr: 'ثبات كيميائي عميق بالأسفل ⚓', statusBadgeClass: 'bg-stone-100 text-stone-600 border-stone-200' };
  if (minutes <= 180) return { activePercent: 40, evaporatedPercent: 2, statusTextAr: 'تفاعل عميق مع كيمياء البشرة 🧬', statusBadgeClass: 'bg-stone-200 text-stone-900 border-stone-300' };
  if (minutes <= 480) return { activePercent: 90, evaporatedPercent: 10, statusTextAr: 'بصمة شرقية ملكية سائدة 👑', statusBadgeClass: 'bg-amber-300 text-stone-950 border-amber-500 font-bold' };
  if (minutes <= 720) return { activePercent: 100, evaporatedPercent: 15, statusTextAr: 'ذروة الجفاف الملكي (Drydown) 🌟', statusBadgeClass: 'bg-stone-950 text-amber-400 border-amber-600 font-bold' };
  return { activePercent: 75, evaporatedPercent: 25, statusTextAr: 'أثر خالد وملاصق للبشرة والملابس 24+ ساعة ⚓', statusBadgeClass: 'bg-stone-950 text-amber-400 border-amber-600 font-bold' };
}

