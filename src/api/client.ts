import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { BackendErrorResponse } from './types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/';

const createApiClient = (): AxiosInstance => {
    const client = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
            Accept: 'application/json',
        },
    });

    client.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem('Token');
            const org = localStorage.getItem('org');

            if (token) {
                config.headers.Authorization = token;
            }

            if (org) {
                config.headers.org = org;
            }

            if (!(config.data instanceof FormData)) {
                config.headers['Content-Type'] = 'application/json';
            }

            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    );

    client.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        (error: AxiosError<BackendErrorResponse>) => {
            const isLoginPage = window.location.pathname === '/login';
            const isLoginRequest = error.config?.url?.includes('/auth/login');
            const isUsersRequest = error.config?.url?.includes('/users') || error.config?.url?.includes('users/');
            const isActivityLogsRequest = error.config?.url?.includes('activity-logs');

            if (error.response?.status === 401 || error.response?.status === 403) {
                // Handle 403 (Forbidden) - user doesn't have permission but is authenticated
                // Don't logout, just return error response
                if (error.response?.status === 403) {
                    return Promise.resolve({
                        ...error.response,
                        data: {
                            error: true,
                            status: 403,
                            message: error.response.data?.message || 'You do not have permission to access this resource',
                            errors: undefined,
                        },
                    } as AxiosResponse<BackendErrorResponse>);
                }

                // Handle 401 (Unauthorized) - session may have expired
                // However, don't logout on certain endpoints that might return 401 for permission issues
                if (error.response?.status === 401 && (isUsersRequest || isActivityLogsRequest)) {
                    return Promise.resolve({
                        ...error.response,
                        data: {
                            error: true,
                            status: 401,
                            message: error.response.data?.message || 'Access denied',
                            errors: undefined,
                        },
                    } as AxiosResponse<BackendErrorResponse>);
                }

                // For actual authentication failures, redirect to login
                if (!isLoginPage && !isLoginRequest) {
                    console.warn('Authentication failed - redirecting to login');

                    localStorage.removeItem('Token');
                    localStorage.removeItem('refresh');
                    localStorage.removeItem('org');
                    localStorage.removeItem('user');

                    window.location.href = '/login';

                    return Promise.reject(new Error('Authentication required'));
                }

                return Promise.reject(error);
            }

            if (error.response && error.response.status >= 400 && error.response.status < 500) {
                const errorData = error.response.data;

                return Promise.resolve({
                    data: {
                        error: true,
                        status: error.response.status,
                        message: errorData?.message || errorData?.detail || `HTTP Error ${error.response.status}`,
                        errors: errorData?.errors || null,
                    },
                } as AxiosResponse<BackendErrorResponse>);
            }

            if (error.response && error.response.status >= 500) {
                const errorMessage =
                    error.response.data?.message ||
                    error.response.data?.detail ||
                    `Server Error ${error.response.status}`;
                return Promise.reject(new Error(errorMessage));
            }

            if (!error.response) {
                return Promise.reject(new Error('Network error - please check your connection'));
            }

            return Promise.reject(error);
        }
    );

    return client;
};

export const apiClient = createApiClient();
