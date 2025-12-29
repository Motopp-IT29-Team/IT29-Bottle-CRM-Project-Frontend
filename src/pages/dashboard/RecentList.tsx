import React from 'react';
import { Box, Paper, Typography, List, ListItem, Skeleton, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface RecentItem {
    id: string;
    title: string;
    subtitle?: string;
    status?: string;
    time?: string;
}

interface RecentListProps {
    title: string;
    items: RecentItem[];
    emptyMessage: string;
    basePath: string;
    isLoading?: boolean;
    icon?: React.ReactNode;
    getStatusColor?: (status: string) => { bg: string; text: string };
}

const defaultStatusColors = (status: string): { bg: string; text: string } => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('new') || statusLower.includes('open')) {
        return { bg: '#dbeafe', text: '#1d4ed8' };
    }
    if (statusLower.includes('progress') || statusLower.includes('qualified')) {
        return { bg: '#fef3c7', text: '#d97706' };
    }
    if (statusLower.includes('won') || statusLower.includes('completed') || statusLower.includes('converted')) {
        return { bg: '#d1fae5', text: '#059669' };
    }
    if (statusLower.includes('lost') || statusLower.includes('closed')) {
        return { bg: '#fee2e2', text: '#dc2626' };
    }
    return { bg: '#f3f4f6', text: '#6b7280' };
};

export const RecentList: React.FC<RecentListProps> = ({
    title,
    items,
    emptyMessage,
    basePath,
    isLoading = false,
    icon,
    getStatusColor = defaultStatusColors,
}) => {
    const navigate = useNavigate();

    const handleItemClick = (id: string) => {
        navigate(`${basePath}/details?id=${id}`);
    };

    return (
        <Paper
            sx={{
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    backgroundColor: '#fafafa',
                }}
            >
                {icon && (
                    <Box sx={{ color: '#6366f1', display: 'flex' }}>
                        {icon}
                    </Box>
                )}
                <Typography
                    sx={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#111827',
                    }}
                >
                    {title}
                </Typography>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {isLoading ? (
                    <List sx={{ p: 0 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <ListItem key={i} sx={{ px: 3, py: 2, borderBottom: '1px solid #f3f4f6' }}>
                                <Box sx={{ width: '100%' }}>
                                    <Skeleton variant="text" width="60%" height={24} />
                                    <Skeleton variant="text" width="40%" height={18} />
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                ) : items.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '200px',
                            color: '#9ca3af',
                        }}
                    >
                        <Typography sx={{ fontSize: '14px' }}>{emptyMessage}</Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {items.map((item, index) => {
                            const statusColors = item.status ? getStatusColor(item.status) : null;
                            return (
                                <ListItem
                                    key={item.id}
                                    onClick={() => handleItemClick(item.id)}
                                    sx={{
                                        px: 3,
                                        py: 2,
                                        cursor: 'pointer',
                                        borderBottom: index < items.length - 1 ? '1px solid #f3f4f6' : 'none',
                                        transition: 'background-color 0.15s ease',
                                        '&:hover': {
                                            backgroundColor: '#f9fafb',
                                        },
                                        '&:active': {
                                            backgroundColor: '#f3f4f6',
                                        },
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                                            <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 500,
                                                    color: '#111827',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    maxWidth: '200px',
                                                }}
                                            >
                                                {item.title}
                                            </Typography>
                                            {item.status && statusColors && (
                                                <Chip
                                                    label={item.status}
                                                    size="small"
                                                    sx={{
                                                        height: '22px',
                                                        fontSize: '11px',
                                                        fontWeight: 500,
                                                        backgroundColor: statusColors.bg,
                                                        color: statusColors.text,
                                                        textTransform: 'capitalize',
                                                    }}
                                                />
                                            )}
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            {item.subtitle && (
                                                <Typography
                                                    sx={{
                                                        fontSize: '12px',
                                                        color: '#6b7280',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                        maxWidth: '180px',
                                                    }}
                                                >
                                                    {item.subtitle}
                                                </Typography>
                                            )}
                                            {item.time && (
                                                <Typography
                                                    sx={{
                                                        fontSize: '11px',
                                                        color: '#9ca3af',
                                                        flexShrink: 0,
                                                        ml: 1,
                                                    }}
                                                >
                                                    {item.time}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </Box>
        </Paper>
    );
};
