import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface OrganizationData {
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  font: string;
  cv_template_url: string | null;
  theme: 'light' | 'dark';
}

interface CV {
  id: string;
  original_filename: string;
  file_url: string;
  status: 'PROCESSING' | 'CRAFTED';
  created_at: string;
  parsed_data?: Record<string, unknown>;
}

export const loginUser = async (username: string, password: string): Promise<LoginResponse> => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await api.post<LoginResponse>('/auth/token', formData);
  localStorage.setItem('token', response.data.access_token);
  return response.data;
};

export const signupUser = async (username: string, email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/signup', {
    username,
    email,
    password,
  });
  localStorage.setItem('token', response.data.access_token);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getOrganization = async (): Promise<OrganizationData> => {
  const response = await api.get<OrganizationData>('/organization');
  return response.data;
};

export const updateOrganization = async (data: Partial<OrganizationData>): Promise<OrganizationData> => {
  const response = await api.patch<OrganizationData>('/organization', data);
  return response.data;
};

export const uploadLogo = async (file: File): Promise<OrganizationData> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<OrganizationData>('/organization/logo', formData);
  return response.data;
};

export const deleteLogo = async (): Promise<OrganizationData> => {
  const response = await api.delete<OrganizationData>('/organization/logo');
  return response.data;
};

export const uploadTemplate = async (file: File): Promise<OrganizationData> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post<OrganizationData>('/organization/template', formData);
  return response.data;
};

export const deleteTemplate = async (): Promise<OrganizationData> => {
  const response = await api.delete<OrganizationData>('/organization/template');
  return response.data;
};

export const uploadCVs = async (files: File[]): Promise<CV[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  const response = await api.post<CV[]>('/cv/upload', formData);
  return response.data;
};

export const getCVs = async (): Promise<CV[]> => {
  const response = await api.get<CV[]>('/cv');
  return response.data;
};

export const updateCVStatus = async (cvId: string, status: CV['status']): Promise<CV> => {
  const response = await api.patch<CV>(`/cv/${cvId}`, { status });
  return response.data;
};

export const deleteCV = async (cvId: string): Promise<void> => {
  await api.delete(`/cv/${cvId}`);
};

export const getParsedData = async (cvId: string): Promise<any> => {
  const response = await api.get(`/cv/${cvId}/parsed-data`);
  return response.data;
};