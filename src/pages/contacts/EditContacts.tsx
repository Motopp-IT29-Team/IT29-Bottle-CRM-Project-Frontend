import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ModernAppBar, AppBarAction, IForm, FormErrors } from '../../components/ui';
import { useContacts, ContactFormData, validateContactForm } from '../../api';
import { routes } from '../../constants/routes';
import { useFormState } from '../../hooks/useFormState';
import { getContactConfig } from '../../api/configs/contact.config';

export function EditContact() {
    const [searchParams] = useSearchParams();
    const contactId = searchParams.get('id');
    const navigate = useNavigate();
    const { getById, update, isLoading: isSubmitting } = useContacts();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [backendErrors, setBackendErrors] = useState<FormErrors>({});
    const [initialFormData, setInitialFormData] = useState<ContactFormData | null>(null);
    const [formData, setFormData] = useState<ContactFormData | null>(null);

    const { canSubmit } = useFormState({
        formConfig: getContactConfig(),
        formData: formData || ({} as ContactFormData),
        initialData: initialFormData,
        isSubmitting,
    });

    useEffect(() => {
        if (contactId) {
            fetchContactData();
        } else {
            navigate(routes.contacts.main);
        }
    }, [contactId]);

    const fetchContactData = async () => {
        if (!contactId) return;

        setLoading(true);
        const result = await getById(contactId);

        if (result.success && result.data) {
            const contact = result.data;
            const loadedData: ContactFormData = {
                salutation: contact.salutation || '',
                first_name: contact.first_name || '',
                last_name: contact.last_name || '',
                primary_email: contact.primary_email || '',
                secondary_email: contact.secondary_email || '',
                mobile_number: contact.mobile_number || '',
                secondary_number: contact.secondary_number || '',
                organization: contact.organization || '',
                title: contact.title || '',
                language: contact.language || '',
                do_not_call: contact.do_not_call || false,
                department: contact.department || '',
                address_line: contact.address.address_line || '',
                street: contact.address.street || '',
                city: contact.address.city || '',
                state: contact.address.state || '',
                country: contact.address.country || '',
                postcode: contact.address.postcode || '',
                description: contact.description || '',
                linked_in_url: contact.linked_in_url || '',
                facebook_url: contact.facebook_url || '',
                twitter_username: contact.twitter_username || '',
            };
            setFormData(loadedData);
            setInitialFormData(loadedData);
        } else {
            setError(true);
        }
        setLoading(false);
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
    ) => {
        const { name, value } = e.target;
        const type = 'type' in e.target ? e.target.type : undefined;

        if (!formData) return;

        if (type === 'checkbox') {
            const checked = 'checked' in e.target ? e.target.checked : false;
            setFormData((prev) => ({
                ...prev!,
                [name]: checked,
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

    const handleBack = () => {
        navigate(`${routes.contacts.details}?id=${contactId}`);
    };

    const handleCancel = () => {
        fetchContactData();
        setBackendErrors({});
        setValidationErrors({});
        navigate(-1);
    };

    const handleSubmit = async () => {
        if (!contactId || !formData) return;

        setBackendErrors({});

        const errors = validateContactForm(formData);
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        const result = await update(contactId, formData);

        if (result.success) {
            navigate(`${routes.contacts.details}?id=${contactId}`);
        } else {
            if (result.fieldErrors) {
                setBackendErrors(result.fieldErrors);
            }
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <CircularProgress size={40} sx={{ color: '#667eea' }} />
                <Typography sx={{ color: '#6b7280', fontSize: '14px', fontWeight: 500 }}>
                    Loading contact data...
                </Typography>
            </Box>
        );
    }

    if (error || !formData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography sx={{ color: '#ef4444', fontSize: '16px', fontWeight: 500 }}>
                    Error loading contact data. Please try again.
                </Typography>
            </Box>
        );
    }

    const allErrors: FormErrors = Object.keys(validationErrors).reduce(
        (acc, key) => {
            const error = validationErrors[key];
            acc[key] = error ? [error] : undefined;
            return acc;
        },
        { ...backendErrors } as FormErrors
    );

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Contact Details', onClick: handleBack },
        { type: 'cancel', onClick: handleCancel, disabled: isSubmitting },
        { type: 'save', onClick: handleSubmit, loading: isSubmitting, disabled: !canSubmit },
    ];

    return (
        <Box sx={{ mt: '60px', backgroundColor: '#f9fafb' }}>
            <ModernAppBar module="Contacts" crntPage="Edit Contact" actions={actions} />

            <Box sx={{ mt: '120px', p: '24px', maxWidth: '1400px', mx: 'auto' }}>
                <IForm
                    config={getContactConfig()}
                    formData={formData}
                    errors={allErrors}
                    onChange={handleChange}
                    disabled={isSubmitting}
                />
            </Box>
        </Box>
    );
}
