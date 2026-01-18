import { useState, useCallback } from 'react';
import { reportsApi, ReportConfiguration, ReportGenerateRequest, GeneratedReport } from '../services/reports';

export const useReports = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [configurations, setConfigurations] = useState<ReportConfiguration[]>([]);
    const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);

    const getConfigurations = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await reportsApi.getConfigurations();
            setConfigurations(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch configurations');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const generateReport = useCallback(async (request: ReportGenerateRequest): Promise<GeneratedReport | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const report = await reportsApi.generateReport(request);
            return report;
        } catch (err: any) {
            setError(err.message || 'Failed to generate report');
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const downloadReport = useCallback(async (id: string, filename: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await reportsApi.triggerReportDownload(id, filename);
        } catch (err: any) {
            setError(err.message || 'Failed to download report');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getGeneratedReports = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await reportsApi.getGeneratedReports();
            setGeneratedReports(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch generated reports');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        configurations,
        generatedReports,
        getConfigurations,
        generateReport,
        downloadReport,
        getGeneratedReports,
    };
};
