import { FiUser, FiMapPin } from 'react-icons/fi';
import { IFormConfig } from '../../components/ui/form';
import { COUNTRIES } from '../../constants/countries';

export const getEditUserFormConfig = (isCurrentUser: boolean = false): IFormConfig => ({
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
                {
                    name: 'password',
                    label: 'New Password (optional)',
                    type: 'text',
                    placeholder: 'Leave blank to keep current password',
                },
                {
                    name: 'is_active',
                    label: 'Account Status',
                    type: 'toggle',
                    disabled: isCurrentUser,
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
                    required: true,
                    placeholder: 'Enter street address',
                },
                {
                    name: 'street',
                    label: 'Street',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter street name',
                },
                {
                    name: 'city',
                    label: 'City',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter city',
                },
                {
                    name: 'state',
                    label: 'State',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter state/province',
                },
                {
                    name: 'postcode',
                    label: 'Postal Code',
                    type: 'text',
                    required: true,
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
