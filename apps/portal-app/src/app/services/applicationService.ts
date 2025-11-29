import axiosInstance from '../libs/axiosInstance';
import { API_BASE_URL } from '../libs/constants';

export interface Application {
  applicationId: string;
  studentId: string;
  studentName: string;
  applicationType: 'LOAN' | 'SCHOLARSHIP';
  applicationTitle: string;
  applicationDetails?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  appliedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationRequest {
  studentId: string;
  studentName: string;
  applicationType: 'LOAN' | 'SCHOLARSHIP';
  applicationTitle: string;
  applicationDetails?: string;
}

export interface UpdateApplicationRequest {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'UNDER_REVIEW';
  reviewedBy?: string;
  reviewNotes?: string;
}

export const applicationService = {
  // Create a new application
  createApplication: async (data: CreateApplicationRequest): Promise<Application> => {
    const response = await axiosInstance.post(`${API_BASE_URL}/applications`, data);
    return response.data;
  },

  // Get all applications (for admins/counsellors)
  getAllApplications: async (): Promise<Application[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/applications`);
    return response.data;
  },

  // Get applications by student ID
  getStudentApplications: async (studentId: string): Promise<Application[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/applications/student/${studentId}`);
    return response.data;
  },

  // Get current student's applications
  getMyApplications: async (): Promise<Application[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/applications/my-applications`);
    return response.data;
  },

  // Get pending applications
  getPendingApplications: async (): Promise<Application[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/applications/pending`);
    return response.data;
  },

  // Get applications by type
  getApplicationsByType: async (type: 'LOAN' | 'SCHOLARSHIP'): Promise<Application[]> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/applications/type/${type}`);
    return response.data;
  },

  // Get application by ID
  getApplicationById: async (id: string): Promise<Application> => {
    const response = await axiosInstance.get(`${API_BASE_URL}/applications/${id}`);
    return response.data;
  },

  // Update application
  updateApplication: async (id: string, data: UpdateApplicationRequest): Promise<Application> => {
    const response = await axiosInstance.put(`${API_BASE_URL}/applications/${id}`, data);
    return response.data;
  },

  // Delete application
  deleteApplication: async (id: string): Promise<{ success: boolean }> => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/applications/${id}`);
    return response.data;
  },
};
