import { useState, ChangeEvent } from 'react';

export interface UserFormData {
    email: string;
    role: string;
    phone: string;
    alternate_phone: string;
    address_line: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    profile_pic: string | null;
    has_sales_access: boolean;
    has_marketing_access: boolean;
    is_organization_admin: boolean;
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
