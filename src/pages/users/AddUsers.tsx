import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { useUserFormData, UserFormData } from '../../hooks/user/useUserFormData';
import { useUserValidation } from '../../hooks/user/useUserValidation';
import { useSubmitUser } from '../../hooks/user/useSubmitUser';
import { UsersLoadingBackdrop } from '../../components/users/create/UsersLoadingBackdrop';
import { UsersInfoSection } from '../../components/users/create/UsersInfoSection';
import { UsersAddressSection } from '../../components/users/create/UsersAddressSection';
import { ModernAppBar, AppBarAction } from '../../components/ModernAppBar';
import { useNotification } from '../../context/NotificationContext';
import '../../styles/style.css';

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
    const [isLoading, setIsLoading] = useState(false);
    const [backendErrors, setBackendErrors] = useState<Record<string, string[]>>({});

    const { formData, handleChange, resetForm } = useUserFormData(INITIAL_FORM_DATA);
    const { validationErrors, validateForm } = useUserValidation();
    const { submitForm } = useSubmitUser(resetForm);
    const { addNotification } = useNotification();

    const handleBack = () => navigate('/app/users');

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

        setIsLoading(true);
        try {
            const result = await submitForm(formData);

            if (result.success) {
                addNotification('success', 'User created successfully!', 'Invitation email has been sent');
                navigate('/app/users');
            } else {
                if (result.fieldErrors) {
                    setBackendErrors(result.fieldErrors);
                }
                addNotification('error', 'Failed to create user', result.error);
            }
        } catch (error: any) {
            addNotification('error', 'Error', error.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const allErrors = { ...validationErrors, ...backendErrors };

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Users', onClick: handleBack },
        { type: 'cancel', onClick: handleCancel, disabled: isLoading },
        { type: 'save', label: 'Create', onClick: handleSubmit, loading: isLoading },
    ];

    return (
        <Box sx={{ mt: '60px' }}>
            <ModernAppBar module="Users" crntPage="Create User" actions={actions} />

            <UsersLoadingBackdrop open={isLoading} />

            <Box sx={{ mt: '120px' }}>
                <div style={{ padding: '10px' }}>
                    <UsersInfoSection
                        email={formData.email}
                        first_name={formData.first_name}
                        last_name={formData.last_name}
                        role={formData.role}
                        onChange={handleChange}
                        errors={allErrors}
                        disabled={isLoading}
                    />

                    <UsersAddressSection
                        address={{
                            address_line: formData.address_line,
                            street: formData.street,
                            city: formData.city,
                            state: formData.state,
                            postcode: formData.postcode,
                            country: formData.country,
                        }}
                        onChange={handleChange}
                        errors={allErrors}
                        disabled={isLoading}
                    />
                </div>
            </Box>
        </Box>
    );
}
