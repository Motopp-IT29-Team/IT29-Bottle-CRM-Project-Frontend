export interface IDashboardStats {
    leads_count: number;
    opportunities_count: number;
    accounts_count: number;
    contacts_count: number;
    pipeline_value: number | string;
    open_leads_count: number;
    won_opportunities_count: number;
}

export interface IRecentLead {
    id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    email: string;
    status: string;
    source?: string;
    created_at?: string;
    created_on_arrow?: string;
}

export interface IRecentOpportunity {
    id: string;
    name: string;
    stage: string;
    amount: number | null;
    currency?: string;
    probability?: number;
    account_name?: string | null;
    created_at?: string;
    created_on_arrow?: string;
}

export interface IRecentContact {
    id: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    primary_email?: string;
    organization?: string | null;
    created_at?: string;
    created_on_arrow?: string;
}

export interface IRecentActivity {
    id: string;
    action: string;
    model_name: string;
    object_id: string | null;
    object_repr: string;
    user_email: string | null;
    created_at: string;
    created_on_arrow: string | null;
}

// The API response structure - counts and arrays at root level
export interface IDashboardResponse {
    leads_count: number;
    opportunities_count: number;
    accounts_count: number;
    contacts_count: number;
    pipeline_value?: number;
    leads: IRecentLead[];
    opportunities: IRecentOpportunity[];
    contacts: IRecentContact[];
    accounts: any[];
    // Optional nested stats for backwards compatibility
    stats?: IDashboardStats;
    recent_leads?: IRecentLead[];
    recent_opportunities?: IRecentOpportunity[];
    recent_contacts?: IRecentContact[];
    recent_activities?: IRecentActivity[];
}
