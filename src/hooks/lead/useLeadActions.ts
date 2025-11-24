import { fetchData } from '../../components/FetchData';
import { LeadUrl } from '../../services/ApiUrls';

interface UseLeadActionsResult {
    deleteLead: (id: string) => Promise<boolean>;
    addComment: (id: string, comment: string) => Promise<boolean>;
    uploadAttachment: (id: string, file: File) => Promise<{ success: boolean; data?: any }>;
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

    const addComment = async (id: string, comment: string): Promise<boolean> => {
        const data = { comment };

        try {
            const response = await fetchData(`${LeadUrl}/${id}/`, 'POST', JSON.stringify(data), getHeaders());
            return !response.error;
        } catch (error) {
            console.error('Failed to add comment:', error);
            return false;
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

            console.log('Uploading file:', file.name);
            console.log('FormData entries:');

            const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/app/';
            const response = await fetch(`${baseUrl}leads/${id}/`, {
                method: 'POST',
                headers: headers,
                body: formData,
            });

            const data = await response.json();
            console.log('Upload response:', data);

            return {
                success: response.ok && !data.error,
                data: data,
            };
        } catch (error) {
            console.error('Failed to upload attachment:', error);
            return { success: false };
        }
    };

    return {
        deleteLead,
        addComment,
        uploadAttachment,
    };
}
