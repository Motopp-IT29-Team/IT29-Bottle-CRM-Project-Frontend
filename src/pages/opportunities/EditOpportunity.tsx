import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { IModernAppBar, AppBarAction, ILoadingBackdrop, IForm, FormErrors } from '../../components/ui';
import { routes } from '../../constants/routes';
import {
    useOpportunities,
    OpportunityFormData,
    validateOpportunityForm,
    getOpportunityConfig,
    useForm,
} from '../../api';

export function EditOpportunity() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();
    const { getAll: getAllOpportunities, getById, update, isLoading } = useOpportunities();

    const [formData, setFormData] = useState<OpportunityFormData | null>(null);
    const [initialData, setInitialData] = useState<OpportunityFormData | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [accounts, setAccounts] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [currency, setCurrency] = useState<any[]>([]);
    const [stage, setStage] = useState<any[]>([]);
    const [leadSource, setLeadSource] = useState<any[]>([]);

    const formConfig = formData
        ? getOpportunityConfig({
              accounts,
              contacts,
              users,
              teams,
              tags,
              currency,
              stage,
              leadSource,
          })
        : null;

    const { canSubmit } = useForm({
        formConfig: formConfig || { sections: [] },
        formData: formData || {},
        isSubmitting: isLoading,
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                navigate(routes.opportunities.main);
                return;
            }

            setIsLoadingData(true);

            // Fetch dropdown options
            const optionsResult = await getAllOpportunities({ limit: 1 });
            if (optionsResult.success && optionsResult.data) {
                setAccounts(optionsResult.data.accounts_list || []);
                setContacts(optionsResult.data.contacts_list || []);
                // setUsers(optionsResult.data.users || []);
                // setTeams(optionsResult.data.teams || []);
                setTags(optionsResult.data.tags || []);
                setCurrency(optionsResult.data.currency || []);
                setStage(optionsResult.data.stage || []);
                setLeadSource(optionsResult.data.lead_source || []);
            }

            // Fetch opportunity data
            const result = await getById(id);
            if (result.success && result.data) {
                const opportunity = result.data.opportunity;

                const data: OpportunityFormData = {
                    name: opportunity.name || '',
                    account: opportunity.account?.id || '',
                    amount: opportunity.amount || '',
                    currency: opportunity.currency || 'USD',
                    stage: opportunity.stage || '',
                    probability: opportunity.probability || 50,
                    lead_source: opportunity.lead_source || '',
                    closed_on: opportunity.closed_on || '',
                    description: opportunity.description || '',
                    contacts: opportunity.contacts?.map((c: any) => c.id) || [],
                    assigned_to: opportunity.assigned_to?.map((u: any) => u.id) || [],
                    teams: opportunity.teams?.map((t: any) => t.id) || [],
                    tags: opportunity.tags?.map((tag: any) => tag.name || tag) || [],
                    attachments: null,
                };

                setFormData(data);
                setInitialData(data);
            } else {
                navigate(routes.opportunities.main);
            }

            setIsLoadingData(false);
        };

        fetchData();
    }, [id]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
    ) => {
        if (!formData) return;

        const { name, value } = e.target;
        const type = 'type' in e.target ? e.target.type : undefined;

        if (type === 'number') {
            setFormData((prev) => ({
                ...prev!,
                [name]: value === '' ? '' : Number(value),
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

    const handleAutocompleteChange = (name: string, value: any[]) => {
        if (!formData) return;

        setFormData((prev) => ({
            ...prev!,
            [name]: value,
        }));
    };

    const handleBack = () => {
        if (state?.fromDetails) {
            navigate(routes.opportunities.details, { state: { opportunityId: id } });
        } else {
            navigate(routes.opportunities.main);
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
        if (!formData || !id) return;

        setBackendErrors({});

        const errors = validateOpportunityForm(formData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const result = await update(id, formData);

        if (result.success) {
            if (state?.fromDetails) {
                navigate(routes.opportunities.details, { state: { opportunityId: id } });
            } else {
                navigate(routes.opportunities.main);
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
            label: state?.fromDetails ? 'Back To Details' : 'Back To Opportunities',
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
                <IModernAppBar module="Opportunities" crntPage="Edit Opportunity" actions={actions} />
                <Box
                    sx={{
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
            <IModernAppBar module="Opportunities" crntPage="Edit Opportunity" actions={actions} />

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
