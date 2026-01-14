import React, { useEffect, useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { FiUsers, FiTrendingUp, FiFolder, FiPhone } from 'react-icons/fi';
import { FaEuroSign } from 'react-icons/fa';
import { useDashboard } from '../../api';
import { routes } from '../../constants/routes';
import { StatCard } from './StatCard';
import { RecentList } from './RecentList';
import { RecentActivities } from './RecentActivities';
import { IRecentLead, IRecentOpportunity, IRecentContact } from '../../types';

export const Dashboard: React.FC = () => {
    const { isLoading, dashboardData, getDashboard } = useDashboard();

    useEffect(() => {
        getDashboard();
    }, [getDashboard]);

    const leadsCount = dashboardData?.leads_count ?? dashboardData?.stats?.leads_count ?? 0;
    const opportunitiesCount = dashboardData?.opportunities_count ?? dashboardData?.stats?.opportunities_count ?? 0;
    const accountsCount = dashboardData?.accounts_count ?? dashboardData?.stats?.accounts_count ?? 0;
    const contactsCount = dashboardData?.contacts_count ?? dashboardData?.stats?.contacts_count ?? 0;
    const openLeadsCount = dashboardData?.stats?.open_leads_count ?? 0;
    const wonOpportunitiesCount = dashboardData?.stats?.won_opportunities_count ?? 0;

    // Pipeline value is at root level from API
    const pipelineValueRaw = dashboardData?.pipeline_value ?? dashboardData?.stats?.pipeline_value ?? 0;

    // Format pipeline value
    const formattedPipelineValue = useMemo(() => {
        if (!pipelineValueRaw) return '€0';
        const value = typeof pipelineValueRaw === 'string' ? parseFloat(pipelineValueRaw) : pipelineValueRaw;
        if (value >= 1000000) {
            return `€${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
            return `€${(value / 1000).toFixed(1)}K`;
        }
        return `€${value.toLocaleString()}`;
    }, [pipelineValueRaw]);

    // Transform recent items to common format - API returns 'leads' array at root level
    const recentLeads = useMemo(() => {
        const leads = dashboardData?.leads || dashboardData?.recent_leads || [];

        return leads.slice(0, 5).map((lead: IRecentLead) => ({
            id: lead.id,
            title: lead.full_name || `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || 'Unknown',
            subtitle: lead.email,
            status: lead.status,
            time: lead.created_on_arrow,
        }));
    }, [dashboardData?.leads, dashboardData?.recent_leads]);

    const recentOpportunities = useMemo(() => {
        const opportunities = dashboardData?.opportunities || dashboardData?.recent_opportunities || [];
        return opportunities.slice(0, 5).map((opp: IRecentOpportunity) => ({
            id: opp.id,
            title: opp.name,
            subtitle: opp.amount ? `${opp.currency || '€'}${opp.amount.toLocaleString()}` : undefined,
            status: opp.stage,
            time: opp.created_on_arrow,
        }));
    }, [dashboardData?.opportunities, dashboardData?.recent_opportunities]);

    const recentContacts = useMemo(() => {
        const contacts = dashboardData?.contacts || dashboardData?.recent_contacts || [];
        return contacts.slice(0, 5).map((contact: IRecentContact) => ({
            id: contact.id,
            title: contact.full_name || `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Unknown',
            subtitle: contact.organization || contact.primary_email,
            time: contact.created_on_arrow,
        }));
    }, [dashboardData?.contacts, dashboardData?.recent_contacts]);

    const statCards = [
        {
            title: 'Leads',
            value: leadsCount,
            subtitle: openLeadsCount > 0 ? `${openLeadsCount} open` : undefined,
            icon: <FiUsers size={24} />,
            color: '#6366f1',
            bgColor: '#eef2ff',
            path: routes.leads.main,
        },
        {
            title: 'Opportunities',
            value: opportunitiesCount,
            subtitle: wonOpportunitiesCount > 0 ? `${wonOpportunitiesCount} won` : undefined,
            icon: <FiTrendingUp size={24} />,
            color: '#10b981',
            bgColor: '#d1fae5',
            path: routes.opportunities.main,
        },
        {
            title: 'Accounts',
            value: accountsCount,
            icon: <FiFolder size={24} />,
            color: '#f59e0b',
            bgColor: '#fef3c7',
            path: routes.accounts.main,
        },
        {
            title: 'Contacts',
            value: contactsCount,
            icon: <FiPhone size={24} />,
            color: '#3b82f6',
            bgColor: '#dbeafe',
            path: routes.contacts.main,
        },
        {
            title: 'Total Value',
            value: formattedPipelineValue,
            icon: <FaEuroSign size={24} />,
            color: '#059669',
            bgColor: '#d1fae5',
            path: routes.opportunities.main,
        },
    ];

    return (
        <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 60px)' }}>
            {/* Welcome Section */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    sx={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#111827',
                        mb: 0.5,
                    }}
                >
                    Welcome back! 👋
                </Typography>
                <Typography
                    sx={{
                        fontSize: '14px',
                        color: '#6b7280',
                    }}
                >
                    Here's an overview of your CRM activities
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((card) => (
                    <Grid item xs={12} sm={6} md={4} lg={2.4} key={card.title}>
                        <StatCard
                            title={card.title}
                            value={card.value}
                            subtitle={card.subtitle}
                            icon={card.icon}
                            color={card.color}
                            bgColor={card.bgColor}
                            path={card.path}
                            isLoading={isLoading}
                        />
                    </Grid>
                ))}
            </Grid>

            {/* Recent Lists Section */}
            <Grid container spacing={3}>
                {/* Recent Leads */}
                <Grid item xs={12} md={6} lg={4}>
                    <RecentList
                        title="Recent Leads"
                        items={recentLeads}
                        emptyMessage="No recent leads"
                        basePath={routes.leads.main}
                        isLoading={isLoading}
                        icon={<FiUsers size={18} />}
                    />
                </Grid>

                {/* Recent Opportunities */}
                <Grid item xs={12} md={6} lg={4}>
                    <RecentList
                        title="Recent Opportunities"
                        items={recentOpportunities}
                        emptyMessage="No recent opportunities"
                        basePath={routes.opportunities.main}
                        isLoading={isLoading}
                        icon={<FiTrendingUp size={18} />}
                    />
                </Grid>

                {/* Recent Contacts */}
                <Grid item xs={12} md={6} lg={4}>
                    <RecentList
                        title="Recent Contacts"
                        items={recentContacts}
                        emptyMessage="No recent contacts"
                        basePath={routes.contacts.main}
                        isLoading={isLoading}
                        icon={<FiPhone size={18} />}
                    />
                </Grid>

                {/* Recent Activities */}
                <Grid item xs={12} lg={8}>
                    <RecentActivities activities={dashboardData?.recent_activities || []} isLoading={isLoading} />
                </Grid>
            </Grid>
        </Box>
    );
};
