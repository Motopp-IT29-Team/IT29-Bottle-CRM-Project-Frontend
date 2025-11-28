import { FiUser, FiBriefcase, FiMapPin, FiFileText } from 'react-icons/fi';
import { IFormConfig } from '../../components/ui/form';
import { COUNTRIES } from '../../constants/countries';

interface Params {
    industries?: Array<{ value: string; label: string }>;
    statuses?: Array<{ value: string; label: string }>;
    sources?: Array<{ value: string; label: string }>;
    countries?: Array<{ code: string; name: string }>;
}

export const getEditLeadFormConfig = (params: Params = {}): IFormConfig => ({
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
                    options: params.industries?.length
                        ? params.industries
                        : [
                              { value: 'ADVERTISING', label: 'Advertising' },
                              { value: 'AGRICULTURE', label: 'Agriculture' },
                              { value: 'BANKING', label: 'Banking' },
                              { value: 'BIOTECHNOLOGY', label: 'Biotechnology' },
                              { value: 'COMPUTER', label: 'Computer' },
                              { value: 'EDUCATION', label: 'Education' },
                              { value: 'ELECTRONICS', label: 'Electronics' },
                              { value: 'ENERGY', label: 'Energy' },
                              { value: 'FINANCE', label: 'Finance' },
                              { value: 'HEALTHCARE', label: 'Healthcare' },
                              { value: 'INSURANCE', label: 'Insurance' },
                              { value: 'LEGAL', label: 'Legal' },
                              { value: 'MANUFACTURING', label: 'Manufacturing' },
                              { value: 'REAL ESTATE', label: 'Real Estate' },
                              { value: 'SOFTWARE', label: 'Software' },
                              { value: 'TECHNOLOGY', label: 'Technology' },
                              { value: 'TELECOMMUNICATIONS', label: 'Telecommunications' },
                          ],
                },
                {
                    name: 'status',
                    label: 'Status',
                    type: 'select',
                    required: true,
                    placeholder: 'Select status',
                    options: params.statuses?.length
                        ? params.statuses
                        : [
                              { value: 'new', label: 'New' },
                              { value: 'working', label: 'Working' },
                              { value: 'qualified', label: 'Qualified' },
                              { value: 'unqualified', label: 'Unqualified' },
                              { value: 'on hold', label: 'On Hold' },
                          ],
                },
                {
                    name: 'source',
                    label: 'Source',
                    type: 'select',
                    required: true,
                    placeholder: 'Select source',
                    options: params.sources?.length
                        ? params.sources
                        : [
                              { value: 'call', label: 'Call' },
                              { value: 'email', label: 'Email' },
                              { value: 'existing customer', label: 'Existing Customer' },
                              { value: 'partner', label: 'Partner' },
                              { value: 'public relations', label: 'Public Relations' },
                              { value: 'compaign', label: 'Campaign' },
                              { value: 'other', label: 'Other' },
                          ],
                },
                {
                    name: 'opportunity_amount',
                    label: 'Opportunity Amount',
                    type: 'number',
                    placeholder: '0.00',
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
                    options: [
                        { value: 'Hot', label: 'Hot' },
                        { value: 'Warm', label: 'Warm' },
                        { value: 'Cold', label: 'Cold' },
                    ],
                },
                {
                    name: 'budget_range',
                    label: 'Budget Range',
                    type: 'select',
                    placeholder: 'Select budget range',
                    options: [
                        { value: 'less_than_5000', label: 'Less than €5,000' },
                        { value: '5000_to_10000', label: '€5,000–€10,000' },
                        { value: '10000_to_25000', label: '€10,000–€25,000' },
                        { value: 'over_25000', label: 'Over €25,000' },
                    ],
                },
                {
                    name: 'decision_timeframe',
                    label: 'Decision Timeframe',
                    type: 'select',
                    placeholder: 'Select timeframe',
                    options: [
                        { value: 'within_1_week', label: 'Within 1 week' },
                        { value: 'within_1_month', label: 'Within 1 month' },
                        { value: 'within_3_months', label: 'Within 3 months' },
                        { value: 'more_than_3_months', label: 'More than 3 months' },
                    ],
                },
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
                    options: params.countries?.length
                        ? params.countries.map((c: any) => ({ value: c[0], label: c[1] }))
                        : COUNTRIES.map((country) => ({ value: country.code, label: country.name })),
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
