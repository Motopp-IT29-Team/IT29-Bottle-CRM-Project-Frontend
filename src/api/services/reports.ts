import axios from 'axios';
import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/';

export interface ReportConfiguration {
    id?: number;
    name?: string;
    report_type: string;
    date_from?: string | null;
    date_to?: string | null;
    date_preset?: string | null;
    filters?: Record<string, any>;
    metrics?: string[];
    grouping?: string | null;
    include_graphics: boolean;
    graphics_config?: {
        show_bar_chart?: boolean;
        show_pie_chart?: boolean;
        colors?: string[];
    };
    include_summary: boolean;
    include_charts: boolean;
    include_tables: boolean;
    include_logo: boolean;
}

export interface GeneratedReport {
    id: number;
    configuration?: number;
    configuration_name?: string;
    file_path: string;
    file_url?: string;
    file_name: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    error_message?: string;
    generated_by: number;
    generated_by_name?: string;
    generated_at: string;
}

export interface ReportGenerateRequest {
    configuration_id?: number;
    report_type?: string;
    date_from?: string | null;
    date_to?: string | null;
    date_preset?: string | null;
    filters?: Record<string, any>;
    metrics?: string[];
    grouping?: string | null;
    include_graphics?: boolean;
    graphics_config?: {
        show_bar_chart?: boolean;
        show_pie_chart?: boolean;
        colors?: string[];
    };
    include_summary?: boolean;
    include_charts?: boolean;
    include_tables?: boolean;
    include_logo?: boolean;
}

export const reportsApi = {
    // Get all report configurations
    getConfigurations: async (): Promise<ReportConfiguration[]> => {
        const response = await apiClient.get(ENDPOINTS.REPORTS_CONFIGURATIONS);
        return response.data.data;
    },

    // Get single report configuration
    getConfiguration: async (id: string): Promise<ReportConfiguration> => {
        const response = await apiClient.get(ENDPOINTS.REPORTS_CONFIGURATION_DETAIL(id));
        return response.data.data;
    },

    // Create report configuration
    createConfiguration: async (data: ReportConfiguration): Promise<ReportConfiguration> => {
        const response = await apiClient.post(ENDPOINTS.REPORTS_CONFIGURATIONS, data);
        return response.data.data;
    },

    // Update report configuration
    updateConfiguration: async (id: string, data: Partial<ReportConfiguration>): Promise<ReportConfiguration> => {
        const response = await apiClient.put(ENDPOINTS.REPORTS_CONFIGURATION_DETAIL(id), data);
        return response.data.data;
    },

    // Delete report configuration
    deleteConfiguration: async (id: string): Promise<void> => {
        await apiClient.delete(ENDPOINTS.REPORTS_CONFIGURATION_DETAIL(id));
    },

    // Generate report
    generateReport: async (request: ReportGenerateRequest): Promise<GeneratedReport> => {
        const response = await apiClient.post(ENDPOINTS.REPORTS_GENERATE, request);
        console.log('Full API response:', response);
        console.log('Response data:', response.data);
        console.log('Response data.data:', response.data?.data);
        
        // Check for error response from API client interceptor
        if (response.data?.error) {
            const error = new Error(response.data.message || 'Failed to generate report');
            (error as any).response = { data: response.data };
            throw error;
        }
        
        // Handle both {data: {...}} and direct response formats
        return response.data.data || response.data;
    },

    // Get all generated reports
    getGeneratedReports: async (): Promise<GeneratedReport[]> => {
        const response = await apiClient.get(ENDPOINTS.REPORTS_GENERATED);
        return response.data.data || response.data;
    },

    // Download report
    downloadReport: async (id: string): Promise<Blob> => {
        console.log('Downloading report:', id);
        
        // Use direct axios call to avoid interceptors that set Accept: application/json
        const token = localStorage.getItem('Token');
        const org = localStorage.getItem('org');
        
        const response = await axios.get(`${API_BASE_URL}${ENDPOINTS.REPORTS_DOWNLOAD(id)}`, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': token || '',
                'org': org || '',
            },
        });
        
        console.log('Download response status:', response.status);
        console.log('Download response data size:', response.data.byteLength);
        console.log('Content-Type:', response.headers['content-type']);
        
        // Check if response might be JSON error (small response)
        if (response.data.byteLength < 1000) {
            try {
                const decoder = new TextDecoder('utf-8');
                const text = decoder.decode(response.data);
                console.log('Small response text:', text);
                if (text.startsWith('{')) {
                    const jsonError = JSON.parse(text);
                    if (jsonError.error) {
                        throw new Error(jsonError.message || 'Download failed');
                    }
                }
            } catch (e) {
                // Not JSON, continue with blob creation
            }
        }
        
        return new Blob([response.data], { type: 'application/pdf' });
    },

    // Download report by triggering file download
    triggerReportDownload: async (id: string, filename: string): Promise<void> => {
        try {
            const blob = await reportsApi.downloadReport(id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename || 'report.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            throw error;
        }
    },
};
