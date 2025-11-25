import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button, DialogContent, Box, Typography } from '@mui/material';
import { FiAlertTriangle, FiCheckCircle, FiXCircle, FiInfo, FiHelpCircle } from 'react-icons/fi';

type ModalVariant = 'success' | 'error' | 'warning' | 'info' | 'confirm';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    variant?: ModalVariant;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    showCancel?: boolean;
}

const variantConfig = {
    success: {
        icon: FiCheckCircle,
        iconColor: '#10b981',
        bgColor: '#f0fdf4',
        borderColor: '#d1fae5',
        buttonColor: '#10b981',
        buttonHoverColor: '#059669',
    },
    error: {
        icon: FiXCircle,
        iconColor: '#ef4444',
        bgColor: '#fef2f2',
        borderColor: '#fee2e2',
        buttonColor: '#ef4444',
        buttonHoverColor: '#dc2626',
    },
    warning: {
        icon: FiAlertTriangle,
        iconColor: '#f59e0b',
        bgColor: '#fffbeb',
        borderColor: '#fef3c7',
        buttonColor: '#f59e0b',
        buttonHoverColor: '#d97706',
    },
    info: {
        icon: FiInfo,
        iconColor: '#3b82f6',
        bgColor: '#eff6ff',
        borderColor: '#dbeafe',
        buttonColor: '#3b82f6',
        buttonHoverColor: '#2563eb',
    },
    confirm: {
        icon: FiHelpCircle,
        iconColor: '#6366f1',
        bgColor: '#eef2ff',
        borderColor: '#e0e7ff',
        buttonColor: '#6366f1',
        buttonHoverColor: '#4f46e5',
    },
};

export const IActionModal: React.FC<Props> = ({
    open,
    onClose,
    onConfirm,
    variant = 'confirm',
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isLoading = false,
    showCancel = true,
}) => {
    const config = variantConfig[variant];
    const Icon = config.icon;

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        } else {
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={isLoading ? undefined : onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    maxWidth: '440px',
                    borderRadius: '16px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                    overflow: 'visible',
                },
            }}
        >
            {/* Icon Circle */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -32,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: config.bgColor,
                    border: `4px solid ${config.borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Icon size={28} color={config.iconColor} strokeWidth={2.5} />
            </Box>

            {/* Content */}
            <Box sx={{ pt: 6, px: 4, pb: 3 }}>
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                        fontSize: '22px',
                        fontWeight: 700,
                        color: '#111827',
                        p: 0,
                        mb: 2,
                    }}
                >
                    {title}
                </DialogTitle>

                <DialogContent sx={{ p: 0, mb: 3 }}>
                    <Typography
                        sx={{
                            textAlign: 'center',
                            fontSize: '15px',
                            color: '#6b7280',
                            lineHeight: 1.6,
                        }}
                    >
                        {message}
                    </Typography>
                </DialogContent>

                <DialogActions
                    sx={{
                        p: 0,
                        gap: 1.5,
                        justifyContent: 'center',
                    }}
                >
                    {showCancel && (
                        <Button
                            onClick={onClose}
                            disabled={isLoading}
                            variant="outlined"
                            sx={{
                                flex: 1,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '15px',
                                py: 1.25,
                                borderRadius: '10px',
                                color: '#374151',
                                borderColor: '#d1d5db',
                                '&:hover': {
                                    borderColor: '#9ca3af',
                                    backgroundColor: '#f9fafb',
                                },
                                '&:disabled': {
                                    borderColor: '#e5e7eb',
                                    color: '#d1d5db',
                                },
                            }}
                        >
                            {cancelText}
                        </Button>
                    )}
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        variant="contained"
                        sx={{
                            flex: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '15px',
                            py: 1.25,
                            borderRadius: '10px',
                            backgroundColor: config.buttonColor,
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: config.buttonHoverColor,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            },
                            '&:disabled': {
                                backgroundColor: config.borderColor,
                                color: '#9ca3af',
                            },
                        }}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};
