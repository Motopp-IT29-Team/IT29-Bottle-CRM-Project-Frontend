import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
    label: string;
    value: any;
}

export const DetailField: React.FC<Props> = ({ label, value }) => (
    <Box>
        <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={600}
            sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}
        >
            {label}
        </Typography>
        <Box sx={{ mt: 0.5, fontSize: '14px', color: 'text.primary', fontWeight: 500 }}>{value || '---'}</Box>
    </Box>
);
