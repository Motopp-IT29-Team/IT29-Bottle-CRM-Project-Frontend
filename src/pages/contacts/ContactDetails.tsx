import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';
import { FaUser, FaMapMarkerAlt, FaFileAlt, FaShareAlt } from 'react-icons/fa';
import { IModernAppBar, AppBarAction, ILoadingState, ErrorState, IActionModal } from '../../components/ui';
import { useContacts } from '../../api';
import { routes } from '../../constants/routes';
import { DetailField, DetailSection } from '../../components/leads/details';
import { getCountryNameByCode } from '../../utils/userHelpers';
import { IContact } from '../../types';

export function ContactDetails() {
    const [searchParams] = useSearchParams();
    const contactId = searchParams.get('id');
    const navigate = useNavigate();
    const { getById, deleteContact, isLoading } = useContacts();

    const [contactDetails, setContactDetails] = useState<IContact>();
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        if (contactId) {
            fetchContactDetails();
        } else {
            navigate(routes.contacts.main);
        }
    }, [contactId]);

    const fetchContactDetails = async () => {
        if (!contactId) return;

        const result = await getById(contactId);
        if (result.success && result.data) {
            setContactDetails(result.data);
        } else {
            navigate(routes.contacts.main);
        }
    };

    const handleBack = () => navigate(routes.contacts.main);
    const handleEdit = () => navigate(`${routes.contacts.edit}?id=${contactId}`);
    const handleDeleteContact = async () => {
        if (!contactId) return;

        const result = await deleteContact(contactId);
        if (result.success) {
            navigate(routes.contacts.main);
            setDeleteModal(false);
        }
    };

    if (isLoading) {
        return <ILoadingState message="Loading..." />;
    }

    if (!contactId || !contactDetails) {
        return <ErrorState message="Contact not found" />;
    }

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Contacts', onClick: handleBack },
        { type: 'edit', onClick: handleEdit },
        { type: 'delete', onClick: () => setDeleteModal(true) },
    ];

    return (
        <Box>
            <IModernAppBar module="Contacts" crntPage="Contact Details" actions={actions} />

            <Box sx={{ p: 3, mx: 'auto' }}>
                {/* Hero Section */}
                <Box
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        p: 3,
                        mb: 3,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                bgcolor: '#667eea',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '32px',
                                fontWeight: 600,
                            }}
                        >
                            {contactDetails.first_name?.charAt(0)}
                            {contactDetails.last_name?.charAt(0)}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: '24px', fontWeight: 600, color: '#1f2937' }}>
                                {contactDetails.salutation} {contactDetails.first_name} {contactDetails.last_name}
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: '#6b7280', mt: 0.5 }}>
                                {contactDetails.title} at {contactDetails.organization}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Contact Information */}
                <DetailSection title="Contact Information" icon={<FaUser style={{ color: '#6366f1' }} />}>
                    <DetailField label="First Name" value={contactDetails.first_name} />
                    <DetailField label="Last Name" value={contactDetails.last_name} />
                    <DetailField label="Organization" value={contactDetails.organization} />
                    <DetailField
                        label="Primary Email"
                        value={
                            contactDetails.primary_email ? (
                                <Link href={`mailto:${contactDetails.primary_email}`}>
                                    {contactDetails.primary_email}
                                </Link>
                            ) : (
                                '---'
                            )
                        }
                    />
                    <DetailField
                        label="Secondary Email"
                        value={
                            contactDetails.secondary_email ? (
                                <Link href={`mailto:${contactDetails.secondary_email}`}>
                                    {contactDetails.secondary_email}
                                </Link>
                            ) : (
                                '---'
                            )
                        }
                    />
                    <DetailField label="Mobile Number" value={contactDetails.mobile_number} />
                    <DetailField label="Secondary Number" value={contactDetails.secondary_number} />
                    <DetailField label="Department" value={contactDetails.department} />
                    <DetailField label="Language" value={contactDetails.language} />
                    <DetailField label="Do Not Call" value={contactDetails.do_not_call ? 'Yes' : 'No'} />
                </DetailSection>

                {/* Address Information */}
                <DetailSection title="Address Information" icon={<FaMapMarkerAlt style={{ color: '#6366f1' }} />}>
                    <DetailField label="Address Line" value={contactDetails.address.address_line} />
                    <DetailField label="Street" value={contactDetails.address.street} />
                    <DetailField label="City" value={contactDetails.address.city} />
                    <DetailField label="State" value={contactDetails.address.state} />
                    <DetailField label="Postcode" value={contactDetails.address.postcode} />
                    <DetailField label="Country" value={getCountryNameByCode(contactDetails.address.country || '')} />
                </DetailSection>

                {/* Description */}
                <DetailSection title="Description" icon={<FaFileAlt style={{ color: '#6366f1' }} />}>
                    {contactDetails.description ? (
                        <Box
                            sx={{
                                gridColumn: 'span 3',
                                color: 'text.secondary',
                                fontSize: '14px',
                                lineHeight: 1.7,
                            }}
                            dangerouslySetInnerHTML={{ __html: contactDetails.description }}
                        />
                    ) : (
                        <Typography color="text.secondary" sx={{ gridColumn: 'span 3' }}>
                            No description provided
                        </Typography>
                    )}
                </DetailSection>

                {/* Social Links */}
                <DetailSection title="Social Links" icon={<FaShareAlt style={{ color: '#6366f1' }} />}>
                    <DetailField
                        label="LinkedIn URL"
                        value={
                            contactDetails.linked_in_url ? (
                                <Link href={contactDetails.linked_in_url} target="_blank" rel="noopener">
                                    {contactDetails.linked_in_url}
                                </Link>
                            ) : (
                                '---'
                            )
                        }
                    />
                    <DetailField
                        label="Facebook URL"
                        value={
                            contactDetails.facebook_url ? (
                                <Link href={contactDetails.facebook_url} target="_blank" rel="noopener">
                                    {contactDetails.facebook_url}
                                </Link>
                            ) : (
                                '---'
                            )
                        }
                    />
                    <DetailField label="Twitter Username" value={contactDetails.twitter_username} />
                </DetailSection>
            </Box>

            <IActionModal
                open={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDeleteContact}
                variant="warning"
                title="Delete Contact?"
                message="Are you sure you want to delete this contact?"
                confirmText="Delete"
                cancelText="Cancel"
            />
        </Box>
    );
}
