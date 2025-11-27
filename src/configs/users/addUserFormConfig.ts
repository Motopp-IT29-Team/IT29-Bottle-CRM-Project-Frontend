import { FiUser, FiMapPin } from 'react-icons/fi';
import { IFormConfig } from '../../components/ui/form';
import { COUNTRIES } from '../../constants/countries';

export const getAddUserFormConfig = (): IFormConfig => ({
    sections: [
        {
            title: 'User Information',
            icon: FiUser,
            defaultExpanded: true,
            fields: [
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
                    name: 'email',
                    label: 'Email',
                    type: 'email',
                    required: true,
                    placeholder: 'Enter email address',
                },
                {
                    name: 'role',
                    label: 'Role',
                    type: 'select',
                    options: [
                        { value: 'ADMIN', label: 'ADMIN' },
                        { value: 'USER', label: 'USER' },
                    ],
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
                    placeholder: 'Enter street address',
                },
                {
                    name: 'street',
                    label: 'Street',
                    type: 'text',
                    placeholder: 'Enter street name',
                },
                {
                    name: 'city',
                    label: 'City',
                    type: 'text',
                    placeholder: 'Enter city',
                },
                {
                    name: 'state',
                    label: 'State',
                    type: 'text',
                    placeholder: 'Enter state/province',
                },
                {
                    name: 'postcode',
                    label: 'Postal Code',
                    type: 'text',
                    placeholder: 'Enter postal code',
                },
                {
                    name: 'country',
                    label: 'Country',
                    type: 'select',
                    placeholder: 'Select country',
                    options: COUNTRIES.map((country) => ({
                        value: country.code,
                        label: country.name,
                    })),
                },
            ],
        },
    ],
});
