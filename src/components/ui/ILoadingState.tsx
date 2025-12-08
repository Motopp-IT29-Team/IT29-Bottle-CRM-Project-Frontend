import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface Props {
    message?: string;
}

export const ILoadingState: React.FC<Props> = ({ message = 'Loading...' }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <CircularProgress size={40} sx={{ color: '#667eea' }} />
            <Typography sx={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>{message}</Typography>
        </Box>
    );
};
