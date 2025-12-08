import { useState, useCallback } from 'react';
import {
    opportunitiesService,
    OpportunityFormData,
    GetOpportunitiesParams,
    OpportunitiesListResponse,
} from '../services/opportunities.service';
import { ApiResult } from '../types';
import { parseApiErrors, formatErrorMessage } from '../errors';
import { useNotification } from '../../components/ui/notification/NotificationContext';
import { IOpportunity } from '../../types';

export const useOpportunities = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [opportunities, setOpportunities] = useState<IOpportunity[]>([]);
    const { addNotification } = useNotification();

    const getAll = useCallback(
        async (params?: GetOpportunitiesParams): Promise<ApiResult<OpportunitiesListResponse>> => {
            setIsLoading(true);
            try {
                const data = await opportunitiesService.getAll(params);

                if (!data.error) {
                    setOpportunities(data.opportunities || []);
                    return { success: true, data };
                } else {
                    const fieldErrors = parseApiErrors(data as any);
                    return {
                        success: false,
                        error: formatErrorMessage(fieldErrors, 'Failed to load opportunities'),
                        fieldErrors,
                    };
                }
            } catch (error: any) {
                addNotification('error', 'Server Error', error.message || 'Failed to load opportunities');
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
        (params?: GetOpportunitiesParams) => {
            return getAll(params);
        },
        [getAll]
    );

    const getById = async (id: string): Promise<ApiResult<any>> => {
        setIsLoading(true);
        try {
            const data = await opportunitiesService.getById(id);

            if (!data.error) {
                return { success: true, data };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                return {
                    success: false,
                    error: formatErrorMessage(fieldErrors, 'Failed to load opportunity'),
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to load opportunity');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const create = async (formData: OpportunityFormData): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await opportunitiesService.create(formData);

            if (!data.error) {
                addNotification('success', 'Opportunity created', 'The opportunity has been created successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to create opportunity');
                addNotification('error', 'Failed to create opportunity', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to create opportunity');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const update = async (id: string, formData: Partial<OpportunityFormData>): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await opportunitiesService.update(id, formData);

            if (!data.error) {
                addNotification('success', 'Opportunity updated', 'The opportunity has been updated successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to update opportunity');
                addNotification('error', 'Failed to update opportunity', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to update opportunity');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteOpportunity = async (id: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await opportunitiesService.delete(id);

            if (!data.error) {
                addNotification('success', 'Opportunity deleted', 'The opportunity has been deleted successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to delete opportunity');
                addNotification('error', 'Failed to delete opportunity', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to delete opportunity');
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
            const data = await opportunitiesService.addComment(id, comment);

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
            const data = await opportunitiesService.updateComment(commentId, comment);

            if (!data.error) {
                addNotification('success', 'Comment updated', 'Your comment has been updated');
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
            const data = await opportunitiesService.deleteComment(commentId);

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
            const data = await opportunitiesService.deleteAttachment(attachmentId);

            if (!data.error) {
                addNotification('success', 'Attachment deleted', 'The attachment has been deleted');
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
        opportunities,
        getAll,
        refetch,
        getById,
        create,
        update,
        deleteOpportunity,
        addComment,
        updateComment,
        deleteComment,
        deleteAttachment,
    };
};
