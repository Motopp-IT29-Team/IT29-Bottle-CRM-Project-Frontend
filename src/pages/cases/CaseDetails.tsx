import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Paper,
    CircularProgress,
    Grid,
    Chip,
    Avatar,
    AvatarGroup,
    Tooltip,
    Divider,
} from '@mui/material';
import { IModernAppBar } from '../../components/ui';
import { ICase } from '../../types';
import { routes } from '../../constants/routes';
import { useCases } from '../../api';

// Helper component for displaying detail fields
function DetailField({ label, value }: { label: string; value?: string | null }) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
                {label}
            </Typography>
            <Typography variant="body1" sx={{ color: '#1A3353', fontWeight: 500 }}>
                {value || '-'}
            </Typography>
        </Box>
    );
}

// Status color mapping
const getStatusColor = (status: string): string => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('new')) return '#2196f3';
    if (statusLower.includes('working')) return '#ff9800';
    if (statusLower.includes('closed')) return '#4caf50';
    if (statusLower.includes('duplicate')) return '#9e9e9e';
    return '#757575';
};

// Priority color mapping
const getPriorityColor = (priority: string): string => {
    const priorityLower = priority?.toLowerCase() || '';
    if (priorityLower.includes('low')) return '#4caf50';
    if (priorityLower.includes('medium')) return '#ff9800';
    if (priorityLower.includes('high')) return '#f44336';
    return '#757575';
};

