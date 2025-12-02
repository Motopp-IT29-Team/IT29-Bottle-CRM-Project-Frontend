import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { IForm, FormErrors } from '../../components/ui/form';
import { useUsers, UserFormData, validateUserForm, getUserConfig } from '../../api';
import { useFormState } from '../../hooks/useFormState';
import { LoadingBackdrop, ModernAppBar, AppBarAction } from '../../components/ui';
import { routes } from '../../constants/routes';

const INITIAL_FORM_DATA: UserFormData = {
    first_name: '',
    last_name: '',
    role: 'ADMIN',
    date_of_joining: '',
    address_line: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
    email: '',
};

export function AddUsers() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<UserFormData>(INITIAL_FORM_DATA);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const { create, isLoading } = useUsers();
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});

    const { canSubmit } = useFormState({
        formConfig: getUserConfig(),
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

    const handleBack = () => navigate(routes.users.main);

    const handleCancel = () => {
        resetForm();
        setBackendErrors({});
        navigate(-1);
    };

    const handleSubmit = async () => {
        setBackendErrors({});

        const errors = validateUserForm(formData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const result = await create(formData);

        if (result.success) {
            resetForm();
            navigate(routes.users.main);
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
        { type: 'back', label: 'Back To Users', onClick: handleBack },
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
        <Box sx={{ mt: '60px', backgroundColor: '#f9fafb' }}>
            <ModernAppBar module="Users" crntPage="Create User" actions={actions} />

            <LoadingBackdrop open={isLoading} />

            <Box sx={{ mt: '120px', p: '24px', maxWidth: '1400px', mx: 'auto' }}>
                <IForm
                    config={getUserConfig()}
                    formData={formData}
                    errors={allErrors}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </Box>
        </Box>
    );
}
