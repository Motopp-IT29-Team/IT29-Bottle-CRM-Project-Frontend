import { useState, useCallback } from 'react';
import { leadsService, Lead, LeadFormData, GetLeadsParams, GetLeadsResponse } from '../services/leads.service';
import { ApiResult } from '../types';
import { parseApiErrors, formatErrorMessage } from '../errors';
import { useNotification } from '../../context/NotificationContext';

export const useLeads = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [leads, setLeads] = useState<Lead[]>([]);
    const { addNotification } = useNotification();

    const getAll = useCallback(
        async (params?: GetLeadsParams): Promise<ApiResult<GetLeadsResponse>> => {
            setIsLoading(true);
            try {
                const data = await leadsService.getAll(params);

                if (!data.error) {
                    const openLeads = data.open_leads?.open_leads || [];
                    const closeLeads = data.close_leads?.close_leads || [];
                    setLeads([...openLeads, ...closeLeads]);
                    return { success: true, data };
                } else {
                    const fieldErrors = parseApiErrors(data);
                    return {
                        success: false,
                        error: formatErrorMessage(fieldErrors, 'Failed to load leads'),
                        fieldErrors,
                    };
                }
            } catch (error: any) {
                console.error('Critical error loading leads:', error);
                addNotification('error', 'Server Error', error.message || 'Failed to load leads');
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
        (params?: GetLeadsParams) => {
            return getAll(params);
        },
        [getAll]
    );

    const getById = async (id: string): Promise<ApiResult<{ lead: Lead; attachments: any[]; comments: any[] }>> => {
        setIsLoading(true);
        try {
            const data = await leadsService.getById(id);

            if (!data.error) {
                const result = {
                    lead: data.lead_obj,
                    attachments: data.attachments || [],
                    comments: data.comments || [],
                };
                return { success: true, data: result };
            } else {
                const fieldErrors = parseApiErrors(data);
                return {
                    success: false,
                    error: formatErrorMessage(fieldErrors, 'Failed to load lead'),
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Critical error loading lead:', error);
            addNotification('error', 'Server Error', error.message || 'Failed to load lead');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const create = async (formData: LeadFormData): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await leadsService.create(formData);

            if (!data.error) {
                addNotification('success', 'Lead created', 'The lead has been created successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to create lead');
                addNotification('error', 'Failed to create lead', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Critical error creating lead:', error);
            addNotification('error', 'Server Error', error.message || 'Failed to create lead');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const update = async (id: string, formData: Partial<LeadFormData>): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await leadsService.update(id, formData);

            if (!data.error) {
                addNotification('success', 'Lead updated', 'The lead has been updated successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to update lead');
                addNotification('error', 'Failed to update lead', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Critical error updating lead:', error);
            addNotification('error', 'Server Error', error.message || 'Failed to update lead');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteLead = async (id: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await leadsService.delete(id);

            if (!data.error) {
                addNotification('success', 'Lead deleted', 'The lead has been deleted successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to delete lead');
                addNotification('error', 'Failed to delete lead', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Critical error deleting lead:', error);
            addNotification('error', 'Server Error', error.message || 'Failed to delete lead');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const checkDuplicate = async (email: string, phone: string): Promise<ApiResult<{ duplicate: boolean }>> => {
        try {
            const data = await leadsService.checkDuplicate(email, phone);
            return {
                success: true,
                data: { duplicate: data.duplicate || false },
            };
        } catch (error: any) {
            console.error('Error checking duplicate:', error);
            return {
                success: false,
                error: error.message || 'Failed to check duplicate',
            };
        }
    };

    const addComment = async (id: string, comment: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await leadsService.addComment(id, comment);

            if (!data.error) {
                addNotification('success', 'Comment added', 'Your comment has been added');
                return { success: true, data };
            } else {
                const fieldErrors = parseApiErrors(data);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to add comment');
                addNotification('error', 'Failed to add comment', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Critical error adding comment:', error);
            addNotification('error', 'Server Error', error.message || 'Failed to add comment');
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
            const data = await leadsService.deleteComment(commentId);

            if (!data.error) {
                addNotification('success', 'Comment deleted', 'The comment has been deleted');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to delete comment');
                addNotification('error', 'Failed to delete comment', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Critical error deleting comment:', error);
            addNotification('error', 'Server Error', error.message || 'Failed to delete comment');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const uploadAttachment = async (id: string, file: File): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await leadsService.uploadAttachment(id, file);

            if (!data.error) {
                addNotification('success', 'Attachment uploaded', 'The file has been uploaded');
                return { success: true, data };
            } else {
                const fieldErrors = parseApiErrors(data);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to upload attachment');
                addNotification('error', 'Failed to upload attachment', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Critical error uploading attachment:', error);
            addNotification('error', 'Server Error', error.message || 'Failed to upload attachment');
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
            const data = await leadsService.deleteAttachment(attachmentId);

            if (!data.error) {
                addNotification('success', 'Attachment deleted', 'The file has been deleted');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to delete attachment');
                addNotification('error', 'Failed to delete attachment', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Critical error deleting attachment:', error);
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
        leads,
        getAll,
        refetch,
        getById,
        create,
        update,
        deleteLead,
        checkDuplicate,
        addComment,
        deleteComment,
        uploadAttachment,
        deleteAttachment,
    };
};
