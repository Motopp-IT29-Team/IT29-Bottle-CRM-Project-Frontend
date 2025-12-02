import React from 'react';
import { Box, List, ListItem, Tooltip, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavItem } from './ISidebar';

interface Props {
    navItems: NavItem[];
    isCollapsed: boolean;
}

export const ISidebarNavigation: React.FC<Props> = ({ navItems, isCollapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/app') {
            return location.pathname === '/app' || location.pathname === '/app/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <List sx={{ px: 1.5, py: 2, flex: 1 }}>
            {navItems.map((item: NavItem) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                    <Tooltip key={item.key} title={isCollapsed ? item.label : ''} placement="right">
                        <ListItem disablePadding sx={{ mb: 0.5 }}>
                            <Box
                                onClick={() => navigate(item.path)}
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    px: 2,
                                    py: 1.5,
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    color: active ? 'white' : 'rgba(255, 255, 255, 0.6)',
                                    backgroundColor: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    '&:hover': {
                                        backgroundColor: active
                                            ? 'rgba(99, 102, 241, 0.2)'
                                            : 'rgba(255, 255, 255, 0.05)',
                                        color: 'white',
                                    },
                                    '&::before': active
                                        ? {
                                              content: '""',
                                              position: 'absolute',
                                              left: 0,
                                              top: '50%',
                                              transform: 'translateY(-50%)',
                                              width: '3px',
                                              height: '60%',
                                              backgroundColor: '#6366f1',
                                              borderRadius: '0 2px 2px 0',
                                          }
                                        : {},
                                }}
                            >
                                <Box sx={{ flexShrink: 0, display: 'flex' }}>
                                    <Icon size={20} />
                                </Box>
                                <Box
                                    sx={{
                                        opacity: isCollapsed ? 0 : 1,
                                        transition: 'opacity 0.2s ease',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '14px',
                                            fontWeight: active ? 600 : 500,
                                        }}
                                    >
                                        {item.label}
                                    </Typography>
                                </Box>
                            </Box>
                        </ListItem>
                    </Tooltip>
                );
            })}
        </List>
    );
};
