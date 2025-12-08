import { useState, useCallback } from 'react';
import {
    accountsService,
    AccountFormData,
    GetAccountsParams,
    AccountsListResponse,
} from '../services/accounts.service';
import { ApiResult } from '../types';
import { parseApiErrors, formatErrorMessage } from '../errors';
import { useNotification } from '../../components/ui/notification/NotificationContext';
import { IAccount, IAttachment, IComment } from '../../types';

export const useAccounts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const { addNotification } = useNotification();

    const getAll = useCallback(
        async (params?: GetAccountsParams): Promise<ApiResult<AccountsListResponse>> => {
            setIsLoading(true);
            try {
                const data = await accountsService.getAll(params);

                if (!data.error) {
                    const openAccounts = data.active_accounts?.open_accounts || [];
                    const closeAccounts = data.closed_accounts?.close_accounts || [];
                    setAccounts([...openAccounts, ...closeAccounts]);
                    return { success: true, data };
                } else {
                    const fieldErrors = parseApiErrors(data as any);
                    return {
                        success: false,
                        error: formatErrorMessage(fieldErrors, 'Failed to load accounts'),
                        fieldErrors,
                    };
                }
            } catch (error: any) {
                addNotification('error', 'Server Error', error.message || 'Failed to load accounts');
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
        (params?: GetAccountsParams) => {
            return getAll(params);
        },
        [getAll]
    );

    const getById = async (
        id: string
    ): Promise<ApiResult<{ account: IAccount; attachments: IAttachment[]; comments: IComment[] }>> => {
        setIsLoading(true);
        try {
            const data = await accountsService.getById(id);

            if (!data.error) {
                const result = {
                    account: data.account_obj,
                    attachments: data.attachments || [],
                    comments: data.comments || [],
                };
                return { success: true, data: result };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                return {
                    success: false,
                    error: formatErrorMessage(fieldErrors, 'Failed to load account'),
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to load account');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const create = async (formData: AccountFormData): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await accountsService.create(formData);

            if (!data.error) {
                addNotification('success', 'Account created', 'The account has been created successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to create account');
                addNotification('error', 'Failed to create account', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to create account');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const update = async (id: string, formData: Partial<AccountFormData>): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await accountsService.update(id, formData as AccountFormData);

            if (!data.error) {
                addNotification('success', 'Account updated', 'The account has been updated successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to update account');
                addNotification('error', 'Failed to update account', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to update account');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAccount = async (id: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await accountsService.delete(id);

            if (!data.error) {
                addNotification('success', 'Account deleted', 'The account has been deleted successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to delete account');
                addNotification('error', 'Failed to delete account', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to delete account');
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
            const data = await accountsService.addComment(id, comment);

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
            const data = await accountsService.updateComment(commentId, comment);

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
            const data = await accountsService.deleteComment(commentId);

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
            const data = await accountsService.deleteAttachment(attachmentId);

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
        accounts,
        getAll,
        refetch,
        getById,
        create,
        update,
        deleteAccount,
        addComment,
        updateComment,
        deleteComment,
        deleteAttachment,
    };
};
