import { create } from 'zustand';

interface OrganizationSettings {
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  font: string;
  cvTemplate: string | null;
  theme: 'light' | 'dark';
}

interface OrganizationState {
  settings: OrganizationSettings;
  updateSettings: (settings: Partial<OrganizationSettings>) => void;
}

export const useOrganizationStore = create<OrganizationState>((set) => ({
  settings: {
    logo: null,
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    font: 'Inter',
    cvTemplate: null,
    theme: 'light',
  },
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
}));