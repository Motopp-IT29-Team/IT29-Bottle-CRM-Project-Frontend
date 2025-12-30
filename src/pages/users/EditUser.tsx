import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { IModernAppBar, AppBarAction, ILoadingState, ErrorState, IForm, FormErrors } from '../../components/ui';
import { useUsers, UserFormData, apiClient, ENDPOINTS, getUserConfig, useForm } from '../../api';
import { hasFormChanges } from '../../utils/formHelpers';
import { routes } from '../../constants/routes';

export function EditUser() {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('id');
    const navigate = useNavigate();
    const { getById, update, toggleStatus, isLoading: isSubmitting } = useUsers();

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [currentUserEmail, setCurrentUserEmail] = useState<string>('');
    const [initialFormData, setInitialFormData] = useState<UserFormData | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
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
    });

    const isCurrentUser = formData.email === currentUserEmail;
    const formConfig = getUserConfig(isCurrentUser);

    const { canSubmit } = useForm({
        formConfig,
        formData,
        initialData: initialFormData,
        isSubmitting,
        customValidation: (data) => {
            const hasPasswordChange = data.user_details?.password?.trim() !== '';
            const hasDataChanges = hasFormChanges(data, initialFormData, [
                'first_name',
                'last_name',
                'role',
                'phone',
                'address_line',
                'street',
                'city',
                'state',
                'postcode',
                'country',
                'is_active',
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
            const response = await apiClient.get(ENDPOINTS.PROFILE);
            if (response.data?.user_obj?.user_details?.email) {
                setCurrentUserEmail(response.data.user_obj.user_details.email);
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    const fetchUserData = async () => {
        if (!userId) return;

        setIsLoading(true);
        const result = await getById(userId);
        if (result.success && result.data) {
            const data = result.data;

            const loadedData: UserFormData = {
                first_name: data.first_name,
                last_name: data.last_name,
                role: data.role,
                date_of_joining: data.date_of_joining || '',
                address_line: data.address?.address_line || '',
                street: data.address?.street || '',
                city: data.address?.city || '',
                state: data.address?.state || '',
                postcode: data.address?.postcode || '',
                country: data.address?.country || '',
                is_active: data.user_details.is_active,
                can_view_others_activity_logs: data.can_view_others_activity_logs || false,
                email: data.user_details.email,
            };
            setFormData(loadedData);
            setInitialFormData(loadedData);
        } else {
            setError(true);
        }
        setIsLoading(false);
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;

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

        const isActiveChanged = initialFormData?.is_active !== formData.is_active;

        if (isActiveChanged) {
            const toggleResult = await toggleStatus(userId);
            if (!toggleResult.success) {
                return;
            }
        }

        const result = await update(userId, formData);

        if (result.success) {
            navigate(routes.users.main);
        } else {
            if (result.fieldErrors) {
                setFormErrors(result.fieldErrors);
            }
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (isLoading) {
        return <ILoadingState message="Loading user data..." />;
    }

    if (error) {
        return <ErrorState message="Error loading user data. Please try again." />;
    }

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Users', onClick: handleBack },
        { type: 'cancel', onClick: handleCancel, disabled: isSubmitting },
        { type: 'save', onClick: handleSubmit, loading: isSubmitting, disabled: !canSubmit },
    ];

    return (
        <Box>
            <IModernAppBar module="Users" crntPage="Edit User" actions={actions} />

            <IForm
                config={formConfig}
                formData={formData}
                errors={formErrors}
                onChange={handleChange}
                disabled={isSubmitting}
            />
        </Box>
    );
}
