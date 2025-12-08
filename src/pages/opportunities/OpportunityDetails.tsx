import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Avatar, Chip, Button, Stack } from '@mui/material';
import { FaPlus } from 'react-icons/fa';
import { IModernAppBar, AppBarAction } from '../../components/ui';
import { useOpportunities } from '../../api';
import { routes } from '../../constants/routes';
import { IOpportunity, IAttachment, IComment, IProfile } from '../../types';
import FormateTime from '../../utils/formateTime';
import { ILabel } from '../../components/ui/ILabel';

export function OpportunityDetails() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { id } = useParams<{ id: string }>();
    const { getById, isLoading } = useOpportunities();

    const [opportunity, setOpportunity] = useState<IOpportunity | null>(null);
    const [attachments, setAttachments] = useState<IAttachment[]>([]);
    const [comments, setComments] = useState<IComment[]>([]);
    const [users, setUsers] = useState<IProfile[]>([]);

    const opportunityId = id || state?.opportunityId;

    useEffect(() => {
        if (!opportunityId) {
            navigate(routes.opportunities.main);
            return;
        }

        fetchOpportunityDetails();
    }, [opportunityId]);

    const fetchOpportunityDetails = async () => {
        if (!opportunityId) return;

        const result = await getById(opportunityId);

        if (result.success && result.data) {
            setOpportunity(result.data.opportunity);
            setAttachments(result.data.attachments || []);
            setComments(result.data.comments || []);
            setUsers(result.data.users || []);
        } else {
            navigate(routes.opportunities.main);
        }
    };

    const handleBack = () => navigate(routes.opportunities.main);

    const handleEdit = () => {
        navigate(routes.opportunities.edit.replace(':id', opportunityId), {
            state: {
                fromDetails: true,
            },
        });
    };

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Opportunities', onClick: handleBack },
        { type: 'edit', onClick: handleEdit },
    ];

    if (isLoading || !opportunity) {
        return (
            <Box sx={{ mt: '60px', backgroundColor: '#f9fafb' }}>
                <IModernAppBar module="Opportunities" crntPage="Opportunity Details" actions={actions} />
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
            <IModernAppBar module="Opportunities" crntPage="Opportunity Details" actions={actions} />

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
                            <Box sx={{ fontWeight: 600, fontSize: '18px', color: '#1a3353' }}>
                                Opportunity Information
                            </Box>
                            <Box sx={{ color: 'gray', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                                <span>created {FormateTime(opportunity.created_at)} by</span>
                                <Avatar
                                    src={opportunity.created_by?.profile_pic || ''}
                                    alt={opportunity.created_by?.email}
                                    sx={{ width: 24, height: 24, mx: 1 }}
                                />
                                <span>{opportunity.created_by?.email}</span>
                            </Box>
                        </Box>

                        {/* Title and Assigned Users */}
                        <Box sx={{ p: '20px' }}>
                            <Box sx={{ fontSize: '24px', fontWeight: 600, color: '#1a3353', mb: 2 }}>
                                {opportunity.name}
                            </Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                {opportunity.assigned_to?.map((user: any) => (
                                    <Avatar
                                        key={user.id}
                                        alt={user.email}
                                        src={user.profile_pic}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                ))}
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                {opportunity.tags?.map((tag: any) => (
                                    <ILabel key={tag.id || tag} tags={tag} />
                                ))}
                            </Stack>
                        </Box>

                        {/* Details Grid */}
                        <Box sx={{ p: '20px', display: 'flex', gap: '20px', borderTop: '1px solid #f5f5f5' }}>
                            <DetailField label="Name" value={opportunity.name} />
                            <DetailField label="Lead Source" value={opportunity.lead_source} />
                            <DetailField label="Account" value={opportunity.account?.name} />
                        </Box>

                        <Box sx={{ p: '20px', display: 'flex', gap: '20px', borderTop: '1px solid #f5f5f5' }}>
                            <DetailField label="Probability" value={`${opportunity.probability}%`} />
                            <DetailField
                                label="Amount"
                                value={
                                    opportunity.amount
                                        ? `${getCurrencySymbol(opportunity.currency)}${opportunity.amount}`
                                        : undefined
                                }
                            />
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ fontSize: '12px', color: '#666', mb: 0.5 }}>Teams</Box>
                                <Box>
                                    {opportunity.teams && opportunity.teams.length > 0 ? (
                                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                            {opportunity.teams.map((team: any) => (
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
                            <DetailField label="Currency" value={opportunity.currency} />
                            <DetailField label="Stage" value={opportunity.stage} />
                            <DetailField label="Closed Date" value={opportunity.closed_on} />
                        </Box>

                        {/* Description Section */}
                        {opportunity.description && (
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
                                <Box sx={{ p: '20px' }} dangerouslySetInnerHTML={{ __html: opportunity.description }} />
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
                    {opportunity.contacts && opportunity.contacts.length > 0 && (
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
                                    {opportunity.contacts.map((contact: any) => (
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

// Helper Components
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

function getCurrencySymbol(currency?: string): string {
    const symbols: Record<string, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
    };
    return symbols[currency || ''] || '';
}
