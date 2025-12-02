import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { IForm, FormErrors } from '../../components/ui/form';
import { ModernAppBar, AppBarAction } from '../../components/ui';
import { useContacts, ContactFormData, validateContactForm } from '../../api';
import { useFormState } from '../../hooks/useFormState';
import { getContactConfig } from '../../api/configs/contact.config';
import { routes } from '../../constants/routes';

const INITIAL_FORM_DATA: ContactFormData = {
    salutation: '',
    first_name: '',
    last_name: '',
    primary_email: '',
    secondary_email: '',
    mobile_number: '',
    secondary_number: '',
    organization: '',
    title: '',
    language: '',
    do_not_call: false,
    department: '',
    address_line: '',
    street: '',
    city: '',
    state: '',
    country: '',
    postcode: '',
    description: '',
    linked_in_url: '',
    facebook_url: '',
    twitter_username: '',
};

export function AddContacts() {
    const navigate = useNavigate();
    const { create, isLoading } = useContacts();

    const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});

    const formConfig = getContactConfig();

    const { canSubmit } = useFormState({
        formConfig,
        formData,
        isSubmitting: isLoading,
    });

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
    ) => {
        const { name, value } = e.target;
        const type = 'type' in e.target ? e.target.type : undefined;

        if (type === 'checkbox') {
            const checked = 'checked' in e.target ? e.target.checked : false;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
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

    const resetForm = () => {
        setFormData(INITIAL_FORM_DATA);
        setValidationErrors({});
    };

    const handleBack = () => {
        navigate(routes.contacts.main);
    };

    const handleCancel = () => {
        resetForm();
        setBackendErrors({});
        handleBack();
    };

    const handleSubmit = async () => {
        setBackendErrors({});

        const errors = validateContactForm(formData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const result = await create(formData);

        if (result.success) {
            resetForm();
            navigate(routes.contacts.main);
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
        { type: 'back', label: 'Back To Contacts', onClick: handleBack },
        { type: 'cancel', onClick: handleCancel, disabled: isLoading },
        {
            type: 'save',
            label: 'Create Contact',
            onClick: handleSubmit,
            loading: isLoading,
            disabled: !canSubmit,
        },
    ];

    return (
        <Box sx={{ mt: '60px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <ModernAppBar module="Contacts" crntPage="Create Contact" actions={actions} />

            <Box sx={{ mt: '120px', p: '24px', maxWidth: '1400px', mx: 'auto' }}>
                <IForm
                    config={formConfig}
                    formData={formData}
                    errors={allErrors}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </Box>
        </Box>
    );
}
