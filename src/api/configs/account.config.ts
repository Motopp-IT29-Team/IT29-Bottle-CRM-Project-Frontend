import { IFormConfig } from '../../components/ui/form';
import { FiFileText, FiHome, FiMapPin } from 'react-icons/fi';
import { IContact, ILead, IUser } from '../../types';
import { toTitleCase } from '../../utils/formHelpers';
import React from 'react';

interface GetAccountConfigParams {
    contacts?: IContact[];
    users?: IUser[];
    leads?: ILead[];
    industries?: any[];
    countries?: any[];
    status?: any[];
}

export const getAccountConfig = (params: GetAccountConfigParams = {}): IFormConfig => {
    const { contacts = [], users = [], leads = [], industries = [], countries = [], status = [] } = params;

    return {
        sections: [
            {
                title: 'Account Information',
                icon: FiHome,
                defaultExpanded: true,
                fields: [
                    {
                        name: 'name',
                        label: 'Account Name',
                        type: 'text',
                        required: true,
                        placeholder: 'Enter account name',
                    },
                    {
                        name: 'email',
                        label: 'Email',
                        type: 'email',
                        required: true,
                        placeholder: 'Enter email address',
                    },
                    {
                        name: 'phone',
                        label: 'Phone',
                        type: 'phone',
                        placeholder: '',
                    },
                    {
                        name: 'website',
                        label: 'Website',
                        type: 'text',
                        placeholder: 'Enter website URL',
                    },
                    {
                        name: 'industry',
                        label: 'Industry',
                        type: 'select',
                        placeholder: 'Select industry',
                        options: industries.map((ind: any) => ({
                            value: ind[0],
                            label: toTitleCase(ind[1]),
                        })),
                    },
                    {
                        name: 'status',
                        label: 'Status',
                        type: 'select',
                        placeholder: 'Select status',
                        options: status.map((s: string) => ({
                            value: s,
                            label: s.charAt(0).toUpperCase() + s.slice(1),
                        })),
                    },
                    {
                        name: 'lead',
                        label: 'Lead',
                        type: 'select',
                        placeholder: 'Select lead',
                        options: leads.map((lead: any) => ({
                            value: lead.id,
                            label: `${lead.first_name} ${lead.last_name}`,
                        })),
                    },
                    {
                        name: 'contact_name',
                        label: 'Contact Name',
                        type: 'text',
                        required: true,
                        placeholder: 'Enter contact name',
                    },
                    {
                        name: 'contacts',
                        label: 'Contacts',
                        type: 'autocomplete',
                        placeholder: 'Select contacts',
                        options: contacts.map((contact: any) => ({
                            value: contact.id,
                            label:
                                `${contact.first_name || ''} ${contact.last_name || ''}`.trim() ||
                                contact.primary_email ||
                                'Unknown',
                        })),
                        getOptionLabel: (option: any) => {
                            if (typeof option === 'object' && option.label) return option.label;
                            if (typeof option === 'string') {
                                const found = contacts.find((c: any) => c.id === option);
                                if (found) {
                                    const name = `${found.first_name || ''} ${found.last_name || ''}`.trim();
                                    const email = found.primary_email || found.secondary_email || '';
                                    return name ? `${name} (${email})` : email;
                                }
                            }
                            return option;
                        },
                    },

                    {
                        name: 'assigned_to',
                        label: 'Assign To',
                        type: 'autocomplete',
                        placeholder: 'Select users',
                        options: users.map((user: any) => {
                            const firstName = user.user__first_name || '';
                            const lastName = user.user__last_name || '';
                            const email = user.user__email || user.email || '';
                            const fullName = `${firstName} ${lastName}`.trim();
                            const label = fullName ? `${fullName} (${email})` : email;

                            return {
                                value: user.id,
                                label: label,
                                fullName: fullName,
                                email: email,
                            };
                        }),
                        getOptionLabel: (option: any) => {
                            if (typeof option === 'object' && option.label) return option.label;
                            if (typeof option === 'string') {
                                const found: any = users.find((u: any) => u.id === option);
                                if (found) {
                                    const firstName = found.user__first_name || '';
                                    const lastName = found.user__last_name || '';
                                    const email = found.user__email || found.email || '';
                                    const fullName = `${firstName} ${lastName}`.trim();
                                    return fullName ? `${fullName} (${email})` : email;
                                }
                            }
                            return option;
                        },
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
                    },
                ],
            },
            {
                title: 'Address',
                icon: FiMapPin,
                defaultExpanded: true,
                fields: [
                    {
                        name: 'billing_address_line',
                        label: 'Address Line',
                        type: 'text',
                        placeholder: 'Enter address line',
                    },
                    {
                        name: 'billing_street',
                        label: 'Street',
                        type: 'text',
                        placeholder: 'Enter street',
                    },
                    {
                        name: 'billing_city',
                        label: 'City',
                        type: 'text',
                        placeholder: 'Enter city',
                    },
                    {
                        name: 'billing_state',
                        label: 'State',
                        type: 'text',
                        placeholder: 'Enter state',
                    },
                    {
                        name: 'billing_postcode',
                        label: 'Postal Code',
                        type: 'text',
                        placeholder: 'Enter postal code',
                    },
                    {
                        name: 'billing_country',
                        label: 'Country',
                        type: 'select',
                        placeholder: 'Select country',
                        options: countries.map((country: any) => ({
                            value: country[0],
                            label: country[1],
                        })),
                    },
                ],
            },
            {
                title: 'Other',
                icon: FiFileText,
                defaultExpanded: true,
                fields: [
                    {
                        name: 'description',
                        label: 'Description',
                        type: 'textarea',
                        rows: 6,
                        placeholder: 'Enter account description...',
                    },
                ],
            },
        ],
    };
};
