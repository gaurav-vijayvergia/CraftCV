import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type LayoutType = 'classic' | 'modern' | 'minimal' | 'creative';

export interface Layout {
  id: LayoutType;
  name: string;
  description: string;
  preview: string;
  styles: {
    container: string;
    header: string;
    content: string;
    columns: number;
    spacing: string;
    accent: string;
  };
}

export interface Template {
  id: string;
  name: string;
  layout: LayoutType | null;
  sections: TemplateSection[];
  isDefault: boolean;
  createdAt: string;
}

export interface TemplateSection {
  id: string;
  type: string;
  title: string;
}

interface TemplateState {
  templates: Template[];
  sections: TemplateSection[];
  selectedLayout: LayoutType | null;
  isUsingUploadedTemplate: boolean;
  uploadedTemplateUrl: string | null;
  addSection: (type: string, title: string) => void;
  removeSection: (id: string) => void;
  updateSections: (sections: TemplateSection[]) => void;
  setLayout: (layout: LayoutType) => void;
  saveTemplate: (name?: string) => Promise<void>;
  setDefaultTemplate: (id: string) => void;
  removeTemplate: (id: string) => void;
  selectTemplate: (template: Template) => void;
  setUploadedTemplate: (url: string | null) => void;
  resetTemplate: () => void;
}

export const layouts: Layout[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional layout with a clean, professional look',
    preview: '/layouts/classic.png',
    styles: {
      container: 'max-w-[21cm] mx-auto bg-white shadow-lg p-8',
      header: 'border-b-2 border-gray-900 pb-4 mb-6',
      content: 'space-y-6',
      columns: 1,
      spacing: 'gap-6',
      accent: 'border-gray-900',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with bold elements',
    preview: '/layouts/modern.png',
    styles: {
      container: 'max-w-[21cm] mx-auto bg-white shadow-lg p-8 grid grid-cols-3 gap-8',
      header: 'col-span-3 border-l-4 border-primary pl-4',
      content: 'space-y-8',
      columns: 3,
      spacing: 'gap-8',
      accent: 'border-primary',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant with focus on content',
    preview: '/layouts/minimal.png',
    styles: {
      container: 'max-w-[21cm] mx-auto bg-white shadow-lg p-12',
      header: 'text-center mb-8',
      content: 'space-y-8',
      columns: 1,
      spacing: 'gap-8',
      accent: 'border-gray-200',
    },
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Unique design for creative professionals',
    preview: '/layouts/creative.png',
    styles: {
      container: 'max-w-[21cm] mx-auto bg-white shadow-lg grid grid-cols-4 gap-6 p-6',
      header: 'col-span-4 bg-primary text-white p-6 rounded-lg',
      content: 'space-y-6',
      columns: 4,
      spacing: 'gap-6',
      accent: 'border-primary',
    },
  },
];

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  sections: [],
  selectedLayout: null,
  isUsingUploadedTemplate: false,
  uploadedTemplateUrl: null,

  addSection: (type: string, title: string) => {
    const newSection = {
      id: uuidv4(),
      type,
      title,
    };
    set((state) => ({
      sections: [...state.sections, newSection],
    }));
  },

  removeSection: (id: string) => {
    set((state) => ({
      sections: state.sections.filter((section) => section.id !== id),
    }));
  },

  updateSections: (sections: TemplateSection[]) => {
    set({ sections });
  },

  setLayout: (layout: LayoutType) => {
    set({ selectedLayout: layout });
  },

  saveTemplate: async (name?: string) => {
    const state = get();
    const templateName = name || `Template ${state.templates.length + 1}`;

    const newTemplate: Template = {
      id: uuidv4(),
      name: templateName,
      layout: state.selectedLayout,
      sections: [...state.sections],
      isDefault: state.templates.length === 0,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      templates: [...state.templates, newTemplate],
    }));
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

  selectTemplate: (template: Template) => {
    set({
      sections: [...template.sections],
      selectedLayout: template.layout,
    });
  },

  setUploadedTemplate: (url: string | null) => {
    set({
      isUsingUploadedTemplate: !!url,
      uploadedTemplateUrl: url,
      selectedLayout: null,
      sections: [],
    });
  },

  resetTemplate: () => {
    set({
      sections: [],
      selectedLayout: null,
      isUsingUploadedTemplate: false,
      uploadedTemplateUrl: null,
    });
  },
}));
