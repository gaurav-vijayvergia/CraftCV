export type Layout = '1-column' | '2-column';

export interface Section {
  id: string;
  type: string;
  title: string;
  column: 'left' | 'right' | 'full';
}

export interface Template {
  id: string;
  name: string;
  layout: Layout;
  sections: Section[];
  isDefault: boolean;
  createdAt: string;
}

// Available section types that match backend's Jinja template variables
export const SECTION_TYPES = {
  HEADER: 'header',
  PERSONAL_INFO: 'personal-info',
  SUMMARY: 'summary',
  EXPERIENCE: 'experience',
  EDUCATION: 'education',
  SKILLS: 'skills',
  CERTIFICATIONS: 'certifications',
  FOOTER: 'footer'
} as const;

export type SectionType = typeof SECTION_TYPES[keyof typeof SECTION_TYPES];