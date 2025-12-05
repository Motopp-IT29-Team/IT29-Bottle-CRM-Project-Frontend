import React, { useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { FiX, FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { INotification } from '../../../types';

interface Props {
    notification: INotification;
    onClose: (id: string) => void;
}

const notificationConfig = {
    success: {
        icon: FiCheckCircle,
        iconColor: '#10b981',
        bg: '#f0fdf4',
        border: '#86efac',
        shadow: 'rgba(16, 185, 129, 0.2)',
    },
    error: {
        icon: FiAlertCircle,
        iconColor: '#ef4444',
        bg: '#fef2f2',
        border: '#fca5a5',
        shadow: 'rgba(239, 68, 68, 0.2)',
    },
    warning: {
        icon: FiAlertTriangle,
        iconColor: '#f59e0b',
        bg: '#fffbeb',
        border: '#fcd34d',
        shadow: 'rgba(245, 158, 11, 0.2)',
    },
    info: {
        icon: FiInfo,
        iconColor: '#3b82f6',
        bg: '#eff6ff',
        border: '#93c5fd',
        shadow: 'rgba(59, 130, 246, 0.2)',
    },
};

export const INotificationItem: React.FC<Props> = ({ notification, onClose }) => {
    const [isLeaving, setIsLeaving] = useState(false);
    const config = notificationConfig[notification.type];
    const Icon = config.icon;
    const duration = notification.duration || 5000;

    useEffect(() => {
        const leaveTimer = setTimeout(() => {
            setIsLeaving(true);
        }, duration - 300);

        return () => clearTimeout(leaveTimer);
    }, [duration]);

    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onClose(notification.id);
        }, 300);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                width: '500px',
                minHeight: '100px',
                backgroundColor: 'white',
                borderRadius: '16px',
                border: `2px solid ${config.border}`,
                overflow: 'hidden',
                mb: 2.5,
                backdropFilter: 'blur(10px)',
                animation: isLeaving
                    ? 'slideOut 0.3s ease-in forwards'
                    : 'slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transition: 'all 0.2s ease',
                '@keyframes slideIn': {
                    '0%': {
                        transform: 'translateX(-120%) scale(0.8)',
                        opacity: 0,
                    },
                    '60%': {
                        transform: 'translateX(10px) scale(1.02)',
                        opacity: 1,
                    },
                    '100%': {
                        transform: 'translateX(0) scale(1)',
                        opacity: 1,
                    },
                },
                '@keyframes slideOut': {
                    from: {
                        transform: 'translateX(0) scale(1)',
                        opacity: 1,
                    },
                    to: {
                        transform: 'translateX(-120%) scale(0.8)',
                        opacity: 0,
                    },
                },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '4px',
                    backgroundColor: config.iconColor,
                    animation: `shrink ${notification.duration || 5000}ms linear`,
                    transformOrigin: 'left',
                    '@keyframes shrink': {
                        from: { width: '100%' },
                        to: { width: '0%' },
                    },
                }}
            />

            <Box sx={{ display: 'flex', alignItems: 'flex-start', p: 2.5, gap: 2 }}>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '14px',
                        backgroundColor: config.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: `2px solid ${config.border}`,
                        animation: 'iconPulse 2s ease-in-out infinite',
                        '@keyframes iconPulse': {
                            '0%, 100%': {
                                transform: 'scale(1)',
                                boxShadow: `0 0 0 0 ${config.shadow}`,
                            },
                            '50%': {
                                transform: 'scale(1.05)',
                                boxShadow: `0 0 0 8px transparent`,
                            },
                        },
                    }}
                >
                    <Icon size={24} color={config.iconColor} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0, pt: 0.5 }}>
                    <Typography
                        sx={{
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#111827',
                            mb: notification.message ? 0.75 : 0,
                            lineHeight: 1.3,
                            letterSpacing: '-0.01em',
                        }}
                    >
                        {notification.title}
                    </Typography>
                    {notification.message && (
                        <Typography
                            sx={{
                                fontSize: '14px',
                                color: '#6b7280',
                                lineHeight: 1.6,
                                letterSpacing: '-0.005em',
                            }}
                        >
                            {notification.message}
                        </Typography>
                    )}
                </Box>

                <IconButton
                    size="small"
                    onClick={handleClose}
                    sx={{
                        width: 32,
                        height: 32,
                        flexShrink: 0,
                        color: '#9ca3af',
                        backgroundColor: 'transparent',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            backgroundColor: config.bg,
                            color: config.iconColor,
                            transform: 'rotate(90deg)',
                        },
                    }}
                >
                    <FiX size={18} />
                </IconButton>
            </Box>
        </Box>
    );
};
