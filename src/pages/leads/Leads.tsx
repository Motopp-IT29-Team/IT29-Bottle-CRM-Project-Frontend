import React, { useState, useEffect, useCallback, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { ITableToolbar, ITable, ITableColumn, IPagination } from '../../components/ui';
import { LeadTableRow } from '../../components/leads/LeadTableRow';
import { useLeads, Lead } from '../../api';
import { routes } from '../../constants/routes';

const columns: ITableColumn[] = [
    { id: 'title', label: 'Lead Name', sortable: true },
    { id: 'country', label: 'Country & Source', sortable: false },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'tags', label: 'Tags & Team', sortable: false },
    { id: 'created_at', label: 'Created', sortable: true },
];

const tabs = [
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
];

export function Leads() {
    const navigate = useNavigate();
    const { getAll, isLoading } = useLeads();

    const [tab, setTab] = useState<'open' | 'closed'>('open');
    const [leads, setLeads] = useState<Lead[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const fetchLeads = useCallback(async () => {
        const offset = (currentPage - 1) * recordsPerPage;
        const result = await getAll({
            offset,
            limit: recordsPerPage,
        });

        if (result.success && result.data) {
            const openLeadsData = result.data.open_leads?.open_leads || [];
            const closedLeadsData = result.data.close_leads?.close_leads || [];

            const openLeadsCount = result.data.open_leads?.leads_count || 0;
            const closedLeadsCount = result.data.close_leads?.leads_count || 0;

            if (tab === 'open') {
                setLeads(openLeadsData);
                setTotalPages(Math.ceil(openLeadsCount / recordsPerPage));
            } else {
                setLeads(closedLeadsData);
                setTotalPages(Math.ceil(closedLeadsCount / recordsPerPage));
            }
        }
    }, [tab, currentPage, recordsPerPage, getAll]);

    useEffect(() => {
        if (localStorage.getItem('org')) {
            fetchLeads();
        }
    }, [fetchLeads]);

    useEffect(() => {
        setCurrentPage(1);
    }, [tab]);

    const handleChangeTab = (e: SyntheticEvent, val: string) => {
        setTab(val as 'open' | 'closed');
    };

    const handleRecordsPerPage = (value: number) => {
        setRecordsPerPage(value);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const navigateToLeadDetail = (leadId: string) => {
        navigate(`${routes.leads.details}?id=${leadId}`);
    };

    const navigateToAddLead = () => {
        if (!isLoading) {
            navigate(routes.leads.create);
        }
    };

    const sortLeads = (leads: Lead[], order: 'asc' | 'desc', orderBy: string) => {
        return [...leads].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (orderBy === 'title') {
                aValue = a.title?.toLowerCase() || '';
                bValue = b.title?.toLowerCase() || '';
            } else if (orderBy === 'status') {
                aValue = a.status?.toLowerCase() || '';
                bValue = b.status?.toLowerCase() || '';
            } else if (orderBy === 'created_at') {
                aValue = new Date(a.created_at).getTime();
                bValue = new Date(b.created_at).getTime();
            } else {
                return 0;
            }

            if (order === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    };

    return (
        <Box sx={{ mt: '60px' }}>
            <ITableToolbar
                tabs={tabs}
                currentTab={tab}
                onTabChange={handleChangeTab}
                addButtonLabel="Add Lead"
                onAdd={navigateToAddLead}
                loading={isLoading}
            >
                <IPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    recordsPerPage={recordsPerPage}
                    onRecordsPerPageChange={handleRecordsPerPage}
                    onPreviousPage={handlePreviousPage}
                    onNextPage={handleNextPage}
                />
            </ITableToolbar>

            <Container sx={{ maxWidth: '100% !important', px: 3, py: 3 }}>
                <ITable
                    data={leads}
                    columns={columns}
                    loading={isLoading}
                    emptyMessage={`No ${tab} leads found`}
                    renderRow={(lead) => <LeadTableRow key={lead.id} lead={lead} onViewDetail={navigateToLeadDetail} />}
                    getRowKey={(lead) => lead.id}
                    sortable={true}
                    defaultOrderBy="created_at"
                    defaultOrder="desc"
                    customSort={sortLeads}
                />
            </Container>
        </Box>
    );
}
