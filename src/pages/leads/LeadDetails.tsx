import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';
import { FaEdit, FaTrash, FaBuilding, FaUser, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';
import { ModernAppBar, AppBarAction } from '../../components/ModernAppBar';
import { HeroCard, DetailSection, DetailField, AttachmentsCard, NotesCard } from '../../components/leads/details';
import { useLeadDetails } from '../../hooks/lead/useLeadDetails';
import { useLeadActions } from '../../hooks/lead/useLeadActions';
import { useNotification } from '../../context/NotificationContext';

export function LeadDetails() {
    const [searchParams] = useSearchParams();
    const leadId = searchParams.get('id');
    const navigate = useNavigate();
    const [note, setNote] = useState('');

    const { leadDetails, attachments, comments, isLoading, refresh } = useLeadDetails(leadId);
    const { deleteLead, addComment, uploadAttachment } = useLeadActions();

    const { addNotification } = useNotification();

    if (!leadId) {
        navigate('/app/leads');
        return null;
    }

    if (!isLoading && !leadDetails) {
        navigate('/app/leads');
        return null;
    }

    const handleBack = () => navigate('/app/leads');

    const handleEdit = () => {
        navigate(`/app/leads/edit-lead?id=${leadId}`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            const success = await deleteLead(leadId);
            if (success) {
                addNotification('success', 'Lead deleted successfully', '');
                navigate('/app/leads');
            } else {
                addNotification('error', 'Failed to delete lead', '');
            }
        }
    };

    const handleFileUpload = async (file: File) => {
        const success = await uploadAttachment(leadId, file);
        if (success) {
            addNotification('success', 'Attachment uploaded successfully', '');
            await refresh();
        } else {
            addNotification('error', 'Failed to upload attachment', '');
        }
    };

    const handleSendNote = async () => {
        if (!note.trim()) return;

        const success = await addComment(leadId, note);
        if (success) {
            addNotification('success', 'Note added successfully', '');
            setNote('');
            await refresh();
        } else {
            addNotification('error', 'Failed to add note', '');
        }
    };

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Leads', onClick: handleBack },
        { type: 'custom', label: 'Edit', icon: <FaEdit />, onClick: handleEdit },
        { type: 'custom', label: 'Delete', icon: <FaTrash />, onClick: handleDelete, color: 'error' },
    ];

    if (isLoading) {
        return (
            <Box sx={{ mt: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (!leadDetails) {
        return (
            <Box sx={{ mt: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <Typography>Lead not found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: '60px' }}>
            <ModernAppBar module="Leads" crntPage="Lead Details" actions={actions} />

            <Box sx={{ mt: '120px', p: 3, display: 'flex', gap: 3 }}>
                {/* Main Content - 68% */}
                <Box sx={{ flex: '0 0 68%' }}>
                    {/* Hero Card */}
                    <HeroCard
                        salutation={leadDetails.salutation}
                        firstName={leadDetails.first_name}
                        lastName={leadDetails.last_name}
                        title={leadDetails.title}
                        companyName={leadDetails.account_name}
                        status={leadDetails.status}
                        source={leadDetails.source}
                        rating={leadDetails.rating}
                        opportunityAmount={leadDetails.opportunity_amount}
                        probability={leadDetails.probability}
                        closeDate={leadDetails.close_date}
                        assignedTo={leadDetails.assigned_to}
                        tags={leadDetails.tags}
                        createdBy={leadDetails.created_by}
                        createdAt={leadDetails.created_at}
                    />

                    {/* Lead Information */}
                    <DetailSection title="Lead Information" icon={<FaBuilding style={{ color: '#6366f1' }} />}>
                        <DetailField label="Company Name" value={leadDetails.account_name} />
                        <DetailField label="Industry" value={leadDetails.industry} />
                        <DetailField label="Department" value={leadDetails.department} />
                        <DetailField label="Rating" value={leadDetails.rating} />
                        <DetailField label="Budget Range" value={leadDetails.budget_range} />
                        <DetailField label="Decision Timeframe" value={leadDetails.decision_timeframe} />
                        <DetailField
                            label="Website"
                            value={
                                leadDetails.website ? (
                                    <Link href={leadDetails.website} target="_blank" rel="noopener">
                                        {leadDetails.website}
                                    </Link>
                                ) : (
                                    '---'
                                )
                            }
                        />
                        <DetailField label="Skype ID" value={leadDetails.skype_ID} />
                        <DetailField label="Preferred Language" value={leadDetails.preferred_language} />
                    </DetailSection>

                    {/* Contact Information */}
                    <DetailSection title="Contact Information" icon={<FaUser style={{ color: '#6366f1' }} />}>
                        <DetailField label="First Name" value={leadDetails.first_name} />
                        <DetailField label="Last Name" value={leadDetails.last_name} />
                        <DetailField label="Job Title" value={leadDetails.title} />
                        <DetailField
                            label="Email"
                            value={
                                leadDetails.email ? (
                                    <Link href={`mailto:${leadDetails.email}`}>{leadDetails.email}</Link>
                                ) : (
                                    '---'
                                )
                            }
                        />
                        <DetailField label="Phone" value={leadDetails.phone} />
                        <DetailField label="Do Not Call" value={leadDetails.do_not_call ? 'Yes' : 'No'} />
                    </DetailSection>

                    {/* Address Information */}
                    <DetailSection title="Address Information" icon={<FaMapMarkerAlt style={{ color: '#6366f1' }} />}>
                        <DetailField label="Address Line" value={leadDetails.address_line} />
                        <DetailField label="Street" value={leadDetails.street} />
                        <DetailField label="City" value={leadDetails.city} />
                        <DetailField label="State" value={leadDetails.state} />
                        <DetailField label="Postal Code" value={leadDetails.postcode} />
                        <DetailField label="Country" value={leadDetails.country} />
                    </DetailSection>

                    {/* Description */}
                    <DetailSection title="Description" icon={<FaFileAlt style={{ color: '#6366f1' }} />}>
                        {leadDetails.description ? (
                            <Box
                                sx={{
                                    gridColumn: 'span 3',
                                    color: 'text.secondary',
                                    fontSize: '14px',
                                    lineHeight: 1.7,
                                }}
                                dangerouslySetInnerHTML={{ __html: leadDetails.description }}
                            />
                        ) : (
                            <Typography color="text.secondary" sx={{ gridColumn: 'span 3' }}>
                                No description provided
                            </Typography>
                        )}
                    </DetailSection>
                </Box>

                {/* Sidebar - 30% */}
                <Box sx={{ flex: '0 0 30%' }}>
                    <AttachmentsCard attachments={attachments} onFileUpload={handleFileUpload} />
                    <NotesCard comments={comments} note={note} onNoteChange={setNote} onSendNote={handleSendNote} />
                </Box>
            </Box>
        </Box>
    );
}
