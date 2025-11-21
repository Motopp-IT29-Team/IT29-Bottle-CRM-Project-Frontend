import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { useLeadFormData, INITIAL_LEAD_FORM_DATA } from '../../hooks/lead/useLeadFormData';
import { useLeadValidation } from '../../hooks/lead/useLeadValidation';
import { LeadLoadingBackdrop } from '../../components/leads/LeadLoadingBackdrop';
import { LeadInformationSection } from '../../components/leads/create/LeadInformationSection';
import { LeadContactSection } from '../../components/leads/create/LeadContactSection';
import { LeadAddressSection } from '../../components/leads/create/LeadAddressSection';
import { LeadDescriptionSection } from '../../components/leads/create/LeadDescriptionSection';
import { LeadTeamSection } from '../../components/leads/create/LeadTeamSection';
import { ModernAppBar, AppBarAction } from '../../components/ModernAppBar';
import { useNotification } from '../../context/NotificationContext';
import '../../styles/style.css';
import { useSubmitLead } from '../../hooks/lead/useSubmitLead';

export function AddLead() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>({});

    // State for Autocomplete selected values
    const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
    const [selectedAssignTo, setSelectedAssignTo] = useState<any[]>([]);
    const [selectedTags, setSelectedTags] = useState<any[]>([]);

    const {
        formData,
        handleChange,
        handleSelectChange,
        handleAutocompleteChange,
        handleFileChange,
        handleDescriptionChange,
        resetForm,
    } = useLeadFormData(INITIAL_LEAD_FORM_DATA);

    const { validationErrors, validateForm, setValidationErrors } = useLeadValidation();
    const { submitForm, checkDuplicate } = useSubmitLead(resetForm);
    const { addNotification } = useNotification();

    const handleBack = () => navigate('/app/leads');

    const handleCancel = () => {
        resetForm();
        setSelectedContacts([]);
        setSelectedAssignTo([]);
        setSelectedTags([]);
        setBackendErrors({});
        setValidationErrors({});
    };

    const handleContactsChange = (name: string, value: any[]) => {
        setSelectedContacts(value);
        handleAutocompleteChange(name, value);
    };

    const handleAssignToChange = (name: string, value: any[]) => {
        setSelectedAssignTo(value);
        handleAutocompleteChange(name, value);
    };

    const handleTagsChange = (name: string, value: any[]) => {
        setSelectedTags(value);
        handleAutocompleteChange(name, value);
    };

    const handleFileUpload = (file: File | null) => {
        handleFileChange(file);
    };

    const handleSubmit = async () => {
        setBackendErrors({});

        // Validate form
        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            addNotification('warning', 'Validation Error', 'Please fill in all required fields correctly');
            return;
        }

        // Check for duplicates
        setIsLoading(true);
        try {
            const isDuplicate = await checkDuplicate(formData.email, formData.phone);

            if (isDuplicate) {
                addNotification('warning', 'Duplicate Lead', 'A lead with this email or phone number already exists');
                setIsLoading(false);
                return;
            }

            // Submit form
            const result = await submitForm(formData);

            if (result.success) {
                addNotification('success', 'Lead created successfully!', 'The lead has been added to your CRM');
                handleCancel();
                navigate('/app/leads');
            } else {
                if (result.fieldErrors) {
                    setBackendErrors(result.fieldErrors);
                }
                addNotification('error', 'Failed to create lead', result.error || 'Please check the form for errors');
            }
        } catch (error: any) {
            addNotification('error', 'Error', error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    // Merge validation and backend errors
    const allErrors: Record<string, string> = {};
    Object.keys(validationErrors).forEach((key) => {
        if (validationErrors[key]) {
            allErrors[key] = validationErrors[key]!;
        }
    });
    Object.keys(backendErrors).forEach((key) => {
        if (backendErrors[key]?.[0]) {
            allErrors[key] = backendErrors[key][0];
        }
    });

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Leads', onClick: handleBack },
        { type: 'cancel', onClick: handleCancel, disabled: isLoading },
        { type: 'save', label: 'Create Lead', onClick: handleSubmit, loading: isLoading },
    ];

    return (
        <Box sx={{ mt: '60px' }}>
            <ModernAppBar module="Leads" crntPage="Create Lead" actions={actions} />

            <LeadLoadingBackdrop open={isLoading} />

            <Box sx={{ mt: '120px' }}>
                <div style={{ padding: '10px' }}>
                    {/* Lead Information */}
                    <LeadInformationSection
                        data={{
                            account_name: formData.account_name,
                            opportunity_amount: formData.opportunity_amount,
                            website: formData.website,
                            industry: formData.industry,
                            status: formData.status,
                            source: formData.source,
                            probability: formData.probability,
                            skype_ID: formData.skype_ID,
                        }}
                        onChange={(e) => {
                            if (
                                e.target.name === 'source' ||
                                e.target.name === 'status' ||
                                e.target.name === 'industry'
                            ) {
                                handleSelectChange(e);
                            } else {
                                handleChange(e);
                            }
                        }}
                        errors={allErrors}
                        disabled={isLoading}
                        industries={state?.industries || []}
                        statuses={state?.status || []}
                        sources={state?.source || []}
                    />

                    {/* Contact Information */}
                    <LeadContactSection
                        data={{
                            first_name: formData.first_name,
                            last_name: formData.last_name,
                            title: formData.title,
                            phone: formData.phone,
                            email: formData.email,
                        }}
                        onChange={handleChange}
                        errors={allErrors}
                        disabled={isLoading}
                    />

                    {/* Address Information */}
                    <LeadAddressSection
                        address={{
                            address_line: formData.address_line,
                            street: formData.street,
                            city: formData.city,
                            state: formData.state,
                            postcode: formData.postcode,
                            country: formData.country,
                        }}
                        onChange={(e) => {
                            if (e.target.name === 'country') {
                                handleSelectChange(e);
                            } else {
                                handleChange(e);
                            }
                        }}
                        errors={allErrors}
                        disabled={isLoading}
                        countries={state?.countries || []}
                    />

                    {/* Team & Assignment */}
                    <LeadTeamSection
                        selectedContacts={selectedContacts}
                        selectedAssignTo={selectedAssignTo}
                        selectedTags={selectedTags}
                        onContactsChange={handleContactsChange}
                        onAssignToChange={handleAssignToChange}
                        onTagsChange={handleTagsChange}
                        errors={allErrors}
                        disabled={isLoading}
                        contacts={state?.contacts || []}
                        users={state?.users || []}
                        tags={state?.tags || []}
                    />

                    {/* Description & Attachment */}
                    <LeadDescriptionSection
                        description={formData.description}
                        leadAttachment={formData.lead_attachment}
                        onDescriptionChange={handleDescriptionChange}
                        onFileChange={handleFileUpload}
                        errors={allErrors}
                        disabled={isLoading}
                    />
                </div>
            </Box>
        </Box>
    );
}
