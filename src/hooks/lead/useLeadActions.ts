import { fetchData } from '../../components/FetchData';
import { LeadUrl } from '../../services/ApiUrls';

interface UseLeadActionsResult {
    deleteLead: (id: string) => Promise<boolean>;
    addComment: (id: string, comment: string) => Promise<{ success: boolean; data?: any }>;
    deleteComment: (commentId: string) => Promise<boolean>;
    uploadAttachment: (id: string, file: File) => Promise<{ success: boolean; data?: any }>;
    deleteAttachment: (attachmentId: string) => Promise<boolean>;
}

export function useLeadActions(): UseLeadActionsResult {
    const getHeaders = () => ({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Token'),
        org: localStorage.getItem('org'),
    });

    const deleteLead = async (id: string): Promise<boolean> => {
        try {
            const response = await fetchData(`${LeadUrl}/${id}/`, 'DELETE', null, getHeaders());
            return !response.error;
        } catch (error) {
            console.error('Failed to delete lead:', error);
            return false;
        }
    };

    const addComment = async (id: string, comment: string): Promise<{ success: boolean; data?: any }> => {
        const data = { comment };

        try {
            const response = await fetchData(`${LeadUrl}/${id}/`, 'POST', JSON.stringify(data), getHeaders());
            return {
                success: !response.error,
                data: response,
            };
        } catch (error) {
            console.error('Failed to add comment:', error);
            return { success: false };
        }
    };

    const uploadAttachment = async (id: string, file: File): Promise<{ success: boolean; data?: any }> => {
        try {
            const token = localStorage.getItem('Token');
            const org = localStorage.getItem('org');

            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = token;
            if (org) headers['org'] = org;

            const formData = new FormData();
            formData.append('lead_attachment', file);

            const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/app/';
            const response = await fetch(`${baseUrl}leads/${id}/attachments/`, {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            const data = await response.json();

            return {
                success: response.ok && !data.error,
                data: data,
            };
        } catch (error) {
            console.error('Failed to upload attachment:', error);
            return { success: false };
        }
    };

    const deleteAttachment = async (attachmentId: string): Promise<boolean> => {
        try {
            const token = localStorage.getItem('Token');
            const org = localStorage.getItem('org');

            const headers: Record<string, string> = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };

            if (token) headers['Authorization'] = token;
            if (org) headers['org'] = org;

            const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/app/';
            const response = await fetch(`${baseUrl}leads/attachments/${attachmentId}/`, {
                method: 'DELETE',
                headers: headers,
            });

            const data = await response.json();
            return response.ok && !data.error;
        } catch (error) {
            console.error('Failed to delete attachment:', error);
            return false;
        }
    };

    const deleteComment = async (commentId: string): Promise<boolean> => {
        try {
            const token = localStorage.getItem('Token');
            const org = localStorage.getItem('org');

            const headers: Record<string, string> = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };

            if (token) headers['Authorization'] = token;
            if (org) headers['org'] = org;

            const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/app/';
            const response = await fetch(`${baseUrl}leads/comment/${commentId}/`, {
                method: 'DELETE',
                headers: headers,
            });

            const data = await response.json();
            return response.ok && !data.error;
        } catch (error) {
            console.error('Failed to delete comment:', error);
            return false;
        }
    };

    return {
        deleteLead,
        uploadAttachment,
        deleteAttachment,
        addComment,
        deleteComment,
    };
}
