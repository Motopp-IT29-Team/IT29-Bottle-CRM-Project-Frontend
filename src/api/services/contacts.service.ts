import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';

export interface ContactFormData {
    salutation: string;
    first_name: string;
    last_name: string;
    primary_email: string;
    secondary_email: string;
    mobile_number: string;
    secondary_number: string;
    organization: string;
    title: string;
    language: string;
    do_not_call: boolean;
    department: string;
    address_line: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
    description: string;
    linked_in_url: string;
    facebook_url: string;
    twitter_username: string;
}

export interface Contact {
    id: string;
    first_name: string;
    last_name: string;
    title?: string;
    created_at: string;
    salutation?: string;
    primary_email?: string;
    secondary_email?: string;
    mobile_number?: string;
    secondary_number?: string;
    organization?: string;
    language?: string;
    do_not_call?: boolean;
    department?: string;
    description?: string;
    linked_in_url?: string;
    facebook_url?: string;
    twitter_username?: string;
    address: {
        address_line?: string;
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        postcode?: string;
    };
}

export interface GetContactsParams {
    offset?: number;
    limit?: number;
}

export const contactsService = {
    getAll: async (params?: GetContactsParams) => {
        const queryParams = new URLSearchParams();

        if (params?.offset !== undefined) {
            queryParams.append('offset', params.offset.toString());
        }
        if (params?.limit !== undefined) {
            queryParams.append('limit', params.limit.toString());
        }

        const url = queryParams.toString() ? `${ENDPOINTS.CONTACTS}?${queryParams.toString()}` : ENDPOINTS.CONTACTS;

        const response = await apiClient.get(url);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(ENDPOINTS.CONTACT_DETAIL(id));
        return response.data;
    },

    create: async (data: ContactFormData) => {
        const response = await apiClient.post(ENDPOINTS.CONTACTS, data);
        return response.data;
    },

    update: async (id: string, data: Partial<ContactFormData>) => {
        const response = await apiClient.put(ENDPOINTS.CONTACT_DETAIL(id), data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(ENDPOINTS.CONTACT_DETAIL(id));
        return response.data;
    },
};
