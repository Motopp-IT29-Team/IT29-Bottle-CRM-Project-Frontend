import React from 'react';
import { TableRow, TableCell, Box, Typography, Avatar, Chip } from '@mui/material';
import { FaEnvelope, FaPhone, FaBuilding } from 'react-icons/fa';
import { IContact } from '../../types';

interface ContactTableRowProps {
    contact: IContact;
    onViewDetail: (id: string) => void;
}

export function ContactTableRow({ contact, onViewDetail }: ContactTableRowProps) {
    const getInitials = () => {
        const firstInitial = contact.first_name?.charAt(0)?.toUpperCase() || '';
        const lastInitial = contact.last_name?.charAt(0)?.toUpperCase() || '';
        return `${firstInitial}${lastInitial}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <TableRow
            onClick={() => onViewDetail(contact.id)}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: '#f9fafb',
                },
                transition: 'background-color 0.2s',
            }}
        >
            {/* Name */}
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                        sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#667eea',
                            fontSize: '14px',
                            fontWeight: 600,
                        }}
                    >
                        {getInitials()}
                    </Avatar>
                    <Box>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
                            {contact.first_name} {contact.last_name}
                        </Typography>
                        {contact.title && (
                            <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>{contact.title}</Typography>
                        )}
                    </Box>
                </Box>
            </TableCell>

            {/* Email */}
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaEnvelope style={{ color: '#9ca3af', fontSize: '14px' }} />
                    <Typography sx={{ fontSize: '14px', color: '#4b5563' }}>
                        {contact.primary_email || '---'}
                    </Typography>
                </Box>
            </TableCell>

            {/* Phone */}
            <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FaPhone style={{ color: '#9ca3af', fontSize: '14px' }} />
                    <Typography sx={{ fontSize: '14px', color: '#4b5563' }}>
                        {contact.mobile_number || '---'}
                    </Typography>
                </Box>
            </TableCell>

            {/* Account */}
            <TableCell>
                {contact.organization ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FaBuilding style={{ color: '#9ca3af', fontSize: '14px' }} />
                        <Typography sx={{ fontSize: '14px', color: '#4b5563' }}>{contact.organization}</Typography>
                    </Box>
                ) : (
                    <Typography sx={{ fontSize: '14px', color: '#9ca3af' }}>---</Typography>
                )}
            </TableCell>

            {/* Created Date */}
            <TableCell>
                <Chip
                    label={formatDate(contact.created_at)}
                    size="small"
                    sx={{
                        backgroundColor: '#f3f4f6',
                        color: '#6b7280',
                        fontSize: '12px',
                        fontWeight: 500,
                        height: '24px',
                    }}
                />
            </TableCell>
        </TableRow>
    );
}
