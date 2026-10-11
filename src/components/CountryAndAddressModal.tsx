import React, { useState } from 'react';
import {
  MapPin,
  Search,
  Globe,
  Compass,
  Building,
  Phone,
  FileText,
  Copy,
  Check,
  CheckCircle2,
  X,
  Sparkles,
  Thermometer,
  Layers,
  FlaskConical,
  Save,
  Send,
  Download,
  Info,
} from 'lucide-react';
import {
  WORLD_COUNTRIES,
  WorldCountryData,
  searchCountries,
  findCountryByCode,
} from '../data/worldCountries';
import { UserDetailedAddress, FACILITY_TYPE_LABELS } from '../types/address';
import {
  UserEnvironmentProfile,
  createEnvironmentProfileFromCountry,
  saveUserEnvironment,
} from '../utils/environmentAdapter';
import { saveDetailedAddress } from '../utils/addressStorage';
import { ExtractedAIPerfume } from '../utils/aiFormulaExtractor';
import { PyramidNote } from '../types/perfume';
import { UserProfile } from '../types/auth';

interface CountryAndAddressModalProps {
  currentProfile: UserEnvironmentProfile;
  currentAddress: UserDetailedAddress;
  currentUser: UserProfile | null;
  onUpdateProfile: (newProfile: UserEnvironmentProfile) => void;
  onUpdateAddress: (newAddress: UserDetailedAddress) => void;
  onApplyRegionalFormulaToWorkbench: (formula: ExtractedAIPerfume) => void;
  onClose: () => void;
}

