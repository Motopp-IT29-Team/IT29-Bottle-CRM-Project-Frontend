import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { validateCaseForm, getCaseConfig, CaseFormData, useCases } from '../../api';
import { useForm } from '../../api/hooks/useForm';
import { ILoadingBackdrop, IModernAppBar, AppBarAction, IForm, FormErrors } from '../../components/ui';
import { routes } from '../../constants/routes';

const INITIAL_FORM_DATA: CaseFormData = {
    name: '',
    account: '',
    status: '',
    priority: '',
    case_type: '',
    closed_on: '',
    description: '',
    contacts: [],
    assigned_to: [],
    teams: [],
};

export function AddCase() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CaseFormData>(INITIAL_FORM_DATA);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const { create, isLoading, getAll } = useCases();
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});

    // Dropdown data
    const [accounts, setAccounts] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [statusOptions, setStatusOptions] = useState<Array<[string, string]>>([]);
    const [priorityOptions, setPriorityOptions] = useState<Array<[string, string]>>([]);
    const [caseTypeOptions, setCaseTypeOptions] = useState<Array<[string, string]>>([]);

    // Load dropdown data
    useEffect(() => {
        const loadData = async () => {
            const result = await getAll({ limit: 1 }); // Fetch to get dropdown data
            if (result.success && result.data) {
                setAccounts(result.data.accounts_list || []);
                setContacts(result.data.contacts_list || []);
                setStatusOptions(result.data.status || []);
                setPriorityOptions(result.data.priority || []);
                setCaseTypeOptions(result.data.type_of_case || []);
                // TODO: Get users and teams from separate endpoints if needed
            }
        };
        loadData();
    }, []);

    const { canSubmit } = useForm({
        formConfig: getCaseConfig({
            accounts,
            contacts,
            users,
            teams,
            status: statusOptions,
            priority: priorityOptions,
            case_type: caseTypeOptions,
        }),
        formData,
        isSubmitting: isLoading,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (validationErrors[name]) {
            setValidationErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setValidationErrors({});
    };

    const handleBack = () => navigate(routes.cases.main);

    const handleCancel = () => {
        resetForm();
        setBackendErrors({});
        navigate(-1);
    };

    const handleSubmit = async () => {
        setBackendErrors({});

        const errors = validateCaseForm(formData);
        if (Object.keys(errors).length > 0) {
            // setValidationErrors(errors);
            return;
        }

        const result = await create(formData);

        if (result.success) {
            resetForm();
            navigate(routes.cases.main);
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
        { type: 'back', label: 'Back To Cases', onClick: handleBack },
        { type: 'cancel', onClick: handleCancel, disabled: isLoading },
        {
            type: 'save',
            label: 'Create',
            onClick: handleSubmit,
            loading: isLoading,
            disabled: !canSubmit,
        },
    ];

    return (
        <Box>
            <IModernAppBar module="Cases" crntPage="Create Case" actions={actions} />

            <ILoadingBackdrop open={isLoading} message="Creating case..." />

            <IForm
                config={getCaseConfig({
                    accounts,
                    contacts,
                    users,
                    teams,
                    status: statusOptions,
                    priority: priorityOptions,
                    case_type: caseTypeOptions,
                })}
                formData={formData}
                errors={allErrors}
                onChange={handleChange}
                disabled={isLoading}
            />
        </Box>
    );
}
