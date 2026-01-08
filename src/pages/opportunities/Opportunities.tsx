import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ITable, ITableColumn, IPagination, ITableToolbar } from '../../components/ui';
import { routes } from '../../constants/routes';
import { IOpportunity } from '../../types';
import { useOpportunities } from '../../api';
import { OpportunitiesTableRow } from '../../components/opportunities/OpportunitiesTableRow';

const columns: ITableColumn[] = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'account', label: 'Account', sortable: false },
    { id: 'assigned_to', label: 'Assigned To', sortable: false },
    { id: 'stage', label: 'Stage', sortable: true },
    { id: 'amount', label: 'Amount', sortable: true },
    { id: 'created_at', label: 'Created On', sortable: true },
    { id: 'lead_source', label: 'Lead Source', sortable: false },
];

export function Opportunities() {
    const navigate = useNavigate();
    const { getAll, isLoading } = useOpportunities();

    const [opportunities, setOpportunities] = useState<IOpportunity[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalOpportunities, setTotalOpportunities] = useState(0);

    const fetchOpportunities = useCallback(async () => {
        const offset = (currentPage - 1) * recordsPerPage;
        const result = await getAll({ offset, limit: recordsPerPage });

        if (result.success && result.data) {
            const count = result.data.opportunities_count || 0;
            setOpportunities(result.data.opportunities);
            setTotalPages(Math.ceil(count / recordsPerPage));
            setTotalOpportunities(count);
        }
    }, [currentPage, recordsPerPage, getAll]);

    useEffect(() => {
        fetchOpportunities();
    }, [fetchOpportunities]);

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

    const navigateToDetail = (id: string) => {
        navigate(`${routes.opportunities.details}?id=${id}`);
    };

    const navigateToAdd = () => {
        if (!isLoading) navigate(routes.opportunities.create);
    };

    const sortOpportunities = (opportunities: IOpportunity[], order: 'asc' | 'desc', orderBy: string) => {
        return [...opportunities].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (orderBy === 'name') {
                aValue = a.name?.toLowerCase() || '';
                bValue = b.name?.toLowerCase() || '';
            } else if (orderBy === 'stage') {
                aValue = a.stage?.toLowerCase() || '';
                bValue = b.stage?.toLowerCase() || '';
            } else if (orderBy === 'amount') {
                aValue = Number(a.amount) || 0;
                bValue = Number(b.amount) || 0;
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
        <Box>
            <ITableToolbar addButtonLabel="Add Opportunity" onAdd={navigateToAdd} loading={isLoading}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                        sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#64748b',
                            px: 2,
                            py: 1,
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                        }}
                    >
                        Total: {totalOpportunities}
                    </Typography>
                    <IPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        recordsPerPage={recordsPerPage}
                        onRecordsPerPageChange={handleRecordsPerPage}
                        onPreviousPage={handlePreviousPage}
                        onNextPage={handleNextPage}
                    />
                </Box>
            </ITableToolbar>

            <ITable
                data={opportunities}
                columns={columns}
                loading={isLoading}
                emptyMessage="No opportunities found"
                renderRow={(opportunity) => (
                    <OpportunitiesTableRow
                        key={opportunity.id}
                        opportunity={opportunity}
                        onViewDetail={navigateToDetail}
                    />
                )}
                getRowKey={(opportunity) => opportunity.id}
                sortable={true}
                defaultOrderBy="created_at"
                customSort={sortOpportunities}
            />
        </Box>
    );
}
