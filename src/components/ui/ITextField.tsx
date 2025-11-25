import React from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import { RequiredTextField } from '../../styles/CssStyled';
import { TEXT_FIELD_STYLES } from '../../styles/ITextFieldStyles';
import { FIELD_BOX_STYLES, FIELD_LABEL_STYLES, REQUIRED_ASTERISK_STYLES } from '../../styles/UIStyles';

interface Props {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: any) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    type?: 'text' | 'email' | 'number' | 'tel';
    multiline?: boolean;
    rows?: number;
    endAdornment?: React.ReactNode;
}

export const ITextField: React.FC<Props> = ({
    label,
    name,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    placeholder = '',
    type = 'text',
    multiline = false,
    rows = 1,
    endAdornment,
}) => {
    const TextFieldComponent = required ? RequiredTextField : TextField;

    return (
        <Box sx={FIELD_BOX_STYLES}>
            <Typography sx={FIELD_LABEL_STYLES}>
                {label} {required && <span style={REQUIRED_ASTERISK_STYLES}>*</span>}
            </Typography>
            <TextFieldComponent
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                size="small"
                type={type}
                multiline={multiline}
                rows={rows}
                error={!!error}
                helperText={error}
                disabled={disabled}
                required={required}
                InputProps={
                    endAdornment
                        ? {
                              endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment>,
                          }
                        : undefined
                }
                sx={TEXT_FIELD_STYLES}
            />
        </Box>
    );
};
