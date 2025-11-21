import React from 'react';
import { Backdrop, CircularProgress, Box, Typography } from '@mui/material';

interface LeadLoadingBackdropProps {
    open: boolean;
}

export const LeadLoadingBackdrop: React.FC<LeadLoadingBackdropProps> = ({ open }) => {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
            open={open}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                <CircularProgress size={50} sx={{ color: '#667eea' }} />
                <Typography sx={{ fontSize: '16px', fontWeight: 500 }}>Creating lead...</Typography>
            </Box>
        </Backdrop>
    );
};
