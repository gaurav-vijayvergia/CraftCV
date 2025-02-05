import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { createTemplate, getTemplates, setDefaultTemplate as setDefaultTemplateApi, deleteTemplate as deleteTemplateApi } from '../services/api';

export type LayoutType = '1-column' | '2-column';

export interface Section {
  id: string;
  type: string;
  title: string;
  column?: 'left' | 'right' | 'full';
}

export interface Template {
  id: string;
  name: string;
  layout: LayoutType;
  sections: Section[];
  isDefault: boolean;
  createdAt: string;
}

interface TemplateState {
  templates: Template[];
  sections: Section[];
  selectedLayout: LayoutType | null;
  isLoading: boolean;
  error: string | null;
  addSection: (section: Section) => void;
  removeSection: (id: string) => void;
  updateSections: (sections: Section[]) => void;
  setLayout: (layout: LayoutType) => void;
  saveTemplate: (name: string) => Promise<void>;
  setDefaultTemplate: (id: string) => Promise<void>;
  removeTemplate: (id: string) => Promise<void>;
  fetchTemplates: () => Promise<void>;
  selectTemplate: (template: Template) => void;
  resetTemplate: () => void;
  initializeLayout: (layout: LayoutType) => void;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  sections: [],
  selectedLayout: null,
  isLoading: false,
  error: null,

  addSection: (section) => {
    const newSection = { ...section, id: uuidv4() };
    set((state) => ({
      sections: [...state.sections, newSection],
    }));
  },

  removeSection: (id: string) => {
    set((state) => ({
      sections: state.sections.filter((section) => section.id !== id),
    }));
  },

  updateSections: (sections: Section[]) => {
    set({ sections });
  },

  setLayout: (layout: LayoutType) => {
    set({ selectedLayout: layout });
  },

  initializeLayout: (layout: LayoutType) => {
    set({
      selectedLayout: layout,
      sections: [],
    });
  },

  saveTemplate: async (name: string) => {
    const state = get();
    set({ isLoading: true, error: null });

    try {
      const response = await createTemplate({
        name,
        layout: state.selectedLayout!,
        sections: state.sections,
        is_default: state.templates.length === 0
      });

      const newTemplate: Template = {
        id: response.id,
        name: response.name,
        layout: response.layout as LayoutType,
        sections: response.sections,
        isDefault: response.is_default,
        createdAt: response.created_at,
      };

      set((state) => ({
        templates: [...state.templates, newTemplate],
        sections: [],
        selectedLayout: null,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: 'Failed to save template',
        isLoading: false
      });
      throw error;
    }
  },

  setDefaultTemplate: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await setDefaultTemplateApi(id);
      set((state) => ({
        templates: state.templates.map((template) => ({
          ...template,
          isDefault: template.id === id,
        })),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: 'Failed to set default template',
        isLoading: false
      });
      throw error;
    }
  },

  removeTemplate: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteTemplateApi(id);
      set((state) => ({
        templates: state.templates.filter((template) => template.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: 'Failed to delete template',
        isLoading: false
      });
      throw error;
    }
  },

  fetchTemplates: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getTemplates();
      const templates: Template[] = response.map(t => ({
        id: t.id,
        name: t.name,
        layout: t.layout as LayoutType,
        sections: t.sections,
        isDefault: t.is_default,
        createdAt: t.created_at,
      }));
      set({ templates, isLoading: false });
    } catch (error) {
      set({
        error: 'Failed to fetch templates',
        isLoading: false
      });
      throw error;
    }
  },

  selectTemplate: (template: Template) => {
    set({
      sections: [...template.sections],
      selectedLayout: template.layout,
    });
  },

  resetTemplate: () => {
    set({
      sections: [],
      selectedLayout: null,
    });
  },
}));
