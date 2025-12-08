import { useEffect, useRef, useState } from 'react';
import { Box, Dialog, Divider, IconButton, List, ListItem, Stack, TextField, Typography, Avatar } from '@mui/material';
import { FiPlus, FiX, FiCheck, FiBriefcase } from 'react-icons/fi';
import { apiClient, ENDPOINTS } from '../../api';
import { routes } from '../../constants/routes';

interface Item {
    org: {
        id: any;
        name: any;
    } | null;
}

export default function OrganizationModal(props: any) {
    const { open, handleClose } = props;

    const [organization, setOrganization] = useState<Item[]>([]);
    const [newOrganization, setNewOrganization] = useState('');
    const [error, setError] = useState('');

    const buttonRef = useRef<HTMLButtonElement>(null);
    const currentOrgId = localStorage.getItem('org');

    useEffect(() => {
        if (open) {
            getOrganization();
            setError('');
            setNewOrganization('');
        }
    }, [open]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buttonRef.current?.click();
        }
    };

    const getOrganization = async () => {
        try {
            const response = await apiClient.get(ENDPOINTS.ORGANIZATIONS);

            if (response.data?.profile_org_list) {
                setOrganization(response.data.profile_org_list);
                setNewOrganization('');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const addOrganization = async () => {
        if (!newOrganization.trim()) return;

        try {
            const response = await apiClient.post(ENDPOINTS.ORGANIZATIONS, {
                name: newOrganization,
            });

            if (response.data?.error) {
                setError(response.data?.errors?.name[0]);
            } else if (response.status === 201) {
                getOrganization();
                setError('');
                setNewOrganization('');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const onHandleClose = () => {
        handleClose();
        setError('');
        setNewOrganization('');
    };

    const selectedOrganization = async (id: any) => {
        if (id === currentOrgId) {
            onHandleClose();
            return;
        }

        localStorage.setItem('org', id);
        
        // Log the org selection as LOGIN
        try {
            await fetchData(
                'auth/log-org-selection/',
                'POST',
                null as any,
                {
                    ...headers,
                    org: id,
                }
            );
        } catch (error) {
            console.error('Error logging org selection:', error);
        }
        
        onHandleClose();
        window.location.href = routes.app.main;
    };

    const getOrgInitial = (name: string) => {
        return name?.charAt(0).toUpperCase() || 'O';
    };

    return (
        <Dialog
            open={open}
            onClose={onHandleClose}
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    width: '480px',
                    maxWidth: '90vw',
                },
            }}
        >
            <Box>
                {/* Header */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3, pb: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '10px',
                                backgroundColor: '#f0f4ff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <FiBriefcase size={20} color="#667eea" />
                        </Box>
                        <Box>
                            <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                                Organizations
                            </Typography>
                            <Typography sx={{ fontSize: '13px', color: '#6b7280' }}>
                                Switch between organizations
                            </Typography>
                        </Box>
                    </Stack>
                    {currentOrgId && (
                        <IconButton
                            onClick={onHandleClose}
                            sx={{
                                color: '#6b7280',
                                '&:hover': {
                                    backgroundColor: '#f3f4f6',
                                },
                            }}
                        >
                            <FiX size={20} />
                        </IconButton>
                    )}
                </Stack>

                <Divider />

                {/* Organizations List */}
                <Box
                    sx={{
                        maxHeight: '320px',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#d1d5db',
                            borderRadius: '3px',
                        },
                    }}
                >
                    {organization?.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '200px',
                                gap: 1,
                            }}
                        >
                            <FiBriefcase size={48} color="#d1d5db" />
                            <Typography sx={{ fontSize: '15px', color: '#9ca3af', fontWeight: 500 }}>
                                No organizations yet
                            </Typography>
                            <Typography sx={{ fontSize: '13px', color: '#d1d5db' }}>
                                Create your first organization below
                            </Typography>
                        </Box>
                    ) : (
                        <List sx={{ p: 2, pt: 1.5 }}>
                            {organization
                                .filter((item) => item?.org !== null)
                                .map((item) => {
                                    const isSelected = item?.org?.id === currentOrgId;
                                    return (
                                        <ListItem key={item.org!.id} disablePadding sx={{ mb: 1 }}>
                                            <Box
                                                onClick={() => selectedOrganization(item?.org!.id)}
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    cursor: 'pointer',
                                                    border: isSelected ? '2px solid #667eea' : '2px solid transparent',
                                                    backgroundColor: isSelected ? '#f0f4ff' : 'white',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        backgroundColor: isSelected ? '#f0f4ff' : '#f9fafb',
                                                        border: isSelected ? '2px solid #667eea' : '2px solid #e5e7eb',
                                                    },
                                                }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 44,
                                                        height: 44,
                                                        backgroundColor: isSelected ? '#667eea' : '#f3f4f6',
                                                        color: isSelected ? 'white' : '#6b7280',
                                                        fontSize: '16px',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {getOrgInitial(item?.org!.name)}
                                                </Avatar>
                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            fontWeight: 600,
                                                            color: '#111827',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}
                                                    >
                                                        {item?.org!.name}
                                                    </Typography>
                                                    {isSelected && (
                                                        <Typography
                                                            sx={{
                                                                fontSize: '12px',
                                                                color: '#667eea',
                                                                fontWeight: 500,
                                                            }}
                                                        >
                                                            Current organization
                                                        </Typography>
                                                    )}
                                                </Box>
                                                {isSelected && (
                                                    <Box
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: '50%',
                                                            backgroundColor: '#667eea',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <FiCheck size={14} color="white" />
                                                    </Box>
                                                )}
                                            </Box>
                                        </ListItem>
                                    );
                                })}
                        </List>
                    )}
                </Box>

                <Divider />

                {/* Add New Organization */}
                <Box sx={{ p: 3, pt: 2.5 }}>
                    <Typography
                        sx={{
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#374151',
                            mb: 1.5,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}
                    >
                        Create New
                    </Typography>
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                        <TextField
                            autoFocus={organization?.length === 0}
                            type="text"
                            fullWidth
                            placeholder="Enter organization name"
                            value={newOrganization}
                            onChange={(e: any) => setNewOrganization(e.target.value)}
                            onKeyDown={handleKeyDown}
                            error={!!error}
                            helperText={error || ''}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    backgroundColor: '#f9fafb',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: 'white',
                                    },
                                },
                                '& .MuiOutlinedInput-input': {
                                    fontSize: '14px',
                                    py: 1.5,
                                },
                            }}
                        />
                        <IconButton
                            onClick={addOrganization}
                            ref={buttonRef}
                            disabled={!newOrganization.trim()}
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: '10px',
                                backgroundColor: newOrganization.trim() ? '#667eea' : '#f3f4f6',
                                color: newOrganization.trim() ? 'white' : '#9ca3af',
                                '&:hover': {
                                    backgroundColor: newOrganization.trim() ? '#5568d3' : '#f3f4f6',
                                },
                                '&:disabled': {
                                    backgroundColor: '#f3f4f6',
                                },
                            }}
                        >
                            <FiPlus size={20} />
                        </IconButton>
                    </Stack>
                </Box>
            </Box>
        </Dialog>
    );
}
