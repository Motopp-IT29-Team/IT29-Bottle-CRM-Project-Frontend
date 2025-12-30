import { FiUser, FiMapPin } from 'react-icons/fi';
import { IFormConfig } from '../../components/ui/form';
import { COUNTRIES } from '../../constants/countries';

export const getUserConfig = (isCurrentUser: boolean = false, isCreateMode: boolean = false): IFormConfig => ({
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
                ...(!isCreateMode
                    ? [
                          {
                              name: 'password' as const,
                              label: 'New Password',
                              type: 'text' as const,
                              placeholder: 'Leave blank to keep current password',
                          },
                      ]
                    : []),
                ...(!isCreateMode
                    ? [
                          {
                              name: 'is_active',
                              label: 'Account Status',
                              type: 'toggle' as const,
                              disabled: isCurrentUser,
                              helperText: 'Deactivated users cannot access the system',
                          },
                      ]
                    : []),
                ...(!isCreateMode
                    ? [
                          {
                              name: 'can_view_others_activity_logs' as const,
                              label: "Can View Others' Activity Logs",
                              type: 'toggle' as const,
                              disabled: isCurrentUser,
                              helperText:
                                  'Allow viewing activity logs of all users. Users can always view their own logs.',
                          },
                      ]
                    : []),
            ],
        },
        // {
        //     title: 'Address Information',
        //     icon: FiMapPin,
        //     defaultExpanded: true,
        //     fields: [
        //         {
        //             name: 'address_line',
        //             label: 'Address Line',
        //             type: 'text',
        //             placeholder: 'Enter street address',
        //         },
        //         {
        //             name: 'street',
        //             label: 'Street',
        //             type: 'text',
        //             placeholder: 'Enter street name',
        //         },
        //         {
        //             name: 'city',
        //             label: 'City',
        //             type: 'text',
        //             placeholder: 'Enter city',
        //         },
        //         {
        //             name: 'state',
        //             label: 'State',
        //             type: 'text',
        //             placeholder: 'Enter state/province',
        //         },
        //         {
        //             name: 'postcode',
        //             label: 'Postal Code',
        //             type: 'text',
        //             placeholder: 'Enter postal code',
        //         },
        //         {
        //             name: 'country',
        //             label: 'Country',
        //             type: 'select',
        //             placeholder: 'Select country',
        //             options: COUNTRIES.map((country) => ({
        //                 value: country.code,
        //                 label: country.name,
        //             })),
        //         },
        //     ],
        // },
    ],
});
