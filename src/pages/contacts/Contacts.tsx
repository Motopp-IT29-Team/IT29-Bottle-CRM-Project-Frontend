import { Box, Container } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Contact, useContactsApi } from '../../hooks/contacts/useContactsApi';
import { IPagination, ITable, ITableColumn, ITableToolbar } from '../../components/ui';
import { routes } from '../../constants/routes';

const columns: ITableColumn[] = [
    {
        id: 'first_name',
        label: 'Name',
        sortable: false,
    },
    // {
    //     id: 'first_name',
    //     sortable: false,
    //     label: 'First Name',
    // },
    // {
    //     id: 'last_name',
    //     sortable: false,
    //     label: 'Last Name',
    // },
    {
        id: 'primary_email',
        label: 'Email Address',
        sortable: false,
    },
    {
        id: 'mobile_number',
        label: 'Phone Number',
        sortable: false,
    },
];

export function Contacts() {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<Contact[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);

    const { getContacts, isLoading } = useContactsApi();

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = useCallback(async () => {
        const offset = (currentPage - 1) * recordsPerPage;
        const result = await getContacts({
            offset,
            limit: recordsPerPage,
        });

        if (result.data?.contacts) {
            setContacts(result.data?.contacts);
        }
    }, [currentPage, recordsPerPage]);

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handleRecordsPerPage = (value: number) => {
        setRecordsPerPage(value);
        setCurrentPage(1);
    };

    const navigateToContactLead = () => {
        if (!isLoading) {
            navigate(routes.contacts.edit);
        }
    };

    const navigateToContactDetail = (id: string) => {
        navigate(`${routes.contacts.details}?id=${id}`);
    };

    const sort = (contacts: Contact[], order: 'asc' | 'desc', orderBy: string) => {
        return [...contacts].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            // if (orderBy === 'title') {
            //     aValue = a.title?.toLowerCase() || '';
            //     bValue = b.title?.toLowerCase() || '';
            // } else if (orderBy === 'status') {
            //     aValue = a.status?.toLowerCase() || '';
            //     bValue = b.status?.toLowerCase() || '';
            // } else if (orderBy === 'created_at') {
            //     aValue = new Date(a.created_at).getTime();
            //     bValue = new Date(b.created_at).getTime();
            // } else {
            //     return 0;
            // }

            if (order === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    };

    return (
        <Box sx={{ mt: '60px' }}>
            <ITableToolbar addButtonLabel="Add Contact" onAdd={navigateToContactLead} loading={isLoading}>
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
                    data={contacts}
                    columns={columns}
                    loading={isLoading}
                    emptyMessage={`No contacts found`}
                    renderRow={(contact) => <></>}
                    getRowKey={(contact) => contact.id}
                    sortable={true}
                    defaultOrderBy="created_at"
                    defaultOrder="desc"
                    customSort={sort}
                />
            </Container>
        </Box>
    );
}
