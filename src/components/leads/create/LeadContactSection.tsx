import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Paper } from '@mui/material';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { ITextField } from '../../ui';
import {
    LEADS_ACCORDION_STYLES,
    LEADS_ACCORDION_SUMMARY_STYLES,
    LEADS_ACCORDION_TITLE_STYLES,
    LEADS_FIELD_CONTAINER_STYLES,
} from '../../../styles/LeadsStyles';

interface LeadContactSectionProps {
    data: {
        first_name: string;
        last_name: string;
        title: string;
        phone: string;
        email: string;
    };
    onChange: (e: any) => void;
    errors: Record<string, string>;
    disabled?: boolean;
}

export const LeadContactSection: React.FC<LeadContactSectionProps> = ({ data, onChange, errors, disabled = false }) => {
    return (
        <Paper elevation={0} sx={{ mb: 3 }}>
            <Accordion defaultExpanded sx={LEADS_ACCORDION_STYLES}>
                <AccordionSummary
                    expandIcon={
                        <Box sx={{ backgroundColor: '#f3f4f6', borderRadius: '8px', p: 0.5 }}>
                            <FiChevronDown style={{ fontSize: '20px', color: '#6b7280' }} />
                        </Box>
                    }
                    sx={LEADS_ACCORDION_SUMMARY_STYLES}
                >
                    <Typography sx={LEADS_ACCORDION_TITLE_STYLES}>Contact Information</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={LEADS_FIELD_CONTAINER_STYLES}>
                        {/* First Name - REQUIRED */}
                        <ITextField
                            label="First Name"
                            name="first_name"
                            value={data.first_name}
                            onChange={onChange}
                            error={errors.first_name}
                            disabled={disabled}
                            required
                            placeholder="Enter first name"
                        />

                        {/* Last Name - REQUIRED */}
                        <ITextField
                            label="Last Name"
                            name="last_name"
                            value={data.last_name}
                            onChange={onChange}
                            error={errors.last_name}
                            disabled={disabled}
                            required
                            placeholder="Enter last name"
                        />

                        {/* Job Title */}
                        <ITextField
                            label="Job Title"
                            name="title"
                            value={data.title}
                            onChange={onChange}
                            error={errors.title}
                            disabled={disabled}
                            required
                            placeholder="Enter job title"
                        />

                        {/* Phone - REQUIRED */}
                        <ITextField
                            label="Phone Number"
                            name="phone"
                            type="tel"
                            value={data.phone}
                            onChange={onChange}
                            error={errors.phone}
                            disabled={disabled}
                            required
                            placeholder="+1 (555) 123-4567"
                        />

                        {/* Email - REQUIRED */}
                        <ITextField
                            label="Email Address"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={onChange}
                            error={errors.email}
                            disabled={disabled}
                            required
                            placeholder="email@company.com"
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};
