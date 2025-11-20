import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { CustomAppBar } from '../../components/CustomAppBar';
import { useUserFormData, UserFormData } from '../../hooks/user/useUserFormData';
import { useUserValidation } from '../../hooks/user/useUserValidation';
import { useSubmitUser } from '../../hooks/user/useSubmitUser';
import { ErrorAlert } from '../../components/ErrorAlert';
import { UsersLoadingBackdrop } from '../../components/users/create/UsersLoadingBackdrop';
import { UsersInfoSection } from '../../components/users/create/UsersInfoSection';
import { UsersAddressSection } from '../../components/users/create/UsersAddressSection';
import '../../styles/style.css';

const INITIAL_FORM_DATA: UserFormData = {
    email: '',
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
    const [errorMessage, setErrorMessage] = useState('');

    const { formData, handleChange, resetForm } = useUserFormData(INITIAL_FORM_DATA);
    const { validationErrors, validateForm } = useUserValidation();
    const { submitForm } = useSubmitUser(resetForm);

    const backBtnHandle = () => navigate('/app/users');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        const errors = validateForm(formData);
        if (Object.keys(errors).length > 0) return;

        setIsLoading(true);
        try {
            console.log(formData);
            const response = await submitForm(formData);
            if (response) {
                const message = typeof response === 'string' ? response : JSON.stringify(response);
                setErrorMessage(message);
            }
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to create user. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ mt: '60px' }}>
            <CustomAppBar
                backbtnHandle={backBtnHandle}
                module="Users"
                backBtn="Back To Users"
                crntPage="Add Users"
                onCancel={resetForm}
                onSubmit={handleSubmit}
            />

            <UsersLoadingBackdrop open={isLoading} />

            <Box sx={{ mt: '120px' }}>
                <form onSubmit={handleSubmit}>
                    <div style={{ padding: '10px' }}>
                        <ErrorAlert message={errorMessage} onClose={() => setErrorMessage('')} />

                        <UsersInfoSection
                            email={formData.email}
                            role={formData.role}
                            onChange={handleChange}
                            errors={validationErrors}
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
                            errors={validationErrors}
                            disabled={isLoading}
                        />
                    </div>
                </form>
            </Box>
        </Box>
    );
}
