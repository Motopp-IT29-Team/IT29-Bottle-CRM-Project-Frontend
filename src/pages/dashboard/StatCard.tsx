import React from 'react';
import { Box, Paper, Typography, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    path: string;
    isLoading?: boolean;
    subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon,
    color,
    bgColor,
    path,
    isLoading = false,
    subtitle,
}) => {
    const navigate = useNavigate();

    return (
        <Paper
            onClick={() => navigate(path)}
            sx={{
                p: 2,
                cursor: 'pointer',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    borderColor: color,
                },
                '&:active': {
                    transform: 'translateY(-2px)',
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ flex: 1 }}>
                    <Typography
                        sx={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: '#6b7280',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            mb: 1,
                        }}
                    >
                        {title}
                    </Typography>
                    {isLoading ? (
                        <Skeleton variant="text" width={80} height={40} />
                    ) : (
                        <Typography
                            sx={{
                                fontSize: '32px',
                                fontWeight: 700,
                                color: '#111827',
                                lineHeight: 1.2,
                            }}
                        >
                            {typeof value === 'number' ? value.toLocaleString() : value}
                        </Typography>
                    )}
                    {subtitle && (
                        <Typography
                            sx={{
                                fontSize: '12px',
                                color: '#9ca3af',
                                mt: 0.5,
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        backgroundColor: bgColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: color,
                        flexShrink: 0,
                    }}
                >
                    {icon}
                </Box>
            </Box>
        </Paper>
    );
};
