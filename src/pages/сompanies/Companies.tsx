import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ITable, ITableColumn, IPagination, ITableToolbar, IActionModal } from '../../components/ui';
import { routes } from '../../constants/routes';
import { useCompanies } from '../../api';
import { ICompany } from '../../types';
import { CompaniesTableRow } from '../../components/сompanies/CompaniesTableRow';

const columns: ITableColumn[] = [
    { id: 'index', label: '#', sortable: false },
    { id: 'name', label: 'Company Name', sortable: true },
    { id: 'actions', label: 'Actions', sortable: false },
];

export function Companies() {
    const navigate = useNavigate();
    const { getAll, isLoading, delete: deleteCompany } = useCompanies();

    // State
    const [companies, setCompanies] = useState<ICompany[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

    // Fetch companies
    useEffect(() => {
        const fetchCompanies = async () => {
            const result = await getAll();

            if (result.success && result.data) {
                setCompanies(result.data.data);
                // Calculate total pages for client-side pagination
                setTotalPages(Math.ceil(result.data.data.length / recordsPerPage));
            }
        };

        fetchCompanies();
    }, [recordsPerPage]);

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

    const navigateToCompanyDetail = (company: ICompany) => {
        navigate(routes.companies.details, {
            state: { companyId: company.id, detail: true },
        });
    };

    const navigateToAddCompany = () => {
        if (!isLoading) navigate(routes.companies.create);
    };

    const handleDeleteClick = (id: string) => {
        setCompanyToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (companyToDelete) {
            const result = await deleteCompany(companyToDelete);
            if (result.success) {
                // Refetch companies
                const fetchResult = await getAll();
                if (fetchResult.success && fetchResult.data) {
                    setCompanies(fetchResult.data.data);
                    setTotalPages(Math.ceil(fetchResult.data.data.length / recordsPerPage));
                }
            }
            setDeleteModalOpen(false);
            setCompanyToDelete(null);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setCompanyToDelete(null);
    };

    // Custom sort function
    const sortCompanies = (companies: ICompany[], order: 'asc' | 'desc', orderBy: string) => {
        return [...companies].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (orderBy === 'name') {
                aValue = a.name?.toLowerCase() || '';
                bValue = b.name?.toLowerCase() || '';
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

    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedCompanies = companies.slice(startIndex, endIndex);

    return (
        <Box>
            <ITableToolbar addButtonLabel="Add Company" onAdd={navigateToAddCompany} loading={isLoading}>
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
                data={paginatedCompanies}
                columns={columns}
                loading={isLoading}
                emptyMessage="No companies found"
                renderRow={(company, index) => (
                    <CompaniesTableRow
                        key={company.id}
                        company={company}
                        index={startIndex + index}
                        onClick={navigateToCompanyDetail}
                        onDelete={handleDeleteClick}
                    />
                )}
                getRowKey={(company) => company.id}
                sortable={true}
                defaultOrderBy="name"
                customSort={sortCompanies}
            />

            {/* Delete Modal */}
            <IActionModal
                open={deleteModalOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                variant="warning"
                title="Delete Company?"
                message="Are you sure you want to delete this company? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />
        </Box>
    );
}
