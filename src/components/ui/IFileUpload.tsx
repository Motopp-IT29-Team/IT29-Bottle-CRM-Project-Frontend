import React from 'react';
import { Box, Typography, TextField, InputAdornment, IconButton } from '@mui/material';
import { FaUpload } from 'react-icons/fa';
import { FIELD_BOX_STYLES, FIELD_LABEL_STYLES } from '../../styles/UIStyles';
import { TEXT_FIELD_STYLES } from '../../styles/ITextFieldStyles';

interface Props {
    label: string;
    name: string;
    value: string | null;
    onChange: (file: File | null) => void;
    error?: string;
    disabled?: boolean;
    placeholder?: string;
    accept?: string;
}

export const IFileUpload: React.FC<Props> = ({
    label,
    name,
    value,
    onChange,
    error,
    disabled = false,
    placeholder = 'No file selected',
    accept = 'image/*,application/pdf,.doc,.docx',
}) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        onChange(file);
    };

    return (
        <Box sx={FIELD_BOX_STYLES}>
            <Typography sx={FIELD_LABEL_STYLES}>{label}</Typography>
            <TextField
                name={name}
                value={value || ''}
                placeholder={placeholder}
                size="small"
                fullWidth
                disabled
                error={!!error}
                helperText={error}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                component="label"
                                disabled={disabled}
                                sx={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#f3f4f6',
                                    borderRadius: '0 6px 6px 0',
                                    mr: '-14px',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: '#e5e7eb',
                                    },
                                }}
                            >
                                <input hidden accept={accept} type="file" onChange={handleFileChange} />
                                <FaUpload style={{ fontSize: '14px', color: '#6b7280' }} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                sx={TEXT_FIELD_STYLES}
            />
        </Box>
    );
};
