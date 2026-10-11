export interface UserDetailedAddress {
  countryCode: string; // ISO 2-letter, e.g. 'SA', 'EG', 'FR'
  countryNameAr: string;
  countryNameEn: string;
  city: string; // المدينة / المحافظة / الإمارة
  district: string; // الحي / المنطقة
  street: string; // الشارع / رقم المبنى
  postalCode: string; // الرمز البريدي
  labOrFacilityName: string; // اسم المعمل / المتجر / المنشأة العطرية
  facilityType: 'artisan_studio' | 'boutique' | 'factory' | 'ecommerce' | 'personal_lab';
  phoneNumber: string; // رقم هاتف التواصل مع كود الدولة
  additionalNotes?: string; // تعليمات الشحن أو التخزين المبرد
  updatedAt?: string;
}

export const FACILITY_TYPE_LABELS: Record<string, { ar: string; en: string }> = {
  artisan_studio: { ar: 'معمل تركيب يدوي وتجريبي (Artisan Studio)', en: 'Artisan Bespoke Studio' },
  boutique: { ar: 'متجر عطور ومعرض تجاري (Boutique)', en: 'Perfume Boutique' },
  factory: { ar: 'مصنع إنتاج وتعبئة عطور (Factory)', en: 'Production & Bottling Facility' },
  ecommerce: { ar: 'متجر إلكتروني ومستودع توزيع (E-Commerce Hub)', en: 'E-Commerce Hub' },
  personal_lab: { ar: 'مختبر منزلي شخصي (Personal Home Lab)', en: 'Personal Home Lab' },
};
