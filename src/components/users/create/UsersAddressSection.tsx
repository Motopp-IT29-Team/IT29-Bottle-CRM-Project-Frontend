import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    TextField,
    Paper,
    MenuItem,
    Select,
    FormControl,
    FormHelperText,
} from '@mui/material';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import {
    USERS_ACCORDION_STYLES,
    USERS_ACCORDION_SUMMARY_STYLES,
    USERS_ACCORDION_TITLE_STYLES,
    USERS_EXPAND_ICON_STYLES,
    USERS_FIELD_BOX_STYLES,
    USERS_FIELD_CONTAINER_STYLES,
    USERS_FIELD_LABEL_STYLES,
    USERS_TEXT_FIELD_STYLES,
} from '../../../styles/UsersStyles';
import { COUNTRIES } from '../../../constants/countries';

interface AddressSectionProps {
    address: {
        address_line: string;
        street: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
    };
    onChange: (e: any) => void;
    errors: Record<string, string | string[]>;
    disabled?: boolean;
}

const ADDRESS_FIELDS = [
    { name: 'address_line', label: 'Address Line', placeholder: 'Enter street address', type: 'text' },
    { name: 'street', label: 'Street', placeholder: 'Enter street name', type: 'text' },
    { name: 'city', label: 'City', placeholder: 'Enter city', type: 'text' },
    { name: 'state', label: 'State', placeholder: 'Enter state/province', type: 'text' },
    { name: 'postcode', label: 'Postal Code', placeholder: 'Enter postal code', type: 'text' },
    { name: 'country', label: 'Country', placeholder: 'Select country', type: 'select' },
];

export const UsersAddressSection: React.FC<AddressSectionProps> = ({ address, onChange, errors, disabled = false }) => {
    return (
        <Paper elevation={0} sx={{ mb: 3 }}>
            <Accordion defaultExpanded sx={USERS_ACCORDION_STYLES}>
                <AccordionSummary
                    expandIcon={
                        <Box sx={USERS_EXPAND_ICON_STYLES}>
                            <FiChevronDown style={{ fontSize: '20px', color: '#6b7280' }} />
                        </Box>
                    }
                    sx={USERS_ACCORDION_SUMMARY_STYLES}
                >
                    <Typography sx={USERS_ACCORDION_TITLE_STYLES}>Address Information</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={USERS_FIELD_CONTAINER_STYLES}>
                        {ADDRESS_FIELDS.map((field) => (
                            <Box key={field.name} sx={USERS_FIELD_BOX_STYLES}>
                                <Typography sx={USERS_FIELD_LABEL_STYLES}>{field.label}</Typography>

                                {field.type === 'select' ? (
                                    <FormControl fullWidth size="small" error={!!errors[field.name]}>
                                        <Select
                                            name={field.name}
                                            value={address[field.name as keyof typeof address]}
                                            onChange={onChange}
                                            disabled={disabled}
                                            displayEmpty
                                            sx={USERS_TEXT_FIELD_STYLES}
                                        >
                                            <MenuItem value="" disabled>
                                                <em>{field.placeholder}</em>
                                            </MenuItem>
                                            {COUNTRIES.map((country) => (
                                                <MenuItem key={country.code} value={country.code}>
                                                    {country.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors[field.name] && <FormHelperText>{errors[field.name]}</FormHelperText>}
                                    </FormControl>
                                ) : (
                                    <TextField
                                        name={field.name}
                                        value={address[field.name as keyof typeof address]}
                                        onChange={onChange}
                                        placeholder={field.placeholder}
                                        size="small"
                                        fullWidth
                                        error={!!errors[field.name]}
                                        helperText={errors[field.name]}
                                        disabled={disabled}
                                        sx={USERS_TEXT_FIELD_STYLES}
                                    />
                                )}
                            </Box>
                        ))}
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};
