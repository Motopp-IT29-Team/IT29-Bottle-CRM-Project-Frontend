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
 * Response handling:
 * - 2xx: Returns parsed JSON response (or { success: true } for empty body)
 * - 401/403: Redirects to /login and clears tokens
 * - 4xx (other): Returns error object with structure { error: true, status, message, errors }
 * - 5xx: Throws exception (server error)
 * - Network errors: Throws exception
 *
 * @param url - API endpoint (e.g., '/api/profile/')
 * @param method - HTTP method ('GET', 'POST', 'PUT', 'DELETE')
 * @param data - Request body (for POST/PUT)
 * @param header - Request headers
 * @returns Promise with parsed JSON response or error object
 * @throws Error for 5xx responses and network errors
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

        // Handle successful responses (2xx)
        if (response.ok) {
            // Try to parse JSON response
            try {
                const contentType = response.headers.get('content-type');

                // Check if response has JSON content
                if (contentType && contentType.includes('application/json')) {
                    return await response.json();
                }

                // Check if response has content
                const text = await response.text();
                if (text) {
                    try {
                        return JSON.parse(text);
                    } catch {
                        // If not JSON, return as text wrapped in object
                        return { data: text };
                    }
                }

                // Empty body - return success indicator
                return { success: true };
            } catch (error) {
                // If parsing fails, return success indicator
                return { success: true };
            }
        }

        // Handle client errors (4xx) - return error object
        if (response.status >= 400 && response.status < 500) {
            try {
                const errorData = await response.json();

                return {
                    error: true,
                    status: response.status,
                    message: errorData.message || errorData.detail || `HTTP Error ${response.status}`,
                    errors: errorData.errors || null,
                };
            } catch {
                // If response body is not JSON
                return {
                    error: true,
                    status: response.status,
                    message: response.statusText || `HTTP Error ${response.status}`,
                    errors: null,
                };
            }
        }

        // Handle server errors (5xx) - throw exception
        if (response.status >= 500) {
            let errorMessage = `Server Error ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.detail || errorMessage;
            } catch {
                errorMessage = response.statusText || errorMessage;
            }

            throw new Error(errorMessage);
        }

        // Fallback for unexpected status codes
        throw new Error(`Unexpected HTTP status: ${response.status}`);
    } catch (error) {
        // Re-throw the error so calling code can handle it
        throw error;
    }
}
