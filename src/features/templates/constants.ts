import { SectionType, SECTION_TYPES } from './types';

// Define available sections that match Jinja template sections
export const AVAILABLE_SECTIONS = [
  {
    type: SECTION_TYPES.HEADER,
    title: 'Header',
    description: 'Organization logo and name',
    allowedColumns: ['full'] as const,
    required: true,
    maxInstances: 1
  },
  {
    type: SECTION_TYPES.PERSONAL_INFO,
    title: 'Personal Information',
    description: 'Name, contact details, and location',
    allowedColumns: ['left', 'full'] as const,
    required: true,
    maxInstances: 1
  },
  {
    type: SECTION_TYPES.SUMMARY,
    title: 'Professional Summary',
    description: 'Brief career overview',
    allowedColumns: ['right', 'full'] as const,
    required: false,
    maxInstances: 1
  },
  {
    type: SECTION_TYPES.EXPERIENCE,
    title: 'Work Experience',
    description: 'Professional history',
    allowedColumns: ['right', 'full'] as const,
    required: true,
    maxInstances: 1
  },
  {
    type: SECTION_TYPES.EDUCATION,
    title: 'Education',
    description: 'Academic background',
    allowedColumns: ['right', 'full'] as const,
    required: true,
    maxInstances: 1
  },
  {
    type: SECTION_TYPES.SKILLS,
    title: 'Skills',
    description: 'Technical and soft skills',
    allowedColumns: ['left', 'full'] as const,
    required: true,
    maxInstances: 1
  },
  {
    type: SECTION_TYPES.CERTIFICATIONS,
    title: 'Certifications',
    description: 'Professional certifications',
    allowedColumns: ['left', 'full'] as const,
    required: false,
    maxInstances: 1
  },
  {
    type: SECTION_TYPES.FOOTER,
    title: 'Footer',
    description: 'Additional information',
    allowedColumns: ['full'] as const,
    required: false,
    maxInstances: 1
  }
] as const;

// Default layouts that match backend's Jinja templates
export const DEFAULT_LAYOUTS = {
  '1-column': {
    name: 'Single Column',
    description: 'Traditional layout with sections stacked vertically',
    defaultSections: [
      { type: SECTION_TYPES.HEADER, column: 'full' },
      { type: SECTION_TYPES.PERSONAL_INFO, column: 'full' },
      { type: SECTION_TYPES.SUMMARY, column: 'full' },
      { type: SECTION_TYPES.EXPERIENCE, column: 'full' },
      { type: SECTION_TYPES.EDUCATION, column: 'full' },
      { type: SECTION_TYPES.SKILLS, column: 'full' },
      { type: SECTION_TYPES.CERTIFICATIONS, column: 'full' },
      { type: SECTION_TYPES.FOOTER, column: 'full' }
    ]
  },
  '2-column': {
    name: 'Two Columns',
    description: 'Modern layout with sidebar for personal info and skills',
    defaultSections: [
      { type: SECTION_TYPES.HEADER, column: 'full' },
      { type: SECTION_TYPES.PERSONAL_INFO, column: 'left' },
      { type: SECTION_TYPES.SKILLS, column: 'left' },
      { type: SECTION_TYPES.CERTIFICATIONS, column: 'left' },
      { type: SECTION_TYPES.SUMMARY, column: 'right' },
      { type: SECTION_TYPES.EXPERIENCE, column: 'right' },
      { type: SECTION_TYPES.EDUCATION, column: 'right' },
      { type: SECTION_TYPES.FOOTER, column: 'full' }
    ]
  }
} as const;

// Helper to validate section placement
export const isValidSectionPlacement = (
  type: SectionType,
  column: string
): boolean => {
  const sectionConfig = AVAILABLE_SECTIONS.find(s => s.type === type);
  return sectionConfig?.allowedColumns.includes(column as any) ?? false;
};

// Helper to check if a section can be added
export const canAddSection = (
  type: SectionType,
  existingSections: { type: string }[]
): boolean => {
  const sectionConfig = AVAILABLE_SECTIONS.find(s => s.type === type);
  if (!sectionConfig) return false;

  const currentCount = existingSections.filter(s => s.type === type).length;
  return currentCount < sectionConfig.maxInstances;
};