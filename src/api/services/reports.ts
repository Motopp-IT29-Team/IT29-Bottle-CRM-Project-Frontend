import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';

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
        return response.data.data;
    },

    // Get all generated reports
    getGeneratedReports: async (): Promise<GeneratedReport[]> => {
        const response = await apiClient.get(ENDPOINTS.REPORTS_GENERATED);
        return response.data.data;
    },

    // Download report
    downloadReport: async (id: string): Promise<Blob> => {
        const response = await apiClient.get(ENDPOINTS.REPORTS_DOWNLOAD(id), {
            responseType: 'blob',
        });
        return response.data;
    },

    // Download report by triggering file download
    triggerReportDownload: async (id: string, filename: string): Promise<void> => {
        const blob = await reportsApi.downloadReport(id);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    },
};
