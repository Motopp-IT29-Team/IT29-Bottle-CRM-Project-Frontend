import { fetchData } from '../../components/FetchData';
import { UsersUrl } from '../../services/ApiUrls';
import { UserFormData } from './useUserFormData';
import { formatBackendErrors } from '../../utils/errorFormatter';

interface SubmitResult {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
}

export const useSubmitUser = (resetForm: () => void) => {
    const submitForm = async (formData: UserFormData): Promise<SubmitResult> => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org'),
        };

        try {
            const res = await fetchData(`${UsersUrl}/`, 'POST', JSON.stringify(formData), Header);

            if (!res.error) {
                resetForm();
                return { success: true };
            } else {
                const { errorMessage, fieldErrors } = formatBackendErrors(res.errors);

                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors: fieldErrors,
                };
            }
        } catch (err: any) {
            console.error('Submit error:', err);
            return {
                success: false,
                error: err.message || 'Network error. Please try again.',
            };
        }
    };

    return { submitForm };
};
