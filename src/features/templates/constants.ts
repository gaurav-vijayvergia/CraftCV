import { v4 as uuidv4 } from 'uuid';
import { Layout, Section } from './types';

// Predefined sections with unique IDs
export const createSection = (type: string, title: string, column: 'left' | 'right' | 'full'): Section => ({
  id: uuidv4(),
  type,
  title,
  column
});

// Layout presets with their default sections
export const layoutPresets: Record<Layout, Section[]> = {
  '1-column': [
    createSection('header', 'Header', 'full'),
    createSection('personal-info', 'Personal Info', 'full'),
    createSection('summary', 'Professional Summary', 'full'),
    createSection('experience', 'Work Experience', 'full'),
    createSection('education', 'Education', 'full'),
    createSection('skills', 'Skills', 'full'),
    createSection('certifications', 'Certifications', 'full'),
    createSection('footer', 'Footer', 'full'),
  ],
  '2-column': [
    createSection('header', 'Header', 'full'),
    createSection('personal-info', 'Personal Info', 'left'),
    createSection('skills', 'Skills', 'left'),
    createSection('certifications', 'Certifications', 'left'),
    createSection('summary', 'Professional Summary', 'right'),
    createSection('experience', 'Work Experience', 'right'),
    createSection('education', 'Education', 'right'),
    createSection('footer', 'Footer', 'full'),
  ],
};