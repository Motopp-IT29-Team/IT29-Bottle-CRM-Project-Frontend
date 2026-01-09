import React from 'react';
import { TableCell, TableRow, Avatar, Stack, Box } from '@mui/material';
import { IAccount } from '../../types';
import { getCountryNameByCode } from '../../utils/userHelpers';

interface AccountsTableRowProps {
    account: IAccount;
    onRowClick: (id: string) => void;
}

export function AccountsTableRow({ account, onRowClick }: AccountsTableRowProps) {
    const handleRowClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('.action-button')) {
            return;
        }
        onRowClick(account.id);
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
                {getCountryNameByCode(account.billing_country) || '---'}
            </TableCell>
        </TableRow>
    );
}
