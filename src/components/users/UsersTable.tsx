import React, { useState } from 'react';
import { Paper, TableContainer, Table, TableBody, TableRow, TableCell, Typography } from '@mui/material';
import { UserTableRow } from './UserTableRow';
import { EnhancedTableHead } from '../EnchancedTableHead';
import { Spinner } from '../Spinner';

interface User {
    id: string;
    user_details: { email: string };
    role: string;
}

interface UsersTableProps {
    users: User[];
    loading: boolean;
    tab: 'active' | 'inactive';
    onViewDetail: (userId: string) => void;
    onEdit: (userId: string) => void;
    onDelete: (userId: string) => void;
}

const headCells = [
    { id: 'email', numeric: false, disablePadding: false, label: 'Email Address' },
    { id: 'role', numeric: false, disablePadding: false, label: 'Role' },
    { id: 'actions', numeric: true, disablePadding: false, label: 'Actions' },
];

const sortUsers = (users: User[], order: 'asc' | 'desc', orderBy: string) => {
    return [...users].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (orderBy === 'email') {
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

export const UsersTable: React.FC<UsersTableProps> = ({ users, loading, tab, onViewDetail, onEdit, onDelete }) => {
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState('email');

    const handleRequestSort = (event: any, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedUsers = sortUsers(users, order, orderBy);

    return (
        <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e7ef' }}>
            <TableContainer>
                <Table>
                    <EnhancedTableHead
                        numSelected={0}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={() => {}}
                        onRequestSort={handleRequestSort}
                        rowCount={users.length}
                        headCells={headCells}
                        numSelectedId={[]}
                        isSelectedId={[]}
                    />
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={3} sx={{ border: 0, textAlign: 'center', py: 8 }}>
                                    <Spinner />
                                </TableCell>
                            </TableRow>
                        ) : sortedUsers.length > 0 ? (
                            sortedUsers.map((user: User) => (
                                <UserTableRow
                                    key={user.id}
                                    user={user}
                                    onViewDetail={onViewDetail}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ border: 0, py: 8 }}>
                                    <Typography color="text.secondary">No {tab} users found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};
