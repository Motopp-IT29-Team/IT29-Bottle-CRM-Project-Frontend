import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Paper } from '@mui/material';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { ISelect, ITextField } from '../../ui';
import {
    LEADS_ACCORDION_STYLES,
    LEADS_ACCORDION_SUMMARY_STYLES,
    LEADS_ACCORDION_TITLE_STYLES,
    LEADS_EXPAND_ICON_STYLES,
    LEADS_FIELD_CONTAINER_STYLES,
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
    // Convert backend array to options format
    const countryOptions = countries.map((opt) => ({ value: opt[0], label: opt[1] }));

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
                        <ITextField
                            label="Address Line"
                            name="address_line"
                            value={address.address_line}
                            onChange={onChange}
                            error={errors.address_line}
                            disabled={disabled}
                            placeholder="Enter street address"
                        />

                        {/* Street */}
                        <ITextField
                            label="Street"
                            name="street"
                            value={address.street}
                            onChange={onChange}
                            error={errors.street}
                            disabled={disabled}
                            placeholder="Enter street name"
                        />

                        {/* City */}
                        <ITextField
                            label="City"
                            name="city"
                            value={address.city}
                            onChange={onChange}
                            error={errors.city}
                            disabled={disabled}
                            placeholder="Enter city"
                        />

                        {/* State */}
                        <ITextField
                            label="State"
                            name="state"
                            value={address.state}
                            onChange={onChange}
                            error={errors.state}
                            disabled={disabled}
                            placeholder="Enter state/province"
                        />

                        {/* Postal Code */}
                        <ITextField
                            label="Postal Code"
                            name="postcode"
                            value={address.postcode}
                            onChange={onChange}
                            error={errors.postcode}
                            disabled={disabled}
                            placeholder="Enter postal code"
                        />

                        {/* Country */}
                        <ISelect
                            label="Country"
                            name="country"
                            value={address.country}
                            options={countryOptions}
                            onChange={onChange}
                            error={errors.country}
                            disabled={disabled}
                            placeholder="Select country"
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};
