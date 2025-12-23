import React from 'react';
import { Box } from '@mui/material';
import { FiUser, FiBriefcase, FiMapPin, FiFileText } from 'react-icons/fi';
import { IFormConfig } from '../../components/ui/form';
import { COUNTRIES } from '../../constants/countries';
import {
    LEAD_BUDGET_RANGE,
    LEAD_DECISION_TIMEFRAME,
    LEAD_INDUSTRY,
    LEAD_RATING,
    LEAD_SOURCE,
    LEAD_STATUS,
} from '../../constants/lead';

interface Params {
    industries?: Array<{ value: string; label: string }>;
    statuses?: Array<{ value: string; label: string }>;
    sources?: Array<{ value: string; label: string }>;
    countries?: Array<{ code: string; name: string }>;
    users?: Array<{ id: string; user__email: string; user__is_active: boolean; user__first_name?: string; user__last_name?: string }>;
}

export const getLeadConfig = (params: Params = {}): IFormConfig => ({
    sections: [
        {
            title: 'Lead Information',
            icon: FiBriefcase,
            defaultExpanded: true,
            fields: [
                {
                    name: 'account_name',
                    label: 'Company Name',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter company name',
                },
                {
                    name: 'website',
                    label: 'Website',
                    type: 'text',
                    placeholder: 'https://example.com',
                },
                {
                    name: 'industry',
                    label: 'Industry',
                    type: 'select',
                    placeholder: 'Select industry',
                    options: params.industries?.length ? params.industries : LEAD_INDUSTRY,
                },
                {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    required: true,
                    placeholder: 'Select status',
                    options: params.statuses?.length ? params.statuses : LEAD_STATUS,
                },
                {
                    name: 'source',
                    label: 'Source',
                    type: 'select',
                    required: true,
                    placeholder: 'Select source',
                    options: params.sources?.length ? params.sources : LEAD_SOURCE,
                },
                {
                    name: 'opportunity_amount',
                    label: 'Opportunity Amount',
                    type: 'number',
                    placeholder: '0.00',
                    startAdornment: '€',
                },
                {
                    name: 'probability',
                    label: 'Probability (%)',
                    type: 'number',
                    placeholder: '50',
                },
                {
                    name: 'rating',
                    label: 'Rating',
                    type: 'select',
                    placeholder: 'Select rating',
                    options: LEAD_RATING,
                },
                {
                    name: 'budget_range',
                    label: 'Budget Range',
                    type: 'select',
                    placeholder: 'Select budget range',
                    options: LEAD_BUDGET_RANGE,
                },
                {
                    name: 'decision_timeframe',
                    label: 'Decision Timeframe',
                    type: 'select',
                    placeholder: 'Select timeframe',
                    options: LEAD_DECISION_TIMEFRAME,
                },
                {
                    name: 'close_date',
                    label: 'Expected Close Date',
                    type: 'date',
                    placeholder: 'Select date',
                },
                {
                    name: 'assigned_to',
                    label: 'Assigned To',
                    type: 'select',
                    placeholder: 'Select user',
                    options:
                        params.users
                            ?.filter((user) => user.user__is_active)
                            ?.map((user) => {
                                const firstName = user.user__first_name || '';
                                const lastName = user.user__last_name || '';
                                const fullName = `${firstName} ${lastName}`.trim();
                                const label = fullName ? `${fullName} (${user.user__email})` : user.user__email;
                                return {
                                    value: user.id,
                                    label: label,
                                    fullName: fullName,
                                    email: user.user__email,
                                };
                            }) || [],
                    getOptionLabel: (option: any) => option.label || option.user__email || option,
                    renderBadge: (option: any) => {
                        if (option.fullName) {
                            return React.createElement(
                                React.Fragment,
                                null,
                                React.createElement('strong', null, option.fullName),
                                ' (',
                                option.email,
                                ')'
                            );
                        }
                        return option.label || option.email;
                    },
                }
            ],
        },
        {
            title: 'Contact Information',
            icon: FiUser,
            defaultExpanded: true,
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
                    placeholder: 'Enter first name',
                },
                {
                    name: 'last_name',
                    label: 'Last Name',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter last name',
                },
                {
                    name: 'title',
                    label: 'Job Title',
                    type: 'text',
                    required: true,
                    placeholder: 'e.g., CEO, Marketing Manager',
                },
                {
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    required: true,
                    placeholder: 'email@example.com',
                },
                {
                    name: 'phone',
                    label: 'Phone',
                    type: 'tel',
                    required: true,
                    placeholder: '+1234567890',
                },
                {
                    name: 'department',
                    label: 'Department',
                    type: 'select',
                    options: [
                        { value: 'Sales', label: 'Sales' },
                        { value: 'Marketing', label: 'Marketing' },
                        { value: 'Support', label: 'Support' },
                        { value: 'Finance', label: 'Finance' },
                        { value: 'Operations', label: 'Operations' },
                    ],
                },
                {
                    name: 'preferred_language',
                    label: 'Preferred Language',
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
            ],
        },
        {
            title: 'Address Information',
            icon: FiMapPin,
            defaultExpanded: true,
            fields: [
                {
                    name: 'address_line',
                    label: 'Address Line',
                    type: 'text',
                    placeholder: 'Street address',
                },
                {
                    name: 'street',
                    label: 'Street',
                    type: 'text',
                    placeholder: 'Street name',
                },
                {
                    name: 'city',
                    label: 'City',
                    type: 'text',
                    placeholder: 'City',
                },
                {
                    name: 'state',
                    label: 'State/Province',
                    type: 'text',
                    placeholder: 'State or province',
                },
                {
                    name: 'postcode',
                    label: 'Postal Code',
                    type: 'text',
                    placeholder: 'Postal code',
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
            title: 'Description',
            icon: FiFileText,
            defaultExpanded: true,
            fields: [
                {
                    name: 'description',
                    label: 'Description',
                    type: 'textarea',
                    placeholder: 'Enter lead description...',
                    rows: 6,
                },
                {
                    name: 'attachments',
                    label: 'Attachments',
                    type: 'multifile',
                    placeholder: 'Upload documents, images, or PDFs',
                    accept: 'image/*,application/pdf,.doc,.docx,.xls,.xlsx',
                    maxFiles: 10,
                    maxSizeInMB: 10,
                },
            ],
        },
    ],
});
