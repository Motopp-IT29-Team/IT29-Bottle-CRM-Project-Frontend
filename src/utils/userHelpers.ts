import { COUNTRIES } from '../constants/countries';

export const getInitials = (email: string): string => {
    return email.split('@')[0].substring(0, 2).toUpperCase();
};

export const formatDate = (dateString: string): string => {
    if (!dateString) return '---';

    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const getCountryNameByCode = (code: string): string => {
    if (!code) return '---';

    const country = COUNTRIES.find((c) => c.code === code);
    return country ? country.name : code;
};
