import { SxProps, Theme } from '@mui/material';

export const TEXT_FIELD_STYLES: SxProps<Theme> = {
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        fontSize: '14px',
        transition: 'all 0.2s ease',
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
        '&.Mui-error fieldset': {
            borderColor: '#ef4444',
        },
    },
    '& .MuiInputBase-input': {
        padding: '10px 14px',
        fontSize: '14px',
        color: '#1f2937',
        '&::placeholder': {
            color: '#9ca3af',
            opacity: 1,
        },
    },
    '& .MuiFormHelperText-root': {
        marginLeft: '2px !important',
        marginTop: '6px',
        fontSize: '13px',
    },
};
