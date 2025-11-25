import { useState } from 'react';
import { fetchData } from '../../components/FetchData';
import { LeadUrl, SERVER } from '../../services/ApiUrls';
import { formatErrorMessage, parseApiErrors } from '../../utils/errorFormatter';
import { FormErrors } from '../../components/ui/form';

interface ApiResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    fieldErrors?: FormErrors;
}

interface LeadFormData {
    first_name: string;
    last_name: string;
    title: string;
    phone: string;
    email: string;
    account_name: string;
    opportunity_amount: string;
    website: string;
    industry: string;
    status: string;
    source: string;
    probability: number;
    skype_ID: string;
    salutation: string;
    department: string;
    preferred_language: string;
    rating: string;
    budget_range: string;
    decision_timeframe: string;
    do_not_call: boolean;
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    description: string;
    actualFile?: File | null;
    assigned_to: string[];
    contacts: string[];
    tags: string[];
}

export interface Lead {
    id: string;
    title: string;
    first_name: string;
    last_name: string;
    account_name: string;
    phone: string;
    email: string;
    status: string;
    source: string;
    created_at: string;
    country: string;
    tags: any[];
    team: any;
    created_by: {
        profile_pic?: string;
    };
}

interface LeadDetails {
    id: string;
    title: string;
    first_name: string;
    last_name: string;
    account_name: string;
    phone: string;
    email: string;
    website: string;
    description: string;
    status: string;
    source: string;
    industry: string;
    probability: number;
    opportunity_amount: string;
    skype_ID: string;
    salutation: string;
    department: string;
    preferred_language: string;
    rating: string;
    budget_range: string;
    decision_timeframe: string;
    do_not_call: boolean;
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    close_date: string;
    organization: string;
    created_from_site: boolean;
    created_at: string;
    created_by: {
        email: string;
        profile_pic: string;
    };
    tags: any[];
    assigned_to: any[];
}

interface LeadsListParams {
    offset?: number;
    limit?: number;
    status?: string;
    search?: string;
}

