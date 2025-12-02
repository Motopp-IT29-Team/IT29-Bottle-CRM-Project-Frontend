import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Stack, Box } from '@mui/material';
import { FaChevronDown } from 'react-icons/fa';

interface Props {
    title: string;
    icon: React.ReactNode;
    defaultExpanded?: boolean;
    children: React.ReactNode;
}

export const DetailSection: React.FC<Props> = ({ title, icon, defaultExpanded = true, children }) => {
    return (
        <Accordion
            defaultExpanded={defaultExpanded}
            elevation={0}
            sx={{
                mb: 2,
                border: '1px solid #e5e7eb',
                borderRadius: '12px !important',
                '&:before': { display: 'none' },
            }}
        >
            <AccordionSummary
                expandIcon={<FaChevronDown />}
                sx={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    '&:hover': { backgroundColor: '#f3f4f6' },
                }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    {icon}
                    <Typography fontWeight={600} color="#1a3353">
                        {title}
                    </Typography>
                </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: 3,
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                    }}
                >
                    {children}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};
