import React from 'react';
import { TableCell, TableRow, IconButton, Avatar, Stack, Chip, Box } from '@mui/material';
import { FaTrashAlt } from 'react-icons/fa';
import { IAccount } from '../../types';

interface AccountsTableRowProps {
    account: IAccount;
    onRowClick: (id: string) => void;
    onDelete: (id: string) => void;
}

export function AccountsTableRow({ account, onRowClick, onDelete }: AccountsTableRowProps) {
    const handleRowClick = (e: React.MouseEvent) => {
        // Don't trigger row click if clicking on action buttons
        if ((e.target as HTMLElement).closest('.action-button')) {
            return;
        }
        onRowClick(account.id);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(account.id);
    };

    return (
        <TableRow
            onClick={handleRowClick}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: '#f5f5f5',
                },
                '&:nth-of-type(even)': {
                    backgroundColor: '#fafafa',
                },
            }}
        >
            {/* Name */}
            <TableCell
                sx={{
                    fontWeight: 500,
                    color: '#1a3353',
                    textTransform: 'capitalize',
                }}
            >
                {account.name || '---'}
            </TableCell>

            {/* Website */}
            <TableCell sx={{ color: '#1a3353' }}>
                {account.website ? (
                    <a
                        href={account.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: '#3E79F7', textDecoration: 'none' }}
                    >
                        {account.website}
                    </a>
                ) : (
                    '---'
                )}
            </TableCell>

            {/* Created By */}
            <TableCell>
                {account.created_by ? (
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                            src={account.created_by.profile_pic || ''}
                            alt={account.created_by.email}
                            sx={{ width: 32, height: 32 }}
                        />
                        <Box sx={{ color: '#1a3353', textTransform: 'lowercase' }}>{account.created_by.email}</Box>
                    </Stack>
                ) : (
                    '---'
                )}
            </TableCell>

            {/* Country */}
            <TableCell sx={{ color: '#1a3353', textTransform: 'capitalize' }}>
                {account.billing_country || '---'}
            </TableCell>

            {/* Tags */}
            <TableCell>
                {account.tags && account.tags.length > 0 ? (
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {account.tags.slice(0, 2).map((tag: any) => (
                            <Chip
                                key={tag.id || tag}
                                label={tag.name || tag}
                                size="small"
                                sx={{
                                    height: '24px',
                                    borderRadius: '4px',
                                    backgroundColor: '#e3f2fd',
                                    color: '#1976d2',
                                }}
                            />
                        ))}
                        {account.tags.length > 2 && (
                            <Chip
                                label={`+${account.tags.length - 2}`}
                                size="small"
                                sx={{
                                    height: '24px',
                                    borderRadius: '4px',
                                    backgroundColor: '#f5f5f5',
                                }}
                            />
                        )}
                    </Stack>
                ) : (
                    '---'
                )}
            </TableCell>

            {/* Actions */}
            <TableCell>
                <IconButton
                    className="action-button"
                    onClick={handleDelete}
                    size="small"
                    sx={{
                        '&:hover': {
                            backgroundColor: '#ffebee',
                        },
                    }}
                >
                    <FaTrashAlt style={{ fill: '#d32f2f', width: '14px' }} />
                </IconButton>
            </TableCell>
        </TableRow>
    );
}
