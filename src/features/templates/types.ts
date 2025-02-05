export type Layout = '1-column' | '2-column';

export interface Section {
  id: string;
  type: string;
  title: string;
  column?: 'left' | 'right' | 'full';
}

export interface Template {
  id: string;
  name: string;
  layout: Layout;
  sections: Section[];
  isDefault: boolean;
  createdAt: string;
}