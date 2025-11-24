import React from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    MenuItem,
    Select,
    FormControl,
    Paper,
} from '@mui/material';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { RequiredTextField } from '../../../styles/CssStyled';
import {
    USERS_ACCORDION_STYLES,
    USERS_ACCORDION_SUMMARY_STYLES,
    USERS_ACCORDION_TITLE_STYLES,
    USERS_EXPAND_ICON_STYLES,
    USERS_FIELD_BOX_STYLES,
    USERS_FIELD_CONTAINER_STYLES,
    USERS_FIELD_LABEL_STYLES,
    USERS_TEXT_FIELD_STYLES,
    USERS_SELECT_STYLES,
    USERS_MENU_ITEM_STYLES,
    USERS_ROLE_BADGE_STYLES,
    USERS_ROLE_TEXT_STYLES,
    USERS_REQUIRED_ASTERISK_STYLES,
    getRoleBadgeColor,
} from '../../../styles/UsersStyles';

interface UsersInfoSectionProps {
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    onChange: (e: any) => void;
    errors: Record<string, string | string[]>;
    disabled?: boolean;
}

export const USERS_ROLES = [
    { value: 'ADMIN', label: 'Administrator' },
    { value: 'USER', label: 'User' },
];

export const UsersInfoSection: React.FC<UsersInfoSectionProps> = ({
    email,
    first_name,
    last_name,
    role,
    onChange,
    errors,
    disabled = false,
}) => {
    return (
        <Paper elevation={0} sx={{ mb: 3 }}>
            <Accordion defaultExpanded sx={USERS_ACCORDION_STYLES}>
                <AccordionSummary
                    expandIcon={
                        <Box sx={USERS_EXPAND_ICON_STYLES}>
                            <FiChevronDown style={{ fontSize: '20px', color: '#6b7280' }} />
                        </Box>
                    }
                    sx={USERS_ACCORDION_SUMMARY_STYLES}
                >
                    <Typography sx={USERS_ACCORDION_TITLE_STYLES}>User Information</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={USERS_FIELD_CONTAINER_STYLES}>
                        {/* First Name */}
                        <Box sx={USERS_FIELD_BOX_STYLES}>
                            <Typography sx={USERS_FIELD_LABEL_STYLES}>
                                First Name <span style={USERS_REQUIRED_ASTERISK_STYLES}>*</span>
                            </Typography>
                            <RequiredTextField
                                required
                                name="first_name"
                                value={first_name}
                                onChange={onChange}
                                placeholder="Enter first name"
                                size="small"
                                error={!!errors.first_name}
                                helperText={errors.first_name}
                                disabled={disabled}
                                sx={USERS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Last Name */}
                        <Box sx={USERS_FIELD_BOX_STYLES}>
                            <Typography sx={USERS_FIELD_LABEL_STYLES}>
                                Last Name <span style={USERS_REQUIRED_ASTERISK_STYLES}>*</span>
                            </Typography>
                            <RequiredTextField
                                required
                                name="last_name"
                                value={last_name}
                                onChange={onChange}
                                placeholder="Enter last name"
                                size="small"
                                error={!!errors.last_name}
                                helperText={errors.last_name}
                                disabled={disabled}
                                sx={USERS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Email Address */}
                        <Box sx={USERS_FIELD_BOX_STYLES}>
                            <Typography sx={USERS_FIELD_LABEL_STYLES}>
                                Email Address <span style={USERS_REQUIRED_ASTERISK_STYLES}>*</span>
                            </Typography>
                            <RequiredTextField
                                required
                                name="email"
                                type="email"
                                value={email}
                                onChange={onChange}
                                placeholder="Enter email address"
                                size="small"
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={disabled}
                                sx={USERS_TEXT_FIELD_STYLES}
                            />
                        </Box>

                        {/* Role */}
                        <Box sx={USERS_FIELD_BOX_STYLES}>
                            <Typography sx={USERS_FIELD_LABEL_STYLES}>Role</Typography>
                            <FormControl fullWidth size="small">
                                <Select
                                    name="role"
                                    value={role}
                                    onChange={onChange}
                                    disabled={disabled}
                                    displayEmpty
                                    sx={USERS_SELECT_STYLES}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                mt: 1,
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                                borderRadius: '8px',
                                                maxHeight: '300px',
                                                '& .MuiList-root': {
                                                    py: 0,
                                                },
                                            },
                                        },
                                    }}
                                >
                                    {USERS_ROLES.map((option) => (
                                        <MenuItem key={option.value} value={option.value} sx={USERS_MENU_ITEM_STYLES}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box
                                                    sx={{
                                                        ...USERS_ROLE_BADGE_STYLES,
                                                        backgroundColor: getRoleBadgeColor(option.value),
                                                    }}
                                                />
                                                <Typography sx={USERS_ROLE_TEXT_STYLES}>{option.label}</Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};
