import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { IForm, FormErrors } from '../../components/ui/form';
import { getAddUserFormConfig } from '../../configs/users/addUserFormConfig';
import { useUserFormData, UserFormData } from '../../hooks/users/useUserFormData';
import { useUserValidation } from '../../hooks/users/useUserValidation';
import { useUserApi } from '../../hooks/users/useUserApi';
import { useFormState } from '../../hooks/common/useFormState';
import { UsersLoadingBackdrop } from '../../components/users/UsersLoadingBackdrop';
import { ModernAppBar, AppBarAction } from '../../components/ui/ModernAppBar';
import { useNotification } from '../../context/NotificationContext';
import { routes } from '../../constants/routes';

const INITIAL_FORM_DATA: UserFormData = {
    email: '',
    first_name: '',
    last_name: '',
    role: 'ADMIN',
    address_line: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: '',
};

export function AddUsers() {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { formData, handleChange, resetForm } = useUserFormData(INITIAL_FORM_DATA);
    const { validationErrors, validateForm } = useUserValidation();
    const { createUser, isLoading } = useUserApi();
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});

    const { canSubmit } = useFormState({
        formConfig: getAddUserFormConfig(),
        formData,
        isSubmitting: isLoading,
    });

    const handleBack = () => navigate(routes.users.main);

    const handleCancel = () => {
        resetForm();
        setBackendErrors({});
        navigate(-1);
    };

    const handleSubmit = async () => {
        setBackendErrors({});

        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) {
            addNotification('warning', 'Validation Error', 'Please fix the form errors');
            return;
        }

        const result = await createUser(formData);

        if (result.success) {
            addNotification('success', 'User created successfully!', 'Invitation email has been sent');
            resetForm();
            navigate(routes.users.main);
        } else {
            if (result.fieldErrors) {
                setBackendErrors(result.fieldErrors);
            }
            if (result.error) {
                addNotification('error', 'Failed to create user', result.error);
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
        <Box sx={{ mt: '60px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <ModernAppBar module="Users" crntPage="Create User" actions={actions} />

            <UsersLoadingBackdrop open={isLoading} />

            <Box sx={{ mt: '120px', p: '24px', maxWidth: '1400px', mx: 'auto' }}>
                <IForm
                    config={getAddUserFormConfig()}
                    formData={formData}
                    errors={allErrors}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </Box>
        </Box>
    );
}
