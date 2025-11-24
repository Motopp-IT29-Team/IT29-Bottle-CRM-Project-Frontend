import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Paper } from '@mui/material';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { ITextField, IFileUpload } from '../../ui';
import {
    LEADS_ACCORDION_STYLES,
    LEADS_ACCORDION_SUMMARY_STYLES,
    LEADS_ACCORDION_TITLE_STYLES,
    LEADS_FIELD_CONTAINER_STYLES,
} from '../../../styles/LeadsStyles';
import { FIELD_BOX_STYLES } from '../../../styles/UIStyles';

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
    const handleDescriptionInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onDescriptionChange(e.target.value);
    };

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
                    <Typography sx={LEADS_ACCORDION_TITLE_STYLES}>Additional Details</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={LEADS_FIELD_CONTAINER_STYLES}>
                        {/* Description - Full Width */}
                        <Box sx={{ ...FIELD_BOX_STYLES, gridColumn: 'span 2' }}>
                            <ITextField
                                label="Description"
                                name="description"
                                value={description}
                                onChange={handleDescriptionInput}
                                error={errors.description}
                                disabled={disabled}
                                placeholder="Enter additional notes about this lead..."
                                multiline
                                rows={4}
                            />
                        </Box>

                        {/* Lead Attachment */}
                        <IFileUpload
                            label="Lead Attachment"
                            name="lead_attachment"
                            value={leadAttachment}
                            onChange={onFileChange}
                            error={errors.lead_attachment}
                            disabled={disabled}
                            placeholder="No file selected"
                            accept="image/*,application/pdf,.doc,.docx"
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};
