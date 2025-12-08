import { IFormConfig } from '../../components/ui/form';
import { FiHome } from 'react-icons/fi';

export const getCompanyConfig = (): IFormConfig => {
    return {
        sections: [
            {
                title: 'Company Information',
                icon: FiHome,
                defaultExpanded: true,
                fields: [
                    {
                        name: 'name',
                        label: 'Company Name',
                        type: 'text',
                        required: true,
                        placeholder: 'Enter company name...',
                    },
                ],
            },
        ],
    };
};
