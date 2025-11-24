import { useEffect, useState } from 'react';
import { fetchData } from '../../components/FetchData';
import { LeadUrl } from '../../services/ApiUrls';

interface LeadDetailsData {
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

interface UseLeadDetailsResult {
    leadDetails: LeadDetailsData | null;
    attachments: any[];
    comments: any[];
    isLoading: boolean;
    error: string | null;
    fetchLeadDetails: (id: string) => Promise<void>;
    refresh: () => Promise<void>;
}

export function useLeadDetails(id: string | null): UseLeadDetailsResult {
    const [leadDetails, setLeadDetails] = useState<LeadDetailsData | null>(null);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLeadDetails = async (id: string) => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org'),
        };

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetchData(`${LeadUrl}/${id}/`, 'GET', null, Header);

            if (!res.error) {
                setLeadDetails(res.lead_obj);
                setAttachments(res.attachments || []);
                setComments(res.comments || []);
            } else {
                setError(res.error.message || 'Failed to load lead details');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
            console.error('Failed to load lead details:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const refresh = async () => {
        if (id) {
            await fetchLeadDetails(id);
        }
    };

    useEffect(() => {
        if (id) {
            void fetchLeadDetails(id);
        }
    }, [id]);

    return {
        leadDetails,
        attachments,
        comments,
        isLoading,
        error,
        fetchLeadDetails,
        refresh,
    };
}
