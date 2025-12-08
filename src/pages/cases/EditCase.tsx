import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useForm } from '../../api/hooks/useForm';
import { ILoadingBackdrop, IModernAppBar, AppBarAction, IForm, FormErrors } from '../../components/ui';
import { routes } from '../../constants/routes';
import { CaseFormData, getCaseConfig, useCases, validateCaseForm } from '../../api';

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

export function EditCase() {
    const navigate = useNavigate();
    const location = useLocation();
    const { getById, update, isLoading, getAll } = useCases();

    const caseId = location.state?.caseId;
    const fromDetails = location.state?.fromDetails;

    const [formData, setFormData] = useState<CaseFormData>(INITIAL_FORM_DATA);
    const [initialData, setInitialData] = useState<CaseFormData>(INITIAL_FORM_DATA);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});
    const [loadingData, setLoadingData] = useState(true);

    // Dropdown data
    const [accounts, setAccounts] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [statusOptions, setStatusOptions] = useState<Array<[string, string]>>([]);
    const [priorityOptions, setPriorityOptions] = useState<Array<[string, string]>>([]);
    const [caseTypeOptions, setCaseTypeOptions] = useState<Array<[string, string]>>([]);

    // Load case data and dropdown options
    useEffect(() => {
        if (!caseId) {
            navigate(routes.cases.main);
            return;
        }

        const loadData = async () => {
            setLoadingData(true);

            // Load dropdown data
            const dropdownResult = await getAll({ limit: 1 });
            if (dropdownResult.success && dropdownResult.data) {
                setAccounts(dropdownResult.data.accounts_list || []);
                setContacts(dropdownResult.data.contacts_list || []);
                setStatusOptions(dropdownResult.data.status || []);
                setPriorityOptions(dropdownResult.data.priority || []);
                setCaseTypeOptions(dropdownResult.data.type_of_case || []);
            }

            // Load case data
            const result = await getById(caseId);

            if (result.success && result.data) {
                // const caseData = result.data.cases_obj;
                // const data: CaseFormData = {
                //     name: caseData.name || '',
                //     account: caseData.account?.id || '',
                //     status: caseData.status || '',
                //     priority: caseData.priority || '',
                //     case_type: caseData.case_type || '',
                //     closed_on: caseData.closed_on || '',
                //     description: caseData.description || '',
                //     contacts: caseData.contacts?.map((c: any) => c.id) || [],
                //     assigned_to: caseData.assigned_to?.map((u: any) => u.id) || [],
                //     teams: caseData.teams?.map((t: any) => t.id) || [],
                // };
                // setFormData(data);
                // setInitialData(data);
            } else {
                navigate(routes.cases.main);
            }

            setLoadingData(false);
        };

        loadData();
    }, [caseId]);

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

    const handleBack = () => {
        if (fromDetails) {
            navigate(routes.cases.details, {
                state: { caseId, detail: true },
            });
        } else {
            navigate(routes.cases.main);
        }
    };

    const handleCancel = () => {
        setFormData(initialData);
        setValidationErrors({});
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

        const result = await update(caseId, formData);

        if (result.success) {
            if (fromDetails) {
                navigate(routes.cases.details, {
                    state: { caseId, detail: true },
                });
            } else {
                navigate(routes.cases.main);
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
        { type: 'back', label: 'Back To Cases', onClick: handleBack },
        { type: 'cancel', onClick: handleCancel, disabled: isLoading },
        {
            type: 'save',
            label: 'Update',
            onClick: handleSubmit,
            loading: isLoading,
            disabled: !canSubmit,
        },
    ];

    if (loadingData) {
        return (
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
        );
    }

    return (
        <Box>
            <IModernAppBar module="Cases" crntPage="Edit Case" actions={actions} />

            <ILoadingBackdrop open={isLoading} message="Updating case..." />

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
