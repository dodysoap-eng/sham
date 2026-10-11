import { UserDetailedAddress } from '../types/address';
import { findCountryByCode, WORLD_COUNTRIES } from '../data/worldCountries';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ADDRESS_STORAGE_KEY = 'sham_perfume_detailed_address';

export function getDefaultDetailedAddress(countryCode: string = 'SA'): UserDetailedAddress {
  const country = findCountryByCode(countryCode) || WORLD_COUNTRIES[0];
  return {
    countryCode: country.code,
    countryNameAr: country.nameAr,
    countryNameEn: country.nameEn,
    city: country.code === 'SA' ? 'الرياض' : country.code === 'EG' ? 'القاهرة' : country.code === 'AE' ? 'دبي' : '',
    district: country.code === 'SA' ? 'حي الياسمين' : country.code === 'EG' ? 'المعادي' : country.code === 'AE' ? 'وسط المدينة' : '',
    street: '',
    postalCode: '',
    labOrFacilityName: 'مختبر صمم عطرك مع شام',
    facilityType: 'artisan_studio',
    phoneNumber: `${country.phoneCode} `,
    additionalNotes: 'تخزين المواد العطرية والزيوت في درجة حرارة 18-22 مئوية بعيداً عن الضوء المباشر.',
    updatedAt: new Date().toISOString().split('T')[0],
  };
}

export function loadDetailedAddress(countryCodeFallback: string = 'SA'): UserDetailedAddress {
  try {
    const raw = localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as UserDetailedAddress;
      if (parsed && parsed.countryCode) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load detailed address from localStorage:', e);
  }
  return getDefaultDetailedAddress(countryCodeFallback);
}

export async function saveDetailedAddress(
  address: UserDetailedAddress,
  userId?: string
): Promise<void> {
  try {
    const toSave: UserDetailedAddress = {
      ...address,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(toSave));

    // If user is logged in, sync address to their Firestore user doc
    if (userId) {
      try {
        const userDocRef = doc(db, 'users', userId);
        await setDoc(userDocRef, { detailedAddress: toSave }, { merge: true });
      } catch (firestoreErr) {
        console.warn('Notice syncing address to Firestore:', firestoreErr);
      }
    }
  } catch (e) {
    console.error('Failed to save detailed address:', e);
  }
}
