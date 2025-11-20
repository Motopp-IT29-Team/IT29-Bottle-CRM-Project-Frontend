import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Breadcrumbs, Link, Button, CircularProgress, Box } from '@mui/material';
import { FaCheckCircle, FaEdit, FaTimesCircle, FaTrash } from 'react-icons/fa';
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft';
import { useMyContext } from '../context/Context';

export type ActionType = 'back' | 'save' | 'cancel' | 'edit' | 'delete' | 'custom';
export type ActionColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

export interface AppBarAction {
    type: ActionType;
    label?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    color?: ActionColor;
    disabled?: boolean;
    loading?: boolean;
}

interface ModernAppBarProps {
    module: string;
    crntPage: string;
    actions?: AppBarAction[];
}

const defaultIcons = {
    back: <FiChevronLeft style={{ fontSize: '18px' }} />,
    save: <FaCheckCircle style={{ fontSize: '14px' }} />,
    cancel: <FaTimesCircle style={{ fontSize: '14px' }} />,
    edit: <FaEdit style={{ fontSize: '14px' }} />,
    delete: <FaTrash style={{ fontSize: '14px' }} />,
};

const defaultLabels = {
    back: 'Back',
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
};

const defaultColors: Record<ActionType, ActionColor> = {
    back: 'secondary',
    save: 'success',
    cancel: 'error',
    edit: 'info',
    delete: 'error',
    custom: 'primary',
};

const colorStyles = {
    primary: {
        backgroundColor: '#667eea',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#5568d3',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
        },
    },
    secondary: {
        backgroundColor: '#64748b',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#475569',
            boxShadow: '0 4px 12px rgba(100, 116, 139, 0.3)',
        },
    },
    error: {
        backgroundColor: '#ef4444',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#dc2626',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
        },
    },
    warning: {
        backgroundColor: '#f59e0b',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#d97706',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
        },
    },
    info: {
        backgroundColor: '#3b82f6',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#2563eb',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        },
    },
    success: {
        backgroundColor: '#10b981',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#059669',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
        },
    },
};

export function ModernAppBar({ module, crntPage, actions = [] }: ModernAppBarProps) {
    const sharedData = useMyContext();
    const navigate = useNavigate();
    const moduleLink = module.toLowerCase();

    const renderAction = (action: AppBarAction, index: number) => {
        const icon = action.icon || (action.type !== 'custom' ? defaultIcons[action.type] : undefined);
        const label = action.label || (action.type !== 'custom' ? defaultLabels[action.type] : 'Action');
        const isBack = action.type === 'back';
        const buttonColor = action.color || defaultColors[action.type];

        return (
            <Button
                key={index}
                size="small"
                onClick={action.onClick}
                disabled={action.disabled || action.loading}
                variant={isBack ? 'outlined' : 'contained'}
                startIcon={
                    action.loading ? <CircularProgress size={14} sx={{ color: isBack ? '#64748b' : 'white' }} /> : icon
                }
                sx={{
                    ml: index > 0 ? 1.5 : 0,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    borderRadius: '8px',
                    px: 2.5,
                    py: 0.75,
                    minWidth: 'auto',
                    transition: 'all 0.2s ease',
                    ...(isBack
                        ? {
                              backgroundColor: 'white',
                              color: '#475569',
                              border: '1.5px solid #e2e8f0',
                              '&:hover': {
                                  backgroundColor: '#f8fafc',
                                  border: '1.5px solid #cbd5e1',
                                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.08)',
                              },
                              '&:disabled': {
                                  backgroundColor: '#f1f5f9',
                                  color: '#cbd5e1',
                                  border: '1.5px solid #e2e8f0',
                              },
                          }
                        : {
                              ...colorStyles[buttonColor],
                              border: 'none',
                              transform: 'translateY(0)',
                              '&:disabled': {
                                  background: '#e2e8f0',
                                  color: '#94a3b8',
                                  boxShadow: 'none',
                              },
                          }),
                }}
            >
                {label}
            </Button>
        );
    };

    return (
        <AppBar
            elevation={0}
            sx={{
                backgroundColor: '#1A3353',
                height: '50px',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '-5px',
                boxShadow: 'none',
                top: '64px',
                left: '240px',
                width: '-webkit-fill-available',
            }}
            position="fixed"
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    height: '100%',
                    px: 2,
                }}
            >
                <Breadcrumbs
                    separator={
                        <Box
                            component="span"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.4)',
                                mx: 0.5,
                            }}
                        >
                            /
                        </Box>
                    }
                    sx={{
                        '& .MuiBreadcrumbs-separator': {
                            mx: 1,
                        },
                    }}
                >
                    <Link
                        underline="hover"
                        href="/"
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            fontWeight: 500,
                            transition: 'color 0.2s ease',
                            '&:hover': {
                                color: 'rgba(255, 255, 255, 0.95)',
                            },
                        }}
                    >
                        Dashboard
                    </Link>
                    <Link
                        underline="hover"
                        onClick={() => navigate(`/app/${moduleLink}`)}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'color 0.2s ease',
                            '&:hover': {
                                color: 'rgba(255, 255, 255, 0.95)',
                            },
                        }}
                    >
                        {module}
                    </Link>
                    <Box
                        component="span"
                        sx={{
                            color: 'white',
                            fontSize: '14px',
                            fontWeight: 600,
                        }}
                    >
                        {crntPage}
                    </Box>
                </Breadcrumbs>

                {actions.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {actions.map((action, index) => renderAction(action, index))}
                    </Box>
                )}
            </Box>
        </AppBar>
    );
}
