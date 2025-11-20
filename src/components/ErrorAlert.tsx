import React from 'react';
import { Box, Alert, Typography } from '@mui/material';

interface ErrorAlertProps {
    message: string;
    onClose: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <Box sx={{ mb: 2, mx: 'auto', maxWidth: '98%' }}>
            <Alert
                severity="error"
                onClose={onClose}
                sx={{
                    borderRadius: '12px',
                    '& .MuiAlert-message': {
                        width: '100%',
                    },
                }}
            >
                <Typography variant="body2">
                    <strong>Error:</strong> {message}
                </Typography>
            </Alert>
        </Box>
    );
};
