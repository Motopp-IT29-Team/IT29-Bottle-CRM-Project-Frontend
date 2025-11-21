import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, TextField, Paper } from '@mui/material';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { RequiredTextField } from '../../../styles/CssStyled';
import {
    LEADS_ACCORDION_STYLES,
    LEADS_ACCORDION_SUMMARY_STYLES,
    LEADS_ACCORDION_TITLE_STYLES,
    LEADS_EXPAND_ICON_STYLES,
    LEADS_FIELD_BOX_STYLES,
    LEADS_FIELD_CONTAINER_STYLES,
    LEADS_FIELD_LABEL_STYLES,
    LEADS_TEXT_FIELD_STYLES,
    LEADS_REQUIRED_ASTERISK_STYLES,
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
                        <Box sx={LEADS_EXPAND_ICON_STYLES}>
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
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>
                                First Name <span style={LEADS_REQUIRED_ASTERISK_STYLES}>*</span>
                            </Typography>
                            <RequiredTextField
                                required
                                name="first_name"
                                value={data.first_name}
                                onChange={onChange}
                                placeholder="Enter first name"
                                size="small"
                                error={!!errors.first_name}
                                helperText={errors.first_name}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Last Name */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>
                                Last Name <span style={LEADS_REQUIRED_ASTERISK_STYLES}>*</span>
                            </Typography>
                            <RequiredTextField
                                required
                                name="last_name"
                                value={data.last_name}
                                onChange={onChange}
                                placeholder="Enter last name"
                                size="small"
                                error={!!errors.last_name}
                                helperText={errors.last_name}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Job Title */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Job Title</Typography>
                            <TextField
                                name="title"
                                value={data.title}
                                onChange={onChange}
                                placeholder="Enter job title"
                                size="small"
                                error={!!errors.title}
                                helperText={errors.title}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Phone */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>
                                Phone Number <span style={LEADS_REQUIRED_ASTERISK_STYLES}>*</span>
                            </Typography>
                            <RequiredTextField
                                required
                                name="phone"
                                value={data.phone}
                                onChange={onChange}
                                placeholder="+1 (555) 123-4567"
                                size="small"
                                error={!!errors.phone}
                                helperText={errors.phone}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Email */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>
                                Email Address <span style={LEADS_REQUIRED_ASTERISK_STYLES}>*</span>
                            </Typography>
                            <RequiredTextField
                                required
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={onChange}
                                placeholder="email@company.com"
                                size="small"
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};
