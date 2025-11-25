import React from 'react';
import { Box, Typography, Select, MenuItem, FormControl, FormHelperText } from '@mui/material';
import { MENU_ITEM_STYLES, SELECT_STYLES } from '../../styles/ISelectStyles';
import { FIELD_BOX_STYLES, FIELD_LABEL_STYLES, REQUIRED_ASTERISK_STYLES } from '../../styles/UIStyles';

interface Props {
    label: string;
    name: string;
    value: string | number;
    options: Array<{ value: string | number; label: string; badge?: string }>;
    onChange: (e: any) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    renderBadge?: (option: any) => React.ReactNode;
}

export const ISelect: React.FC<Props> = ({
    label,
    name,
    value,
    options,
    onChange,
    error,
    disabled = false,
    required = false,
    placeholder = 'Select an option',
    renderBadge,
}) => {
    return (
        <Box sx={FIELD_BOX_STYLES}>
            <Typography sx={FIELD_LABEL_STYLES}>
                {label} {required && <span style={REQUIRED_ASTERISK_STYLES}>*</span>}
            </Typography>
            <FormControl fullWidth size="small" error={!!error}>
                <Select
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    displayEmpty
                    sx={SELECT_STYLES}
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
                    {placeholder && (
                        <MenuItem value="" disabled key="placeholder">
                            <em>{placeholder}</em>
                        </MenuItem>
                    )}
                    {options.map((option, index) => (
                        <MenuItem key={option.value ?? `option-${index}`} value={option.value} sx={MENU_ITEM_STYLES}>
                            {renderBadge ? renderBadge(option) : option.label}
                        </MenuItem>
                    ))}
                </Select>
                {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
        </Box>
    );
};
