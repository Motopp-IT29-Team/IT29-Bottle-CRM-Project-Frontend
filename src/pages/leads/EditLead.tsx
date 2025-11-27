import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useLeadFormData } from '../../hooks/leads/useLeadFormData';
import { useLeadValidation } from '../../hooks/leads/useLeadValidation';
import { useLeadApi } from '../../hooks/leads/useLeadApi';
import { useFormState } from '../../hooks/common/useFormState';
import { IForm, FormErrors } from '../../components/ui/form';
import { getEditLeadFormConfig } from '../../configs/leads/editLeadFormConfig';
import { LeadLoadingBackdrop } from '../../components/leads/LeadLoadingBackdrop';
import { ModernAppBar, AppBarAction } from '../../components/ui/ModernAppBar';
import { useNotification } from '../../context/NotificationContext';
import { COUNTRIES } from '../../constants/countries';

export function EditLead() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const leadId = searchParams.get('id');

    const { addNotification } = useNotification();
    const { getLead, updateLead, isLoading: isSubmitting } = useLeadApi();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});
    const [initialFormData, setInitialFormData] = useState<any>(null);

    const { formData, handleChange, setFormData } = useLeadFormData();
    const { validationErrors, validateForm, setValidationErrors } = useLeadValidation();

    const { canSubmit } = useFormState({
        formConfig: getEditLeadFormConfig(),
        formData,
        initialData: initialFormData,
        isSubmitting,
    });

    useEffect(() => {
        if (leadId) {
            fetchLeadData();
        } else {
            navigate('/app/leads');
        }
    }, [leadId]);

    const getCountryCode = (countryNameOrCode: string): string => {
        if (!countryNameOrCode) return '';
        if (countryNameOrCode.length === 2) return countryNameOrCode.toUpperCase();

        const country = COUNTRIES.find((c) => c.name.toLowerCase() === countryNameOrCode.toLowerCase());
        return country?.code || '';
    };

    const fetchLeadData = async () => {
        if (!leadId) return;

        setLoading(true);
        const result = await getLead(leadId);

        if (result.success && result.data) {
            const lead = result.data.lead;

            const attachments = result.data.attachments || [];
            const formattedAttachments = attachments.map((att: any) => ({
                id: att.id,
                name: att.file_name,
                url: att.file_path,
                isNew: false,
            }));

            const loadedData = {
                first_name: lead.first_name || '',
                last_name: lead.last_name || '',
                title: lead.title || '',
                phone: lead.phone || '',
                email: lead.email || '',
                account_name: lead.account_name || '',
                opportunity_amount: lead.opportunity_amount || '',
                website: lead.website || '',
                industry: lead.industry || '',
                status: lead.status || '',
                source: lead.source || '',
                probability: lead.probability || 50,
                skype_ID: lead.skype_ID || '',
                salutation: lead.salutation || 'Mr',
                department: lead.department || 'Sales',
                preferred_language: lead.preferred_language || 'English',
                rating: lead.rating || '',
                budget_range: lead.budget_range || '',
                decision_timeframe: lead.decision_timeframe || '',
                do_not_call: lead.do_not_call || false,
                address_line: lead.address_line || '',
                street: lead.street || '',
                city: lead.city || '',
                state: lead.state || '',
                postcode: lead.postcode || '',
                country: getCountryCode(lead.country) || '',
                description: lead.description || '',
                attachments: formattedAttachments,
                actualFile: null,
                assigned_to: lead.assigned_to?.map((u: any) => u.id) || [],
                contacts: [],
                tags: lead.tags || [],
            };
            setFormData(loadedData);
            setInitialFormData(loadedData);
        } else {
            setError(true);
            if (result.error) {
                addNotification('error', 'Failed to load lead', result.error);
            }
        }
        setLoading(false);
    };

    const handleBack = () => {
        navigate(`/app/leads/lead-details?id=${leadId}`);
    };

    const handleCancel = () => {
        fetchLeadData();
        setBackendErrors({});
        setValidationErrors({});
        navigate(-1);
    };

    const handleSubmit = async () => {
        if (!leadId) return;

        setBackendErrors({});

        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            addNotification('warning', 'Validation Error', 'Please fill in all required fields correctly');
            return;
        }

        const result = await updateLead(leadId, formData);

        if (result.success) {
            addNotification('success', 'Lead updated successfully!');
            navigate(`/app/leads/lead-details?id=${leadId}`);
        } else {
            if (result.fieldErrors) {
                setBackendErrors(result.fieldErrors);
            }
            if (result.error) {
                addNotification('error', 'Failed to update lead', result.error);
            }
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <CircularProgress size={40} sx={{ color: '#667eea' }} />
                <Typography sx={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>
                    Loading lead data...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography sx={{ color: '#ef4444', fontSize: '16px', fontWeight: 500 }}>
                    Error loading lead data. Please try again.
                </Typography>
            </Box>
        );
    }

    const allErrors: FormErrors = Object.keys(validationErrors).reduce(
        (acc, key) => {
            const error = validationErrors[key];
            acc[key] = error ? [error] : undefined;
            return acc;
        },
        { ...backendErrors } as FormErrors
    );

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Lead Details', onClick: handleBack },
        { type: 'cancel', onClick: handleCancel, disabled: isSubmitting },
        { type: 'save', onClick: handleSubmit, loading: isSubmitting, disabled: !canSubmit },
    ];

    return (
        <Box sx={{ mt: '60px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <ModernAppBar module="Leads" crntPage="Edit Lead" actions={actions} />

            <LeadLoadingBackdrop open={isSubmitting} />

            <Box sx={{ mt: '120px', p: '24px', maxWidth: '1400px', mx: 'auto' }}>
                <IForm
                    config={getEditLeadFormConfig()}
                    formData={formData}
                    errors={allErrors}
                    onChange={handleChange}
                    disabled={isSubmitting}
                />
            </Box>
        </Box>
    );
}
