import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';
import { FaEdit, FaTrash, FaBuilding, FaUser, FaMapMarkerAlt, FaFileAlt } from 'react-icons/fa';
import { ModernAppBar, AppBarAction } from '../../components/ui/ModernAppBar';
import { HeroCard, DetailSection, DetailField, AttachmentsCard, NotesCard } from '../../components/leads/details';
import { IActionModal } from '../../components/ui';
import { useLeadDetails } from '../../hooks/leads/useLeadDetails';
import { useLeadActions } from '../../hooks/leads/useLeadActions';
import { useNotification } from '../../context/NotificationContext';
import { routes } from '../../constants/routes';

export function LeadDetails() {
    const [searchParams] = useSearchParams();
    const leadId = searchParams.get('id');
    const navigate = useNavigate();
    const [note, setNote] = useState('');

    // Modal states
    const [deleteLeadModalOpen, setDeleteLeadModalOpen] = useState(false);
    const [deleteAttachmentModalOpen, setDeleteAttachmentModalOpen] = useState(false);
    const [deleteNoteModalOpen, setDeleteNoteModalOpen] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
    const [selectedAttachmentId, setSelectedAttachmentId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { leadDetails, attachments, comments, isLoading, refresh } = useLeadDetails(leadId);
    const { deleteLead, addComment, uploadAttachment, deleteAttachment, deleteComment } = useLeadActions();
    const { addNotification } = useNotification();

    if (!leadId) {
        navigate(routes.leads.main);
        return null;
    }

    if (!isLoading && !leadDetails) {
        navigate(routes.leads.main);
        return null;
    }

    const handleBack = () => navigate(routes.leads.main);

    const handleEdit = () => {
        navigate(`${routes.leads.edit}?id=${leadId}`);
    };

    const handleDeleteClick = () => {
        setDeleteLeadModalOpen(true);
    };

    const handleConfirmDeleteLead = async () => {
        setIsDeleting(true);
        const success = await deleteLead(leadId);
        setIsDeleting(false);

        if (success) {
            setDeleteLeadModalOpen(false);
            addNotification('success', 'Lead deleted successfully', '');
            navigate(routes.leads.main);
        } else {
            setDeleteLeadModalOpen(false);
            addNotification('error', 'Failed to delete lead', '');
        }
    };

    const handleFileUpload = async (file: File) => {
        const result = await uploadAttachment(leadId, file);
        if (result.success) {
            addNotification('success', 'Attachment uploaded successfully', '');
            await refresh();
        } else {
            addNotification('error', 'Failed to upload attachment', '');
        }
    };

    const handleDeleteAttachmentClick = (attachmentId: string) => {
        setSelectedAttachmentId(attachmentId);
        setDeleteAttachmentModalOpen(true);
    };

    const handleConfirmDeleteAttachment = async () => {
        if (!selectedAttachmentId) return;

        setIsDeleting(true);
        const success = await deleteAttachment(selectedAttachmentId);
        setIsDeleting(false);

        if (success) {
            setDeleteAttachmentModalOpen(false);
            setSelectedAttachmentId(null);
            addNotification('success', 'Attachment deleted successfully', '');
            await refresh();
        } else {
            setDeleteAttachmentModalOpen(false);
            setSelectedAttachmentId(null);
            addNotification('error', 'Failed to delete attachment', '');
        }
    };

    const handleSendNote = async () => {
        if (!note.trim()) return;

        const result = await addComment(leadId, note);
        if (result.success) {
            addNotification('success', 'Note added successfully', '');
            setNote('');
            await refresh();
        } else {
            addNotification('error', 'Failed to add note', '');
        }
    };

    const handleDeleteNoteClick = (commentId: string) => {
        setSelectedCommentId(commentId);
        setDeleteNoteModalOpen(true);
    };

    const handleConfirmDeleteNote = async () => {
        if (!selectedCommentId) return;

        setIsDeleting(true);
        const success = await deleteComment(selectedCommentId);
        setIsDeleting(false);

        if (success) {
            setDeleteNoteModalOpen(false);
            setSelectedCommentId(null);
            addNotification('success', 'Note deleted successfully', '');
            await refresh();
        } else {
            setDeleteNoteModalOpen(false);
            setSelectedCommentId(null);
            addNotification('error', 'Failed to delete note', '');
        }
    };

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Leads', onClick: handleBack },
        { type: 'custom', label: 'Edit', icon: <FaEdit />, onClick: handleEdit },
        { type: 'custom', label: 'Delete', icon: <FaTrash />, onClick: handleDeleteClick, color: 'error' },
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

                    <DetailSection title="Lead Information" icon={<FaBuilding style={{ color: '#6366f1' }} />}>
                        <DetailField label="Company Name" value={leadDetails.account_name} />
                        <DetailField label="Industry" value={leadDetails.industry_display} />
                        <DetailField label="Department" value={leadDetails.department_display} />
                        <DetailField label="Budget Range" value={leadDetails.budget_range_display} />
                        <DetailField label="Decision Timeframe" value={leadDetails.decision_timeframe_display} />
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
                    </DetailSection>

                    <DetailSection title="Contact Information" icon={<FaUser style={{ color: '#6366f1' }} />}>
                        <DetailField label="First Name" value={leadDetails.first_name} />
                        <DetailField label="Last Name" value={leadDetails.last_name} />
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
                        <DetailField label="Preferred Language" value={leadDetails.preferred_language} />
                        <DetailField label="Do Not Call" value={leadDetails.do_not_call ? 'Yes' : 'No'} />
                    </DetailSection>

                    <DetailSection title="Address Information" icon={<FaMapMarkerAlt style={{ color: '#6366f1' }} />}>
                        <DetailField label="Address Line" value={leadDetails.address_line} />
                        <DetailField label="Street" value={leadDetails.street} />
                        <DetailField label="City" value={leadDetails.city} />
                        <DetailField label="State" value={leadDetails.state} />
                        <DetailField label="Postal Code" value={leadDetails.postcode} />
                        <DetailField label="Country" value={leadDetails.country} />
                    </DetailSection>

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
                    <AttachmentsCard
                        attachments={attachments}
                        onFileUpload={handleFileUpload}
                        onDeleteAttachment={handleDeleteAttachmentClick}
                    />
                    <NotesCard
                        comments={comments}
                        note={note}
                        onNoteChange={setNote}
                        onSendNote={handleSendNote}
                        onDeleteNote={handleDeleteNoteClick}
                    />
                </Box>
            </Box>

            {/* Delete Lead Modal */}
            <IActionModal
                open={deleteLeadModalOpen}
                onClose={() => setDeleteLeadModalOpen(false)}
                onConfirm={handleConfirmDeleteLead}
                variant="error"
                title="Delete Lead?"
                message={`Are you sure you want to delete "${leadDetails?.first_name} ${leadDetails?.last_name}"? This action cannot be undone and will remove all associated data.`}
                confirmText="Delete Lead"
                cancelText="Cancel"
                isLoading={isDeleting}
            />

            {/* Delete Attachment Modal */}
            <IActionModal
                open={deleteAttachmentModalOpen}
                onClose={() => {
                    setDeleteAttachmentModalOpen(false);
                    setSelectedAttachmentId(null);
                }}
                onConfirm={handleConfirmDeleteAttachment}
                variant="warning"
                title="Delete Attachment?"
                message="Are you sure you want to delete this attachment? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />

            {/* Delete Note Modal */}
            <IActionModal
                open={deleteNoteModalOpen}
                onClose={() => {
                    setDeleteNoteModalOpen(false);
                    setSelectedCommentId(null);
                }}
                onConfirm={handleConfirmDeleteNote}
                variant="warning"
                title="Delete Note?"
                message="Are you sure you want to delete this note? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </Box>
    );
}
