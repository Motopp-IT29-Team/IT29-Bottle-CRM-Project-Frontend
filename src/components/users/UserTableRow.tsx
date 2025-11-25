import React from 'react';
import { TableRow, TableCell } from '@mui/material';

interface User {
    id: string;
    first_name: string;
    last_name: string;
    user_details: { email: string };
    role: string;
}

interface UserTableRowProps {
    user: User;
    onViewDetail: (userId: string) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({ user, onViewDetail }) => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || '---';

    return (
        <TableRow
            onClick={() => onViewDetail(user.id)}
            sx={{
                '&:nth-of-type(even)': { backgroundColor: '#f9fafb' },
                '&:hover': { backgroundColor: '#f1f5f9' },
                cursor: 'pointer',
                transition: 'background-color 0.2s',
            }}
        >
            <TableCell
                sx={{
                    border: 0,
                    color: '#1f2937',
                    fontWeight: 500,
                }}
            >
                {fullName}
            </TableCell>
            <TableCell
                sx={{
                    border: 0,
                    color: '#1976d2',
                    fontWeight: 500,
                    '&:hover': { textDecoration: 'underline' },
                }}
            >
                {user.user_details?.email || '---'}
            </TableCell>
            <TableCell sx={{ border: 0, color: '#475569', textTransform: 'capitalize' }}>
                {user.role || '---'}
            </TableCell>
        </TableRow>
    );
};
