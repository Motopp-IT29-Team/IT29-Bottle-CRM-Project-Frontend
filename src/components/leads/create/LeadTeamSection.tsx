import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Paper,
    Autocomplete,
    TextField,
    Chip,
    FormControl,
    FormHelperText,
} from '@mui/material';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FaTimes } from 'react-icons/fa';
import {
    LEADS_ACCORDION_STYLES,
    LEADS_ACCORDION_SUMMARY_STYLES,
    LEADS_ACCORDION_TITLE_STYLES,
    LEADS_EXPAND_ICON_STYLES,
    LEADS_FIELD_BOX_STYLES,
    LEADS_FIELD_CONTAINER_STYLES,
    LEADS_FIELD_LABEL_STYLES,
    LEADS_AUTOCOMPLETE_STYLES,
    LEADS_CHIP_STYLES,
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
                        <Box sx={LEADS_EXPAND_ICON_STYLES}>
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
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Assign To</Typography>
                            <FormControl fullWidth error={!!errors.assigned_to}>
                                <Autocomplete
                                    multiple
                                    value={selectedAssignTo}
                                    options={users}
                                    getOptionLabel={(option: any) => option?.user__email || ''}
                                    onChange={(e: any, value: any) => onAssignToChange('assigned_to', value)}
                                    disabled={disabled}
                                    size="small"
                                    limitTags={2}
                                    filterSelectedOptions
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                label={option?.user__email}
                                                deleteIcon={<FaTimes style={{ fontSize: '12px' }} />}
                                                {...getTagProps({ index })}
                                                sx={LEADS_CHIP_STYLES}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="Add users" sx={LEADS_AUTOCOMPLETE_STYLES} />
                                    )}
                                    sx={LEADS_AUTOCOMPLETE_STYLES}
                                />
                                {errors.assigned_to && <FormHelperText>{errors.assigned_to}</FormHelperText>}
                            </FormControl>
                        </Box>

                        {/* Contact Name */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Contact Name</Typography>
                            <FormControl fullWidth error={!!errors.contacts}>
                                <Autocomplete
                                    multiple
                                    value={selectedContacts}
                                    options={contacts}
                                    getOptionLabel={(option: any) => option?.first_name || ''}
                                    onChange={(e: any, value: any) => onContactsChange('contacts', value)}
                                    disabled={disabled}
                                    size="small"
                                    limitTags={2}
                                    filterSelectedOptions
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                label={option?.first_name}
                                                deleteIcon={<FaTimes style={{ fontSize: '12px' }} />}
                                                {...getTagProps({ index })}
                                                sx={LEADS_CHIP_STYLES}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="Add contacts"
                                            sx={LEADS_AUTOCOMPLETE_STYLES}
                                        />
                                    )}
                                    sx={LEADS_AUTOCOMPLETE_STYLES}
                                />
                                {errors.contacts && <FormHelperText>{errors.contacts}</FormHelperText>}
                            </FormControl>
                        </Box>

                        {/* Tags */}
                        <Box sx={{ ...LEADS_FIELD_BOX_STYLES, gridColumn: 'span 2' }}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Tags</Typography>
                            <FormControl fullWidth error={!!errors.tags}>
                                <Autocomplete
                                    multiple
                                    value={selectedTags}
                                    options={tags}
                                    getOptionLabel={(option: any) => option}
                                    onChange={(e: any, value: any) => onTagsChange('tags', value)}
                                    disabled={disabled}
                                    size="small"
                                    limitTags={5}
                                    filterSelectedOptions
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                label={option}
                                                deleteIcon={<FaTimes style={{ fontSize: '12px' }} />}
                                                {...getTagProps({ index })}
                                                sx={LEADS_CHIP_STYLES}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} placeholder="Add tags" sx={LEADS_AUTOCOMPLETE_STYLES} />
                                    )}
                                    sx={LEADS_AUTOCOMPLETE_STYLES}
                                />
                                {errors.tags && <FormHelperText>{errors.tags}</FormHelperText>}
                            </FormControl>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};
