import { create } from 'zustand';
import {
  getOrganization,
  updateOrganization,
  uploadLogo,
  deleteLogo,
  uploadTemplate,
  deleteTemplate,
} from '../services/api';

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
  isLoading: boolean;
  error: string | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: Partial<OrganizationSettings>) => Promise<void>;
  uploadLogo: (file: File) => Promise<void>;
  removeLogo: () => Promise<void>;
  uploadTemplate: (file: File) => Promise<void>;
  removeTemplate: () => Promise<void>;
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
  isLoading: false,
  error: null,
  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getOrganization();
      set({
        settings: {
          logo: data.logo_url,
          primaryColor: data.primary_color,
          secondaryColor: data.secondary_color,
          font: data.font,
          cvTemplate: data.cv_template_url,
          theme: data.theme,
        },
        isLoading: false,
      });
    } catch {
      set({ error: 'Failed to fetch organization settings', isLoading: false });
    }
  },
  updateSettings: async (newSettings) => {
    set({ isLoading: true, error: null });
    try {
      const data = await updateOrganization({
        logo_url: newSettings.logo,
        primary_color: newSettings.primaryColor,
        secondary_color: newSettings.secondaryColor,
        font: newSettings.font,
        cv_template_url: newSettings.cvTemplate,
        theme: newSettings.theme,
      });
      set({
        settings: {
          logo: data.logo_url,
          primaryColor: data.primary_color,
          secondaryColor: data.secondary_color,
          font: data.font,
          cvTemplate: data.cv_template_url,
          theme: data.theme,
        },
        isLoading: false,
      });
    } catch {
      set({ error: 'Failed to update organization settings', isLoading: false });
    }
  },
  uploadLogo: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const data = await uploadLogo(file);
      set((state) => ({
        settings: { ...state.settings, logo: data.logo_url },
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to upload logo', isLoading: false });
    }
  },
  removeLogo: async () => {
    set({ isLoading: true, error: null });
    try {
      await deleteLogo();
      set((state) => ({
        settings: { ...state.settings, logo: null },
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to remove logo', isLoading: false });
    }
  },
  uploadTemplate: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const data = await uploadTemplate(file);
      set((state) => ({
        settings: { ...state.settings, cvTemplate: data.cv_template_url },
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to upload template', isLoading: false });
    }
  },
  removeTemplate: async () => {
    set({ isLoading: true, error: null });
    try {
      await deleteTemplate();
      set((state) => ({
        settings: { ...state.settings, cvTemplate: null },
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to remove template', isLoading: false });
    }
  },
}));