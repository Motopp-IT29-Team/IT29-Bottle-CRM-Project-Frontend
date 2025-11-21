import React from 'react';
import { Box } from '@mui/material';
import { useNotification } from '../context/NotificationContext';
import { NotificationItem } from './NotificationItem';

export const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    if (notifications.length === 0) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 24,
                left: 24,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column-reverse',
                maxHeight: 'calc(100vh - 48px)',
                pointerEvents: 'none',
                '& > *': {
                    pointerEvents: 'all',
                },
            }}
        >
            {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} onClose={removeNotification} />
            ))}
        </Box>
    );
};
