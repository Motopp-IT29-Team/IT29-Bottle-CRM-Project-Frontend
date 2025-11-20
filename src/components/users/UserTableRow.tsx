import React from 'react';
import { TableRow, TableCell, IconButton, Box } from '@mui/material';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

interface User {
    id: string;
    user_details: { email: string };
    role: string;
}

interface UserTableRowProps {
    user: User;
    onViewDetail: (userId: string) => void;
    onEdit: (userId: string) => void;
    onDelete: (userId: string) => void;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({ user, onViewDetail, onEdit, onDelete }) => {
    return (
        <TableRow
            sx={{
                '&:nth-of-type(even)': { backgroundColor: '#f9fafb' },
                '&:hover': { backgroundColor: '#f1f5f9' },
                transition: 'background-color 0.2s',
            }}
        >
            <TableCell
                onClick={() => onViewDetail(user.id)}
                sx={{
                    border: 0,
                    color: '#1976d2',
                    cursor: 'pointer',
                    fontWeight: 500,
                    '&:hover': { textDecoration: 'underline' },
                }}
            >
                {user.user_details?.email || '---'}
            </TableCell>
            <TableCell sx={{ border: 0, color: '#475569', textTransform: 'capitalize' }}>
                {user.role || '---'}
            </TableCell>
            <TableCell sx={{ border: 0 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        onClick={() => onEdit(user.id)}
                        sx={{
                            color: '#1976d2',
                            backgroundColor: '#e3f2fd',
                            borderRadius: '8px',
                            p: 1,
                            '&:hover': { backgroundColor: '#bbdefb' },
                        }}
                    >
                        <FaEdit size={16} />
                    </IconButton>
                    <IconButton
                        onClick={() => onDelete(user.id)}
                        sx={{
                            color: '#ef4444',
                            backgroundColor: '#fef2f2',
                            borderRadius: '8px',
                            p: 1,
                            '&:hover': { backgroundColor: '#fee2e2' },
                        }}
                    >
                        <FaTrashAlt size={14} />
                    </IconButton>
                </Box>
            </TableCell>
        </TableRow>
    );
};
