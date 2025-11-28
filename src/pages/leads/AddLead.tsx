import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useLeadFormData, INITIAL_LEAD_FORM_DATA } from '../../hooks/leads/useLeadFormData';
import { useLeadValidation } from '../../hooks/leads/useLeadValidation';
import { useLeadApi } from '../../hooks/leads/useLeadApi';
import { useFormState } from '../../hooks/common/useFormState';
import { IForm, FormErrors } from '../../components/ui/form';
import { LeadLoadingBackdrop } from '../../components/leads/LeadLoadingBackdrop';
import { ModernAppBar, AppBarAction } from '../../components/ui/ModernAppBar';
import { useNotification } from '../../context/NotificationContext';
import { getAddLeadFormConfig } from '../../configs/leads/addLeadFormConfig';
import { routes } from '../../constants/routes';

export function AddLead() {
    const navigate = useNavigate();

    const { addNotification } = useNotification();
    const { getLeads, createLead, checkDuplicate, isLoading } = useLeadApi();

    const [backendErrors, setBackendErrors] = useState<FormErrors>({});
    const [users, setUsers] = useState<any[]>([]);

    const { formData, handleChange, resetForm } = useLeadFormData(INITIAL_LEAD_FORM_DATA);
    const { validationErrors, validateForm, setValidationErrors } = useLeadValidation();

    const formConfig = getAddLeadFormConfig({ users });

    const { canSubmit } = useFormState({
        formConfig,
        formData,
        isSubmitting: isLoading,
    });

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await getLeads();
            if (result.success && result.data?.users) {
                setUsers(result.data.users);
            }
        };
        fetchUsers();
    }, []);

    const handleBack = () => navigate(routes.leads.main);

    const handleCancel = () => {
        resetForm();
        setBackendErrors({});
        setValidationErrors({});
        handleBack();
    };

    const handleSubmit = async () => {
        setBackendErrors({});

        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            addNotification('warning', 'Validation Error', 'Please fill in all required fields correctly');
            return;
        }

        const duplicateResult = await checkDuplicate(formData.email, formData.phone);
        if (duplicateResult.success && duplicateResult.data?.duplicate) {
            addNotification('warning', 'Duplicate Lead', 'A lead with this email or phone number already exists');
            return;
        }

        const result = await createLead(formData);

        if (result.success) {
            addNotification('success', 'Lead created successfully!', 'The lead has been added to your CRM');
            handleCancel();
            navigate(routes.leads.main);
        } else {
            if (result.fieldErrors) {
                setBackendErrors(result.fieldErrors);
            }
            if (result.error) {
                addNotification('error', 'Failed to create lead', result.error);
            }
        }
    };

    const allErrors: FormErrors = Object.keys(validationErrors).reduce(
        (acc, key) => {
            const error = validationErrors[key];
            acc[key] = error ? [error] : undefined;
            return acc;
        },
        { ...backendErrors } as FormErrors
    );

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Leads', onClick: handleBack },
        { type: 'cancel', onClick: handleCancel, disabled: isLoading },
        {
            type: 'save',
            label: 'Create Lead',
            onClick: handleSubmit,
            loading: isLoading,
            disabled: !canSubmit,
        },
    ];

    return (
        <Box sx={{ mt: '60px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <ModernAppBar module="Leads" crntPage="Create Lead" actions={actions} />

            <LeadLoadingBackdrop open={isLoading} />

            <Box sx={{ mt: '120px', p: '24px', maxWidth: '1400px', mx: 'auto' }}>
                <IForm
                    config={formConfig}
                    formData={formData}
                    errors={allErrors}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </Box>
        </Box>
    );
}
