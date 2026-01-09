import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Avatar, Stack, Typography, Chip, Paper, Divider } from '@mui/material';
import { FaEdit, FaTrash, FaGlobe, FaEnvelope, FaPhone, FaIndustry, FaMapMarkerAlt } from 'react-icons/fa';
import { FiUsers, FiFileText } from 'react-icons/fi';
import { IModernAppBar, AppBarAction, IActionModal } from '../../components/ui';
import { useAccounts } from '../../api';
import { routes } from '../../constants/routes';
import { IAccount, IContact } from '../../types';
import FormateTime from '../../utils/formateTime';
import { ILabel } from '../../components/ui/ILabel';

export function AccountDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const accountId = searchParams.get('id');
    const { getById, deleteAccount, isLoading } = useAccounts();

    const [account, setAccount] = useState<IAccount | null>(null);
    const [contacts, setContacts] = useState<IContact[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!accountId) {
            navigate(routes.accounts.main);
            return;
        }

        fetchAccountDetails();
    }, [accountId]);

    const fetchAccountDetails = async () => {
        if (!accountId) return;

        const result = await getById(accountId);

        if (result.success && result.data) {
            setAccount(result.data.account);
            setContacts(result.data.account.contacts || []);
        } else {
            navigate(routes.accounts.main);
        }
    };

    const handleBack = () => navigate(routes.accounts.main);

    const handleEdit = () => {
        navigate(routes.accounts.edit + `?id=${accountId}`);
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!accountId) return;

        setIsDeleting(true);
        const result = await deleteAccount(accountId);
        setIsDeleting(false);

        if (result.success) {
            setDeleteModalOpen(false);
            navigate(routes.accounts.main);
        } else {
            setDeleteModalOpen(false);
        }
    };

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Accounts', onClick: handleBack },
        { type: 'custom', label: 'Edit', icon: <FaEdit />, onClick: handleEdit },
        { type: 'custom', label: 'Delete', icon: <FaTrash />, onClick: handleDeleteClick, color: 'error' },
    ];

    if (isLoading || !account) {
        return (
            <Box>
                <IModernAppBar module="Accounts" crntPage="Account Details" actions={actions} />
                <Box
                    sx={{
                        mt: '120px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '400px',
                    }}
                >
                    <CircularProgress />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <IModernAppBar module="Accounts" crntPage="Account Details" actions={actions} />

            <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
                {/* Main Content - 68% */}
                <Box sx={{ flex: '0 0 68%' }}>
                    {/* Hero Card */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '16px',
                            border: '1px solid #e5e7eb',
                            overflow: 'hidden',
                            mb: 3,
                        }}
                    >
                        {/* Header with gradient background */}
                        <Box
                            sx={{
                                p: 4,
                                backgroundColor: 'white',
                                borderBottom: '1px solid #e5e7eb',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 4 }}>
                                {/* Left Side - Main Info */}
                                <Box sx={{ flex: 1, display: 'flex', alignItems: 'start', gap: 3 }}>
                                    {/* Account Icon/Initial */}
                                    <Box
                                        sx={{
                                            width: 72,
                                            height: 72,
                                            borderRadius: '16px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 8px 16px rgba(102, 126, 234, 0.25)',
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '32px', fontWeight: 700, color: 'white' }}>
                                            {account.name.charAt(0).toUpperCase()}
                                        </Typography>
                                    </Box>

                                    {/* Account Details */}
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            sx={{
                                                fontSize: '32px',
                                                fontWeight: 700,
                                                color: '#111827',
                                                lineHeight: 1.2,
                                                mb: 1.5,
                                            }}
                                        >
                                            {account.name}
                                        </Typography>

                                        {/* Status & Industry Row */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        backgroundColor:
                                                            account.status === 'open' ? '#10b981' : '#6b7280',
                                                    }}
                                                />
                                                <Typography
                                                    sx={{
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                        color: account.status === 'open' ? '#059669' : '#6b7280',
                                                    }}
                                                >
                                                    {account.status === 'open' ? 'Active' : 'Closed'}
                                                </Typography>
                                            </Box>

                                            {account.industry && (
                                                <>
                                                    <Box
                                                        sx={{
                                                            width: '1px',
                                                            height: '16px',
                                                            backgroundColor: '#e5e7eb',
                                                        }}
                                                    />
                                                    <Typography sx={{ fontSize: '14px', color: '#6b7280' }}>
                                                        {account.industry}
                                                    </Typography>
                                                </>
                                            )}

                                            {account.website && (
                                                <>
                                                    <Box
                                                        sx={{
                                                            width: '1px',
                                                            height: '16px',
                                                            backgroundColor: '#e5e7eb',
                                                        }}
                                                    />
                                                    <Typography
                                                        component="a"
                                                        href={account.website}
                                                        target="_blank"
                                                        sx={{
                                                            fontSize: '14px',
                                                            color: '#6366f1',
                                                            textDecoration: 'none',
                                                            '&:hover': {
                                                                textDecoration: 'underline',
                                                            },
                                                        }}
                                                    >
                                                        {account.website.replace(/^https?:\/\//, '')}
                                                    </Typography>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>

                                {/* Right Side - Created Info */}
                                <Box
                                    sx={{
                                        p: 2.5,
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '12px',
                                        border: '1px solid #e5e7eb',
                                        minWidth: '220px',
                                        flexShrink: 0,
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: '#9ca3af',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            mb: 1.5,
                                        }}
                                    >
                                        Created {FormateTime(account.created_at)}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar
                                            src={account.created_by?.profile_pic || ''}
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                border: '2px solid white',
                                            }}
                                        >
                                            {account.created_by?.email?.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Typography
                                            sx={{
                                                fontSize: '13px',
                                                color: '#6b7280',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {account.created_by?.email}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {/* Assigned Users */}
                        <Box sx={{ p: 3, backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <Typography
                                sx={{
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#6b7280',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px',
                                    mb: 2,
                                }}
                            >
                                Assigned To
                            </Typography>
                            <Stack direction="row" spacing={1.5} flexWrap="wrap">
                                {account.assigned_to && account.assigned_to.length > 0 ? (
                                    account.assigned_to.map((user: any) => (
                                        <Box
                                            key={user.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1.5,
                                                py: 1,
                                                px: 2,
                                                backgroundColor: 'white',
                                                border: '1px solid #e5e7eb',
                                                borderRadius: '12px',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    borderColor: '#6366f1',
                                                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)',
                                                },
                                            }}
                                        >
                                            <Avatar
                                                alt={user.user_details?.email}
                                                src={user.user_details?.profile_pic}
                                                sx={{
                                                    width: 36,
                                                    height: 36,
                                                    border: '2px solid #eef2ff',
                                                }}
                                            >
                                                {user.first_name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                            <Box>
                                                <Typography
                                                    sx={{
                                                        fontSize: '14px',
                                                        fontWeight: 600,
                                                        color: '#111827',
                                                        lineHeight: 1.3,
                                                    }}
                                                >
                                                    {user.first_name} {user.last_name}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        fontSize: '12px',
                                                        color: '#6b7280',
                                                        lineHeight: 1.3,
                                                    }}
                                                >
                                                    {user.user_details?.email}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))
                                ) : (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            py: 1,
                                            px: 2,
                                            backgroundColor: 'white',
                                            border: '1px dashed #d1d5db',
                                            borderRadius: '12px',
                                        }}
                                    >
                                        <Typography sx={{ fontSize: '13px', color: '#9ca3af' }}>
                                            No users assigned
                                        </Typography>
                                    </Box>
                                )}
                            </Stack>
                        </Box>
                    </Paper>

                    {/* Contact Information */}
                    <DetailSection title="Contact Information" icon={<FaEnvelope style={{ color: '#6366f1' }} />}>
                        <DetailField label="Email Address" value={account.email} icon={<FaEnvelope size={14} />} />
                        <DetailField label="Phone Number" value={account.phone} icon={<FaPhone size={14} />} />
                        <DetailField label="Website" value={account.website} icon={<FaGlobe size={14} />} />
                        <DetailField label="Contact Name" value={account.contact_name} />
                    </DetailSection>

                    {/* Business Information */}
                    <DetailSection title="Business Information" icon={<FaIndustry style={{ color: '#6366f1' }} />}>
                        <DetailField label="Industry" value={account.industry} />
                        <DetailField label="Organization" value={account.org?.name} />
                        <DetailField label="Lead" value={`${account.lead?.first_name} ${account.lead?.last_name}`} />
                    </DetailSection>

                    {/* Description */}
                    <DetailSection title="Description" icon={<FiFileText style={{ color: '#6366f1' }} />}>
                        {account.description ? (
                            <Box
                                sx={{
                                    gridColumn: 'span 3',
                                    fontSize: '14px',
                                    color: '#4b5563',
                                    lineHeight: 1.7,
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                }}
                                dangerouslySetInnerHTML={{ __html: account.description }}
                            />
                        ) : (
                            <Box
                                sx={{
                                    gridColumn: 'span 3',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 4,
                                    gap: 1,
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: '50%',
                                        backgroundColor: '#f3f4f6',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 1,
                                    }}
                                >
                                    <FiFileText size={24} color="#9ca3af" />
                                </Box>
                                <Typography
                                    sx={{
                                        fontSize: '14px',
                                        fontWeight: 600,
                                        color: '#6b7280',
                                    }}
                                >
                                    No description provided
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '12px',
                                        color: '#9ca3af',
                                        textAlign: 'center',
                                    }}
                                >
                                    Add a description to provide more details about this account
                                </Typography>
                            </Box>
                        )}
                    </DetailSection>
                </Box>

                {/* Sidebar - 30% */}
                <Box sx={{ flex: '0 0 30%' }}>
                    {/* Contacts Card */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: '16px',
                            border: '1px solid #e5e7eb',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                p: 2.5,
                                backgroundColor: '#f9fafb',
                                borderBottom: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                            }}
                        >
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '10px',
                                    backgroundColor: '#eef2ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <FiUsers size={18} color="#6366f1" />
                            </Box>
                            <Box>
                                <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                                    Contacts
                                </Typography>
                                <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                                    {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ p: 2.5 }}>
                            {contacts && contacts.length > 0 ? (
                                <Stack spacing={1.5}>
                                    {contacts.map((contact: any) => (
                                        <Box
                                            key={contact.id}
                                            sx={{
                                                p: 2,
                                                backgroundColor: '#f9fafb',
                                                borderRadius: '12px',
                                                border: '1px solid #e5e7eb',
                                                transition: 'all 0.2s',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    borderColor: '#6366f1',
                                                    backgroundColor: 'white',
                                                    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)',
                                                },
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: 600,
                                                    color: '#111827',
                                                    mb: 0.5,
                                                }}
                                            >
                                                {contact.first_name} {contact.last_name}
                                            </Typography>
                                            {contact.primary_email && (
                                                <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                                                    {contact.primary_email}
                                                </Typography>
                                            )}
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        py: 6,
                                        gap: 1.5,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: '50%',
                                            backgroundColor: '#f3f4f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <FiUsers size={28} color="#9ca3af" />
                                    </Box>
                                    <Typography
                                        sx={{
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#6b7280',
                                        }}
                                    >
                                        No contacts yet
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontSize: '12px',
                                            color: '#9ca3af',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Contacts will appear here when added
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Box>
            </Box>

            <IActionModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                variant="error"
                title="Delete Account?"
                message={`Are you sure you want to delete "${account?.name}"? This action cannot be undone and will remove all associated data.`}
                confirmText="Delete Account"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </Box>
    );
}

// Helper Components
interface DetailSectionProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}

function DetailSection({ title, icon, children }: DetailSectionProps) {
    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                mb: 3,
            }}
        >
            <Box
                sx={{
                    p: 2.5,
                    backgroundColor: '#f9fafb',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        backgroundColor: '#eef2ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {icon}
                </Box>
                <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{title}</Typography>
            </Box>
            <Box
                sx={{
                    p: 3,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 3,
                }}
            >
                {children}
            </Box>
        </Paper>
    );
}

interface DetailFieldProps {
    label: string;
    value?: string | number | null;
    icon?: React.ReactNode;
}

function DetailField({ label, value, icon }: DetailFieldProps) {
    return (
        <Box>
            <Typography
                sx={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    mb: 1,
                }}
            >
                {label}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {icon && <Box sx={{ color: '#9ca3af' }}>{icon}</Box>}
                <Typography
                    sx={{
                        fontSize: '14px',
                        color: value ? '#111827' : '#9ca3af',
                        fontWeight: 500,
                    }}
                >
                    {value || '----'}
                </Typography>
            </Box>
        </Box>
    );
}
