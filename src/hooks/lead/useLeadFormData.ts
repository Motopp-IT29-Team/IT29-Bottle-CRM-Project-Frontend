import { ChangeEvent, useState } from 'react';

export interface LeadFormData {
    // Lead Information
    account_name: string;
    opportunity_amount: string;
    website: string;
    industry: string;
    status: string;
    source: string;
    probability: number;
    skype_ID: string;

    // Contact Information
    first_name: string;
    last_name: string;
    title: string;
    phone: string;
    email: string;

    // Address Information
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;

    // Additional
    description: string;
    lead_attachment: string | null;
    file: string | null;

    // Relations (arrays of IDs)
    assigned_to: string[];
    contacts: string[];
    tags: string[];
}

export const INITIAL_LEAD_FORM_DATA: LeadFormData = {
    // Lead Information
    account_name: '',
    opportunity_amount: '',
    website: '',
    industry: '',
    status: '',
    source: '',
    probability: 50,
    skype_ID: '',

    // Contact Information
    first_name: '',
    last_name: '',
    title: '',
    phone: '',
    email: '',

    // Address Information
    address_line: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: '',

    // Additional
    description: '',
    lead_attachment: null,
    file: null,

    // Relations
    assigned_to: [],
    contacts: [],
    tags: [],
};

export function useLeadFormData(initialData: LeadFormData = INITIAL_LEAD_FORM_DATA) {
    const [formData, setFormData] = useState<LeadFormData>(initialData);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            setFormData((prev) => ({
                ...prev,
                [name]: value === '' ? '' : Number(value),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSelectChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAutocompleteChange = (name: string, value: any[]) => {
        if (name === 'contacts' || name === 'assigned_to') {
            setFormData((prev) => ({
                ...prev,
                [name]: value.map((item) => item.id),
            }));
        } else if (name === 'tags') {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleFileChange = (file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prev) => ({
                    ...prev,
                    file: reader.result as string,
                    lead_attachment: file.name,
                }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData((prev) => ({
                ...prev,
                file: null,
                lead_attachment: null,
            }));
        }
    };

    const handleDescriptionChange = (content: string) => {
        setFormData((prev) => ({
            ...prev,
            description: content,
        }));
    };

    const resetForm = () => {
        setFormData(initialData);
    };

    return {
        formData,
        handleChange,
        handleSelectChange,
        handleAutocompleteChange,
        handleFileChange,
        handleDescriptionChange,
        resetForm,
        setFormData,
    };
}
