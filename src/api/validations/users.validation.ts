import { UserFormData } from '../services/users.service';

export const validateUserForm = (data: UserFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.first_name.trim()) {
        errors.first_name = 'First name is required';
    }

    if (!data.last_name.trim()) {
        errors.last_name = 'Last name is required';
    }

    if (!data.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Invalid email format';
    }

    // if (!data.password || !data.password.trim()) {
    //     errors.password = 'Password is required';
    // } else if (data.password.length < 8) {
    //     errors.password = 'Password must be at least 8 characters';
    // }

    return errors;
};
