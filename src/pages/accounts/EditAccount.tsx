import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { IModernAppBar, AppBarAction, ILoadingBackdrop, IForm, FormErrors } from '../../components/ui';
import { routes } from '../../constants/routes';
import { useAccounts, AccountFormData, validateAccountForm, getAccountConfig, useForm } from '../../api';

export function EditAccount() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const accountId = searchParams.get('id');
    const { getAll: getAllAccounts, getById, update, isLoading } = useAccounts();

    const [formData, setFormData] = useState<AccountFormData | null>(null);
    const [initialData, setInitialData] = useState<AccountFormData | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [contacts, setContacts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [industries, setIndustries] = useState<any[]>([]);
    const [countries, setCountries] = useState<any[]>([]);
    const [status, setStatus] = useState<any[]>([]);

    const formConfig = formData
        ? getAccountConfig({
              contacts,
              users,
              // teams,
              // tags,
              leads,
              industries,
              countries,
              status,
          })
        : null;

    const { canSubmit } = useForm({
        formConfig: formConfig || { sections: [] },
        formData: formData || {},
        isSubmitting: isLoading,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!accountId) {
                navigate(routes.accounts.main);
                return;
            }

            setIsLoadingData(true);

            // Fetch dropdown options
            const optionsResult = await getAllAccounts({ limit: 1 });
            if (optionsResult.success && optionsResult.data) {
                setContacts(optionsResult.data.contacts || []);
                setUsers(optionsResult.data.users || []);
                setLeads(optionsResult.data.leads || []);
                setIndustries(optionsResult.data.industries || []);
                setCountries(optionsResult.data.countries || []);
                setStatus(optionsResult.data.status || []);
            }

            // Fetch account data
            const result = await getById(accountId);
            if (result.success && result.data) {
                const account = result.data.account;

                const data: AccountFormData = {
                    name: account.name || '',
                    phone: account.phone || '',
                    email: account.email || '',
                    billing_address_line: account.billing_address_line || '',
                    billing_street: account.billing_street || '',
                    billing_city: account.billing_city || '',
                    billing_state: account.billing_state || '',
                    billing_postcode: account.billing_postcode || '',
                    billing_country: account.billing_country || '',
                    website: account.website || '',
                    industry: account.industry || '',
                    description: account.description || '',
                    status: account.status || ('open' as any),
                    lead: account.lead?.id || '',
                    contact_name: account.contact_name || '',
                    contacts: account.contacts?.map((c: any) => c.id) || [],
                    assigned_to: account.assigned_to?.map((u: any) => u.id) || [],
                };
                setFormData(data);
                setInitialData(data);
            } else {
                navigate(routes.accounts.main);
            }

            setIsLoadingData(false);
        };

        fetchData();
    }, [accountId]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
    ) => {
        if (!formData) return;

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev!,
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
        if (!formData) return;

        setFormData((prev) => ({
            ...prev!,
            [name]: value,
        }));
    };

    const handleBack = () => {
        if (accountId) {
            navigate(routes.accounts.details + `?id=${accountId}`);
        } else {
            navigate(routes.accounts.main);
        }
    };

    const handleCancel = () => {
        if (initialData) {
            setFormData({ ...initialData });
            setValidationErrors({});
            setBackendErrors({});
        }
    };

    const handleSubmit = async () => {
        if (!formData || !accountId) return;

        setBackendErrors({});

        const errors = validateAccountForm(formData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const result = await update(accountId, formData);

        if (result.success) {
            if (accountId) {
                navigate(routes.accounts.details + `?id=${accountId}`);
            } else {
                navigate(routes.accounts.main);
            }
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
        {
            type: 'back',
            label: accountId ? 'Back To Details' : 'Back To Accounts',
            onClick: handleBack,
        },
        { type: 'cancel', onClick: handleCancel, disabled: isLoading || isLoadingData },
        {
            type: 'save',
            label: 'Save Changes',
            onClick: handleSubmit,
            loading: isLoading,
            disabled: !canSubmit || isLoadingData,
        },
    ];

    if (isLoadingData || !formData) {
        return (
            <Box>
                <IModernAppBar module="Accounts" crntPage="Edit Account" actions={actions} />
                <Box
                    sx={{
                        mt: '120px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '400px',
                    }}
                >
                    <CircularProgress />
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <IModernAppBar module="Accounts" crntPage="Edit Account" actions={actions} />

            <ILoadingBackdrop open={isLoading} message="Saving changes..." />

            <IForm
                config={formConfig!}
                formData={formData}
                errors={allErrors}
                onAutocompleteChange={handleAutocompleteChange}
                onChange={handleChange}
                disabled={isLoading}
            />
        </Box>
    );
}
