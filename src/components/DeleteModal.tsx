import React from 'react';
import { Dialog, DialogTitle, DialogActions, Button, DialogContent, Box, Typography } from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';

interface DeleteModalProps {
    id: any;
    open: boolean;
    onClose: () => void;
    modalTitle: string;
    modalDialog: string;
    DeleteItem: () => void;
    isDeleting?: boolean;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
    id,
    open,
    onClose,
    modalTitle,
    modalDialog,
    DeleteItem,
    isDeleting = false,
}) => {
    return (
        <Dialog
            id={id}
            open={open}
            onClose={isDeleting ? undefined : onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    width: 'auto',
                    paddingX: '50px',
                    borderRadius: '12px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                },
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    pt: 4,
                    pb: 2,
                }}
            >
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: '#fef2f2',
                        border: '3px solid #fee2e2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <FiAlertTriangle size={28} color="#dc2626" />
                </Box>
            </Box>

            <DialogTitle
                sx={{
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#111827',
                    px: 4,
                    pt: 2,
                    pb: 1,
                }}
            >
                {modalTitle}
            </DialogTitle>

            <DialogContent sx={{ px: 4, pb: 3 }}>
                <Typography
                    sx={{
                        textAlign: 'center',
                        fontSize: '14px',
                        color: '#6b7280',
                        lineHeight: 1.6,
                    }}
                >
                    {modalDialog}
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    px: 3,
                    pb: 3,
                    pt: 0,
                    gap: 1.5,
                    justifyContent: 'center',
                }}
            >
                <Button
                    onClick={onClose}
                    disabled={isDeleting}
                    variant="outlined"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '14px',
                        px: 3,
                        py: 1,
                        borderRadius: '8px',
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
                    Cancel
                </Button>
                <Button
                    onClick={DeleteItem}
                    disabled={isDeleting}
                    variant="contained"
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '14px',
                        px: 3,
                        py: 1,
                        borderRadius: '8px',
                        backgroundColor: '#dc2626',
                        '&:hover': {
                            backgroundColor: '#b91c1c',
                        },
                        '&:disabled': {
                            backgroundColor: '#fca5a5',
                        },
                    }}
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
