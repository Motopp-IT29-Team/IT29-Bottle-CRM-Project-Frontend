import { useState, useCallback } from 'react';
import {
    contactsService,
    ContactFormData,
    GetContactsParams,
    ContactsListResponse,
} from '../services/contacts.service';
import { ApiResult } from '../types';
import { parseApiErrors, formatErrorMessage } from '../errors';
import { useNotification } from '../../context/NotificationContext';
import { IContact } from '../../types';

export const useContacts = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [contacts, setContacts] = useState<IContact[]>([]);
    const { addNotification } = useNotification();

    const getAll = useCallback(
        async (params?: GetContactsParams): Promise<ApiResult<ContactsListResponse>> => {
            setIsLoading(true);
            try {
                const data = await contactsService.getAll(params);

                if (!data.error) {
                    setContacts(data.contact_obj_list || []);
                    return { success: true, data };
                } else {
                    const fieldErrors = parseApiErrors(data as any);
                    return {
                        success: false,
                        error: formatErrorMessage(fieldErrors, 'Failed to load contacts'),
                        fieldErrors,
                    };
                }
            } catch (error: any) {
                console.error('Critical error loading contacts:', error);
                addNotification('error', 'Server Error', error.message || 'Failed to load contacts');
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
        (params?: GetContactsParams) => {
            return getAll(params);
        },
        [getAll]
    );

    const getById = async (id: string): Promise<ApiResult<IContact>> => {
        setIsLoading(true);
        try {
            const data = await contactsService.getById(id);

            if (!data.error) {
                return { success: true, data: data.contact_obj };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                return {
                    success: false,
                    error: formatErrorMessage(fieldErrors, 'Failed to load contact'),
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Critical error loading contact:', error);
            addNotification('error', 'Server Error', error.message || 'Failed to load contact');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const create = async (formData: ContactFormData): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await contactsService.create(formData);

            if (!data.error) {
                addNotification('success', 'Contact created', 'The contact has been created successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to create contact');
                addNotification('error', 'Failed to create contact', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Critical error creating contact:', error);
            addNotification('error', 'Server Error', error.message || 'Failed to create contact');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const update = async (id: string, formData: Partial<ContactFormData>): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await contactsService.update(id, formData);

            if (!data.error) {
                addNotification('success', 'Contact updated', 'The contact has been updated successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to update contact');
                addNotification('error', 'Failed to update contact', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Critical error updating contact:', error);
            addNotification('error', 'Server Error', error.message || 'Failed to update contact');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteContact = async (id: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await contactsService.delete(id);

            if (!data.error) {
                addNotification('success', 'Contact deleted', 'The contact has been deleted successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data as any);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to delete contact');
                addNotification('error', 'Failed to delete contact', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Critical error deleting contact:', error);
            addNotification('error', 'Server Error', error.message || 'Failed to delete contact');
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
        contacts,
        getAll,
        refetch,
        getById,
        create,
        update,
        deleteContact,
    };
};
