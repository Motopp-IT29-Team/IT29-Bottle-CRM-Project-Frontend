import React from 'react';
import { Backdrop, CircularProgress, Typography } from '@mui/material';

interface LoadingBackdropProps {
    open: boolean;
    message?: string;
}

export const UsersLoadingBackdrop: React.FC<LoadingBackdropProps> = ({ open, message = 'Creating user...' }) => {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
            open={open}
        >
            <CircularProgress color="inherit" size={60} />
            <Typography variant="h6">{message}</Typography>
        </Backdrop>
    );
};
