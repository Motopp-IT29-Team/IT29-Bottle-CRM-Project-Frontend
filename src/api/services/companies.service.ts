import { ENDPOINTS } from '../endpoints';
import { ICompany } from '../../types';
import { apiClient } from '../client';

export interface CompanyFormData {
    name: string;
}

export interface CompaniesListResponse {
    error?: boolean;
    data: ICompany[];
}

export interface CompanyDetailResponse {
    error?: boolean;
    data: ICompany;
}

export interface CompanyCreateResponse {
    error?: boolean;
    message: string;
}

export interface CompanyUpdateResponse {
    error?: boolean;
    message: string;
    data: ICompany;
}

export interface CompanyDeleteResponse {
    error?: boolean;
    message: string;
}

export const companiesService = {
    getAll: async (): Promise<CompaniesListResponse> => {
        const response = await apiClient.get<CompaniesListResponse>(ENDPOINTS.COMPANIES);
        return response.data;
    },

    getById: async (id: string): Promise<CompanyDetailResponse> => {
        const response = await apiClient.get<CompanyDetailResponse>(ENDPOINTS.COMPANY(id));
        return response.data;
    },

    create: async (data: CompanyFormData): Promise<CompanyCreateResponse> => {
        const response = await apiClient.post<CompanyCreateResponse>(ENDPOINTS.COMPANIES, data);
        return response.data;
    },

    update: async (id: string, data: CompanyFormData): Promise<CompanyUpdateResponse> => {
        const response = await apiClient.put<CompanyUpdateResponse>(ENDPOINTS.COMPANY(id), data);
        return response.data;
    },

    delete: async (id: string): Promise<CompanyDeleteResponse> => {
        const response = await apiClient.delete<CompanyDeleteResponse>(ENDPOINTS.COMPANY(id));
        return response.data;
    },
};
