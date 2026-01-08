import { IFormConfig } from '../../components/ui/form';
import { FiDollarSign, FiFileText } from 'react-icons/fi';
import { LEAD_DECISION_TIMEFRAME } from '../../constants/lead';
import { toTitleCase } from '../../utils/formHelpers';

interface Params {
    accounts?: any[];
    users?: any[];
    stage?: any[];
    leadSource?: any[];
}

export const getOpportunityConfig = (params: Params = {}): IFormConfig => {
    const { accounts = [], users = [], stage = [], leadSource = [] } = params;

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
                        placeholder: '0.00',
                        startAdornment: '€',
                    },
                    {
                        name: 'stage',
                        label: 'Stage',
                        type: 'select',
                        required: true,
                        placeholder: 'Select stage',
                        options: stage.map((s: any) => ({
                            value: s[0],
                            label: toTitleCase(s[1]),
                        })),
                    },
                    {
                        name: 'probability',
                        label: 'Probability (%)',
                        type: 'number',
                        placeholder: 'Enter probability (0-100)',
                    },
                    {
                        name: 'decision_timeframe',
                        label: 'Decision Timeframe',
                        type: 'select',
                        placeholder: 'Select timeframe',
                        options: LEAD_DECISION_TIMEFRAME,
                    },
                    {
                        name: 'lead_source',
                        label: 'Lead Source',
                        type: 'select',
                        placeholder: 'Select lead source',
                        options: leadSource.map((ls: any) => ({
                            value: ls[0],
                            label: toTitleCase(ls[1]),
                        })),
                    },
                    {
                        name: 'closed_on',
                        label: 'Expected Close Date',
                        type: 'date',
                    },
                    {
                        name: 'assigned_to',
                        label: 'Assign To',
                        type: 'autocomplete',
                        placeholder: 'Select users',
                        options: users.map((user: any) => {
                            const firstName = user.user__first_name || user.first_name || '';
                            const lastName = user.user__last_name || user.last_name || '';
                            const email = user.user__email || user.email || '';
                            const fullName = `${firstName} ${lastName}`.trim();
                            const label = fullName ? `${fullName} (${email})` : email;

                            return {
                                value: user.id,
                                label: label,
                            };
                        }),
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
