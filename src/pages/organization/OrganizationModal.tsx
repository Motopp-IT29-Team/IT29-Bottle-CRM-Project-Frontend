import { useEffect, useRef, useState } from 'react';
import {
    Box,
    Dialog,
    Divider,
    IconButton,
    List,
    ListItem,
    Stack,
    TextField,
    Typography,
    Avatar,
    CircularProgress,
    Tooltip,
} from '@mui/material';
import { FiPlus, FiX, FiCheck, FiBriefcase, FiEdit2 } from 'react-icons/fi';
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
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Rename state
    const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
    const [editingOrgName, setEditingOrgName] = useState('');
    const [isRenaming, setIsRenaming] = useState(false);
    const [renameError, setRenameError] = useState('');

    const buttonRef = useRef<HTMLButtonElement>(null);
    const renameInputRef = useRef<HTMLInputElement>(null);
    const isCancellingRef = useRef(false);

    const currentOrgId = localStorage.getItem('org');
    const userRole = localStorage.getItem('role');

    // Check if user is ADMIN
    const isAdmin = userRole === 'ADMIN';

    useEffect(() => {
        if (open) {
            getOrganization();
            setError('');
            setNewOrganization('');
            setEditingOrgId(null);
            setEditingOrgName('');
            setRenameError('');
        }
    }, [open]);

    // Focus rename input when editing starts
    useEffect(() => {
        if (editingOrgId && renameInputRef.current) {
            renameInputRef.current.focus();
            renameInputRef.current.select();
        }
    }, [editingOrgId]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buttonRef.current?.click();
        }
    };

    const handleRenameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSaveRename();
        } else if (e.key === 'Escape') {
            handleCancelRename();
        }
    };

    const getOrganization = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get(ENDPOINTS.ORGANIZATIONS);

            if (response.data?.profile_org_list) {
                setOrganization(response.data.profile_org_list);
                setNewOrganization('');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addOrganization = async () => {
        if (!newOrganization.trim()) return;

        setIsCreating(true);
        setError('');

        try {
            const response = await apiClient.post(ENDPOINTS.ORGANIZATIONS, {
                name: newOrganization,
            });

            if (response.data?.error === false) {
                await getOrganization();
                setError('');
                setNewOrganization('');
            } else if (response.data?.error === true) {
                setError(response.data?.errors?.name?.[0] || 'Failed to create organization');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.errors?.name?.[0] || 'Failed to create organization');
        } finally {
            setIsCreating(false);
        }
    };

    const handleStartRename = (orgId: string, orgName: string) => {
        setEditingOrgId(orgId);
        setEditingOrgName(orgName);
        setRenameError('');
    };

    const handleCancelRename = () => {
        isCancellingRef.current = true;
        setEditingOrgId(null);
        setEditingOrgName('');
        setRenameError('');

        setTimeout(() => {
            isCancellingRef.current = false;
        }, 100);
    };

    const handleSaveRename = async () => {
        // Check if cancelling
        if (isCancellingRef.current) {
            return;
        }

        if (!editingOrgName.trim()) {
            setRenameError('Organization name cannot be empty');
            return;
        }

        if (editingOrgId !== currentOrgId) {
            setRenameError('You can only rename the current organization');
            return;
        }

        setIsRenaming(true);
        setRenameError('');

        try {
            const token = localStorage.getItem('Token');
            const org = localStorage.getItem('org');

            if (!token) {
                setRenameError('Authentication required. Please login again.');
                setIsRenaming(false);
                return;
            }

            const response = await apiClient.put(
                ENDPOINTS.UPDATE_ORGANIZATION,
                { name: editingOrgName.trim() },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        org: org,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.data?.error === false) {
                await getOrganization();
                setEditingOrgId(null);
                setEditingOrgName('');
            } else if (response.data?.error === true) {
                const errorMsg =
                    typeof response.data.errors === 'string'
                        ? response.data.errors
                        : response.data.errors?.name?.[0] || 'Failed to rename organization';
                setRenameError(errorMsg);
            }
        } catch (err: any) {
            const errorMsg =
                typeof err.response?.data?.errors === 'string'
                    ? err.response.data.errors
                    : err.response?.data?.errors?.name?.[0] || 'Failed to rename organization';
            setRenameError(errorMsg);
        } finally {
            setIsRenaming(false);
        }
    };

    const onHandleClose = () => {
        handleClose();
        setError('');
        setNewOrganization('');
        setEditingOrgId(null);
        setEditingOrgName('');
        setRenameError('');
    };

    const selectedOrganization = async (id: any) => {
        if (id === currentOrgId) {
            onHandleClose();
            return;
        }

        localStorage.setItem('org', id);

        try {
            await apiClient.post(
                ENDPOINTS.LOG_ORG_SELECTION,
                {},
                {
                    headers: {
                        org: id,
                    },
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
                                {isAdmin ? 'Manage and switch organizations' : 'Switch between organizations'}
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
                    {isLoading ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '200px',
                            }}
                        >
                            <CircularProgress size={40} sx={{ color: '#667eea' }} />
                        </Box>
                    ) : organization?.length === 0 ? (
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
                                    const isEditing = editingOrgId === item?.org?.id;
                                    const canRename = isAdmin && isSelected;

                                    return (
                                        <ListItem key={item.org!.id} disablePadding sx={{ mb: 1 }}>
                                            <Box
                                                sx={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    p: 2,
                                                    borderRadius: '12px',
                                                    border: isSelected ? '2px solid #667eea' : '2px solid transparent',
                                                    backgroundColor: isSelected ? '#f0f4ff' : 'white',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': {
                                                        backgroundColor: isSelected ? '#f0f4ff' : '#f9fafb',
                                                        border: isSelected ? '2px solid #667eea' : '2px solid #e5e7eb',
                                                        '& .rename-button': {
                                                            opacity: canRename ? 1 : 0,
                                                        },
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
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {getOrgInitial(item?.org!.name)}
                                                </Avatar>

                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    {isEditing ? (
                                                        <TextField
                                                            inputRef={renameInputRef}
                                                            fullWidth
                                                            size="small"
                                                            value={editingOrgName}
                                                            onChange={(e) => setEditingOrgName(e.target.value)}
                                                            onKeyDown={handleRenameKeyDown}
                                                            onBlur={() => {
                                                                setTimeout(() => {
                                                                    if (!isCancellingRef.current) {
                                                                        handleSaveRename();
                                                                    }
                                                                }, 150);
                                                            }}
                                                            error={!!renameError}
                                                            helperText={renameError}
                                                            disabled={isRenaming}
                                                            sx={{
                                                                '& .MuiOutlinedInput-root': {
                                                                    fontSize: '15px',
                                                                    fontWeight: 600,
                                                                },
                                                            }}
                                                        />
                                                    ) : (
                                                        <>
                                                            <Typography
                                                                onClick={() =>
                                                                    !isEditing && selectedOrganization(item?.org!.id)
                                                                }
                                                                sx={{
                                                                    fontSize: '15px',
                                                                    fontWeight: 600,
                                                                    color: '#111827',
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis',
                                                                    cursor: 'pointer',
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
                                                        </>
                                                    )}
                                                </Box>

                                                {canRename && !isEditing && (
                                                    <Tooltip title="Rename organization">
                                                        <IconButton
                                                            className="rename-button"
                                                            size="small"
                                                            onClick={() =>
                                                                handleStartRename(item?.org!.id, item?.org!.name)
                                                            }
                                                            sx={{
                                                                opacity: 0,
                                                                transition: 'opacity 0.2s',
                                                                color: '#6b7280',
                                                                '&:hover': {
                                                                    backgroundColor: '#f3f4f6',
                                                                    color: '#667eea',
                                                                },
                                                            }}
                                                        >
                                                            <FiEdit2 size={16} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                                {!isEditing && (
                                                    <Box
                                                        onClick={() => selectedOrganization(item?.org!.id)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    >
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
                                                                    flexShrink: 0,
                                                                }}
                                                            >
                                                                <FiCheck size={14} color="white" />
                                                            </Box>
                                                        )}
                                                    </Box>
                                                )}

                                                {isEditing && (
                                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleSaveRename}
                                                            disabled={isRenaming}
                                                            sx={{
                                                                color: '#10b981',
                                                                '&:hover': {
                                                                    backgroundColor: '#d1fae5',
                                                                },
                                                            }}
                                                        >
                                                            {isRenaming ? (
                                                                <CircularProgress size={16} />
                                                            ) : (
                                                                <FiCheck size={16} />
                                                            )}
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onMouseDown={(e) => {
                                                                e.preventDefault();
                                                                handleCancelRename();
                                                            }}
                                                            disabled={isRenaming}
                                                            sx={{
                                                                color: '#ef4444',
                                                                '&:hover': {
                                                                    backgroundColor: '#fee2e2',
                                                                },
                                                            }}
                                                        >
                                                            <FiX size={16} />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                            </Box>
                                        </ListItem>
                                    );
                                })}
                        </List>
                    )}
                </Box>

                {(isAdmin || !userRole) && (
                    <>
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
                                    disabled={isCreating}
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
                                    disabled={!newOrganization.trim() || isCreating}
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: '10px',
                                        backgroundColor: newOrganization.trim() && !isCreating ? '#667eea' : '#f3f4f6',
                                        color: newOrganization.trim() && !isCreating ? 'white' : '#9ca3af',
                                        '&:hover': {
                                            backgroundColor:
                                                newOrganization.trim() && !isCreating ? '#5568d3' : '#f3f4f6',
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#f3f4f6',
                                        },
                                    }}
                                >
                                    {isCreating ? (
                                        <CircularProgress size={20} sx={{ color: '#9ca3af' }} />
                                    ) : (
                                        <FiPlus size={20} />
                                    )}
                                </IconButton>
                            </Stack>
                        </Box>
                    </>
                )}
            </Box>
        </Dialog>
    );
}
