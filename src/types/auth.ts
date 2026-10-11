export interface UserProfile {
  id: string;
  name: string;
  email: string;
  craftLevel: 'hobbyist' | 'perfumer' | 'master_lab';
  craftLevelLabelAr: string;
  regionId: string;
  createdAt: string;
  lastLogin: string;
  formulaCount: number;
  dataProtectionConsents: {
    privacyPolicyAccepted: boolean;
    clientEncryptionEnabled: boolean;
    autoPurgeThirtyDays: boolean;
  };
}

export interface AuthSession {
  user: UserProfile | null;
  isAuthenticated: boolean;
  token?: string;
}
