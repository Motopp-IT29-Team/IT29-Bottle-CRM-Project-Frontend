import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ModernAppBar, AppBarAction } from '../../components/ui/ModernAppBar';
import { useNotification } from '../../context/NotificationContext';
import { fetchData } from '../../components/FetchData';
import { ProfileUrl } from '../../services/ApiUrls';
import { FormErrors, IForm } from '../../components/ui/form';
import { getEditUserFormConfig } from '../../configs/users/editUserFormConfig';
import { useUserApi } from '../../hooks/users/useUserApi';
import { useFormState } from '../../hooks/common/useFormState';
import { hasFormChanges } from '../../utils/form/formHelpers';
import { routes } from '../../constants/routes';

interface FormData {
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    password: string;
    is_active: boolean;
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
}

export function EditUser() {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('id');
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { getUser, updateUser, toggleUserStatus, isLoading: isSubmitting } = useUserApi();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
    const [initialFormData, setInitialFormData] = useState<FormData | null>(null);
    const [formData, setFormData] = useState<FormData>({
        email: '',
        first_name: '',
        last_name: '',
        role: 'ADMIN',
        password: '',
        is_active: true,
        address_line: '',
        street: '',
        city: '',
        state: '',
        postcode: '',
        country: '',
    });

    const isCurrentUser = formData.email === currentUserEmail;
    const formConfig = getEditUserFormConfig(isCurrentUser);

    const { canSubmit } = useFormState({
        formConfig,
        formData,
        initialData: initialFormData,
        isSubmitting,
        customValidation: (data) => {
            const hasPasswordChange = data.password?.trim() !== '';
            const hasDataChanges = hasFormChanges(data, initialFormData, [
                'email',
                'first_name',
                'last_name',
                'role',
                'address_line',
                'street',
                'city',
                'state',
                'postcode',
                'country',
            ]);

            return hasDataChanges || hasPasswordChange;
        },
    });

    useEffect(() => {
        if (userId) {
            fetchUserData();
            fetchCurrentUser();
        } else {
            navigate(routes.users.main);
        }
    }, [userId, navigate]);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetchData(`${ProfileUrl}/`, 'GET', null as any, {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('Token'),
                org: localStorage.getItem('org'),
            });
            if (res?.user_obj?.user_details?.email) {
                setCurrentUserEmail(res.user_obj.user_details.email);
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    const fetchUserData = async () => {
        if (!userId) return;

        setLoading(true);
        const result = await getUser(userId);

        if (result.success && result.data) {
            const data = result.data;
            const loadedData = {
                email: data.user_details.email,
                first_name: data.first_name,
                last_name: data.last_name,
                role: data.role,
                password: '',
                is_active: data.is_active,
                address_line: data.address.address_line,
                street: data.address.street,
                city: data.address.city,
                state: data.address.state,
                postcode: data.address.postcode,
                country: data.address.country,
            };
            setFormData(loadedData);
            setInitialFormData(loadedData);
        } else {
            setError(true);
            if (result.error) {
                addNotification('error', 'Failed to load user', result.error);
            }
        }
        setLoading(false);
    };

    const handleChange = async (e: any) => {
        const { name, value } = e.target;

        if (name === 'is_active' && userId) {
            const newValue = value === true || value === 'true';
            setFormData({ ...formData, [name]: newValue });
            const result = await toggleUserStatus(userId);

            if (result.success) {
                addNotification('success', `User ${newValue ? 'activated' : 'deactivated'} successfully`);
            } else {
                setFormData({ ...formData, [name]: !newValue });
                addNotification('error', 'Failed to change user status', result.error);
            }
            return;
        }

        setFormData({ ...formData, [name]: value });

        if (formErrors[name]) {
            setFormErrors({ ...formErrors, [name]: undefined });
        }
    };

    const handleBack = () => {
        navigate(routes.users.main);
    };

    const handleSubmit = async () => {
        if (!userId) return;

        const { password, is_active, ...dataToSend } = formData;
        const dataWithPassword = password ? { ...formData, password: password.trim() } : { ...dataToSend, is_active };

        const result = await updateUser(userId, dataWithPassword);

        if (result.success) {
            addNotification('success', 'User updated successfully');
            navigate(routes.users.main);
        } else {
            if (result.fieldErrors) {
                setFormErrors(result.fieldErrors);
            }
            if (result.error) {
                addNotification('error', 'Failed to update user', result.error);
            }
        }
    };

    const handleCancel = () => {
        navigate(-1);
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
                    Loading user data...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography sx={{ color: '#ef4444', fontSize: '16px', fontWeight: 500 }}>
                    Error loading user data. Please try again.
                </Typography>
            </Box>
        );
    }

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Users', onClick: handleBack },
        { type: 'cancel', onClick: handleCancel, disabled: isSubmitting },
        { type: 'save', onClick: handleSubmit, loading: isSubmitting, disabled: !canSubmit },
    ];

    return (
        <Box sx={{ mt: '60px', backgroundColor: '#f9fafb' }}>
            <ModernAppBar module="Users" crntPage="Edit User" actions={actions} />

            <Box sx={{ mt: '120px', p: '24px', maxWidth: '1400px', mx: 'auto' }}>
                <IForm
                    config={formConfig}
                    formData={formData}
                    errors={formErrors}
                    onChange={handleChange}
                    disabled={isSubmitting}
                />
            </Box>
        </Box>
    );
}
