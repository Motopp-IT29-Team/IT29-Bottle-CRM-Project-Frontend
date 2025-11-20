import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { UserUrl } from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';
import { ModernAppBar, AppBarAction } from '../../components/ModernAppBar';
import { EditUserInfoSection } from '../../components/users/edit/EditUserInfoSection';
import { EditUserAddressSection } from '../../components/users/edit/EditUserAddressSection';

interface FormErrors {
    email?: string[];
    password?: string[];
    role?: string[];
    address_line?: string[];
    street?: string[];
    city?: string[];
    state?: string[];
    pincode?: string[];
    country?: string[];
}

interface FormData {
    email: string;
    role: string;
    address_line: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export function EditUser() {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('id');
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [password, setPassword] = useState('');
    const [formData, setFormData] = useState<FormData>({
        email: '',
        role: 'ADMIN',
        address_line: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        country: '',
    });
    const [initialData, setInitialData] = useState<FormData | null>(null);

    useEffect(() => {
        if (userId) {
            getUserData();
        } else {
            navigate('/app/users');
        }
    }, [userId]);

    const getAuthHeaders = () => ({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Token'),
        org: localStorage.getItem('org'),
    });

    const getUserData = async () => {
        setLoading(true);
        try {
            const res = await fetchData(`${UserUrl}/${userId}/`, 'GET', null as any, getAuthHeaders());
            if (!res.error) {
                const data = res?.data?.profile_obj;
                const userData = {
                    email: data?.user_details?.email || '',
                    role: data?.role || 'ADMIN',
                    address_line: data?.address?.address_line || '',
                    street: data?.address?.street || '',
                    city: data?.address?.city || '',
                    state: data?.address?.state || '',
                    pincode: data?.address?.postcode || '',
                    country: data?.address?.country || '',
                };
                setFormData(userData);
                setInitialData(userData);
            } else {
                setError(true);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (formErrors[name as keyof FormErrors]) {
            setFormErrors({ ...formErrors, [name]: undefined });
        }
    };

    const handleBack = () => {
        navigate('/app/users');
    };

    const handleSubmit = async () => {
        const data = {
            ...formData,
            ...(password && password.trim().length > 0 ? { password: password.trim() } : {}),
        };

        setIsSubmitting(true);
        try {
            const res = await fetchData(`${UserUrl}/${userId}/`, 'PUT', JSON.stringify(data), getAuthHeaders());

            if (!res.error) {
                navigate('/app/users');
            } else {
                const allErrors = {
                    ...res?.errors?.profile_errors,
                    ...res?.errors?.user_errors,
                    ...res?.errors?.address_errors,
                };
                setFormErrors(allErrors);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (initialData) {
            setFormData(initialData);
            setPassword('');
            setFormErrors({});
        }
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
        { type: 'save', onClick: handleSubmit, loading: isSubmitting },
    ];

    return (
        <Box sx={{ mt: '60px', backgroundColor: '#f9fafb' }}>
            <ModernAppBar module="Users" crntPage="Edit User" actions={actions} />

            <Box sx={{ mt: '120px', p: '24px', maxWidth: '1400px', mx: 'auto' }}>
                <EditUserInfoSection
                    formData={{ email: formData.email, role: formData.role }}
                    password={password}
                    onChange={handleChange}
                    onPasswordChange={setPassword}
                    errors={{
                        email: formErrors.email,
                        role: formErrors.role,
                        password: formErrors.password,
                    }}
                />

                <EditUserAddressSection
                    formData={{
                        address_line: formData.address_line,
                        street: formData.street,
                        city: formData.city,
                        state: formData.state,
                        pincode: formData.pincode,
                        country: formData.country,
                    }}
                    onChange={handleChange}
                    errors={{
                        address_line: formErrors.address_line,
                        street: formErrors.street,
                        city: formErrors.city,
                        state: formErrors.state,
                        pincode: formErrors.pincode,
                        country: formErrors.country,
                    }}
                />
            </Box>
        </Box>
    );
}
