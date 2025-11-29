import axiosInstance from '../libs/axiosInstance';
import { API_BASE_URL } from '../libs/constants';

export interface College {
  collegeId: string;
  name: string;
  type: string;
  program: string;
  state: string;
  district?: string;
  city?: string;
  fees?: string;
  image?: string;
  rating?: number;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  establishedYear?: number;
  affiliation?: string;
  accreditation?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Enhanced fields
  coursesOffered?: string[];
  entranceExams?: string[];
  cutoffPercentile?: number;
  applicationDeadline?: string;
  minimumPercentage?: number;
  tuitionFeeYearly?: number;
  hostelFeeYearly?: number;
  totalFeeYearly?: number;
  scholarshipsAvailable?: boolean;
  loanFacilities?: boolean;
  campusSizeAcres?: number;
  hostelFacility?: boolean;
  libraryBooksCount?: number;
  laboratoriesCount?: number;
  wifiFacility?: boolean;
  totalStudents?: number;
  facultyCount?: number;
  placementPercentage?: number;
  averageSalary?: number;
  topRecruiters?: string[];
}

export interface CollegeCreateRequest {
  name: string;
  type: string;
  state: string;
  district?: string;
  city?: string;
  fees?: string;
  image?: string;
  rating?: number;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  address?: string;
  establishedYear?: number;
  affiliation?: string;
  accreditation?: string;
  isActive?: boolean;
}

export interface CollegeSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  state?: string;
  type?: string;
  sort?: string;
}

export interface CollegeListResponse {
  data: College[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
}

class CollegeService {
  private readonly baseUrl = `${API_BASE_URL}/colleges`;

  /**
   * Get colleges with pagination and filters
   */
  async getColleges(params: CollegeSearchParams = {}): Promise<CollegeListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.state) queryParams.append('filter[state]', params.state);
    if (params.type) queryParams.append('filter[type]', params.type);
    if (params.sort) queryParams.append('sort', params.sort);

    const response = await axiosInstance.get(`${this.baseUrl}?${queryParams.toString()}`);
    return response.data;
  }

  /**
   * Get a single college by ID
   */
  async getCollege(id: string): Promise<College> {
    const response = await axiosInstance.get(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Create a new college
   */
  async createCollege(data: CollegeCreateRequest): Promise<College> {
    const response = await axiosInstance.post(this.baseUrl, data);
    return response.data;
  }

  /**
   * Update an existing college
   */
  async updateCollege(id: string, data: Partial<CollegeCreateRequest>): Promise<College> {
    const response = await axiosInstance.patch(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a college
   */
  async deleteCollege(id: string): Promise<void> {
    await axiosInstance.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Search colleges by name
   */
  async searchColleges(searchTerm: string): Promise<College[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/search?q=${encodeURIComponent(searchTerm)}`);
    return response.data;
  }

  /**
   * Get colleges by state
   */
  async getCollegesByState(state: string): Promise<College[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/by-state/${encodeURIComponent(state)}`);
    return response.data;
  }

  /**
   * Get colleges by type
   */
  async getCollegesByType(type: string): Promise<College[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/by-type/${encodeURIComponent(type)}`);
    return response.data;
  }

  /**
   * Get top-rated colleges
   */
  async getTopRatedColleges(limit: number = 10): Promise<College[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/top-rated?limit=${limit}`);
    return response.data;
  }

  /**
   * Get colleges with student assignment counts
   */
  async getCollegesWithStudentCounts(): Promise<College[]> {
    const response = await axiosInstance.get(`${this.baseUrl}/with-student-counts`);
    return response.data;
  }
}

export const collegeService = new CollegeService();