export const useLeadApi = () => {
    const [isLoading, setIsLoading] = useState(false);

    const getAuthHeaders = () => ({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Token'),
        org: localStorage.getItem('org'),
    });

    const getLeads = async (
        params: LeadsListParams = {}
    ): Promise<
        ApiResult<{
            open_leads: { open_leads: Lead[]; leads_count: number; offset: number | null };
            close_leads: { close_leads: Lead[]; leads_count: number; offset: number };
            contacts: any[];
            status: any[];
            source: any[];
            companies: any[];
            tags: any[];
            users: any[];
            countries: any[];
            industries: any[];
        }>
    > => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (params.offset) queryParams.append('offset', params.offset.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.status) queryParams.append('status', params.status);
            if (params.search) queryParams.append('search', params.search);

            const url = queryParams.toString() ? `${LeadUrl}/?${queryParams}` : `${LeadUrl}/`;
            const res = await fetchData(url, 'GET', null as any, getAuthHeaders());

            if (!res.error) {
                return {
                    success: true,
                    data: {
                        open_leads: res.open_leads || { open_leads: [], leads_count: 0, offset: null },
                        close_leads: res.close_leads || { close_leads: [], leads_count: 0, offset: 0 },
                        contacts: res.contacts || [],
                        status: res.status || [],
                        source: res.source || [],
                        companies: res.companies || [],
                        tags: res.tags || [],
                        users: res.users || [],
                        countries: res.countries || [],
                        industries: res.industries || [],
                    },
                };
            } else {
                return {
                    success: false,
                    error: 'Failed to fetch leads',
                };
            }
        } catch (error: any) {
            console.error('Error fetching leads:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const getLead = async (
        leadId: string
    ): Promise<ApiResult<{ lead: LeadDetails; attachments: any[]; comments: any[] }>> => {
        setIsLoading(true);
        try {
            const res = await fetchData(`${LeadUrl}/${leadId}/`, 'GET', null as any, getAuthHeaders());

            if (!res.error) {
                return {
                    success: true,
                    data: {
                        lead: res.lead_obj,
                        attachments: res.attachments || [],
                        comments: res.comments || [],
                    },
                };
            } else {
                return {
                    success: false,
                    error: res.error?.message || 'Failed to fetch lead data',
                };
            }
        } catch (error: any) {
            console.error('Error fetching lead:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const createLead = async (formData: LeadFormData): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('Token');
            const org = localStorage.getItem('org');

            const headers: Record<string, string> = { Accept: 'application/json' };
            if (token) headers.Authorization = token;
            if (org) headers.org = org;

            const formDataObj = new FormData();
            formDataObj.append('title', formData.title);
            formDataObj.append('first_name', formData.first_name);
            formDataObj.append('last_name', formData.last_name);
            formDataObj.append('account_name', formData.account_name);
            formDataObj.append('phone', formData.phone);
            formDataObj.append('email', formData.email);
            formDataObj.append('opportunity_amount', formData.opportunity_amount.toString());
            formDataObj.append('website', formData.website);
            formDataObj.append('description', formData.description);
            formDataObj.append('status', formData.status);
            formDataObj.append('source', formData.source);
            formDataObj.append('probability', formData.probability.toString());
            formDataObj.append('industry', formData.industry);
            formDataObj.append('skype_ID', formData.skype_ID);
            formDataObj.append('salutation', formData.salutation);
            formDataObj.append('department', formData.department);
            formDataObj.append('preferred_language', formData.preferred_language);
            formDataObj.append('rating', formData.rating);
            formDataObj.append('budget_range', formData.budget_range);
            formDataObj.append('decision_timeframe', formData.decision_timeframe);
            formDataObj.append('do_not_call', formData.do_not_call.toString());
            formDataObj.append('address_line', formData.address_line);
            formDataObj.append('street', formData.street);
            formDataObj.append('city', formData.city);
            formDataObj.append('state', formData.state);
            formDataObj.append('postcode', formData.postcode);
            formDataObj.append('country', formData.country);

            if (formData.actualFile) {
                formDataObj.append('lead_attachment', formData.actualFile);
            }

            formData.assigned_to.forEach((id) => formDataObj.append('assigned_to', id));
            formData.contacts.forEach((id) => formDataObj.append('contacts', id));
            formData.tags.forEach((tag) => formDataObj.append('tags', tag));

            const response = await fetch(`${SERVER}${LeadUrl}/`, {
                method: 'POST',
                headers: headers,
                body: formDataObj,
            });

            const data = await response.json();

            if (!response.ok) {
                const fieldErrors = parseApiErrors(data);
                return {
                    success: false,
                    error: formatErrorMessage(fieldErrors, data.message || 'Failed to create lead'),
                    fieldErrors,
                };
            }

            return { success: true, data };
        } catch (error: any) {
            console.error('Error creating lead:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const updateLead = async (leadId: string, formData: LeadFormData): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('Token');
            const org = localStorage.getItem('org');

            const headers: Record<string, string> = { Accept: 'application/json' };
            if (token) headers.Authorization = token;
            if (org) headers.org = org;

            const formDataObj = new FormData();
            Object.keys(formData).forEach((key) => {
                const value = (formData as any)[key];
                if (key === 'actualFile' && value) {
                    formDataObj.append('lead_attachment', value);
                } else if (key === 'assigned_to' || key === 'contacts' || key === 'tags') {
                    value.forEach((item: string) => formDataObj.append(key, item));
                } else if (key !== 'actualFile') {
                    formDataObj.append(key, value?.toString() || '');
                }
            });

            const response = await fetch(`${SERVER}${LeadUrl}/${leadId}/`, {
                method: 'PUT',
                headers: headers,
                body: formDataObj,
            });

            const data = await response.json();

            if (!response.ok) {
                const fieldErrors = parseApiErrors(data);
                return {
                    success: false,
                    error: formatErrorMessage(fieldErrors, 'Failed to update lead'),
                    fieldErrors,
                };
            }

            return { success: true };
        } catch (error: any) {
            console.error('Error updating lead:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteLead = async (leadId: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const res = await fetchData(`${LeadUrl}/${leadId}/`, 'DELETE', null as any, getAuthHeaders());

            if (!res.error) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: 'Failed to delete lead',
                };
            }
        } catch (error: any) {
            console.error('Error deleting lead:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const checkDuplicate = async (email: string, phone: string): Promise<ApiResult<{ duplicate: boolean }>> => {
        try {
            const response = await fetch(
                `${SERVER}${LeadUrl}/check-duplicate/?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`,
                {
                    method: 'GET',
                    headers: getAuthHeaders() as any,
                }
            );

            const data = await response.json();
            return {
                success: true,
                data: { duplicate: data.duplicate || false },
            };
        } catch (error: any) {
            console.error('Error checking duplicate:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        }
    };

    const addComment = async (leadId: string, comment: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const res = await fetchData(`${LeadUrl}/${leadId}/`, 'POST', JSON.stringify({ comment }), getAuthHeaders());

            if (!res.error) {
                return { success: true, data: res };
            } else {
                return {
                    success: false,
                    error: 'Failed to add comment',
                };
            }
        } catch (error: any) {
            console.error('Error adding comment:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteComment = async (commentId: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('Token');
            const org = localStorage.getItem('org');

            const headers: Record<string, string> = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            if (token) headers.Authorization = token;
            if (org) headers.org = org;

            const response = await fetch(`${SERVER}leads/comment/${commentId}/`, {
                method: 'DELETE',
                headers: headers,
            });

            const data = await response.json();

            if (response.ok && !data.error) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: 'Failed to delete comment',
                };
            }
        } catch (error: any) {
            console.error('Error deleting comment:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const uploadAttachment = async (leadId: string, file: File): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('Token');
            const org = localStorage.getItem('org');

            const headers: Record<string, string> = {};
            if (token) headers.Authorization = token;
            if (org) headers.org = org;

            const formData = new FormData();
            formData.append('lead_attachment', file);

            const response = await fetch(`${SERVER}leads/${leadId}/attachments/`, {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            const data = await response.json();

            if (response.ok && !data.error) {
                return { success: true, data };
            } else {
                return {
                    success: false,
                    error: 'Failed to upload attachment',
                };
            }
        } catch (error: any) {
            console.error('Error uploading attachment:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteAttachment = async (attachmentId: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('Token');
            const org = localStorage.getItem('org');

            const headers: Record<string, string> = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };
            if (token) headers.Authorization = token;
            if (org) headers.org = org;

            const response = await fetch(`${SERVER}leads/attachments/${attachmentId}/`, {
                method: 'DELETE',
                headers: headers,
            });

            const data = await response.json();

            if (response.ok && !data.error) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: 'Failed to delete attachment',
                };
            }
        } catch (error: any) {
            console.error('Error deleting attachment:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        getLeads,
        getLead,
        createLead,
        updateLead,
        deleteLead,
        checkDuplicate,
        addComment,
        deleteComment,
        uploadAttachment,
        deleteAttachment,
    };
};
