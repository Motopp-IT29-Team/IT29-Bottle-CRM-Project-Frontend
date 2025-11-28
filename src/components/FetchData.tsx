import { SERVER } from '../services/ApiUrls';

export const Header = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('Token'),
    org: localStorage.getItem('org'),
};

export const Header1 = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('Token'),
};

/**
 * Centralized fetch function with automatic authentication error handling.
 *
 * Automatically redirects to /login on:
 * - 401 Unauthorized (invalid/expired token)
 * - 403 Forbidden (no access/missing token)
 *
 * @param url - API endpoint (e.g., '/api/profile/')
 * @param method - HTTP method ('GET', 'POST', 'PUT', 'DELETE')
 * @param data - Request body (for POST/PUT)
 * @param header - Request headers
 * @returns Promise with parsed JSON response
 * @throws Error for non-2xx responses
 */
export async function fetchData(url: any, method: any, data = null as any, header: any) {
    // Always get fresh tokens from localStorage
    const freshHeaders = {
        ...header,
        Authorization: localStorage.getItem('Token'),
        org: localStorage.getItem('org'),
    };

    try {
        const response = await fetch(`${SERVER}${url}`, {
            method,
            headers: freshHeaders,
            body: data,
        });

        // Handle authentication errors - redirect to login
        if (response.status === 401 || response.status === 403) {
            console.warn('Authentication failed - redirecting to login');

            // Clear tokens
            localStorage.removeItem('Token');
            localStorage.removeItem('refresh');
            localStorage.removeItem('org');
            localStorage.removeItem('user');

            // Redirect to login
            window.location.href = '/login';

            // Throw error to stop further processing
            throw new Error('Authentication required');
        }

        // Handle other HTTP errors (404, 500, etc.)
        if (!response.ok) {
            // Try to parse error message from response
            let errorMessage = `HTTP Error ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.detail || errorMessage;
            } catch {
                // If response is not JSON, use status text
                errorMessage = response.statusText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        // Parse and return JSON for successful responses
        return await response.json();
    } catch (error) {
        // Re-throw the error so calling code can handle it
        throw error;
    }
}
