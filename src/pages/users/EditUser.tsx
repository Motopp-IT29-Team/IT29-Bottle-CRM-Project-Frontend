import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { ModernAppBar, AppBarAction } from '../../components/ModernAppBar';
import { EditUserInfoSection } from '../../components/users/edit/EditUserInfoSection';
import { EditUserAddressSection } from '../../components/users/edit/EditUserAddressSection';
import { useEditUser } from '../../hooks/user/useEditUser';
import { useNotification } from '../../context/NotificationContext';
import { fetchData } from '../../components/FetchData';
import { ProfileUrl } from '../../services/ApiUrls';

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
    const { addNotification } = useNotification();
    const { getUserData, updateUser, toggleUserStatus, isSubmitting } = useEditUser();

    const [loading, setLoading] = useState(true);
    const [isTogglingStatus, setIsTogglingStatus] = useState(false);
    const [error, setError] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [password, setPassword] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
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

    useEffect(() => {
        if (userId) {
            fetchUserData();
            fetchCurrentUser();
        } else {
            navigate('/app/users');
        }
    }, [userId, navigate]);

    const getAuthHeaders = () => ({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Token'),
        org: localStorage.getItem('org'),
    });

    const fetchCurrentUser = async () => {
        try {
            const res = await fetchData(`${ProfileUrl}/`, 'GET', null as any, getAuthHeaders());
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
        const result = await getUserData(userId);

        if (result.success && result.data) {
            setFormData({
                email: result.data.email,
                role: result.data.role,
                address_line: result.data.address_line,
                street: result.data.street,
                city: result.data.city,
                state: result.data.state,
                pincode: result.data.pincode,
                country: result.data.country,
            });
            setIsActive(result.data.is_active);
        } else {
            setError(true);
        }
        setLoading(false);
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
        if (!userId) return;

        const result = await updateUser(userId, formData, password);

        if (result.success) {
            addNotification('success', 'User updated successfully');
            navigate('/app/users');
        } else {
            if (result.fieldErrors) {
                setFormErrors(result.fieldErrors);
            }
            addNotification('error', 'Failed to update user', result.error);
        }
    };

    const handleToggleStatus = async () => {
        if (!userId) return;

        if (formData.email === currentUserEmail) {
            addNotification('warning', 'Cannot deactivate your own account', 'You cannot deactivate yourself');
            return;
        }

        setIsTogglingStatus(true);
        const result = await toggleUserStatus(userId, isActive);

        if (result.success) {
            setIsActive(!isActive);
            addNotification(
                'success',
                `User ${isActive ? 'deactivated' : 'activated'} successfully`,
                `The user has been ${isActive ? 'deactivated' : 'activated'}`
            );
        } else {
            addNotification('error', 'Failed to change user status', result.error);
        }
        setIsTogglingStatus(false);
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

    const isCurrentUser = formData.email === currentUserEmail;

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Users', onClick: handleBack },
        { type: 'cancel', onClick: handleCancel, disabled: isSubmitting || isTogglingStatus },
        { type: 'save', onClick: handleSubmit, loading: isSubmitting, disabled: isTogglingStatus },
    ];

    return (
        <Box sx={{ mt: '60px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            <ModernAppBar module="Users" crntPage="Edit User" actions={actions} />

            <Box sx={{ mt: '120px', p: '24px', maxWidth: '1400px', mx: 'auto' }}>
                <EditUserInfoSection
                    formData={{ email: formData.email, role: formData.role }}
                    password={password}
                    isActive={isActive}
                    isTogglingStatus={isTogglingStatus}
                    isCurrentUser={isCurrentUser}
                    onChange={handleChange}
                    onPasswordChange={setPassword}
                    onToggleStatus={handleToggleStatus}
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
