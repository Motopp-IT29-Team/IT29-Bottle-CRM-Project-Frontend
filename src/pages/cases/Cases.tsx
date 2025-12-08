import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ITable, ITableColumn, IPagination, ITableToolbar } from '../../components/ui';
import { useCases } from '../../api';
import { routes } from '../../constants/routes';
import { ICase } from '../../types';
import { CasesTableRow } from '../../components/cases/CasesTableRow';

const columns: ITableColumn[] = [
    { id: 'name', label: 'Case Name', sortable: true },
    { id: 'account', label: 'Account', sortable: true },
    { id: 'status', label: 'Status', sortable: true },
    { id: 'priority', label: 'Priority', sortable: true },
    { id: 'assigned_to', label: 'Assigned To', sortable: false },
    { id: 'created_at', label: 'Created', sortable: true },
];

export function Cases() {
    const navigate = useNavigate();
    const { getAll, isLoading } = useCases();

    // State
    const [cases, setCases] = useState<ICase[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    // Fetch cases
    useEffect(() => {
        const fetchCases = async () => {
            const offset = (currentPage - 1) * recordsPerPage;
            const result = await getAll({ offset, limit: recordsPerPage });

            if (result.success && result.data) {
                setCases(result.data.cases);
                setTotalPages(Math.ceil(result.data.cases_count / recordsPerPage));
            }
        };

        fetchCases();
    }, [currentPage, recordsPerPage]);

    // Handlers
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

    const navigateToCaseDetail = (caseItem: ICase) => {
        navigate(routes.cases.details, {
            state: { caseId: caseItem.id, detail: true },
        });
    };

    const navigateToAddCase = () => {
        if (!isLoading) navigate(routes.cases.create);
    };

    // Sort function
    const sortCases = (cases: ICase[], order: 'asc' | 'desc', orderBy: string) => {
        return [...cases].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (orderBy === 'name') {
                aValue = a.name?.toLowerCase() || '';
                bValue = b.name?.toLowerCase() || '';
            } else if (orderBy === 'account') {
                aValue = a.account?.name?.toLowerCase() || '';
                bValue = b.account?.name?.toLowerCase() || '';
            } else if (orderBy === 'status') {
                aValue = a.status?.toLowerCase() || '';
                bValue = b.status?.toLowerCase() || '';
            } else if (orderBy === 'priority') {
                aValue = a.priority?.toLowerCase() || '';
                bValue = b.priority?.toLowerCase() || '';
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
            <ITableToolbar addButtonLabel="Add Case" onAdd={navigateToAddCase} loading={isLoading}>
                <IPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    recordsPerPage={recordsPerPage}
                    onRecordsPerPageChange={handleRecordsPerPage}
                    onPreviousPage={handlePreviousPage}
                    onNextPage={handleNextPage}
                />
            </ITableToolbar>

            <ITable
                data={cases}
                columns={columns}
                loading={isLoading}
                emptyMessage="No cases found"
                renderRow={(caseItem) => (
                    <CasesTableRow key={caseItem.id} case={caseItem} onClick={navigateToCaseDetail} />
                )}
                getRowKey={(caseItem) => caseItem.id}
                sortable={true}
                defaultOrderBy="created_at"
                customSort={sortCases}
            />
        </Box>
    );
}
