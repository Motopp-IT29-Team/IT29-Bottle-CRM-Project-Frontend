import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    TextField,
    MenuItem,
    Select,
    FormControl,
    FormHelperText,
    Paper,
    InputAdornment,
    IconButton,
} from '@mui/material';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FaPercent } from 'react-icons/fa';
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
    LEADS_SELECT_STYLES,
    LEADS_MENU_ITEM_STYLES,
    LEADS_REQUIRED_ASTERISK_STYLES,
    getStatusBadgeColor,
    getSourceBadgeColor,
    LEADS_STATUS_BADGE_STYLES,
    LEADS_STATUS_TEXT_STYLES,
} from '../../../styles/LeadsStyles';

interface LeadInformationSectionProps {
    data: {
        account_name: string;
        opportunity_amount: string;
        website: string;
        industry: string;
        status: string;
        source: string;
        probability: number;
        skype_ID: string;
    };
    onChange: (e: any) => void;
    errors: Record<string, string>;
    disabled?: boolean;
    industries?: any[];
    statuses?: any[];
    sources?: any[];
}

export const LeadInformationSection: React.FC<LeadInformationSectionProps> = ({
    data,
    onChange,
    errors,
    disabled = false,
    industries = [],
    statuses = [],
    sources = [],
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
                    <Typography sx={LEADS_ACCORDION_TITLE_STYLES}>Lead Information</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={LEADS_FIELD_CONTAINER_STYLES}>
                        {/* Company Name - REQUIRED */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>
                                Company Name <span style={LEADS_REQUIRED_ASTERISK_STYLES}>*</span>
                            </Typography>
                            <RequiredTextField
                                required
                                name="account_name"
                                value={data.account_name}
                                onChange={onChange}
                                placeholder="Enter company name"
                                size="small"
                                error={!!errors.account_name}
                                helperText={errors.account_name}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Lead Source - REQUIRED */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>
                                Lead Source <span style={LEADS_REQUIRED_ASTERISK_STYLES}>*</span>
                            </Typography>
                            <FormControl fullWidth size="small" error={!!errors.source}>
                                <Select
                                    name="source"
                                    value={data.source}
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
                                        <em>Select source</em>
                                    </MenuItem>
                                    {sources.length > 0 ? (
                                        sources.map((option: any) => (
                                            <MenuItem key={option[0]} value={option[0]} sx={LEADS_MENU_ITEM_STYLES}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box
                                                        sx={{
                                                            ...LEADS_STATUS_BADGE_STYLES,
                                                            backgroundColor: getSourceBadgeColor(option[1]),
                                                        }}
                                                    />
                                                    <Typography sx={LEADS_STATUS_TEXT_STYLES}>{option[1]}</Typography>
                                                </Box>
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="">No sources available</MenuItem>
                                    )}
                                </Select>
                                {errors.source && <FormHelperText>{errors.source}</FormHelperText>}
                            </FormControl>
                        </Box>

                        {/* Industry */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Industry</Typography>
                            <FormControl fullWidth size="small">
                                <Select
                                    name="industry"
                                    value={data.industry}
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
                                        <em>Select industry</em>
                                    </MenuItem>
                                    {industries.length > 0 ? (
                                        industries.map((option: any) => (
                                            <MenuItem
                                                key={option[0]}
                                                value={option[0]}
                                                sx={{
                                                    ...LEADS_MENU_ITEM_STYLES,
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {option[1].toLowerCase()}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="">No industries available</MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Status - REQUIRED */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>
                                Status <span style={LEADS_REQUIRED_ASTERISK_STYLES}>*</span>
                            </Typography>
                            <FormControl fullWidth size="small" error={!!errors.status}>
                                <Select
                                    name="status"
                                    value={data.status}
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
                                        <em>Select status</em>
                                    </MenuItem>
                                    {statuses.length > 0 ? (
                                        statuses.map((option: any) => (
                                            <MenuItem key={option[0]} value={option[0]} sx={LEADS_MENU_ITEM_STYLES}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                    <Box
                                                        sx={{
                                                            ...LEADS_STATUS_BADGE_STYLES,
                                                            backgroundColor: getStatusBadgeColor(option[1]),
                                                        }}
                                                    />
                                                    <Typography sx={LEADS_STATUS_TEXT_STYLES}>
                                                        {option[1].toLowerCase()}
                                                    </Typography>
                                                </Box>
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem value="">No statuses available</MenuItem>
                                    )}
                                </Select>
                                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                            </FormControl>
                        </Box>

                        {/* Website */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Website</Typography>
                            <TextField
                                name="website"
                                value={data.website}
                                onChange={onChange}
                                placeholder="https://company.com"
                                size="small"
                                error={!!errors.website}
                                helperText={errors.website}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Opportunity Amount */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Opportunity Amount</Typography>
                            <TextField
                                name="opportunity_amount"
                                type="number"
                                value={data.opportunity_amount}
                                onChange={onChange}
                                placeholder="0"
                                size="small"
                                error={!!errors.opportunity_amount}
                                helperText={errors.opportunity_amount}
                                disabled={disabled}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Probability */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Probability (%)</Typography>
                            <TextField
                                name="probability"
                                type="number"
                                value={data.probability}
                                onChange={onChange}
                                placeholder="50"
                                size="small"
                                error={!!errors.probability}
                                helperText={errors.probability}
                                disabled={disabled}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                disableFocusRipple
                                                disableTouchRipple
                                                sx={{
                                                    backgroundColor: '#f3f4f6',
                                                    width: '40px',
                                                    borderRadius: '0 6px 6px 0',
                                                    mr: '-14px',
                                                    '&:hover': {
                                                        backgroundColor: '#e5e7eb',
                                                    },
                                                }}
                                            >
                                                <FaPercent style={{ width: '12px', color: '#6b7280' }} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={LEADS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Skype ID */}
                        <Box sx={LEADS_FIELD_BOX_STYLES}>
                            <Typography sx={LEADS_FIELD_LABEL_STYLES}>Skype ID</Typography>
                            <TextField
                                name="skype_ID"
                                value={data.skype_ID}
                                onChange={onChange}
                                placeholder="Enter Skype ID"
                                size="small"
                                error={!!errors.skype_ID}
                                helperText={errors.skype_ID}
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
