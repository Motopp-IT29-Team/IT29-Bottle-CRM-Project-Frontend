import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useForm } from '../../api/hooks/useForm';
import { IModernAppBar, AppBarAction, ILoadingBackdrop, IForm, FormErrors } from '../../components/ui';
import { routes } from '../../constants/routes';
import { useOpportunities, OpportunityFormData, validateOpportunityForm, getOpportunityConfig } from '../../api';

const INITIAL_OPPORTUNITY_FORM_DATA: OpportunityFormData = {
    name: '',
    account: '',
    amount: '',
    currency: 'USD',
    stage: '',
    probability: 50,
    lead_source: '',
    closed_on: '',
    description: '',
    contacts: [],
    assigned_to: [],
    teams: [],
    tags: [],
    attachments: null,
};

export function AddOpportunity() {
    const navigate = useNavigate();
    const { getAll: getAllOpportunities, create, isLoading } = useOpportunities();

    const [formData, setFormData] = useState<OpportunityFormData>(INITIAL_OPPORTUNITY_FORM_DATA);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});

    const [accounts, setAccounts] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [currency, setCurrency] = useState<any[]>([]);
    const [stage, setStage] = useState<any[]>([]);
    const [leadSource, setLeadSource] = useState<any[]>([]);

    const formConfig = getOpportunityConfig({
        accounts,
        contacts,
        users,
        teams,
        tags,
        currency,
        stage,
        leadSource,
    });

    const { canSubmit } = useForm({
        formConfig,
        formData,
        isSubmitting: isLoading,
    });

    useEffect(() => {
        const fetchFormData = async () => {
            const result = await getAllOpportunities({ limit: 1 });
            if (result.success && result.data) {
                setAccounts(result.data.accounts_list || []);
                setContacts(result.data.contacts_list || []);
                // setUsers(result.data.users || []);
                // setTeams(result.data.teams || []);
                setTags(result.data.tags || []);
                setCurrency(result.data.currency || []);
                setStage(result.data.stage || []);
                setLeadSource(result.data.lead_source || []);
            }
        };
        fetchFormData();
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
        setFormData(INITIAL_OPPORTUNITY_FORM_DATA);
        setValidationErrors({});
    };

    const handleBack = () => navigate(routes.opportunities.main);

    const handleCancel = () => {
        resetForm();
        setBackendErrors({});
        handleBack();
    };

    const handleSubmit = async () => {
        setBackendErrors({});

        const errors = validateOpportunityForm(formData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const result = await create(formData);

        if (result.success) {
            resetForm();
            navigate(routes.opportunities.main);
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
        { type: 'back', label: 'Back To Opportunities', onClick: handleBack },
        { type: 'cancel', onClick: handleCancel, disabled: isLoading },
        {
            type: 'save',
            label: 'Create Opportunity',
            onClick: handleSubmit,
            loading: isLoading,
            disabled: !canSubmit,
        },
    ];

    return (
        <Box>
            <IModernAppBar module="Opportunities" crntPage="Create Opportunity" actions={actions} />

            <ILoadingBackdrop open={isLoading} message="Creating opportunity..." />

            <IForm
                config={formConfig}
                formData={formData}
                errors={allErrors}
                onAutocompleteChange={handleAutocompleteChange}
                onChange={handleChange}
                disabled={isLoading}
            />
        </Box>
    );
}
