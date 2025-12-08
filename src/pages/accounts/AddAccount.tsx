import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { IModernAppBar, AppBarAction, ILoadingBackdrop, IForm, FormErrors } from '../../components/ui';
import { routes } from '../../constants/routes';
import { useAccounts, AccountFormData, validateAccountForm, getAccountConfig, useForm } from '../../api';

const INITIAL_ACCOUNT_FORM_DATA: AccountFormData = {
    name: '',
    phone: '',
    email: '',
    billing_address_line: '',
    billing_street: '',
    billing_city: '',
    billing_state: '',
    billing_postcode: '',
    billing_country: '',
    website: '',
    industry: '',
    description: '',
    status: 'open',
    lead: '',
    contact_name: '',
    contacts: [],
    teams: [],
    assigned_to: [],
    tags: [],
    account_attachment: null,
};

export function AddAccount() {
    const navigate = useNavigate();
    const { getAll: getAllAccounts, create, isLoading } = useAccounts();

    const [formData, setFormData] = useState<AccountFormData>(INITIAL_ACCOUNT_FORM_DATA);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});

    const [contacts, setContacts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [industries, setIndustries] = useState<any[]>([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [status, setStatus] = useState<any[]>([]);

    const formConfig = getAccountConfig({
        contacts,
        users,
        teams,
        tags,
        leads,
        industries,
        countries,
        status,
    });

    const { canSubmit } = useForm({
        formConfig,
        formData,
        isSubmitting: isLoading,
    });

    useEffect(() => {
        const fetchFormData = async () => {
            const result = await getAllAccounts({ limit: 1 });
            if (result.success && result.data) {
                setContacts(result.data.contacts || []);
                setUsers(result.data.users || []);
                setTeams(result.data.teams || []);
                setTags(result.data.tags || []);
                setLeads(result.data.leads || []);
                setIndustries(result.data.industries || []);
                setCountries(result.data.countries || []);
                setStatus(result.data.status || []);
            }
        };
        fetchFormData();
    }, []);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

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
        setFormData(INITIAL_ACCOUNT_FORM_DATA);
        setValidationErrors({});
    };

    const handleBack = () => navigate(routes.accounts.main);

    const handleCancel = () => {
        resetForm();
        setBackendErrors({});
        handleBack();
    };

    const handleSubmit = async () => {
        setBackendErrors({});

        const errors = validateAccountForm(formData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const result = await create(formData);

        if (result.success) {
            resetForm();
            navigate(routes.accounts.main);
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
        { type: 'back', label: 'Back To Accounts', onClick: handleBack },
        { type: 'cancel', onClick: handleCancel, disabled: isLoading },
        {
            type: 'save',
            label: 'Create Account',
            onClick: handleSubmit,
            loading: isLoading,
            disabled: !canSubmit,
        },
    ];

    return (
        <Box>
            <IModernAppBar module="Accounts" crntPage="Create Account" actions={actions} />

            <ILoadingBackdrop open={isLoading} message="Creating account..." />

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
