import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Avatar, Chip, Button, Stack } from '@mui/material';
import { FaPlus } from 'react-icons/fa';
import { IModernAppBar, AppBarAction } from '../../components/ui';
import { useAccounts } from '../../api';
import { routes } from '../../constants/routes';
import { IAccount, IAttachment, IContact } from '../../types';
import FormateTime from '../../utils/formateTime';
import { ILabel } from '../../components/ui/ILabel';

export function AccountDetails() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams<{ id: string }>();
    const { getById, isLoading } = useAccounts();

    const [account, setAccount] = useState<IAccount | null>(null);
    const [attachments, setAttachments] = useState<IAttachment[]>([]);
    const [contacts, setContacts] = useState<IContact[]>([]);

    const accountId = id || state?.accountId;

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
            // setAccount(result.data.account_obj);
            setAttachments(result.data.attachments || []);
            // setContacts(result.data.contacts || []);
        } else {
            navigate(routes.accounts.main);
        }
    };

    const handleBack = () => navigate(routes.accounts.main);

    const handleEdit = () => {
        navigate(routes.accounts.edit.replace(':id', accountId), {
            state: {
                fromDetails: true,
            },
        });
    };

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Accounts', onClick: handleBack },
        { type: 'edit', onClick: handleEdit },
    ];

    if (isLoading || !account) {
        return (
            <Box sx={{ mt: '60px', backgroundColor: '#f9fafb' }}>
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
        <Box>
            <IModernAppBar module="Accounts" crntPage="Account Details" actions={actions} />

            <Box
                sx={{
                    p: 3,
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '24px',
                }}
            >
                {/* Main Content - Left Side */}
                <Box sx={{ flex: 1 }}>
                    <Box
                        sx={{
                            borderRadius: '10px',
                            border: '1px solid #e0e0e0',
                            backgroundColor: 'white',
                            mb: 3,
                        }}
                    >
                        {/* Header Section */}
                        <Box
                            sx={{
                                p: '20px',
                                borderBottom: '1px solid #e0e0e0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Box sx={{ fontWeight: 600, fontSize: '18px', color: '#1a3353' }}>Account Information</Box>
                            <Box sx={{ color: 'gray', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                                <span>created {FormateTime(account.created_at)} by</span>
                                <Avatar
                                    src={account.created_by?.profile_pic || ''}
                                    alt={account.created_by?.email}
                                    sx={{ width: 24, height: 24, mx: 1 }}
                                />
                                <span>{account.created_by?.email}</span>
                            </Box>
                        </Box>

                        {/* Title and Tags */}
                        <Box sx={{ p: '20px' }}>
                            <Box sx={{ fontSize: '24px', fontWeight: 600, color: '#1a3353', mb: 2 }}>
                                {account.name}
                            </Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                {account.assigned_to?.map((user: any) => (
                                    <Avatar
                                        key={user.id}
                                        alt={user.email}
                                        src={user.profile_pic}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                ))}
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                {account.tags?.map((tag: any) => (
                                    <ILabel key={tag.id || tag} tags={tag} />
                                ))}
                            </Stack>
                        </Box>

                        {/* Details Grid */}
                        <Box sx={{ p: '20px', display: 'flex', gap: '20px', borderTop: '1px solid #f5f5f5' }}>
                            <DetailField label="Website" value={account.website} />
                            <DetailField label="Contact Name" value={account.contact_name} />
                            <DetailField label="Organization" value={account.org?.name} />
                        </Box>

                        <Box sx={{ p: '20px', display: 'flex', gap: '20px', borderTop: '1px solid #f5f5f5' }}>
                            <DetailField label="Industry" value={account.industry} />
                            <DetailField label="Lead" value={account.lead?.first_name} />
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ fontSize: '12px', color: '#666', mb: 0.5 }}>Teams</Box>
                                <Box>
                                    {account.teams && account.teams.length > 0 ? (
                                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                            {account.teams.map((team: any) => (
                                                <Chip
                                                    key={team.id || team}
                                                    label={team.name || team}
                                                    size="small"
                                                    sx={{ height: '24px', borderRadius: '4px' }}
                                                />
                                            ))}
                                        </Stack>
                                    ) : (
                                        <Box sx={{ color: '#999' }}>----</Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ p: '20px', display: 'flex', gap: '20px', borderTop: '1px solid #f5f5f5' }}>
                            <DetailField label="Email Address" value={account.email} />
                            <DetailField label="Phone Number" value={account.phone} />
                            <DetailField label="Status" value={account.status} />
                        </Box>

                        {/* Address Section */}
                        <Box sx={{ borderTop: '1px solid #e0e0e0', mt: 2 }}>
                            <Box
                                sx={{
                                    p: '20px',
                                    borderBottom: '1px solid #e0e0e0',
                                    fontWeight: 600,
                                    fontSize: '18px',
                                    color: '#1a3353',
                                }}
                            >
                                Address Details
                            </Box>
                            <Box sx={{ p: '20px', display: 'flex', gap: '20px' }}>
                                <DetailField label="Address Line" value={account.billing_address_line} />
                                <DetailField label="Street" value={account.billing_street} />
                                <DetailField label="City" value={account.billing_city} />
                            </Box>
                            <Box sx={{ p: '20px', display: 'flex', gap: '20px', pt: 0 }}>
                                <DetailField label="Postal Code" value={account.billing_postcode} />
                                <DetailField label="State" value={account.billing_state} />
                                <DetailField label="Country" value={account.billing_country} />
                            </Box>
                        </Box>

                        {/* Description Section */}
                        {account.description && (
                            <Box sx={{ borderTop: '1px solid #e0e0e0', mt: 2 }}>
                                <Box
                                    sx={{
                                        p: '20px',
                                        borderBottom: '1px solid #e0e0e0',
                                        fontWeight: 600,
                                        fontSize: '18px',
                                        color: '#1a3353',
                                    }}
                                >
                                    Description
                                </Box>
                                <Box sx={{ p: '20px' }} dangerouslySetInnerHTML={{ __html: account.description }} />
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Sidebar - Right Side */}
                <Box sx={{ width: '400px' }}>
                    {/* Attachments Section */}
                    <Box
                        sx={{
                            borderRadius: '10px',
                            border: '1px solid #e0e0e0',
                            backgroundColor: 'white',
                            mb: 3,
                        }}
                    >
                        <Box
                            sx={{
                                p: '20px',
                                borderBottom: '1px solid #e0e0e0',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Box sx={{ fontWeight: 600, fontSize: '18px', color: '#1a3353' }}>Attachments</Box>
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<FaPlus style={{ fill: '#3E79F7', width: '12px' }} />}
                                sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                            >
                                Add Attachments
                            </Button>
                        </Box>

                        <Box sx={{ p: '20px' }}>
                            {attachments && attachments.length > 0 ? (
                                <Stack spacing={2}>
                                    {attachments.map((attachment) => (
                                        <Box
                                            key={attachment.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                p: 1,
                                                border: '1px solid #e0e0e0',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                '&:hover': { backgroundColor: '#f5f5f5' },
                                            }}
                                        >
                                            {/*<Box sx={{ flex: 1, fontSize: '14px' }}>*/}
                                            {/*    {attachment.attachment?.split('/').pop() || 'Attachment'}*/}
                                            {/*</Box>*/}
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Box sx={{ color: '#999', textAlign: 'center', py: 2 }}>No attachments</Box>
                            )}
                        </Box>
                    </Box>

                    {/* Contacts Section */}
                    {contacts && contacts.length > 0 && (
                        <Box
                            sx={{
                                borderRadius: '10px',
                                border: '1px solid #e0e0e0',
                                backgroundColor: 'white',
                            }}
                        >
                            <Box
                                sx={{
                                    p: '20px',
                                    borderBottom: '1px solid #e0e0e0',
                                    fontWeight: 600,
                                    fontSize: '18px',
                                    color: '#1a3353',
                                }}
                            >
                                Contacts
                            </Box>
                            <Box sx={{ p: '20px' }}>
                                <Stack spacing={1}>
                                    {contacts.map((contact: any) => (
                                        <Box key={contact.id} sx={{ fontSize: '14px', color: '#333' }}>
                                            {contact.first_name} {contact.last_name}
                                            {contact.email && (
                                                <Box sx={{ fontSize: '12px', color: '#666' }}>{contact.email}</Box>
                                            )}
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

// Helper Component
interface DetailFieldProps {
    label: string;
    value?: string | number | null;
}

function DetailField({ label, value }: DetailFieldProps) {
    return (
        <Box sx={{ flex: 1 }}>
            <Box sx={{ fontSize: '12px', color: '#666', mb: 0.5 }}>{label}</Box>
            <Box sx={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>
                {value || <span style={{ color: '#999' }}>----</span>}
            </Box>
        </Box>
    );
}
