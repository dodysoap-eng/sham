import { WORLD_COUNTRIES, WorldCountryData, findCountryByCode } from '../data/worldCountries';
import { detectUserCountryAndLanguage, saveUserCountryCode } from './geoDetector';

export interface UserEnvironmentProfile {
  regionId: string;
  countryCode: string;
  countryFlag: string;
  countryNameAr: string;
  countryNameEn: string;
  climateType: 'hot_arid' | 'mediterranean' | 'cold_temperate' | 'tropical_humid';
  climateLabelAr: string;
  climateLabelEn: string;
  currencyCode: string;
  currencySymbolAr: string;
  currencySymbolEn: string;
  tolaSupport: boolean; // 1 Tola = 11.66g (Gulf & India standard)
  recommendedConcentrationType: 'extrait' | 'edp' | 'edt';
  recommendedConcentrationPercent: number;
  recommendedFixativePercent: number;
  recommendedBaseRatio: number; // percentage of pyramid for base
  traditionalNotes: Array<{
    nameAr: string;
    nameEn: string;
    category: 'top' | 'heart' | 'base';
    percentageOfOil: number;
    description: string;
  }>;
  climateAdviceAr: string;
  climateAdviceEn: string;
}

const TRADITIONAL_NOTES_BY_CLIMATE: Record<
  string,
  Array<{
    nameAr: string;
    nameEn: string;
    category: 'top' | 'heart' | 'base';
    percentageOfOil: number;
    description: string;
  }>
> = {
  hot_arid: [
    { nameAr: 'دهن عود كمبودي معتق', nameEn: 'Aged Cambodian Oud', category: 'base', percentageOfOil: 25, description: 'عمق تراثي دافئ وثبات يدوم طويلاً أمام درجات الحرارة' },
    { nameAr: 'زعفران أحمر ملكي', nameEn: 'Royal Red Saffron', category: 'heart', percentageOfOil: 15, description: 'طابع أرستقراطي شرقي فواح' },
    { nameAr: 'عنبر أبيض ومسك الغزال', nameEn: 'White Ambergris & Musk', category: 'base', percentageOfOil: 25, description: 'تثبيت عميق للأجواء الجافة' },
    { nameAr: 'ورد طائفي جبلي', nameEn: 'Taif Mountain Rose', category: 'heart', percentageOfOil: 20, description: 'قلب زهري ملوكي ندي' },
    { nameAr: 'هيل أخضر وبخور اللبان', nameEn: 'Cardamom & Frankincense', category: 'top', percentageOfOil: 15, description: 'افتتاحية ترحيبية مهيبة' },
  ],
  mediterranean: [
    { nameAr: 'ورد دمشقي بلدي قطفة أولى', nameEn: 'Damask Rose Absolute', category: 'heart', percentageOfOil: 30, description: 'عراقة الشام والروح الزهرية الأصيلة' },
    { nameAr: 'ياسمين بلدي وزهر النارنج', nameEn: 'Jasmine & Neroli Blossom', category: 'top', percentageOfOil: 25, description: 'انتعاش البيوت العتيقة المتوسطية' },
    { nameAr: 'خشب الأرز وسيدار الأطلس', nameEn: 'Cedarwood & Atlas Cedar', category: 'base', percentageOfOil: 25, description: 'قاعدة خشبية أرستقراطية صلبة' },
    { nameAr: 'لبان حوجري ومسك حرير', nameEn: 'Frankincense & Silk Musk', category: 'base', percentageOfOil: 20, description: 'طهارة ونقاء تدوم ساعات' },
  ],
  cold_temperate: [
    { nameAr: 'لافندر بروفانس الفرنسي', nameEn: 'French Provence Lavender', category: 'top', percentageOfOil: 25, description: 'كلاسيكية دور العطور الباريسية' },
    { nameAr: 'سوسن فلورنسا (Orris Iris)', nameEn: 'Florentine Orris Iris', category: 'heart', percentageOfOil: 20, description: 'بودرية مخملية فائقة الفخامة' },
    { nameAr: 'طحلب السنديان المتوافق مع IFRA', nameEn: 'IFRA Oakmoss', category: 'base', percentageOfOil: 20, description: 'عمق تشيبر باريسي أصيل' },
    { nameAr: 'برغموت كالابريا الإيطالي', nameEn: 'Calabrian Bergamot', category: 'top', percentageOfOil: 20, description: 'إشراقة إيطالية بلورية' },
    { nameAr: 'أيزو إي سوبر وخشب الصندل', nameEn: 'Iso E Super & Sandalwood', category: 'base', percentageOfOil: 15, description: 'هالة عطرية حديثة' },
  ],
  tropical_humid: [
    { nameAr: 'شاي أخضر وشاي أولونغ نقي', nameEn: 'Green & Oolong Tea', category: 'heart', percentageOfOil: 30, description: 'هدوء وتأمل وانتعاش غير خانق' },
    { nameAr: 'زهر الكرز واللوتس المائي', nameEn: 'Cherry Blossom & Water Lotus', category: 'top', percentageOfOil: 25, description: 'شفافية ناعمة كالحرير' },
    { nameAr: 'بخور الهينوكي والنجيل الهندي (Vetiver)', nameEn: 'Hinoki & Vetiver', category: 'base', percentageOfOil: 25, description: 'خشب معقم ومنعش للرطوبة' },
    { nameAr: 'مسك أبيض كريستالي شفاف', nameEn: 'Crystal White Musk', category: 'base', percentageOfOil: 20, description: 'نظافة مائية لا تزعج المحيط' },
  ],
};

