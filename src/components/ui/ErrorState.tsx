import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { FaExclamationTriangle } from 'react-icons/fa';

interface Props {
    message?: string;
    onRetry?: () => void;
}

export const ErrorState: React.FC<Props> = ({ message = 'Something went wrong. Please try again.', onRetry }) => {
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
            <Box
                sx={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                }}
            >
                <FaExclamationTriangle style={{ color: '#ef4444', fontSize: '28px' }} />
            </Box>
            <Typography
                sx={{ color: '#ef4444', fontSize: '16px', fontWeight: 500, textAlign: 'center', maxWidth: '400px' }}
            >
                {message}
            </Typography>
            {onRetry && (
                <Button
                    variant="contained"
                    onClick={onRetry}
                    sx={{
                        mt: 2,
                        backgroundColor: '#667eea',
                        '&:hover': { backgroundColor: '#5568d3' },
                        textTransform: 'none',
                        px: 3,
                    }}
                >
                    Try Again
                </Button>
            )}
        </Box>
    );
};
