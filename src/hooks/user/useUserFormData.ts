import { useState, ChangeEvent } from 'react';

export interface UserFormData {
    email: string;
    role: string;
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
}

export const useUserFormData = (initialState: UserFormData) => {
    const [formData, setFormData] = useState<UserFormData>(initialState);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => setFormData(initialState);

    return { formData, setFormData, handleChange, resetForm };
};
