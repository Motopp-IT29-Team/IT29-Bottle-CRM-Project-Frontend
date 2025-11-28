import { ChangeEvent, useState } from 'react';
import { UploadedFile } from '../../components/ui/form';

export interface LeadFormData {
    // Contact Information
    first_name: string;
    last_name: string;
    title: string;
    phone: string;
    email: string;

    // Lead Information
    account_name: string;
    opportunity_amount: string;
    website: string;
    industry: string;
    status: string;
    source: string;
    probability: number;
    skype_ID: string;

    // Lead Information
    salutation: string;
    department: string;
    preferred_language: string;
    rating: string;
    budget_range: string;
    decision_timeframe: string;
    do_not_call: boolean;

    // Address Information
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;

    // Additional
    description: string;
    attachments: UploadedFile[] | null;
    actualFile: File | null;

    // Relations (arrays of IDs)
    assigned_to: string[];
    contacts: string[];
    tags: string[];
}

export const INITIAL_LEAD_FORM_DATA: LeadFormData = {
    // Contact Information
    first_name: '',
    last_name: '',
    title: '',
    phone: '',
    email: '',

    // Lead Information
    account_name: '',
    opportunity_amount: '',
    website: '',
    industry: '',
    status: '',
    source: '',
    probability: 50,
    skype_ID: '',

    // Lead Information
    salutation: 'Mr',
    department: 'Sales',
    preferred_language: 'English',
    rating: '',
    budget_range: '',
    decision_timeframe: '',
    do_not_call: false,

    // Address Information
    address_line: '',
    street: '',
    city: '',
    state: '',
    postcode: '',
    country: 'NL',

    // Additional
    description: '',
    attachments: null,
    actualFile: null,

    // Relations
    assigned_to: [],
    contacts: [],
    tags: [],
};

export function useLeadFormData(initialData: LeadFormData = INITIAL_LEAD_FORM_DATA) {
    const [formData, setFormData] = useState<LeadFormData>(initialData);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
    ) => {
        const { name, value } = e.target;
        const type = 'type' in e.target ? e.target.type : undefined;

        if (type === 'number') {
            setFormData((prev) => ({
                ...prev,
                [name]: value === '' ? '' : Number(value),
            }));
        } else if (type === 'checkbox') {
            const checked = 'checked' in e.target ? e.target.checked : false;
            setFormData((prev) => ({
                ...prev,
                [name]: checked,
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
                [name]: value,
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
            setFormData((prev) => ({
                ...prev,
                actualFile: file,
                lead_attachment: file.name,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                actualFile: null,
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