export function CaseDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const { getById } = useCases();

    const caseId = location.state?.caseId;

    const [caseData, setCaseData] = useState<ICase | null>(null);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Load case data
    useEffect(() => {
        if (!caseId) {
            navigate(routes.cases.main);
            return;
        }

        const loadData = async () => {
            setLoading(true);
            const result = await getById(caseId);

            if (result.success && result.data) {
                // setCaseData(result.data.cases_obj);
                setAttachments(result.data.attachments || []);
                setComments(result.data.comments || []);
                // setContacts(result.data.contacts || []);
            } else {
                navigate(routes.cases.main);
            }

            setLoading(false);
        };

        loadData();
    }, [caseId]);

    const handleBack = () => {
        navigate(routes.cases.main);
    };

    const handleEdit = () => {
        navigate(routes.cases.edit, {
            state: { caseId, fromDetails: true },
        });
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!caseData) {
        return null;
    }

    return (
        <>
            <IModernAppBar
                module="Cases"
                crntPage="Case Details"
                actions={[{ label: 'Edit', onClick: handleEdit, type: 'edit' }]}
            />

            <Container maxWidth="lg" sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', gap: 3 }}>
                    {/* Main Content - 65% */}
                    <Box sx={{ flex: 1 }}>
                        {/* Header Section */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    mb: 2,
                                }}
                            >
                                <Box>
                                    <Typography variant="caption" sx={{ color: '#666' }}>
                                        Created {new Date(caseData.created_at).toLocaleDateString()} by
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Avatar
                                            src={caseData.created_by?.profile_pic || ''}
                                            sx={{ width: 24, height: 24 }}
                                        >
                                            {caseData.created_by?.email?.charAt(0).toUpperCase()}
                                        </Avatar>
                                        <Typography variant="body2" sx={{ color: '#666' }}>
                                            {caseData.created_by?.email}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Typography variant="h4" sx={{ color: '#1A3353', fontWeight: 600, mb: 2 }}>
                                {caseData.name}
                            </Typography>

                            {/* Assigned Users and Tags */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {caseData.assigned_to && caseData.assigned_to.length > 0 && (
                                    <AvatarGroup max={5}>
                                        {caseData.assigned_to.map((user) => (
                                            <Tooltip key={user.id} title={user.user_details?.email || 'Unknown'}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                                                    {user.user_details?.email?.charAt(0).toUpperCase() || 'U'}
                                                </Avatar>
                                            </Tooltip>
                                        ))}
                                    </AvatarGroup>
                                )}
                            </Box>
                        </Paper>

                        {/* Case Information */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ color: '#1A3353', fontWeight: 600, mb: 3 }}>
                                Case Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <DetailField label="Name" value={caseData.name} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
                                            Status
                                        </Typography>
                                        <Chip
                                            label={caseData.status}
                                            size="small"
                                            sx={{
                                                backgroundColor: getStatusColor(caseData.status),
                                                color: 'white',
                                                fontWeight: 500,
                                                textTransform: 'capitalize',
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <DetailField label="Account" value={caseData.account?.name} />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
                                            Priority
                                        </Typography>
                                        <Chip
                                            label={caseData.priority}
                                            size="small"
                                            sx={{
                                                backgroundColor: getPriorityColor(caseData.priority),
                                                color: 'white',
                                                fontWeight: 500,
                                                textTransform: 'capitalize',
                                            }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
                                            Teams
                                        </Typography>
                                        {caseData.teams && caseData.teams.length > 0 ? (
                                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                                {caseData.teams.map((team) => (
                                                    <Chip
                                                        key={team.id}
                                                        label={team.name}
                                                        size="small"
                                                        sx={{ height: '24px' }}
                                                    />
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body1" sx={{ color: '#1A3353' }}>
                                                -
                                            </Typography>
                                        )}
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <DetailField label="Case Type" value={caseData.case_type} />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <DetailField
                                        label="Closed On"
                                        value={
                                            caseData.closed_on
                                                ? new Date(caseData.closed_on).toLocaleDateString()
                                                : undefined
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <DetailField
                                        label="Created At"
                                        value={new Date(caseData.created_at).toLocaleDateString()}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Description */}
                        {caseData.description && (
                            <Paper sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" sx={{ color: '#1A3353', fontWeight: 600, mb: 2 }}>
                                    Description
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666', whiteSpace: 'pre-wrap' }}>
                                    {caseData.description}
                                </Typography>
                            </Paper>
                        )}

                        {/* Comments Section */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ color: '#1A3353', fontWeight: 600, mb: 2 }}>
                                Comments ({comments.length})
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {comments.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {comments.map((comment: any) => (
                                        <Box
                                            key={comment.id}
                                            sx={{
                                                p: 2,
                                                backgroundColor: '#f9fafb',
                                                borderRadius: 1,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 1,
                                                    mb: 1,
                                                }}
                                            >
                                                <Avatar sx={{ width: 24, height: 24 }}>
                                                    {comment.commented_by?.user_details?.email?.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {comment.commented_by?.user_details?.email}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#666' }}>
                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: '#666' }}>
                                                {comment.comment}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" sx={{ color: '#999' }}>
                                    No comments yet
                                </Typography>
                            )}
                        </Paper>
                    </Box>

                    {/* Sidebar - 400px */}
                    <Box sx={{ width: '400px' }}>
                        {/* Attachments */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ color: '#1A3353', fontWeight: 600, mb: 2 }}>
                                Attachments ({attachments.length})
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {attachments.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {attachments.map((attachment: any) => (
                                        <Box
                                            key={attachment.id}
                                            sx={{
                                                p: 2,
                                                backgroundColor: '#f9fafb',
                                                borderRadius: 1,
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: '#f0f0f0',
                                                },
                                            }}
                                            onClick={() => window.open(attachment.attachment, '_blank')}
                                        >
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {attachment.file_name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#666' }}>
                                                {new Date(attachment.created_at).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" sx={{ color: '#999' }}>
                                    No attachments
                                </Typography>
                            )}
                        </Paper>

                        {/* Contacts */}
                        {contacts.length > 0 && (
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ color: '#1A3353', fontWeight: 600, mb: 2 }}>
                                    Contacts ({contacts.length})
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {contacts.map((contact: any) => (
                                        <Box key={contact.id}>
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                {contact.first_name} {contact.last_name}
                                            </Typography>
                                            {contact.email && (
                                                <Typography variant="caption" sx={{ color: '#666' }}>
                                                    {contact.email}
                                                </Typography>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </Paper>
                        )}
                    </Box>
                </Box>
            </Container>
        </>
    );
}
