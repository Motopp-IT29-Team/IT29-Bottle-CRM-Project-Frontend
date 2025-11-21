import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FaUpload } from 'react-icons/fa';
import {
    LEADS_ACCORDION_STYLES,
    LEADS_ACCORDION_SUMMARY_STYLES,
    LEADS_ACCORDION_TITLE_STYLES,
    LEADS_EXPAND_ICON_STYLES,
    LEADS_FIELD_BOX_STYLES,
    LEADS_FIELD_CONTAINER_STYLES,
    LEADS_FIELD_LABEL_STYLES,
    LEADS_TEXT_FIELD_STYLES,
} from '../../../styles/LeadsStyles';

interface LeadDescriptionSectionProps {
    description: string;
    leadAttachment: string | null;
    onDescriptionChange: (content: string) => void;
    onFileChange: (file: File | null) => void;
    errors: Record<string, string>;
    disabled?: boolean;
}

export const LeadDescriptionSection: React.FC<LeadDescriptionSectionProps> = ({
    description,
    leadAttachment,
    onDescriptionChange,
    onFileChange,
    errors,
    disabled = false,
}) => {
    const handleDescriptionInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onDescriptionChange(e.target.value);
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onFileChange(file);
    };

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
                    <Typography sx={LEADS_ACCORDION_TITLE_STYLES}>Additional Details</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={LEADS_FIELD_CONTAINER_STYLES}>
                        {/* Description */}
                        <Box sx={{ ...LEADS_FIELD_BOX_STYLES, gridColumn: 'span 2' }}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Description</Typography>
                            <TextField
                                name="description"
                                value={description}
                                onChange={handleDescriptionInput}
                                placeholder="Enter additional notes about this lead..."
                                multiline
                                rows={4}
                                fullWidth
                                error={!!errors.description}
                                helperText={errors.description}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Lead Attachment */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Lead Attachment</Typography>
                            <TextField
                                name="lead_attachment"
                                value={leadAttachment || ''}
                                placeholder="No file selected"
                                size="small"
                                fullWidth
                                disabled
                                error={!!errors.lead_attachment}
                                helperText={errors.lead_attachment}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                component="label"
                                                disabled={disabled}
                                                sx={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: '#f3f4f6',
                                                    borderRadius: '0 6px 6px 0',
                                                    mr: '-14px',
                                                    cursor: 'pointer',
                                                    '&:hover': {
                                                        backgroundColor: '#e5e7eb',
                                                    },
                                                }}
                                            >
                                                <input
                                                    hidden
                                                    accept="image/*,application/pdf,.doc,.docx"
                                                    type="file"
                                                    onChange={handleFileInputChange}
                                                />
                                                <FaUpload style={{ fontSize: '14px', color: '#6b7280' }} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};
