import React from 'react';
import { Box, Typography, Autocomplete, TextField, Chip, FormControl, FormHelperText } from '@mui/material';
import { FaTimes } from 'react-icons/fa';
import { FIELD_BOX_STYLES, FIELD_LABEL_STYLES } from '../../styles/UIStyles';
import { LEADS_AUTOCOMPLETE_STYLES, LEADS_CHIP_STYLES } from '../../styles/LeadsStyles';

interface Props {
    label: string;
    name: string;
    value: any[];
    options: any[];
    onChange: (name: string, value: any[]) => void;
    getOptionLabel: (option: any) => string;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
    limitTags?: number;
    fullWidth?: boolean;
}

export const IAutocomplete: React.FC<Props> = ({
    label,
    name,
    value,
    options,
    onChange,
    getOptionLabel,
    error,
    disabled = false,
    placeholder = 'Add items',
    limitTags = 2,
    fullWidth = false,
}) => {
    return (
        <Box sx={fullWidth ? { ...FIELD_BOX_STYLES, gridColumn: 'span 2' } : FIELD_BOX_STYLES}>
            <Typography sx={FIELD_LABEL_STYLES}>{label}</Typography>
            <FormControl fullWidth error={!!error}>
                <Autocomplete
                    multiple
                    value={value}
                    options={options}
                    getOptionLabel={getOptionLabel}
                    onChange={(e: any, newValue: any) => onChange(name, newValue)}
                    disabled={disabled}
                    size="small"
                    limitTags={limitTags}
                    filterSelectedOptions
                    renderTags={(tagValue, getTagProps) =>
                        tagValue.map((option, index) => (
                            <Chip
                                label={getOptionLabel(option)}
                                deleteIcon={<FaTimes style={{ fontSize: '12px' }} />}
                                {...getTagProps({ index })}
                                sx={LEADS_CHIP_STYLES}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField {...params} placeholder={placeholder} sx={LEADS_AUTOCOMPLETE_STYLES} />
                    )}
                    sx={LEADS_AUTOCOMPLETE_STYLES}
                />
                {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
        </Box>
    );
};
