import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { companiesService, CompanyFormData, CompaniesListResponse } from '../services/companies.service';
import { ApiResult } from '../types';
import { parseApiErrors, formatErrorMessage } from '../errors';
import { useNotification } from '../../components/ui/notification/NotificationContext';
import { ICompany } from '../../types';
import { routes } from '../../constants/routes';

export const useCompanies = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const { addNotification } = useNotification();

    const getAll = useCallback(async (): Promise<ApiResult<CompaniesListResponse>> => {
        setIsLoading(true);
        try {
            const data = await companiesService.getAll();

            if (!data.error) {
                setCompanies(data.data || []);
                return { success: true, data };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                return {
                    success: false,
                    error: formatErrorMessage(fieldErrors, 'Failed to load companies'),
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to load companies');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    }, [addNotification]);

    const refetch = useCallback(() => {
        return getAll();
    }, [getAll]);

    const getById = async (id: string): Promise<ApiResult<{ company: ICompany }>> => {
        setIsLoading(true);
        try {
            const data = await companiesService.getById(id);

            if (!data.error) {
                const result = {
                    company: data.data,
                };
                return { success: true, data: result };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                return {
                    success: false,
                    error: formatErrorMessage(fieldErrors, 'Failed to load company'),
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to load company');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const create = async (formData: CompanyFormData): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await companiesService.create(formData);

            if (!data.error) {
                addNotification('success', 'Company created', 'The company has been created successfully');
                navigate(routes.companies.main);
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to create company');
                addNotification('error', 'Failed to create company', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to create company');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const update = async (id: string, formData: Partial<CompanyFormData>): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await companiesService.update(id, formData as CompanyFormData);

            if (!data.error) {
                addNotification('success', 'Company updated', 'The company has been updated successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to update company');
                addNotification('error', 'Failed to update company', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to update company');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCompany = async (id: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await companiesService.delete(id);

            if (!data.error) {
                addNotification('success', 'Company deleted', 'The company has been deleted successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to delete company');
                addNotification('error', 'Failed to delete company', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to delete company');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        companies,
        getAll,
        refetch,
        getById,
        create,
        update,
        delete: deleteCompany,
    };
};
