import { IFormConfig } from '../../components/ui/form';
import { FiDollarSign, FiFileText } from 'react-icons/fi';

interface Params {
    accounts?: any[];
    contacts?: any[];
    users?: any[];
    teams?: any[];
    tags?: any[];
    currency?: any[];
    stage?: any[];
    leadSource?: any[];
}

export const getOpportunityConfig = (params: Params = {}): IFormConfig => {
    const {
        accounts = [],
        contacts = [],
        users = [],
        teams = [],
        tags = [],
        currency = [],
        stage = [],
        leadSource = [],
    } = params;

    return {
        sections: [
            {
                title: 'Opportunity Information',
                icon: FiDollarSign,
                defaultExpanded: true,
                fields: [
                    {
                        name: 'name',
                        label: 'Opportunity Name',
                        type: 'text',
                        required: true,
                        placeholder: 'Enter opportunity name',
                    },
                    {
                        name: 'account',
                        label: 'Account',
                        type: 'select',
                        required: true,
                        placeholder: 'Select account',
                        options: accounts.map((acc: any) => ({
                            value: acc.id,
                            label: acc.name,
                        })),
                    },
                    {
                        name: 'amount',
                        label: 'Amount',
                        type: 'number',
                        placeholder: 'Enter amount',
                    },
                    {
                        name: 'currency',
                        label: 'Currency',
                        type: 'select',
                        placeholder: 'Select currency',
                        options: currency.map((curr: any) => ({
                            value: curr[0],
                            label: curr[1],
                        })),
                    },
                    {
                        name: 'stage',
                        label: 'Stage',
                        type: 'select',
                        required: true,
                        placeholder: 'Select stage',
                        options: stage.map((s: any) => ({
                            value: s[0],
                            label: s[1],
                        })),
                    },
                    {
                        name: 'probability',
                        label: 'Probability (%)',
                        type: 'number',
                        placeholder: 'Enter probability (0-100)',
                    },
                    {
                        name: 'lead_source',
                        label: 'Lead Source',
                        type: 'select',
                        placeholder: 'Select lead source',
                        options: leadSource.map((ls: any) => ({
                            value: ls[0],
                            label: ls[1],
                        })),
                    },
                    {
                        name: 'closed_on',
                        label: 'Expected Close Date',
                        type: 'date',
                    },
                    {
                        name: 'contacts',
                        label: 'Contacts',
                        type: 'autocomplete',
                        placeholder: 'Select contacts',
                        options: contacts.map((contact: any) => ({
                            value: contact.id,
                            label: `${contact.first_name} ${contact.last_name}`,
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
                    {
                        name: 'teams',
                        label: 'Teams',
                        type: 'autocomplete',
                        placeholder: 'Select teams',
                        options: teams.map((team: any) => ({
                            value: team.id,
                            label: team.name,
                        })),
                    },
                    {
                        name: 'tags',
                        label: 'Tags',
                        type: 'autocomplete',
                        placeholder: 'Add tags',
                        options: tags.map((tag: any) => ({
                            value: tag.name || tag,
                            label: tag.name || tag,
                        })),
                    },
                    {
                        name: 'attachments',
                        label: 'Attachments',
                        type: 'file',
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
                        rows: 6,
                        placeholder: 'Enter opportunity description...',
                    },
                ],
            },
        ],
    };
};
