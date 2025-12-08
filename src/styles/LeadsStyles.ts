import { SxProps, Theme } from '@mui/material';

export const LEADS_AUTOCOMPLETE_STYLES: SxProps<Theme> = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        padding: '4px 14px !important',
        '& fieldset': {
            borderColor: '#e5e7eb',
            borderWidth: '1.5px',
        },
        '&:hover fieldset': {
            borderColor: '#d1d5db',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#667eea',
            borderWidth: '2px',
        },
    },
    '& .MuiAutocomplete-endAdornment': {
        right: '8px !important',
        top: 'calc(50% - 14px) !important',
        position: 'absolute',
    },
    '& .MuiAutocomplete-popupIndicator': {
        padding: '0 !important',
        marginRight: '0 !important',
    },
    '& .MuiAutocomplete-tag': {
        backgroundColor: '#f3f4f6',
        borderRadius: '6px',
        height: '24px',
        fontSize: '13px',
        color: '#374151',
        '& .MuiChip-deleteIcon': {
            color: '#6b7280',
            fontSize: '16px',
            '&:hover': {
                color: '#ef4444',
            },
        },
    },
    '& .MuiAutocomplete-input': {
        fontSize: '14px',
        color: '#1f2937',
        padding: '6px 0 !important',
    },
};

export const LEADS_CHIP_STYLES: SxProps<Theme> = {
    backgroundColor: '#f3f4f6',
    borderRadius: '6px',
    height: '24px',
    fontSize: '13px',
    color: '#374151',
    border: '1px solid #e5e7eb',
    '& .MuiChip-deleteIcon': {
        color: '#6b7280',
        fontSize: '16px',
        '&:hover': {
            color: '#ef4444',
        },
    },
};
