import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Layout, Section, Template, SectionType } from '../features/templates/types';
import { DEFAULT_LAYOUTS, canAddSection } from '../features/templates/constants';
import { createTemplate, getTemplates, setDefaultTemplate as setDefaultTemplateApi, deleteTemplate as deleteTemplateApi } from '../services/api';

interface TemplateState {
  templates: Template[];
  sections: Section[];
  selectedLayout: Layout | null;
  isLoading: boolean;
  error: string | null;
  addSection: (type: SectionType, column: Section['column']) => void;
  removeSection: (id: string) => void;
  updateSections: (sections: Section[]) => void;
  initializeLayout: (layout: Layout) => void;
  saveTemplate: (name: string) => Promise<void>;
  setDefaultTemplate: (id: string) => Promise<void>;
  removeTemplate: (id: string) => Promise<void>;
  fetchTemplates: () => Promise<void>;
  resetTemplate: () => void;
  canAddSection: (type: SectionType) => boolean;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  sections: [],
  selectedLayout: null,
  isLoading: false,
  error: null,

  addSection: (type, column) => {
    const state = get();
    if (!canAddSection(type, state.sections)) return;

    const newSection: Section = {
      id: uuidv4(),
      type,
      title: type,
      column
    };

    set(state => ({
      sections: [...state.sections, newSection]
    }));
  },

  removeSection: (id) => {
    set(state => ({
      sections: state.sections.filter(section => section.id !== id)
    }));
  },

  updateSections: (sections) => {
    set({ sections });
  },

  initializeLayout: (layout) => {
    const defaultSections = DEFAULT_LAYOUTS[layout].defaultSections.map(section => ({
      id: uuidv4(),
      ...section,
      title: section.type
    }));

    set({
      selectedLayout: layout,
      sections: defaultSections
    });
  },

  saveTemplate: async (name) => {
    const state = get();
    if (!state.selectedLayout) return;

    set({ isLoading: true, error: null });

    try {
      const response = await createTemplate({
        name,
        layout: state.selectedLayout,
        sections: state.sections,
        is_default: state.templates.length === 0
      });

      set(state => ({
        templates: [...state.templates, {
          id: response.id,
          name: response.name,
          layout: response.layout as Layout,
          sections: response.sections,
          isDefault: response.is_default,
          createdAt: response.created_at
        }],
        sections: [],
        selectedLayout: null,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: 'Failed to save template',
        isLoading: false 
      });
      throw error;
    }
  },

  setDefaultTemplate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await setDefaultTemplateApi(id);
      set(state => ({
        templates: state.templates.map(template => ({
          ...template,
          isDefault: template.id === id
        })),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: 'Failed to set default template',
        isLoading: false 
      });
      throw error;
    }
  },

  removeTemplate: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteTemplateApi(id);
      set(state => ({
        templates: state.templates.filter(template => template.id !== id),
        isLoading: false
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
      const templates = response.map(t => ({
        id: t.id,
        name: t.name,
        layout: t.layout as Layout,
        sections: t.sections,
        isDefault: t.is_default,
        createdAt: t.created_at
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

  resetTemplate: () => {
    set({
      sections: [],
      selectedLayout: null
    });
  },

  canAddSection: (type) => {
    const state = get();
    return canAddSection(type, state.sections);
  }
}));