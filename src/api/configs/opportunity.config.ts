import { IFormConfig } from '../../components/ui/form';
import { FiDollarSign, FiFileText } from 'react-icons/fi';
import { LEAD_BUDGET_RANGE, LEAD_DECISION_TIMEFRAME } from '../../constants/lead';
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
                        placeholder: 'Enter amount',
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
                        options: users.map((user: any) => ({
                            value: user.id,
                            label: user.user__email || user.email || `${user.first_name} ${user.last_name}`,
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
