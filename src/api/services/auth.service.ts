import { apiClient } from '../client';

export const authService = {
    login: async (email: string, password: string) => {
        const response = await apiClient.post('/auth/login/', { email, password });
        return response.data;
    },

    forgotPassword: async (email: string) => {
        const response = await apiClient.post('/auth/forgot-password/', { email });
        return response.data;
    },

    resetPassword: async (uidb64: string, token: string, password: string, passwordConfirm: string) => {
        const response = await apiClient.post(`/auth/reset-password/${uidb64}/${token}/`, {
            password,
            password_confirm: passwordConfirm,
        });
        return response.data;
    },
};
