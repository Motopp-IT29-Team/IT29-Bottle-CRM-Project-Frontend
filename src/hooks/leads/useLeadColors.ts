export function useLeadColors() {
    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            assigned: '#3b82f6',
            'in process': '#f59e0b',
            converted: '#10b981',
            recycled: '#6366f1',
            closed: '#ef4444',
        };
        return colors[status?.toLowerCase()] || '#6b7280';
    };

    const getSourceColor = (source: string): string => {
        const colors: Record<string, string> = {
            call: '#8b5cf6',
            email: '#3b82f6',
            'existing customer': '#10b981',
            partner: '#f59e0b',
            'public relations': '#ec4899',
            campaign: '#6366f1',
            other: '#6b7280',
        };
        return colors[source?.toLowerCase()] || '#6b7280';
    };

    const getRatingColor = (rating: string): string => {
        const colors: Record<string, string> = {
            hot: '#ef4444',
            warm: '#f59e0b',
            cold: '#3b82f6',
        };
        return colors[rating?.toLowerCase()] || '#6b7280';
    };

    return {
        getStatusColor,
        getSourceColor,
        getRatingColor,
    };
}
