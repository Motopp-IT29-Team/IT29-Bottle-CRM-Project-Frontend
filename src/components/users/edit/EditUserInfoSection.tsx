import React from 'react';
import { Paper, Box, Typography, TextField, MenuItem, Select, FormControl, Switch } from '@mui/material';
import { FiUser } from '@react-icons/all-files/fi/FiUser';
import { FiMail } from '@react-icons/all-files/fi/FiMail';
import { FiShield } from '@react-icons/all-files/fi/FiShield';
import { FiLock } from '@react-icons/all-files/fi/FiLock';
import { FiToggleLeft } from '@react-icons/all-files/fi/FiToggleLeft';
import {
    USERS_FIELD_BOX_STYLES,
    USERS_FIELD_LABEL_STYLES,
    USERS_TEXT_FIELD_STYLES,
    USERS_SELECT_STYLES,
    USERS_MENU_ITEM_STYLES,
    USER_FIELD_CONTAINER_STYLES,
    USERS_REQUIRED_ASTERISK_STYLES,
} from '../../../styles/UsersStyles';

interface EditUserInfoSectionProps {
    formData: {
        email: string;
        first_name: string;
        last_name: string;
        role: string;
    };
    password: string;
    isActive: boolean;
    isTogglingStatus: boolean;
    isCurrentUser: boolean;
    onChange: (e: any) => void;
    onPasswordChange: (value: string) => void;
    onToggleStatus: () => void;
    errors: {
        email?: string[];
        first_name?: string[];
        last_name?: string[];
        role?: string[];
        password?: string[];
    };
}

export const EditUserInfoSection: React.FC<EditUserInfoSectionProps> = ({
    formData,
    password,
    isActive,
    isTogglingStatus,
    isCurrentUser,
    onChange,
    onPasswordChange,
    onToggleStatus,
    errors,
}) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                mb: 3,
            }}
        >
            <Typography
                sx={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#111827',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <FiUser size={20} />
                User Information
            </Typography>

            <Box sx={USER_FIELD_CONTAINER_STYLES}>
                {/* First Name */}
                <Box sx={USERS_FIELD_BOX_STYLES}>
                    <Typography sx={USERS_FIELD_LABEL_STYLES}>
                        <FiUser size={14} style={{ marginRight: '4px' }} />
                        First Name <span style={USERS_REQUIRED_ASTERISK_STYLES}>*</span>
                    </Typography>
                    <TextField
                        name="first_name"
                        value={formData.first_name}
                        onChange={onChange}
                        placeholder="Enter first name"
                        size="small"
                        fullWidth
                        required
                        error={!!errors.first_name?.[0]}
                        helperText={errors.first_name?.[0]}
                        sx={USERS_TEXT_FIELD_STYLES}
                    />
                </Box>

                {/* Last Name */}
                <Box sx={USERS_FIELD_BOX_STYLES}>
                    <Typography sx={USERS_FIELD_LABEL_STYLES}>
                        <FiUser size={14} style={{ marginRight: '4px' }} />
                        Last Name <span style={USERS_REQUIRED_ASTERISK_STYLES}>*</span>
                    </Typography>
                    <TextField
                        name="last_name"
                        value={formData.last_name}
                        onChange={onChange}
                        placeholder="Enter last name"
                        size="small"
                        fullWidth
                        required
                        error={!!errors.last_name?.[0]}
                        helperText={errors.last_name?.[0]}
                        sx={USERS_TEXT_FIELD_STYLES}
                    />
                </Box>

                {/* Email */}
                <Box sx={USERS_FIELD_BOX_STYLES}>
                    <Typography sx={USERS_FIELD_LABEL_STYLES}>
                        <FiMail size={14} style={{ marginRight: '4px' }} />
                        Email <span style={USERS_REQUIRED_ASTERISK_STYLES}>*</span>
                    </Typography>
                    <TextField
                        name="email"
                        value={formData.email}
                        onChange={onChange}
                        placeholder="Enter email address"
                        size="small"
                        fullWidth
                        required
                        error={!!errors.email?.[0]}
                        helperText={errors.email?.[0]}
                        sx={USERS_TEXT_FIELD_STYLES}
                    />
                </Box>

                {/* Role */}
                <Box sx={USERS_FIELD_BOX_STYLES}>
                    <Typography sx={USERS_FIELD_LABEL_STYLES}>
                        <FiShield size={14} style={{ marginRight: '4px' }} />
                        Role
                    </Typography>
                    <FormControl fullWidth size="small">
                        <Select name="role" value={formData.role} onChange={onChange} sx={USERS_SELECT_STYLES}>
                            <MenuItem value="ADMIN" sx={USERS_MENU_ITEM_STYLES}>
                                ADMIN
                            </MenuItem>
                            <MenuItem value="USER" sx={USERS_MENU_ITEM_STYLES}>
                                USER
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* Password */}
                <Box sx={USERS_FIELD_BOX_STYLES}>
                    <Typography sx={USERS_FIELD_LABEL_STYLES}>
                        <FiLock size={14} style={{ marginRight: '4px' }} />
                        New Password (optional)
                    </Typography>
                    <TextField
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        placeholder="Leave blank to keep current password"
                        size="small"
                        fullWidth
                        error={!!errors.password?.[0]}
                        helperText={errors.password?.[0] || 'Minimum 8 characters'}
                        sx={USERS_TEXT_FIELD_STYLES}
                    />
                </Box>

                {/* Account Status Toggle */}
                <Box sx={USERS_FIELD_BOX_STYLES}>
                    <Typography sx={USERS_FIELD_LABEL_STYLES}>
                        <FiToggleLeft size={14} style={{ marginRight: '4px' }} />
                        Account Status
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingX: 2,
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            backgroundColor: isCurrentUser ? '#f9fafb' : isActive ? '#f0fdf4' : '#fef2f2',
                            transition: 'all 0.3s ease',
                            opacity: isCurrentUser ? 0.6 : 1,
                        }}
                    >
                        <Box>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: isCurrentUser ? '#6b7280' : isActive ? '#10b981' : '#ef4444',
                                    mb: 0.5,
                                }}
                            >
                                {isActive ? 'Active' : 'Inactive'}
                            </Typography>
                            {isCurrentUser && (
                                <Typography
                                    sx={{
                                        fontSize: '12px',
                                        color: '#9ca3af',
                                    }}
                                >
                                    Cannot deactivate your own account
                                </Typography>
                            )}
                        </Box>
                        <Switch
                            checked={isActive}
                            onChange={onToggleStatus}
                            disabled={isTogglingStatus || isCurrentUser}
                            sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                    color: '#10b981',
                                },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                    backgroundColor: '#10b981',
                                },
                                '& .MuiSwitch-track': {
                                    backgroundColor: isActive ? '#10b981' : '#ef4444',
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};
