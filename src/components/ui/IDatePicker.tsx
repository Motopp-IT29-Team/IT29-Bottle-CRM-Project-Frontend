import React, { useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { RequiredTextField } from '../../styles/CssStyled';
import { TEXT_FIELD_STYLES } from '../../styles/ITextFieldStyles';
import { FIELD_BOX_STYLES, FIELD_LABEL_STYLES, REQUIRED_ASTERISK_STYLES } from '../../styles/UIStyles';

interface Props {
    label: string;
    name: string;
    value: string | null;
    onChange: (e: any) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    minDate?: string;
    maxDate?: string;
}

export const IDatePicker: React.FC<Props> = ({
    label,
    name,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    placeholder = 'YYYY-MM-DD',
    minDate,
    maxDate,
}) => {
    const TextFieldComponent = required ? RequiredTextField : TextField;
    const [dateError, setDateError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDate = e.target.value;

        if (minDate && selectedDate && selectedDate < minDate) {
            setDateError('Date cannot be in the past');
            onChange(e);
            return;
        }

        if (maxDate && selectedDate && selectedDate > maxDate) {
            setDateError('Date is too far in the future');
            onChange(e);
            return;
        }

        setDateError('');
        onChange(e);
    };

    return (
        <Box sx={FIELD_BOX_STYLES}>
            <Typography sx={FIELD_LABEL_STYLES}>
                {label} {required && <span style={REQUIRED_ASTERISK_STYLES}>*</span>}
            </Typography>
            <TextFieldComponent
                name={name}
                value={value || ''}
                onChange={handleChange}
                placeholder={placeholder}
                size="small"
                type="date"
                error={!!error || !!dateError}
                helperText={error || dateError}
                disabled={disabled}
                required={required}
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    min: minDate,
                    max: maxDate,
                }}
                sx={{
                    ...TEXT_FIELD_STYLES,
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                        cursor: 'pointer',
                        filter: 'invert(0.5)',
                        '&:hover': {
                            filter: 'invert(0.3)',
                        },
                    },
                }}
            />
        </Box>
    );
};
