import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton } from '@mui/material';
import { FiEye, FiEyeOff } from 'react-icons/fi';
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
    type?: 'text' | 'email' | 'number' | 'tel' | 'password';
    multiline?: boolean;
    rows?: number;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    min?: number;
    max?: number;
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
    startAdornment,
    endAdornment,
    min,
    max,
}) => {
    const TextFieldComponent = required ? RequiredTextField : TextField;
    const [showPassword, setShowPassword] = useState(false);
    const inputType = type === 'password' && showPassword ? 'text' : type;

    const handleChange = (e: any) => {
        if (type === 'number') {
            const newValue = e.target.value;

            if (newValue === '') {
                onChange(e);
                return;
            }

            const numValue = Number(newValue);

            if (min !== undefined && numValue < min) {
                return;
            }

            if (max !== undefined && numValue > max) {
                return;
            }

            if (numValue >= 0) {
                onChange(e);
            }
        } else {
            onChange(e);
        }
    };

    const getStartAdornment = () => {
        if (startAdornment) {
            return <InputAdornment position="start">{startAdornment}</InputAdornment>;
        }
        return undefined;
    };

    const getEndAdornment = () => {
        if (type === 'password') {
            return (
                <InputAdornment position="end">
                    <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{
                            color: '#9ca3af',
                            '&:hover': {
                                color: '#6b7280',
                                backgroundColor: 'transparent',
                            },
                        }}
                    >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </IconButton>
                </InputAdornment>
            );
        }

        if (endAdornment) {
            return <InputAdornment position="end">{endAdornment}</InputAdornment>;
        }

        return undefined;
    };

    return (
        <Box sx={FIELD_BOX_STYLES}>
            <Typography sx={FIELD_LABEL_STYLES}>
                {label} {required && <span style={REQUIRED_ASTERISK_STYLES}>*</span>}
            </Typography>
            <TextFieldComponent
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                size="small"
                type={inputType}
                multiline={multiline}
                rows={rows}
                error={!!error}
                helperText={error}
                disabled={disabled}
                required={required}
                inputProps={{
                    ...(type === 'number' && { min, max }),
                }}
                InputProps={{
                    startAdornment: getStartAdornment(),
                    endAdornment: getEndAdornment(),
                }}
                sx={TEXT_FIELD_STYLES}
            />
        </Box>
    );
};
