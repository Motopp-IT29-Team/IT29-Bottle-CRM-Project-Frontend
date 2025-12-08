import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { casesService, CaseFormData, GetCasesParams, CasesListResponse } from '../services/cases.service';
import { ApiResult } from '../types';
import { parseApiErrors, formatErrorMessage } from '../errors';
import { useNotification } from '../../components/ui/notification/NotificationContext';
import { ICase, IAttachment, IComment } from '../../types';
import { routes } from '../../constants/routes';

export const useCases = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [cases, setCases] = useState<ICase[]>([]);
    const { addNotification } = useNotification();

    const getAll = useCallback(
        async (params?: GetCasesParams): Promise<ApiResult<CasesListResponse>> => {
            setIsLoading(true);
            try {
                const data = await casesService.getAll(params);

                if (!data.error) {
                    setCases(data.cases || []);
                    return { success: true, data };
                } else {
                    const fieldErrors = parseApiErrors(data as any);
                    return {
                        success: false,
                        error: formatErrorMessage(fieldErrors, 'Failed to load cases'),
                        fieldErrors,
                    };
                }
            } catch (error: any) {
                addNotification('error', 'Server Error', error.message || 'Failed to load cases');
                return {
                    success: false,
                    error: error.message || 'Server error occurred',
                };
            } finally {
                setIsLoading(false);
            }
        },
        [addNotification]
    );

    const refetch = useCallback(
        (params?: GetCasesParams) => {
            return getAll(params);
        },
        [getAll]
    );

    const getById = async (
        id: string
    ): Promise<ApiResult<{ case: ICase; attachments: IAttachment[]; comments: IComment[] }>> => {
        setIsLoading(true);
        try {
            const data = await casesService.getById(id);

            if (!data.error) {
                const result = {
                    case: data.cases_obj,
                    attachments: data.attachments || [],
                    comments: data.comments || [],
                };
                return { success: true, data: result };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                return {
                    success: false,
                    error: formatErrorMessage(fieldErrors, 'Failed to load case'),
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to load case');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const create = async (formData: CaseFormData): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await casesService.create(formData);

            if (!data.error) {
                addNotification('success', 'Case created', 'The case has been created successfully');
                navigate(routes.cases.main);
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to create case');
                addNotification('error', 'Failed to create case', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to create case');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const update = async (id: string, formData: Partial<CaseFormData>): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await casesService.update(id, formData as CaseFormData);

            if (!data.error) {
                addNotification('success', 'Case updated', 'The case has been updated successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to update case');
                addNotification('error', 'Failed to update case', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to update case');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCase = async (id: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await casesService.delete(id);

            if (!data.error) {
                addNotification('success', 'Case deleted', 'The case has been deleted successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to delete case');
                addNotification('error', 'Failed to delete case', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to delete case');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const addComment = async (id: string, comment: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await casesService.addComment(id, comment);

            if (!data.error) {
                addNotification('success', 'Comment added', 'Your comment has been added');
                return { success: true, data };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to add comment');
                addNotification('error', 'Failed to add comment', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to add comment');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const updateComment = async (commentId: string, comment: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await casesService.updateComment(commentId, comment);

            if (!data.error) {
                addNotification('success', 'Comment updated', 'The comment has been updated');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to update comment');
                addNotification('error', 'Failed to update comment', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to update comment');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteComment = async (commentId: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await casesService.deleteComment(commentId);

            if (!data.error) {
                addNotification('success', 'Comment deleted', 'The comment has been deleted');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to delete comment');
                addNotification('error', 'Failed to delete comment', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to delete comment');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAttachment = async (attachmentId: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await casesService.deleteAttachment(attachmentId);

            if (!data.error) {
                addNotification('success', 'Attachment deleted', 'The file has been deleted');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to delete attachment');
                addNotification('error', 'Failed to delete attachment', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to delete attachment');
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
        cases,
        getAll,
        refetch,
        getById,
        create,
        update,
        delete: deleteCase,
        addComment,
        updateComment,
        deleteComment,
        deleteAttachment,
    };
};
