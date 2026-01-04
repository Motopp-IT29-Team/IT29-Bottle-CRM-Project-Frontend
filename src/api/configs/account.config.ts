import { IFormConfig } from '../../components/ui/form';
import { FiFileText, FiHome, FiMapPin } from 'react-icons/fi';
import { IContact, ILead, IUser } from '../../types';

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
                        placeholder: 'Enter email address',
                    },
                    {
                        name: 'phone',
                        label: 'Phone',
                        type: 'text',
                        placeholder: 'Enter phone number',
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
                            label: ind[1],
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
                        placeholder: 'Enter contact name',
                    },
                    {
                        name: 'contacts',
                        label: 'Contacts',
                        type: 'autocomplete',
                        placeholder: 'Select contacts',
                        options: contacts.map((contact: any) => ({
                            value: contact.id,
                            label: `${contact.first_name || ''} ${contact.last_name || ''}`.trim(),
                        })),
                    },
                    {
                        name: 'assigned_to',
                        label: 'Assign To',
                        type: 'autocomplete',
                        placeholder: 'Select users',
                        options: users.map((user: any) => ({
                            value: user.id,
                            label: user.user__email || user.email || `${user.first_name} ${user.last_name}`,
                        })),
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
                        required: true,
                        placeholder: 'Enter address line',
                    },
                    {
                        name: 'billing_street',
                        label: 'Street',
                        type: 'text',
                        required: true,
                        placeholder: 'Enter street',
                    },
                    {
                        name: 'billing_city',
                        label: 'City',
                        type: 'text',
                        required: true,
                        placeholder: 'Enter city',
                    },
                    {
                        name: 'billing_state',
                        label: 'State',
                        type: 'text',
                        required: true,
                        placeholder: 'Enter state',
                    },
                    {
                        name: 'billing_postcode',
                        label: 'Postal Code',
                        type: 'text',
                        required: true,
                        placeholder: 'Enter postal code',
                    },
                    {
                        name: 'billing_country',
                        label: 'Country',
                        type: 'select',
                        required: true,
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
