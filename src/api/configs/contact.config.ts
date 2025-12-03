import { IFormConfig } from '../../components/ui/form';
import { COUNTRIES } from '../../constants/countries';

interface Params {
    countries?: Array<{ code: string; name: string }>;
}

export const getContactConfig = (params: Params = {}): IFormConfig => {
    return {
        sections: [
            {
                title: 'Contact Information',
                fields: [
                    {
                        name: 'salutation',
                        label: 'Salutation',
                        type: 'select',
                        options: [
                            { value: 'Mr', label: 'Mr' },
                            { value: 'Ms', label: 'Ms' },
                            { value: 'Mrs', label: 'Mrs' },
                            { value: 'Dr', label: 'Dr' },
                            { value: 'Prof', label: 'Prof' },
                        ],
                    },
                    {
                        name: 'first_name',
                        label: 'First Name',
                        type: 'text',
                        required: true,
                    },
                    {
                        name: 'last_name',
                        label: 'Last Name',
                        type: 'text',
                        required: true,
                    },
                    {
                        name: 'organization',
                        label: 'Organization',
                        type: 'text',
                        required: true,
                    },
                    {
                        name: 'primary_email',
                        label: 'Primary Email',
                        type: 'email',
                        required: true,
                    },
                    {
                        name: 'secondary_email',
                        label: 'Secondary Email',
                        type: 'email',
                    },
                    {
                        name: 'department',
                        label: 'Department',
                        type: 'select',
                        required: true,
                        options: [
                            { value: 'Sales', label: 'Sales' },
                            { value: 'Marketing', label: 'Marketing' },
                            { value: 'Support', label: 'Support' },
                            { value: 'Finance', label: 'Finance' },
                            { value: 'Operations', label: 'Operations' },
                        ],
                    },
                    {
                        name: 'title',
                        label: 'Title',
                        type: 'text',
                    },
                    {
                        name: 'mobile_number',
                        label: 'Mobile Number',
                        type: 'tel',
                        required: true,
                        placeholder: '+1234567890',
                    },
                    {
                        name: 'secondary_number',
                        label: 'Secondary Number',
                        type: 'tel',
                        placeholder: '+1234567890',
                    },
                    {
                        name: 'language',
                        label: 'Language',
                        required: true,
                        type: 'select',
                        options: [
                            { value: 'English', label: 'English' },
                            { value: 'Dutch', label: 'Dutch' },
                            { value: 'Arabic', label: 'Arabic' },
                            { value: 'German', label: 'German' },
                            { value: 'French', label: 'French' },
                            { value: 'Spanish', label: 'Spanish' },
                        ],
                    },
                    {
                        name: 'do_not_call',
                        label: 'Do Not Call',
                        type: 'toggle',
                    },
                    {
                        name: 'description',
                        label: 'Description',
                        type: 'textarea',
                    },
                ],
            },
            {
                title: 'Address',
                fields: [
                    {
                        name: 'address_line',
                        label: 'Billing Address',
                        type: 'text',
                    },
                    {
                        name: 'street',
                        label: 'Street',
                        type: 'text',
                    },
                    {
                        name: 'city',
                        label: 'City',
                        type: 'text',
                    },
                    {
                        name: 'state',
                        label: 'State',
                        type: 'text',
                    },
                    {
                        name: 'postcode',
                        label: 'Postcode',
                        type: 'text',
                    },
                    {
                        name: 'country',
                        label: 'Country',
                        type: 'select',
                        placeholder: 'Select country',
                        options: (params.countries?.length ? params.countries : COUNTRIES).map((country) => {
                            if (Array.isArray(country)) {
                                return {
                                    value: country[0],
                                    label: country[1],
                                };
                            }
                            return {
                                value: country.code,
                                label: country.name,
                            };
                        }),
                    },
                ],
            },
            {
                title: 'Socials',
                fields: [
                    {
                        name: 'linked_in_url',
                        label: 'LinkedIn URL',
                        type: 'text',
                        placeholder: 'https://linkedin.com/in/...',
                    },
                    {
                        name: 'facebook_url',
                        label: 'Facebook URL',
                        type: 'text',
                        placeholder: 'https://facebook.com/...',
                    },
                    {
                        name: 'twitter_username',
                        label: 'Twitter Username',
                        type: 'text',
                        placeholder: '@username',
                    },
                ],
            },
        ],
    };
};
