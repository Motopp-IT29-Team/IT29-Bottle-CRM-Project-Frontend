import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useFormState } from '../../hooks/useFormState';
import { ModernAppBar, AppBarAction, ILoadingBackdrop, IForm, FormErrors } from '../../components/ui';
import { routes } from '../../constants/routes';
import { useLeads, LeadFormData, validateLeadForm, getLeadConfig } from '../../api';

const INITIAL_LEAD_FORM_DATA: LeadFormData = {
    first_name: '',
    last_name: '',
    title: '',
    phone: '',
    email: '',
    account_name: '',
    opportunity_amount: '',
    website: '',
    industry: '',
    status: '',
    source: '',
    probability: 50,
    close_date: '',
    salutation: 'Mr',
    department: 'Sales',
    preferred_language: 'English',
    rating: '',
    budget_range: '',
    decision_timeframe: '',
    do_not_call: false,
    address_line: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: 'NL',
    description: '',
    attachments: null,
    assigned_to: [],
    contacts: [],
    tags: [],
};

export function AddLead() {
    const navigate = useNavigate();
    const { getAll, create, checkDuplicate, isLoading } = useLeads();

    const [formData, setFormData] = useState<LeadFormData>(INITIAL_LEAD_FORM_DATA);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});
    const [users, setUsers] = useState<any[]>([]);

    const formConfig = getLeadConfig({ users });

    const { canSubmit } = useFormState({
        formConfig,
        formData,
        isSubmitting: isLoading,
    });

    useEffect(() => {
        const fetchUsers = async () => {
            const result = await getAll();
            if (result.success && result.data?.users) {
                setUsers(result.data.users);
            }
        };
        fetchUsers();
    }, []);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
    ) => {
        const { name, value } = e.target;
        const type = 'type' in e.target ? e.target.type : undefined;

        if (type === 'number') {
            setFormData((prev) => ({
                ...prev,
                [name]: value === '' ? '' : Number(value),
            }));
        } else if (type === 'checkbox') {
            const checked = 'checked' in e.target ? e.target.checked : false;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        if (validationErrors[name]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleAutocompleteChange = (name: string, value: any[]) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setFormData(INITIAL_LEAD_FORM_DATA);
        setValidationErrors({});
    };

    const handleBack = () => navigate(routes.leads.main);

    const handleCancel = () => {
        resetForm();
        setBackendErrors({});
        handleBack();
    };

    const handleSubmit = async () => {
        setBackendErrors({});

        const errors = validateLeadForm(formData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const duplicateResult = await checkDuplicate(formData.email, formData.phone);
        if (duplicateResult.success && duplicateResult.data) {
            const hasDuplicates =
                duplicateResult.data.data.account_matches.length > 0 ||
                duplicateResult.data.data.contact_matches.length > 0;

            if (hasDuplicates) {
                return;
            }
        }

        const result = await create(formData);

        if (result.success) {
            resetForm();
            navigate(routes.leads.main);
        } else {
            if (result.fieldErrors) {
                setBackendErrors(result.fieldErrors);
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
        <Box sx={{ mt: '60px', backgroundColor: '#f9fafb' }}>
            <ModernAppBar module="Leads" crntPage="Create Lead" actions={actions} />

            <ILoadingBackdrop open={isLoading} message="Creating lead..." />

            <Box sx={{ mt: '120px', p: '24px', mx: 'auto' }}>
                <IForm
                    config={formConfig}
                    formData={formData}
                    errors={allErrors}
                    onAutocompleteChange={handleAutocompleteChange}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </Box>
        </Box>
    );
}
