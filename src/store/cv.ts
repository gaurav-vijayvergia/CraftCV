import { create } from 'zustand';
import { uploadCVs, getCVs, updateCVStatus, deleteCV, getParsedData } from '../services/api';

interface CV {
  id: string;
  originalFilename: string;
  fileUrl: string;
  status: 'PROCESSING' | 'CRAFTED';
  createdAt: string;
}

interface ParsedCVData {
  personal_info: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  summary: string;
  work_experience: Array<{
    company: string;
    position: string;
    dates: string;
    responsibilities: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    dates: string;
  }>;
  skills: string[];
  certifications: string[];
}

interface CVState {
  cvs: CV[];
  isLoading: boolean;
  error: string | null;
  fetchCVs: () => Promise<void>;
  uploadFiles: (files: File[]) => Promise<void>;
  updateStatus: (cvId: string, status: CV['status']) => Promise<void>;
  deleteCV: (cvId: string) => Promise<void>;
  removeCV: (cvId: string) => void;
  fetchParsedData: (cvId: string) => Promise<ParsedCVData>;
}

export const useCVStore = create<CVState>((set) => ({
  cvs: [],
  isLoading: false,
  error: null,
  fetchCVs: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getCVs();
      const cvs: CV[] = data.map((cv) => ({
        id: cv.id,
        originalFilename: cv.original_filename,
        fileUrl: cv.file_url,
        status: cv.status as CV['status'],
        createdAt: cv.created_at,
      }));
      set({ cvs, isLoading: false });
    } catch {
      set({ error: 'Failed to fetch CVs', isLoading: false });
      throw new Error('Failed to fetch CVs');
    }
  },
  uploadFiles: async (files: File[]) => {
    set({ isLoading: true, error: null });
    try {
      const data = await uploadCVs(files);
      const newCVs: CV[] = data.map((cv) => ({
        id: cv.id,
        originalFilename: cv.original_filename,
        fileUrl: cv.file_url,
        status: cv.status as CV['status'],
        createdAt: cv.created_at,
      }));
      set((state) => ({
        cvs: [...state.cvs, ...newCVs],
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to upload CVs', isLoading: false });
      throw new Error('Failed to upload CVs');
    }
  },
  updateStatus: async (cvId: string, status: CV['status']) => {
    set({ isLoading: true, error: null });
    try {
      const updatedCV = await updateCVStatus(cvId, status);
      set((state) => ({
        cvs: state.cvs.map((cv) =>
          cv.id === cvId
            ? {
                ...cv,
                status: updatedCV.status as CV['status'],
              }
            : cv
        ),
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to update CV status', isLoading: false });
      throw new Error('Failed to update CV status');
    }
  },
  deleteCV: async (cvId: string) => {
    set({ isLoading: true, error: null });
    try {
      await deleteCV(cvId);
      set((state) => ({
        cvs: state.cvs.filter((cv) => cv.id !== cvId),
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to delete CV', isLoading: false });
      throw new Error('Failed to delete CV');
    }
  },
  removeCV: (cvId: string) => {
    set((state) => ({
      cvs: state.cvs.filter((cv) => cv.id !== cvId),
    }));
  },
  fetchParsedData: async (cvId: string) => {
    try {
      const data = await getParsedData(cvId);
      return data as ParsedCVData;
    } catch {
      throw new Error('Failed to fetch parsed data');
    }
  },
}));