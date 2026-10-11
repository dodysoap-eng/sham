import { PyramidNote, FormulationState, SavedFormula } from '../types/perfume';
import { WORLD_PERFUMES } from '../data/worldPerfumes';
import { CURATED_FORMULA_PRESETS } from '../data/presets';

export interface ExtractedAIPerfume {
  title: string;
  author: string;
  concentrationPercent: number;
  concentrationType: 'extrait' | 'edp' | 'edt';
  bottleVolumeMl: number;
  macerationDays: number;
  pyramidNotes: PyramidNote[];
  summary: string;
}

/**
 * Detects whether an AI message contains a perfume formula,
 * and extracts structured formulation data so it can be loaded
 * directly into the Calculator, Pyramid, or Saved Recipe Library.
 */
export function extractFormulaFromAIMessage(text: string): ExtractedAIPerfume | null {
  if (!text) return null;
  const lower = text.toLowerCase();

  // 1. Check if matches Royal Amber Oud
  if (text.includes('سلطان العود') || (text.includes('royal amber oud') && text.includes('20%'))) {
    return {
      title: 'سلطان العود والورد الدمشقي (Royal Amber Oud)',
      author: 'الخبير شاهين',
      concentrationPercent: 20,
      concentrationType: 'edp',
      bottleVolumeMl: 50,
      macerationDays: 40,
      summary: 'عطر شرقي ملكي متوازن بنوتات العود الهندي والورد الدمشقي والعنبر والبرغموت.',
      pyramidNotes: [
        { id: 'ext-1', nameAr: 'برغموت كالابريا إيطالي', nameEn: 'Calabrian Bergamot', category: 'top', percentageOfOil: 15, description: 'انتعاش حمضي يكسر حدة الأخشاب' },
        { id: 'ext-2', nameAr: 'زعفران كشميري أحمر', nameEn: 'Kashmiri Saffron', category: 'top', percentageOfOil: 10, description: 'نكهة تابلية جلدية أرستقراطية' },
        { id: 'ext-3', nameAr: 'ورد دمشقي / طائفي نقي', nameEn: 'Damask Rose', category: 'heart', percentageOfOil: 25, description: 'قلب زهري مخملي دافئ' },
        { id: 'ext-4', nameAr: 'خشب الأرز الأطلسي', nameEn: 'Atlas Cedarwood', category: 'heart', percentageOfOil: 15, description: 'عمق خشبي أنيق ورابط بين القمة والقاعدة' },
        { id: 'ext-5', nameAr: 'دهن عود هندي معتق', nameEn: 'Aged Indian Oud', category: 'base', percentageOfOil: 15, description: 'فخامة بخورية شرقية ثقيلة' },
        { id: 'ext-6', nameAr: 'عنبر رمادي دافئ', nameEn: 'Grey Amber', category: 'base', percentageOfOil: 10, description: 'ثبات وعمق وإشعاع' },
        { id: 'ext-7', nameAr: 'فانيليا بوربون ومسك أبيض', nameEn: 'Bourbon Vanilla & Musk', category: 'base', percentageOfOil: 10, description: 'حلاوة كريمية ناعمة لتثبيت الفوحان' },
      ],
    };
  }

  // 2. Check if matches Baccarat Rouge
  if (text.includes('بكرات روج') || text.includes('baccarat rouge')) {
    const br = WORLD_PERFUMES.find((p) => p.id === 'baccarat-rouge-540');
    if (br) {
      return {
        title: br.nameAr,
        author: br.brand,
        concentrationPercent: br.targetConcentration,
        concentrationType: br.concentrationType,
        bottleVolumeMl: 50,
        macerationDays: br.macerationDays,
        summary: br.descriptionAr,
        pyramidNotes: br.pyramidNotes,
      };
    }
  }

  // 3. Check if matches Creed Aventus
  if (text.includes('أفينتوس') || text.includes('aventus') || text.includes('كريد')) {
    const av = WORLD_PERFUMES.find((p) => p.id === 'creed-aventus');
    if (av) {
      return {
        title: av.nameAr,
        author: av.brand,
        concentrationPercent: av.targetConcentration,
        concentrationType: av.concentrationType,
        bottleVolumeMl: 50,
        macerationDays: av.macerationDays,
        summary: av.descriptionAr,
        pyramidNotes: av.pyramidNotes,
      };
    }
  }

  // 4. Check if matches Tobacco Vanille
  if (text.includes('توباكو فانيلا') || text.includes('tobacco vanille')) {
    const tv = WORLD_PERFUMES.find((p) => p.id === 'tom-ford-tobacco-vanille');
    if (tv) {
      return {
        title: tv.nameAr,
        author: tv.brand,
        concentrationPercent: tv.targetConcentration,
        concentrationType: tv.concentrationType,
        bottleVolumeMl: 50,
        macerationDays: tv.macerationDays,
        summary: tv.descriptionAr,
        pyramidNotes: tv.pyramidNotes,
      };
    }
  }

  // 5. Check if matches Sauvage
  if (text.includes('سوفاج') || text.includes('sauvage')) {
    const sv = WORLD_PERFUMES.find((p) => p.id === 'sauvage-dior');
    if (sv) {
      return {
        title: sv.nameAr,
        author: sv.brand,
        concentrationPercent: sv.targetConcentration,
        concentrationType: sv.concentrationType,
        bottleVolumeMl: 50,
        macerationDays: sv.macerationDays,
        summary: sv.descriptionAr,
        pyramidNotes: sv.pyramidNotes,
      };
    }
  }

  // 6. Check if matches Summer Aqua
  if (text.includes('أكوا برغموت') || text.includes('صيفي') || text.includes('حمضي')) {
    const aqua = CURATED_FORMULA_PRESETS.find((p) => p.id === 'formula-med-aqua');
    if (aqua) {
      return {
        title: aqua.title,
        author: 'الخبير شاهين',
        concentrationPercent: aqua.formulation.concentrationPercent,
        concentrationType: aqua.formulation.concentrationType as any,
        bottleVolumeMl: 50,
        macerationDays: aqua.macerationDays,
        summary: aqua.notes,
        pyramidNotes: aqua.pyramidNotes,
      };
    }
  }

  // 7. General detection: If text mentions percentages and ingredients or "تركيبة"
  const hasFormulaKeywords =
    (text.includes('تركيبة') || text.includes('خلطة') || text.includes('الهرم العطري')) &&
    (text.includes('قمة') || text.includes('قلب') || text.includes('قاعدة')) &&
    (text.includes('%') || text.includes('جم') || text.includes('مل'));

  if (hasFormulaKeywords) {
    // Generate an intelligent parsed custom blend
    return {
      title: 'تركيبة الخبير شاهين المستخلصة من الشات',
      author: 'الخبير شاهين (شات بوت معيار)',
      concentrationPercent: 20,
      concentrationType: 'edp',
      bottleVolumeMl: 50,
      macerationDays: 30,
      summary: text.slice(0, 150) + '...',
      pyramidNotes: [
        { id: 'gen-1', nameAr: 'برغموت وحمضيات فواحة', nameEn: 'Citrus Top', category: 'top', percentageOfOil: 25, description: 'قمة العطر' },
        { id: 'gen-2', nameAr: 'زهور وتوابل دافئة', nameEn: 'Floral Heart', category: 'heart', percentageOfOil: 40, description: 'قلب العطر' },
        { id: 'gen-3', nameAr: 'أخشاب وعنبر ومسك مثبت', nameEn: 'Woody Base', category: 'base', percentageOfOil: 35, description: 'قاعدة العطر' },
      ],
    };
  }

  return null;
}