export const CountryAndAddressModal: React.FC<CountryAndAddressModalProps> = ({
  currentProfile,
  currentAddress,
  currentUser,
  onUpdateProfile,
  onUpdateAddress,
  onApplyRegionalFormulaToWorkbench,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'country' | 'address'>('country');
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<'all' | 'arab' | 'europe' | 'asia' | 'americas'>('all');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    currentProfile.countryCode || 'SA'
  );

  // Address form fields
  const [addressForm, setAddressForm] = useState<UserDetailedAddress>({ ...currentAddress });
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedCountry = findCountryByCode(selectedCountryCode) || WORLD_COUNTRIES[0];
  const activeProfile = createEnvironmentProfileFromCountry(selectedCountry);

  // Filtered countries
  const filteredCountries = searchCountries(searchQuery).filter((c) => {
    if (regionFilter === 'all') return true;
    return c.regionCategory === regionFilter;
  });

  const handleSelectCountry = (country: WorldCountryData) => {
    setSelectedCountryCode(country.code);
    const newProfile = saveUserEnvironment(country.code);
    onUpdateProfile(newProfile);

    // Sync country with address form
    const updatedAddress: UserDetailedAddress = {
      ...addressForm,
      countryCode: country.code,
      countryNameAr: country.nameAr,
      countryNameEn: country.nameEn,
      phoneNumber: addressForm.phoneNumber.startsWith('+')
        ? addressForm.phoneNumber
        : `${country.phoneCode} `,
    };
    setAddressForm(updatedAddress);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveDetailedAddress(addressForm, currentUser?.id);
    onUpdateAddress(addressForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyFormattedAddress = () => {
    const formatted = `═══════════════════════════════════════════════════
بيانات مقر المعمل والعنوان التفصيلي · منصة صمم عطرك مع شام
═══════════════════════════════════════════════════
المنشأة العطرية: ${addressForm.labOrFacilityName || 'مختبر تركيب العطور'}
نوع المنشأة: ${FACILITY_TYPE_LABELS[addressForm.facilityType]?.ar || 'معمل تركيب'}
الدولة: ${selectedCountry.flag} ${addressForm.countryNameAr} (${addressForm.countryCode})
المدينة / المحافظة: ${addressForm.city || 'غير محدد'}
الحي / المنطقة: ${addressForm.district || 'غير محدد'}
الشارع / رقم المعمل: ${addressForm.street || 'غير محدد'}
الرمز البريدي: ${addressForm.postalCode || 'غير محدد'}
هاتف التواصل: ${addressForm.phoneNumber || 'غير محدد'}
ملاحظات الشحن والتخزين: ${addressForm.additionalNotes || 'لا توجد'}
═══════════════════════════════════════════════════`;

    navigator.clipboard.writeText(formatted);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  const handleApplyRegionalFormula = () => {
    const transformedNotes: PyramidNote[] = activeProfile.traditionalNotes.map((n, i) => ({
      id: `regional-note-${activeProfile.countryCode}-${i}`,
      nameAr: n.nameAr,
      nameEn: n.nameEn,
      category: n.category,
      percentageOfOil: n.percentageOfOil,
      description: n.description,
    }));

    const formula: ExtractedAIPerfume = {
      title: `توليفة موطن: ${activeProfile.countryNameAr.split('(')[0].trim()}`,
      author: `معمل صمم عطرك مع شام · ${activeProfile.countryNameAr}`,
      bottleVolumeMl: 50,
      concentrationPercent: activeProfile.recommendedConcentrationPercent,
      concentrationType: activeProfile.recommendedConcentrationType,
      macerationDays: activeProfile.climateType === 'hot_arid' ? 40 : 30,
      summary: `${activeProfile.climateAdviceAr} - مخصصة لبيئة ومناخ ${activeProfile.countryNameAr}.`,
      pyramidNotes: transformedNotes,
    };

    onApplyRegionalFormulaToWorkbench(formula);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 text-stone-900 flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 text-xl font-bold shadow-inner">
              {selectedCountry.flag}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>دليل دول العالم والعنوان التفصيلي</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[10px] font-mono border border-stone-700">
                  {selectedCountry.code} · {selectedCountry.currencyCode}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-serif-luxury mt-0.5">
                تحديد بلد ومقر المعمل العطري والعنوان التفصيلي
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full bg-stone-800 hover:bg-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-2 gap-2 text-xs font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('country')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'country'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80 font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-700" />
            <span>1. اختيار الدولة والمناخ العطري ({WORLD_COUNTRIES.length} دولة)</span>
          </button>
          <button
            onClick={() => setActiveTab('address')}
            className={`flex-1 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'address'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80 font-bold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
            }`}
          >
            <Building className="w-4 h-4 text-amber-700" />
            <span>2. خانات العنوان التفصيلي ومقر المعمل</span>
            {addressForm.city && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            )}
          </button>
        </div>

        {/* Body Container (Scrollable) */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          
          {/* TAB 1: ALL COUNTRIES SELECTOR & CLIMATE ADVICE */}
          {activeTab === 'country' && (
            <div className="space-y-6">
              
              {/* Active Selected Country Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-stone-50 border border-amber-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <span className="text-4xl shadow-xs">{selectedCountry.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-950 text-base sm:text-lg">
                        {selectedCountry.nameAr}
                      </span>
                      <span className="text-xs text-stone-500 font-mono">
                        ({selectedCountry.nameEn})
                      </span>
                    </div>
                    <div className="text-xs text-stone-600 mt-0.5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-800">
                        <Thermometer className="w-3.5 h-3.5" />
                        <span>{selectedCountry.climateLabelAr}</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-stone-700">
                        العملة: {selectedCountry.currencySymbolAr} ({selectedCountry.currencyCode})
                      </span>
                      <span>•</span>
                      <span className="font-mono text-stone-700">
                        مفتاح الاتصال: {selectedCountry.phoneCode}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={handleApplyRegionalFormula}
                    className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <FlaskConical className="w-4 h-4 text-amber-300" />
                    <span>تطبيق تركيبة {selectedCountry.nameAr.split('(')[0]} بالمعمل</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('address')}
                    className="px-3 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-stone-200"
                  >
                    <span>كتابة العنوان</span>
                  </button>
                </div>
              </div>

              {/* Fragrance Compounding Recommendations Card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                  <span className="text-[11px] text-stone-500">التركيز الموصى به للمناخ</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-amber-900">
                      {selectedCountry.recommendedConcentrationPercent}%
                    </span>
                    <span className="text-xs font-semibold text-stone-700 uppercase">
                      ({selectedCountry.recommendedConcentrationType})
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1">
                    مضبوط لمنع التبخر أو الاختناق
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                  <span className="text-[11px] text-stone-500">نسبة المثبت الكيميائي</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-amber-900">
                      {selectedCountry.recommendedFixativePercent}%
                    </span>
                    <span className="text-xs font-semibold text-stone-700">Ambroxan/DPG</span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1">
                    يحافظ على ثبات الفوحان
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
                  <span className="text-[11px] text-stone-500">دعم وزن التولة (Tola)</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-stone-900">
                      {selectedCountry.tolaSupport ? 'مفعل (11.66g)' : 'معايير الجرام الدولية'}
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-500 mt-1">
                    {selectedCountry.tolaSupport ? 'معتمد في التراث العطري' : 'وفق مقاييس IFRA العالمية'}
                  </span>
                </div>
              </div>

              {/* Climate Advice Text */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 leading-relaxed flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900">نصيحة الخبير شاهين لمناخ {selectedCountry.nameAr}: </span>
                  <span>{selectedCountry.climateAdviceAr}</span>
                </div>
              </div>

              {/* Search & Region Filter Bar */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث عن أي دولة بالاسم العربي أو الإنجليزي أو كود الدولة (SA, EG, FR, KW...)"
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-[11px] no-scrollbar">
                    {[
                      { id: 'all', label: 'جميع الدول' },
                      { id: 'arab', label: 'الدول العربية' },
                      { id: 'europe', label: 'أوروبا' },
                      { id: 'asia', label: 'آسيا' },
                      { id: 'americas', label: 'الأمريكتان' },
                    ].map((pill) => (
                      <button
                        key={pill.id}
                        onClick={() => setRegionFilter(pill.id as any)}
                        className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                          regionFilter === pill.id
                            ? 'bg-stone-900 text-white font-bold'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {pill.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Countries Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-80 overflow-y-auto pr-1">
                  {filteredCountries.map((country) => {
                    const isSelected = country.code === selectedCountryCode;
                    return (
                      <button
                        key={country.code}
                        onClick={() => handleSelectCountry(country)}
                        className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50/90 border-amber-800/70 shadow-xs ring-1 ring-amber-800/20'
                            : 'bg-white hover:bg-stone-50 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-2xl shrink-0">{country.flag}</span>
                          <div className="min-w-0">
                            <div className="font-bold text-stone-900 text-xs truncate">
                              {country.nameAr}
                            </div>
                            <div className="text-[10px] text-stone-500 font-mono truncate">
                              {country.nameEn} · {country.currencyCode}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                  {filteredCountries.length === 0 && (
                    <div className="col-span-full py-8 text-center text-stone-500 text-xs">
                      لم يتم العثور على دولة مطابقة لبحثك "{searchQuery}".
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DETAILED ADDRESS INQUIRY FIELDS */}
          {activeTab === 'address' && (
            <form onSubmit={handleSaveAddress} className="space-y-6">
              
              {/* Info Banner */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-stone-700 text-xs leading-relaxed flex items-start gap-3">
                <Building className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-stone-900">بيانات العنوان ومقر المعمل: </span>
                  تُستخدم هذه الخانات لتحديد موقع معملك الرسمي، وتضمينها تلقائياً في بطاقات تصنيع العطور المطبوعة، بوالص الشحن، وإرسال العينات للعملاء أو المختبرات.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Country Selection */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    الدولة / البلد المعتمد
                  </label>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 text-xs">
                    <span className="text-xl">{selectedCountry.flag}</span>
                    <span className="font-bold">{selectedCountry.nameAr}</span>
                    <span className="text-stone-500 font-mono">({selectedCountry.code})</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('country')}
                      className="mr-auto text-[11px] text-amber-800 hover:underline font-semibold cursor-pointer"
                    >
                      تغيير الدولة
                    </button>
                  </div>
                </div>

                {/* 2. Facility Name */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    اسم المنشأة أو المعمل العطري
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.labOrFacilityName}
                    onChange={(e) => setAddressForm({ ...addressForm, labOrFacilityName: e.target.value })}
                    placeholder="مثال: مختبر عطور الشام، دار الفخامة..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                {/* 3. Facility Type */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    نوع النشاط / المقر العطري
                  </label>
                  <select
                    value={addressForm.facilityType}
                    onChange={(e) => setAddressForm({ ...addressForm, facilityType: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 cursor-pointer"
                  >
                    {Object.entries(FACILITY_TYPE_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.ar}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. City / Governorate / State */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    المدينة / المحافظة / الإمارة / الولاية
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    placeholder="مثال: الرياض، دبي، القاهرة، باريس..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                {/* 5. District / Neighborhood */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    الحي / المنطقة
                  </label>
                  <input
                    type="text"
                    value={addressForm.district}
                    onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                    placeholder="مثال: حي الياسمين، المعادي، وسط البلد..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                {/* 6. Street Address & Building / Lab Number */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    اسم الشارع ورقم المبنى أو المعمل
                  </label>
                  <input
                    type="text"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    placeholder="مثال: طريق الملك فهد - مبنى رقم 12 - الطابق الثاني"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                {/* 7. Postal / ZIP Code */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    الرمز البريدي (Postal / ZIP Code)
                  </label>
                  <input
                    type="text"
                    value={addressForm.postalCode}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    placeholder="مثال: 12345 أو 75001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                {/* 8. Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    رقم هاتف التواصل مع كود الدولة الدولي
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phoneNumber}
                    onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                    placeholder={`${selectedCountry.phoneCode} 5XXXXXXXX`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 ltr:text-left text-left font-mono"
                  />
                </div>

                {/* 9. Additional Notes (Full width) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    ملاحظات الشحن والتخزين المبرد للعينات والزيوت
                  </label>
                  <textarea
                    rows={2}
                    value={addressForm.additionalNotes}
                    onChange={(e) => setAddressForm({ ...addressForm, additionalNotes: e.target.value })}
                    placeholder="تعليمات خاصة للاستلام، شحن الكحول، درجات الحرارة المطلوبة لحفظ الزيوت العطرية..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 resize-none"
                  />
                </div>

              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ وتحديث العنوان التفصيلي</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyFormattedAddress}
                    className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center gap-1.5 border border-stone-200 transition-all cursor-pointer"
                  >
                    {copiedAddress ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">تم نسخ العنوان!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-stone-500" />
                        <span>نسخ العنوان للشحن</span>
                      </>
                    )}
                  </button>
                </div>

                {savedSuccess && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>تم حفظ العنوان وتحديث بيانات المعمل بنجاح!</span>
                  </span>
                )}
              </div>

            </form>
          )}

        </div>

        {/* Footer */}
        <div className="bg-stone-100 p-4 sm:p-5 border-t border-stone-200 flex items-center justify-between shrink-0 text-xs">
          <div className="text-stone-500 text-[11px] flex items-center gap-2">
            <span>البلد النشط: {selectedCountry.flag} {selectedCountry.nameAr}</span>
            <span>•</span>
            <span>العملة: {selectedCountry.currencyCode}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
