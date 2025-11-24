import { SxProps, Theme } from '@mui/material';

export const SELECT_STYLES: SxProps<Theme> = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    fontSize: '14px',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e5e7eb',
        borderWidth: '1.5px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#d1d5db',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#667eea',
        borderWidth: '2px',
    },
    '& .MuiSelect-select': {
        padding: '10px 14px',
        color: '#1f2937',
    },
    '& .MuiSvgIcon-root': {
        color: '#6b7280',
    },
};

export const MENU_ITEM_STYLES: SxProps<Theme> = {
    fontSize: '14px',
    color: '#374151',
    py: 1.25,
    px: 2,
    '&:hover': {
        backgroundColor: '#f3f4f6',
    },
    '&.Mui-selected': {
        backgroundColor: '#ede9fe !important',
        color: '#667eea',
        fontWeight: 500,
        '&:hover': {
            backgroundColor: '#e0d7fe !important',
        },
    },
};
