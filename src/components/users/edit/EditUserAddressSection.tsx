import React from 'react';
import { Paper, Box, Typography, TextField, MenuItem, Select, FormControl, FormHelperText } from '@mui/material';
import { FiMapPin } from '@react-icons/all-files/fi/FiMapPin';
import { FiHome } from '@react-icons/all-files/fi/FiHome';
import { FiNavigation } from '@react-icons/all-files/fi/FiNavigation';
import { COUNTRIES } from '../../../constants/countries';
import {
    USERS_FIELD_BOX_STYLES,
    USERS_FIELD_LABEL_STYLES,
    USERS_TEXT_FIELD_STYLES,
    USERS_SELECT_STYLES,
    USERS_MENU_ITEM_STYLES,
    USER_FIELD_CONTAINER_STYLES,
} from '../../../styles/UsersStyles';

interface EditUserAddressSectionProps {
    formData: {
        address_line: string;
        street: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
    };
    onChange: (e: any) => void;
    errors: {
        address_line?: string[];
        street?: string[];
        city?: string[];
        state?: string[];
        postcode?: string[];
        country?: string[];
    };
}

export const EditUserAddressSection: React.FC<EditUserAddressSectionProps> = ({ formData, onChange, errors }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
            }}
        >
            <Typography
                sx={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#111827',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <FiMapPin size={20} />
                Address Information
            </Typography>

            <Box sx={USER_FIELD_CONTAINER_STYLES}>
                <Box sx={USERS_FIELD_BOX_STYLES}>
                    <Typography sx={USERS_FIELD_LABEL_STYLES}>
                        <FiHome size={14} style={{ marginRight: '4px' }} />
                        Address Line
                    </Typography>
                    <TextField
                        name="address_line"
                        value={formData.address_line}
                        onChange={onChange}
                        placeholder="Enter street address"
                        size="small"
                        fullWidth
                        required
                        error={!!errors.address_line?.[0]}
                        helperText={errors.address_line?.[0]}
                        sx={USERS_TEXT_FIELD_STYLES}
                    />
                </Box>

                <Box sx={USERS_FIELD_BOX_STYLES}>
                    <Typography sx={USERS_FIELD_LABEL_STYLES}>
                        <FiNavigation size={14} style={{ marginRight: '4px' }} />
                        Street
                    </Typography>
                    <TextField
                        name="street"
                        value={formData.street}
                        onChange={onChange}
                        placeholder="Enter street name"
                        size="small"
                        fullWidth
                        required
                        error={!!errors.street?.[0]}
                        helperText={errors.street?.[0]}
                        sx={USERS_TEXT_FIELD_STYLES}
                    />
                </Box>

                <Box sx={USERS_FIELD_BOX_STYLES}>
                    <Typography sx={USERS_FIELD_LABEL_STYLES}>
                        <FiMapPin size={14} style={{ marginRight: '4px' }} />
                        City
                    </Typography>
                    <TextField
                        name="city"
                        value={formData.city}
                        onChange={onChange}
                        placeholder="Enter city"
                        size="small"
                        fullWidth
                        required
                        error={!!errors.city?.[0]}
                        helperText={errors.city?.[0]}
                        sx={USERS_TEXT_FIELD_STYLES}
                    />
                </Box>

                <Box sx={USERS_FIELD_BOX_STYLES}>
                    <Typography sx={USERS_FIELD_LABEL_STYLES}>
                        <FiMapPin size={14} style={{ marginRight: '4px' }} />
                        State
                    </Typography>
                    <TextField
                        name="state"
                        value={formData.state}
                        onChange={onChange}
                        placeholder="Enter state/province"
                        size="small"
                        fullWidth
                        required
                        error={!!errors.state?.[0]}
                        helperText={errors.state?.[0]}
                        sx={USERS_TEXT_FIELD_STYLES}
                    />
                </Box>

                <Box sx={USERS_FIELD_BOX_STYLES}>
                    <Typography sx={USERS_FIELD_LABEL_STYLES}>
                        <FiMapPin size={14} style={{ marginRight: '4px' }} />
                        Postal Code
                    </Typography>
                    <TextField
                        name="postcode"
                        value={formData.postcode}
                        onChange={onChange}
                        placeholder="Enter postal code"
                        size="small"
                        fullWidth
                        required
                        error={!!errors.postcode?.[0]}
                        helperText={errors.postcode?.[0]}
                        sx={USERS_TEXT_FIELD_STYLES}
                    />
                </Box>

                <Box sx={USERS_FIELD_BOX_STYLES}>
                    <Typography sx={USERS_FIELD_LABEL_STYLES}>
                        <FiMapPin size={14} style={{ marginRight: '4px' }} />
                        Country
                    </Typography>
                    <FormControl fullWidth size="small" error={!!errors.country?.[0]}>
                        <Select
                            name="country"
                            value={formData.country}
                            onChange={onChange}
                            displayEmpty
                            sx={USERS_SELECT_STYLES}
                        >
                            <MenuItem value="" disabled>
                                <em>Select country</em>
                            </MenuItem>
                            {COUNTRIES.map((country) => (
                                <MenuItem key={country.code} value={country.code} sx={USERS_MENU_ITEM_STYLES}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.country?.[0] && <FormHelperText>{errors.country[0]}</FormHelperText>}
                    </FormControl>
                </Box>
            </Box>
        </Paper>
    );
};
