import React from 'react';
import { TableCell, TableRow, Chip, Box, AvatarGroup, Avatar, Tooltip } from '@mui/material';
import { ICase } from '../../types';

interface CasesTableRowProps {
    case: ICase;
    onClick: (caseItem: ICase) => void;
}

const getStatusColor = (status: string): string => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('new')) return '#2196f3';
    if (statusLower.includes('working')) return '#ff9800';
    if (statusLower.includes('closed')) return '#4caf50';
    if (statusLower.includes('duplicate')) return '#9e9e9e';
    return '#757575';
};

const getPriorityColor = (priority: string): string => {
    const priorityLower = priority?.toLowerCase() || '';
    if (priorityLower.includes('low')) return '#4caf50';
    if (priorityLower.includes('medium')) return '#ff9800';
    if (priorityLower.includes('high')) return '#f44336';
    return '#757575';
};

export function CasesTableRow({ case: caseItem, onClick }: CasesTableRowProps) {
    return (
        <TableRow
            hover
            onClick={() => onClick(caseItem)}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
            }}
        >
            {/* Case Name */}
            <TableCell>
                <Box
                    sx={{
                        color: '#3E79F7',
                        fontWeight: 500,
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    }}
                >
                    {caseItem.name}
                </Box>
            </TableCell>

            {/* Account */}
            <TableCell>{caseItem.account?.name || '-'}</TableCell>

            {/* Status */}
            <TableCell>
                <Chip
                    label={caseItem.status}
                    size="small"
                    sx={{
                        backgroundColor: getStatusColor(caseItem.status),
                        color: 'white',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                    }}
                />
            </TableCell>

            {/* Priority */}
            <TableCell>
                <Chip
                    label={caseItem.priority}
                    size="small"
                    sx={{
                        backgroundColor: getPriorityColor(caseItem.priority),
                        color: 'white',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                    }}
                />
            </TableCell>

            {/* Assigned To */}
            <TableCell>
                {caseItem.assigned_to && caseItem.assigned_to.length > 0 ? (
                    <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                        {caseItem.assigned_to.map((user) => (
                            <Tooltip key={user.id} title={user.user_details?.email || 'Unknown'}>
                                <Avatar
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        fontSize: '0.875rem',
                                        bgcolor: '#1976d2',
                                    }}
                                >
                                    {user.user_details?.email?.charAt(0).toUpperCase() || 'U'}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </AvatarGroup>
                ) : (
                    <Box sx={{ color: '#999' }}>Unassigned</Box>
                )}
            </TableCell>

            {/* Created At */}
            <TableCell>{caseItem.created_at ? new Date(caseItem.created_at).toLocaleDateString() : '-'}</TableCell>
        </TableRow>
    );
}
