import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { IContact, IUser } from '../../types';

export interface GetContactsParams {
    offset?: number;
    limit?: number;
}

export interface ContactFormData {
    salutation?: string;
    first_name: string;
    last_name: string;
    organization?: string;
    title?: string;
    primary_email: string;
    secondary_email?: string;
    mobile_number?: string;
    secondary_number?: string;
    department?: string;
    country?: string;
    language?: string;
    do_not_call?: boolean;
    address_line?: string;
    street?: string;
    city?: string;
    state?: string;
    postcode?: string;
    description?: string;
    linked_in_url?: string;
    facebook_url?: string;
    twitter_username?: string;
}

export interface ContactsListResponse {
    error?: boolean;
    contact_obj_list: IContact[];
    contacts_count?: number;
    countries: [string, string][];
    page_number?: number;
    per_page?: number;
    users?: IUser[];
}

export interface ContactDetailResponse {
    error?: boolean;
    contact_obj: IContact;
}

export interface ContactCreateResponse {
    error?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface ContactUpdateResponse {
    error?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface ContactDeleteResponse {
    error?: boolean;
    message?: string;
}

export const contactsService = {
    getAll: async (params?: GetContactsParams): Promise<ContactsListResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.offset !== undefined) {
            queryParams.append('offset', params.offset.toString());
        }
        if (params?.limit !== undefined) {
            queryParams.append('limit', params.limit.toString());
        }

        const url = queryParams.toString() ? `${ENDPOINTS.CONTACTS}?${queryParams.toString()}` : ENDPOINTS.CONTACTS;

        const response = await apiClient.get<ContactsListResponse>(url);
        return response.data;
    },

    getById: async (id: string): Promise<ContactDetailResponse> => {
        const response = await apiClient.get<ContactDetailResponse>(ENDPOINTS.CONTACT_DETAIL(id));
        return response.data;
    },

    create: async (data: ContactFormData): Promise<ContactCreateResponse> => {
        const response = await apiClient.post<ContactCreateResponse>(ENDPOINTS.CONTACTS, data);
        return response.data;
    },

    update: async (id: string, data: Partial<ContactFormData>): Promise<ContactUpdateResponse> => {
        const response = await apiClient.put<ContactUpdateResponse>(ENDPOINTS.CONTACT_DETAIL(id), data);
        return response.data;
    },

    delete: async (id: string): Promise<ContactDeleteResponse> => {
        const response = await apiClient.delete<ContactDeleteResponse>(ENDPOINTS.CONTACT_DETAIL(id));
        return response.data;
    },
};
