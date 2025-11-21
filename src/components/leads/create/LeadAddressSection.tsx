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
    LEADS_ACCORDION_STYLES,
    LEADS_ACCORDION_SUMMARY_STYLES,
    LEADS_ACCORDION_TITLE_STYLES,
    LEADS_EXPAND_ICON_STYLES,
    LEADS_FIELD_BOX_STYLES,
    LEADS_FIELD_CONTAINER_STYLES,
    LEADS_FIELD_LABEL_STYLES,
    LEADS_TEXT_FIELD_STYLES,
    LEADS_SELECT_STYLES,
    LEADS_MENU_ITEM_STYLES,
} from '../../../styles/LeadsStyles';

interface LeadAddressSectionProps {
    address: {
        address_line: string;
        street: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
    };
    onChange: (e: any) => void;
    errors: Record<string, string>;
    disabled?: boolean;
    countries?: any[];
}

export const LeadAddressSection: React.FC<LeadAddressSectionProps> = ({
    address,
    onChange,
    errors,
    disabled = false,
    countries = [],
}) => {
    return (
        <Paper elevation={0} sx={{ mb: 3 }}>
            <Accordion defaultExpanded sx={LEADS_ACCORDION_STYLES}>
                <AccordionSummary
                    expandIcon={
                        <Box sx={LEADS_EXPAND_ICON_STYLES}>
                            <FiChevronDown style={{ fontSize: '20px', color: '#6b7280' }} />
                        </Box>
                    }
                    sx={LEADS_ACCORDION_SUMMARY_STYLES}
                >
                    <Typography sx={LEADS_ACCORDION_TITLE_STYLES}>Address Information</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={LEADS_FIELD_CONTAINER_STYLES}>
                        {/* Address Line */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Address Line</Typography>
                            <TextField
                                name="address_line"
                                value={address.address_line}
                                onChange={onChange}
                                placeholder="Enter street address"
                                size="small"
                                fullWidth
                                error={!!errors.address_line}
                                helperText={errors.address_line}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Street */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Street</Typography>
                            <TextField
                                name="street"
                                value={address.street}
                                onChange={onChange}
                                placeholder="Enter street name"
                                size="small"
                                fullWidth
                                error={!!errors.street}
                                helperText={errors.street}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* City */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>City</Typography>
                            <TextField
                                name="city"
                                value={address.city}
                                onChange={onChange}
                                placeholder="Enter city"
                                size="small"
                                fullWidth
                                error={!!errors.city}
                                helperText={errors.city}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* State */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>State</Typography>
                            <TextField
                                name="state"
                                value={address.state}
                                onChange={onChange}
                                placeholder="Enter state/province"
                                size="small"
                                fullWidth
                                error={!!errors.state}
                                helperText={errors.state}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Postal Code */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Postal Code</Typography>
                            <TextField
                                name="postcode"
                                value={address.postcode}
                                onChange={onChange}
                                placeholder="Enter postal code"
                                size="small"
                                fullWidth
                                error={!!errors.postcode}
                                helperText={errors.postcode}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Country */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Country</Typography>
                            <FormControl fullWidth size="small" error={!!errors.country}>
                                <Select
                                    name="country"
                                    value={address.country}
                                    onChange={onChange}
                                    disabled={disabled}
                                    displayEmpty
                                    sx={LEADS_SELECT_STYLES}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                mt: 1,
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                                borderRadius: '8px',
                                                maxHeight: '300px',
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Select country</em>
                                    </MenuItem>
                                    {countries.length > 0 ? (
                                        countries.map((option: any) => (
                                            <MenuItem key={option[0]} value={option[0]} sx={LEADS_MENU_ITEM_STYLES}>
                                                {option[1]}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="">No countries available</MenuItem>
                                    )}
                                </Select>
                                {errors.country && <FormHelperText>{errors.country}</FormHelperText>}
                            </FormControl>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};
