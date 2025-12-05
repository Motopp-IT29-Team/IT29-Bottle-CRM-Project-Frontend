import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { ITable, ITableColumn, IPagination, ITableToolbar } from '../../components/ui';
import { useContacts } from '../../api';
import { routes } from '../../constants/routes';
import { ContactTableRow } from '../../components/contacts/ContactsTableRow';
import { IContact } from '../../types';

const columns: ITableColumn[] = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'email', label: 'Email Address', sortable: true },
    { id: 'phone', label: 'Phone Number', sortable: false },
    { id: 'account', label: 'Account', sortable: false },
    { id: 'created_at', label: 'Created', sortable: true },
];

export function Contacts() {
    const navigate = useNavigate();
    const { getAll, isLoading } = useContacts();

    const [contacts, setContacts] = useState<IContact[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const fetchContacts = useCallback(async () => {
        const offset = (currentPage - 1) * recordsPerPage;
        const result = await getAll({
            offset,
            limit: recordsPerPage,
        });
        console.log(result);
        if (result.success && result.data) {
            setContacts(result.data.contact_obj_list || []);
            setTotalPages(Math.ceil((result.data.contacts_count || 0) / recordsPerPage));
        }
    }, [currentPage, recordsPerPage, getAll]);

    useEffect(() => {
        fetchContacts();
    }, []);

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

    const navigateToContactDetail = (contactId: string) => {
        navigate(`${routes.contacts.details}?id=${contactId}`);
    };

    const navigateToAddContact = () => {
        if (!isLoading) {
            navigate(routes.contacts.create);
        }
    };

    const sortContacts = (contacts: IContact[], order: 'asc' | 'desc', orderBy: string) => {
        if (!Array.isArray(contacts) || contacts.length === 0) {
            return [];
        }

        return [...contacts].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (orderBy === 'name') {
                aValue = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase();
                bValue = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase();
            } else if (orderBy === 'email') {
                aValue = a.primary_email?.toLowerCase() || '';
                bValue = b.primary_email?.toLowerCase() || '';
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
            <ITableToolbar addButtonLabel="Add Contact" onAdd={navigateToAddContact} loading={isLoading}>
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
                    emptyMessage="No contacts found"
                    renderRow={(contact) => (
                        <ContactTableRow key={contact.id} contact={contact} onViewDetail={navigateToContactDetail} />
                    )}
                    getRowKey={(contact) => contact.id}
                    sortable={true}
                    defaultOrderBy="created_at"
                    defaultOrder="desc"
                    customSort={sortContacts}
                />
            </Container>
        </Box>
    );
}
