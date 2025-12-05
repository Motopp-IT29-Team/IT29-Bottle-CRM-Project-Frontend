import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { ITable, ITableColumn, IPagination } from '../../components/ui';
import { ITableToolbar } from '../../components/ui';
import { UserTableRow } from '../../components/users/UserTableRow';
import { useUsers } from '../../api';
import { routes } from '../../constants/routes';
import { IUser } from '../../types';

const columns: ITableColumn[] = [
    { id: 'name', label: 'Full Name', sortable: true },
    { id: 'email', label: 'Email Address', sortable: true },
    { id: 'role', label: 'Role', sortable: true },
];

const tabs = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

export function Users() {
    const navigate = useNavigate();
    const { getAll, isLoading } = useUsers();

    const [tab, setTab] = useState<'active' | 'inactive'>('active');
    const [users, setUsers] = useState<IUser[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            const offset = (currentPage - 1) * recordsPerPage;
            const result = await getAll({ offset, limit: recordsPerPage, status: tab });

            if (result.success && result.data) {
                setUsers(result.data.users);
                setTotalPages(Math.ceil(result.data.total_count / recordsPerPage));
            }
        };

        fetchUsers();
    }, [tab, currentPage, recordsPerPage, getAll]);

    useEffect(() => {
        setCurrentPage(1);
    }, [tab]);

    const handleChangeTab = (e: SyntheticEvent, val: string) => {
        setTab(val as 'active' | 'inactive');
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

    const navigateToUserDetail = (userId: string) => {
        navigate(`${routes.users.details}?id=${userId}`);
    };

    const navigateToAddUser = () => {
        if (!isLoading) navigate(routes.users.create);
    };

    const sortUsers = (users: IUser[], order: 'asc' | 'desc', orderBy: string) => {
        return [...users].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (orderBy === 'name') {
                aValue = `${a.first_name} ${a.last_name}`.toLowerCase();
                bValue = `${b.first_name} ${b.last_name}`.toLowerCase();
            } else if (orderBy === 'email') {
                aValue = a.user_details?.email?.toLowerCase() || '';
                bValue = b.user_details?.email?.toLowerCase() || '';
            } else if (orderBy === 'role') {
                aValue = a.role?.toLowerCase() || '';
                bValue = b.role?.toLowerCase() || '';
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
                addButtonLabel="Add User"
                onAdd={navigateToAddUser}
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
                    data={users}
                    columns={columns}
                    loading={isLoading}
                    emptyMessage={`No ${tab} users found`}
                    renderRow={(user) => <UserTableRow key={user.id} user={user} onViewDetail={navigateToUserDetail} />}
                    getRowKey={(user) => user.id}
                    sortable={true}
                    defaultOrderBy="name"
                    customSort={sortUsers}
                />
            </Container>
        </Box>
    );
}
