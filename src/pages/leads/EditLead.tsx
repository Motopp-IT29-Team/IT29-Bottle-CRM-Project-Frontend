import React, { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useFormState } from '../../hooks/useFormState';
import {
    ModernAppBar,
    AppBarAction,
    LoadingState,
    ErrorState,
    IForm,
    FormErrors,
    ILoadingBackdrop,
} from '../../components/ui';
import { COUNTRIES } from '../../constants/countries';
import { routes } from '../../constants/routes';
import { useLeads, LeadFormData, validateLeadForm, getLeadConfig } from '../../api';

export function EditLead() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const leadId = searchParams.get('id');

    const { getAll, getById, update, isLoading: isSubmitting } = useLeads();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});
    const [initialFormData, setInitialFormData] = useState<LeadFormData | null>(null);
    const [formData, setFormData] = useState<LeadFormData>();
    const [users, setUsers] = useState<any[]>([]);

    const { canSubmit } = useFormState({
        formConfig: getLeadConfig({ users }),
        formData: formData || ({} as LeadFormData),
        initialData: initialFormData,
        isSubmitting,
    });

    useEffect(() => {
        if (leadId) {
            fetchLeadData();
        } else {
            navigate(routes.leads.main);
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

        setIsLoading(true);
        const result = await getById(leadId);

        if (result.success && result.data) {
            const lead = result.data.lead;
            const attachments = result.data.attachments || [];

            const allUsers = await getAll();
            if (allUsers.success && allUsers.data?.users) {
                setUsers(allUsers.data.users);
            }

            const formattedAttachments = attachments.map((att: any) => ({
                id: att.id,
                name: att.file_name,
                url: att.file_path,
                isNew: false,
            }));

            const loadedData: LeadFormData = {
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
                salutation: lead.salutation || 'Mr',
                department: lead.department || 'Sales',
                preferred_language: lead.preferred_language || 'English',
                rating: lead.rating || '',
                budget_range: lead.budget_range || '',
                decision_timeframe: lead.decision_timeframe || '',
                do_not_call: lead.do_not_call || false,
                address_line: lead.address_line || '',
                close_date: lead.close_date || '',
                street: lead.street || '',
                city: lead.city || '',
                state: lead.state || '',
                postcode: lead.postcode || '',
                country: getCountryCode(lead.country) || '',
                description: lead.description || '',
                attachments: formattedAttachments,
                assigned_to:
                    lead.assigned_to?.map((u: any) => ({
                        value: u.id,
                        label: u.user_details?.email || u.email || `User ${u.id}`,
                    })) || [],
                contacts: [],
                tags: lead.tags?.map((tag) => tag.name) || [],
            };
            setFormData(loadedData);
            setInitialFormData(loadedData);
        } else {
            setError(true);
        }
        setIsLoading(false);
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
    ) => {
        const { name, value } = e.target;
        const type = 'type' in e.target ? e.target.type : undefined;

        if (!formData) return;

        if (type === 'number') {
            setFormData((prev) => ({
                ...prev!,
                [name]: value === '' ? '' : Number(value),
            }));
        } else if (type === 'checkbox') {
            const checked = 'checked' in e.target ? e.target.checked : false;
            setFormData((prev) => ({
                ...prev!,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev!,
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

    const handleBack = () => {
        navigate(`${routes.leads.details}?id=${leadId}`);
    };

    const handleCancel = () => {
        fetchLeadData();
        setBackendErrors({});
        setValidationErrors({});
        navigate(-1);
    };

    const handleSubmit = async () => {
        if (!leadId || !formData) return;

        setBackendErrors({});

        const errors = validateLeadForm(formData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const result = await update(leadId, formData);

        if (result.success) {
            navigate(`${routes.leads.details}?id=${leadId}`);
        } else {
            if (result.fieldErrors) {
                setBackendErrors(result.fieldErrors);
            }
        }
    };

    if (isLoading) {
        return <LoadingState message="Loading lead data..." />;
    }

    if (error || !formData) {
        return <ErrorState message="Error loading lead data. Please try again." onRetry={fetchLeadData} />;
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
        <Box sx={{ mt: '60px', backgroundColor: '#f9fafb' }}>
            <ModernAppBar module="Leads" crntPage="Edit Lead" actions={actions} />

            <ILoadingBackdrop open={isSubmitting} message="Updating lead..." />

            <Box sx={{ mt: '120px', p: '24px', mx: 'auto' }}>
                <IForm
                    config={getLeadConfig({ users })}
                    formData={formData}
                    errors={allErrors}
                    onChange={handleChange}
                    disabled={isSubmitting}
                />
            </Box>
        </Box>
    );
}
