import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Paper } from '@mui/material';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { IAutocomplete } from '../../ui';
import {
    LEADS_ACCORDION_STYLES,
    LEADS_ACCORDION_SUMMARY_STYLES,
    LEADS_ACCORDION_TITLE_STYLES,
    LEADS_FIELD_CONTAINER_STYLES,
} from '../../../styles/LeadsStyles';

interface LeadTeamSectionProps {
    selectedContacts: any[];
    selectedAssignTo: any[];
    selectedTags: any[];
    onContactsChange: (name: string, value: any[]) => void;
    onAssignToChange: (name: string, value: any[]) => void;
    onTagsChange: (name: string, value: any[]) => void;
    errors: Record<string, string>;
    disabled?: boolean;
    contacts?: any[];
    users?: any[];
    tags?: any[];
}

export const LeadTeamSection: React.FC<LeadTeamSectionProps> = ({
    selectedContacts,
    selectedAssignTo,
    selectedTags,
    onContactsChange,
    onAssignToChange,
    onTagsChange,
    errors,
    disabled = false,
    contacts = [],
    users = [],
    tags = [],
}) => {
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
                    <Typography sx={LEADS_ACCORDION_TITLE_STYLES}>Team & Assignment</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={LEADS_FIELD_CONTAINER_STYLES}>
                        {/* Assign To */}
                        <IAutocomplete
                            label="Assign To"
                            name="assigned_to"
                            value={selectedAssignTo}
                            options={users}
                            onChange={onAssignToChange}
                            getOptionLabel={(option: any) => option?.user__email || ''}
                            error={errors.assigned_to}
                            disabled={disabled}
                            placeholder="Add users"
                            limitTags={2}
                        />

                        {/* Contact Name */}
                        <IAutocomplete
                            label="Contact Name"
                            name="contacts"
                            value={selectedContacts}
                            options={contacts}
                            onChange={onContactsChange}
                            getOptionLabel={(option: any) => option?.first_name || ''}
                            error={errors.contacts}
                            disabled={disabled}
                            placeholder="Add contacts"
                            limitTags={2}
                        />

                        {/* Tags - Full Width */}
                        <IAutocomplete
                            label="Tags"
                            name="tags"
                            value={selectedTags}
                            options={tags}
                            onChange={onTagsChange}
                            getOptionLabel={(option: any) => option}
                            error={errors.tags}
                            disabled={disabled}
                            placeholder="Add tags"
                            limitTags={5}
                            fullWidth
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};
