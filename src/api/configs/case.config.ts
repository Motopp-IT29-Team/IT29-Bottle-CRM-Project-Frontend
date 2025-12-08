import { FiFileText } from '@react-icons/all-files/fi/FiFileText';
import { FiInfo } from '@react-icons/all-files/fi/FiInfo';
import { IFormConfig } from '../../components/ui/form';

export interface GetCaseConfigParams {
    accounts?: Array<{ id: string; name: string }>;
    contacts?: Array<{ id: string; first_name: string; last_name: string }>;
    users?: Array<{ id: string; user_details: { email: string } }>;
    teams?: Array<{ id: string; name: string }>;
    status?: Array<[string, string]>;
    priority?: Array<[string, string]>;
    case_type?: Array<[string, string]>;
}

export const getCaseConfig = (params: GetCaseConfigParams = {}): IFormConfig => {
    const { accounts = [], contacts = [], users = [], teams = [], status = [], priority = [], case_type = [] } = params;

    return {
        sections: [
            {
                title: 'Case Information',
                icon: FiFileText,
                defaultExpanded: true,
                fields: [
                    {
                        name: 'name',
                        label: 'Case Name',
                        type: 'text',
                        required: true,
                        placeholder: 'Enter case name...',
                    },
                    {
                        name: 'account',
                        label: 'Account',
                        type: 'autocomplete',
                        required: true,
                        placeholder: 'Select account...',
                        options: accounts.map((acc) => ({
                            value: acc.id,
                            label: acc.name,
                        })),
                    },
                    {
                        name: 'status',
                        label: 'Status',
                        type: 'select',
                        required: true,
                        placeholder: 'Select status...',
                        options: status.map(([value, label]) => ({ value, label })),
                    },
                    {
                        name: 'priority',
                        label: 'Priority',
                        type: 'select',
                        required: true,
                        placeholder: 'Select priority...',
                        options: priority.map(([value, label]) => ({ value, label })),
                    },
                    {
                        name: 'case_type',
                        label: 'Case Type',
                        type: 'select',
                        required: false,
                        placeholder: 'Select case type...',
                        options: case_type.map(([value, label]) => ({ value, label })),
                    },
                    {
                        name: 'closed_on',
                        label: 'Closed On',
                        type: 'date',
                        required: false,
                        placeholder: 'Select close date...',
                    },
                    {
                        name: 'contacts',
                        label: 'Contacts',
                        type: 'autocomplete',
                        required: false,
                        placeholder: 'Select contacts...',
                        options: contacts.map((contact) => ({
                            value: contact.id,
                            label: `${contact.first_name} ${contact.last_name}`,
                        })),
                    },
                    {
                        name: 'assigned_to',
                        label: 'Assigned To',
                        type: 'autocomplete',
                        required: false,
                        placeholder: 'Select users...',
                        options: users.map((user) => ({
                            value: user.id,
                            label: user.user_details?.email || 'Unknown',
                        })),
                    },
                    {
                        name: 'teams',
                        label: 'Teams',
                        type: 'autocomplete',
                        required: false,
                        placeholder: 'Select teams...',
                        options: teams.map((team) => ({
                            value: team.id,
                            label: team.name,
                        })),
                    },
                    {
                        name: 'case_attachment',
                        label: 'Attachment',
                        type: 'file',
                        required: false,
                        placeholder: 'Upload file...',
                    },
                ],
            },
            {
                title: 'Description',
                icon: FiInfo,
                defaultExpanded: true,
                fields: [
                    {
                        name: 'description',
                        label: 'Description',
                        type: 'textarea',
                        required: false,
                        placeholder: 'Enter case description...',
                        rows: 4,
                    },
                ],
            },
        ],
    };
};
