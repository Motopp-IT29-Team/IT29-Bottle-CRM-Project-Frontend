import React from 'react';
import { TableRow, TableCell, Box, Stack, Avatar, AvatarGroup, Link } from '@mui/material';
import { Label } from '../Label';
import FormateTime from '../FormateTime';
import { Lead } from '../../api';

interface Props {
    lead: Lead;
    onViewDetail: (leadId: string) => void;
}

export const LeadTableRow: React.FC<Props> = ({ lead, onViewDetail }) => {
    return (
        <TableRow
            hover
            sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f8fafc' },
            }}
            onClick={() => onViewDetail(lead.id)}
        >
            {/* Lead Name */}
            <TableCell sx={{ border: 0, py: 2 }}>
                <Box>
                    <Box
                        sx={{
                            color: '#1A3353',
                            fontSize: '15px',
                            fontWeight: 600,
                            mb: 0.5,
                        }}
                    >
                        {lead.title}
                    </Box>
                    <Box sx={{ color: '#64748b', fontSize: '13px' }}>
                        {lead.first_name} {lead.last_name}
                    </Box>
                </Box>
            </TableCell>

            {/* Country & Source */}
            <TableCell sx={{ border: 0, py: 2 }}>
                <Box>
                    <Box sx={{ fontSize: '14px', color: '#475569', mb: 0.5 }}>{lead.country || '--'}</Box>
                    <Box sx={{ fontSize: '13px', color: '#94a3b8' }}>
                        Source: <span style={{ color: '#1a3353', fontWeight: 500 }}>{lead.source || '--'}</span>
                    </Box>
                </Box>
            </TableCell>

            {/* Status */}
            <TableCell sx={{ border: 0, py: 2 }}>
                <Box
                    sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 500,
                        textTransform: 'capitalize',
                        backgroundColor: getStatusColor(lead.status),
                        color: getStatusTextColor(lead.status),
                    }}
                >
                    {lead.status || '--'}
                </Box>
            </TableCell>

            {/* Tags & Team */}
            <TableCell sx={{ border: 0, py: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {lead.tags.slice(0, 3).map((tagData: any, idx: number) => (
                            <Label tags={tagData} key={idx} />
                        ))}
                        {lead.tags.length > 3 && (
                            <Link sx={{ fontSize: '13px', alignSelf: 'center' }}>+{lead.tags.length - 3}</Link>
                        )}
                    </Box>

                    {lead.team && lead.team.length > 0 && (
                        <AvatarGroup max={3} sx={{ ml: 1 }}>
                            {lead.team.map((team: any, idx: number) => (
                                <Avatar key={idx} alt={team} src={team} sx={{ width: 28, height: 28 }}>
                                    {team}
                                </Avatar>
                            ))}
                        </AvatarGroup>
                    )}
                </Stack>
            </TableCell>

            {/* Created */}
            <TableCell sx={{ border: 0, py: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ fontSize: '13px', color: '#64748b' }}>{FormateTime(lead.created_at)}</Box>
                    <Avatar alt={lead.first_name} src={lead.created_by?.profile_pic} sx={{ width: 24, height: 24 }} />
                </Stack>
            </TableCell>
        </TableRow>
    );
};

// Helper function for status colors
const getStatusColor = (status?: string) => {
    const statusColors: { [key: string]: string } = {
        assigned: '#e0f2fe',
        'in process': '#fef3c7',
        converted: '#d1fae5',
        recycled: '#e0e7ff',
        closed: '#f1f5f9',
    };
    return statusColors[status?.toLowerCase() || ''] || '#f1f5f9';
};

const getStatusTextColor = (status?: string) => {
    const statusTextColors: { [key: string]: string } = {
        assigned: '#0369a1',
        'in process': '#d97706',
        converted: '#059669',
        recycled: '#6366f1',
        closed: '#64748b',
    };
    return statusTextColors[status?.toLowerCase() || ''] || '#64748b';
};
