import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useForm } from '../../api/hooks/useForm';
import { ILoadingBackdrop, IModernAppBar, AppBarAction, IForm, FormErrors } from '../../components/ui';
import { routes } from '../../constants/routes';
import { CompanyFormData, getCompanyConfig, useCompanies, validateCompanyForm } from '../../api';

const INITIAL_FORM_DATA: CompanyFormData = {
    name: '',
};

export function AddCompany() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CompanyFormData>(INITIAL_FORM_DATA);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const { create, isLoading } = useCompanies();
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});

    const { canSubmit } = useForm({
        formConfig: getCompanyConfig(),
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

    const handleBack = () => navigate(routes.companies.main);

    const handleCancel = () => {
        resetForm();
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

        const result = await create(formData);

        if (result.success) {
            resetForm();
            navigate(routes.companies.main);
        } else {
            // if (result.fieldErrors) {
            //     setBackendErrors(result.fieldErrors);
            // }
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
            label: 'Create',
            onClick: handleSubmit,
            loading: isLoading,
            disabled: !canSubmit,
        },
    ];

    return (
        <Box>
            <IModernAppBar module="Companies" crntPage="Create Company" actions={actions} />

            <ILoadingBackdrop open={isLoading} message="Creating company..." />

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