export function createEnvironmentProfileFromCountry(country: WorldCountryData): UserEnvironmentProfile {
  const notes = TRADITIONAL_NOTES_BY_CLIMATE[country.climateType] || TRADITIONAL_NOTES_BY_CLIMATE.hot_arid;
  const baseRatio = country.climateType === 'hot_arid' ? 45 : country.climateType === 'tropical_humid' ? 30 : 35;

  return {
    regionId: country.code.toLowerCase(),
    countryCode: country.code,
    countryFlag: country.flag,
    countryNameAr: country.nameAr,
    countryNameEn: country.nameEn,
    climateType: country.climateType,
    climateLabelAr: country.climateLabelAr,
    climateLabelEn: country.climateLabelEn,
    currencyCode: country.currencyCode,
    currencySymbolAr: country.currencySymbolAr,
    currencySymbolEn: country.currencySymbolEn,
    tolaSupport: Boolean(country.tolaSupport),
    recommendedConcentrationType: country.recommendedConcentrationType,
    recommendedConcentrationPercent: country.recommendedConcentrationPercent,
    recommendedFixativePercent: country.recommendedFixativePercent,
    recommendedBaseRatio: baseRatio,
    traditionalNotes: notes,
    climateAdviceAr: country.climateAdviceAr,
    climateAdviceEn: country.climateAdviceEn,
  };
}

export const REGIONAL_ENVIRONMENTS: Record<string, UserEnvironmentProfile> = WORLD_COUNTRIES.reduce(
  (acc, country) => {
    acc[country.code.toLowerCase()] = createEnvironmentProfileFromCountry(country);
    return acc;
  },
  {} as Record<string, UserEnvironmentProfile>
);

const ENVIRONMENT_STORAGE_KEY = 'sham_perfume_user_environment';

export function getInitialUserEnvironment(): UserEnvironmentProfile {
  try {
    const savedCode = localStorage.getItem(ENVIRONMENT_STORAGE_KEY);
    if (savedCode) {
      const country = findCountryByCode(savedCode);
      if (country) {
        return createEnvironmentProfileFromCountry(country);
      }
      if (REGIONAL_ENVIRONMENTS[savedCode.toLowerCase()]) {
        return REGIONAL_ENVIRONMENTS[savedCode.toLowerCase()];
      }
    }

    // Auto-detect country based on geo detector
    const detected = detectUserCountryAndLanguage();
    return createEnvironmentProfileFromCountry(detected.detectedCountry);
  } catch (e) {
    // fallback
  }

  const defaultCountry = findCountryByCode('SA') || WORLD_COUNTRIES[0];
  return createEnvironmentProfileFromCountry(defaultCountry);
}

export function saveUserEnvironment(countryCodeOrId: string): UserEnvironmentProfile {
  let targetCountry = findCountryByCode(countryCodeOrId);
  if (!targetCountry) {
    targetCountry = WORLD_COUNTRIES.find((c) => c.code.toLowerCase() === countryCodeOrId.toLowerCase());
  }
  if (!targetCountry) {
    targetCountry = findCountryByCode('SA') || WORLD_COUNTRIES[0];
  }

  const profile = createEnvironmentProfileFromCountry(targetCountry);
  try {
    localStorage.setItem(ENVIRONMENT_STORAGE_KEY, targetCountry.code);
    saveUserCountryCode(targetCountry.code);
  } catch (e) {
    console.error('Failed to save environment profile', e);
  }
  return profile;
}
