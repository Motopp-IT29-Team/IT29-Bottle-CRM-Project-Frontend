import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { FiMenu } from 'react-icons/fi';

interface Props {
    isCollapsed: boolean;
    onToggle: () => void;
}

export const ISidebarHeader: React.FC<Props> = ({ isCollapsed, onToggle }) => {
    return (
        <Box
            sx={{
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'space-between',
                px: isCollapsed ? 0 : 2,
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
            }}
        >
            <Box
                sx={{
                    opacity: isCollapsed ? 0 : 1,
                    transition: 'opacity 0.2s ease',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    display: isCollapsed ? 'none' : 'block',
                }}
            >
                <Typography
                    sx={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: 'white',
                        letterSpacing: '-0.5px',
                    }}
                >
                    Bottle CRM
                </Typography>
            </Box>
            <IconButton
                onClick={onToggle}
                sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    flexShrink: 0,
                    '&:hover': {
                        color: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                }}
            >
                <FiMenu size={20} />
            </IconButton>
        </Box>
    );
};
