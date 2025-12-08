import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ILoadingBackdrop, IModernAppBar, AppBarAction, IForm, FormErrors } from '../../components/ui';
import { routes } from '../../constants/routes';
import { CompanyFormData, getCompanyConfig, useCompanies, validateCompanyForm, useForm } from '../../api';

const INITIAL_FORM_DATA: CompanyFormData = {
    name: '',
};

export function EditCompany() {
    const navigate = useNavigate();
    const location = useLocation();
    const { getById, update, isLoading } = useCompanies();

    const companyId = location.state?.companyId;
    const fromDetails = location.state?.fromDetails;

    const [formData, setFormData] = useState<CompanyFormData>(INITIAL_FORM_DATA);
    const [initialData, setInitialData] = useState<CompanyFormData>(INITIAL_FORM_DATA);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});
    const [loadingData, setLoadingData] = useState(true);

    const { canSubmit } = useForm({
        formConfig: getCompanyConfig(),
        formData,
        isSubmitting: isLoading,
    });

    // Load company data
    useEffect(() => {
        if (!companyId) {
            navigate(routes.companies.main);
            return;
        }

        const loadData = async () => {
            setLoadingData(true);
            const result = await getById(companyId);

            if (result.success && result.data) {
                // const company = result.data.data;
                // const data: CompanyFormData = {
                //     name: company.name || '',
                // };
                //
                // setFormData(data);
                // setInitialData(data);
            } else {
                navigate(routes.companies.main);
            }

            setLoadingData(false);
        };

        loadData();
    }, [companyId]);

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
            navigate(routes.companies.details, {
                state: { companyId, detail: true },
            });
        } else {
            navigate(routes.companies.main);
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

        const errors = validateCompanyForm(formData);
        if (Object.keys(errors).length > 0) {
            // setValidationErrors(errors);
            return;
        }

        const result = await update(companyId, formData);

        if (result.success) {
            if (fromDetails) {
                navigate(routes.companies.details, {
                    state: { companyId, detail: true },
                });
            } else {
                navigate(routes.companies.main);
            }
        } else {
            if (result.fieldErrors) {
                // setBackendErrors(result.fieldErrors);
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
        { type: 'back', label: 'Back To Companies', onClick: handleBack },
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
            <IModernAppBar module="Companies" crntPage="Edit Company" actions={actions} />

            <ILoadingBackdrop open={isLoading} message="Updating company..." />

            <IForm
                config={getCompanyConfig()}
                formData={formData}
                errors={allErrors}
                onChange={handleChange}
                disabled={isLoading}
            />
        </Box>
    );
}
