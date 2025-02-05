import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Layout, Section, Template } from '../types';
import { layoutPresets } from '../constants';

interface TemplateState {
  templates: Template[];
  sections: Section[];
  selectedLayout: Layout | null;
  addSection: (section: Section) => void;
  removeSection: (id: string) => void;
  updateSections: (sections: Section[]) => void;
  setLayout: (layout: Layout) => void;
  saveTemplate: (name: string) => Promise<void>;
  setDefaultTemplate: (id: string) => void;
  removeTemplate: (id: string) => void;
  initializeLayout: (layout: Layout) => void;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  sections: [],
  selectedLayout: null,

  initializeLayout: (layout: Layout) => {
    set({
      selectedLayout: layout,
      sections: layoutPresets[layout],
    });
  },

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

  setLayout: (layout: Layout) => {
    set({ selectedLayout: layout });
  },

  saveTemplate: async (name: string) => {
    set((state) => {
      const newTemplate: Template = {
        id: uuidv4(),
        name,
        layout: state.selectedLayout!,
        sections: [...state.sections],
        isDefault: state.templates.length === 0,
        createdAt: new Date().toISOString(),
      };

      return {
        templates: [...state.templates, newTemplate],
        sections: [],
        selectedLayout: null,
      };
    });
  },

  setDefaultTemplate: (id: string) => {
    set((state) => ({
      templates: state.templates.map((template) => ({
        ...template,
        isDefault: template.id === id,
      })),
    }));
  },

  removeTemplate: (id: string) => {
    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id),
    }));
  },
}));