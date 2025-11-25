import { SxProps, Theme } from '@mui/material';

// Accordion Styles
export const LEADS_ACCORDION_STYLES: SxProps<Theme> = {
    boxShadow: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: '12px !important',
    mb: 2,
    '&:before': {
        display: 'none',
    },
    '&.Mui-expanded': {
        margin: '0 0 16px 0',
    },
};

export const LEADS_ACCORDION_SUMMARY_STYLES: SxProps<Theme> = {
    backgroundColor: '#f9fafb',
    borderRadius: '12px 12px 0 0',
    minHeight: '56px !important',
    px: 3,
    '&.Mui-expanded': {
        minHeight: '56px !important',
        borderBottom: '1px solid #e5e7eb',
    },
    '& .MuiAccordionSummary-content': {
        margin: '12px 0 !important',
    },
};

export const LEADS_ACCORDION_TITLE_STYLES: SxProps<Theme> = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1f2937',
    letterSpacing: '-0.01em',
};

export const LEADS_EXPAND_ICON_STYLES: SxProps<Theme> = {
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    '&:hover': {
        backgroundColor: '#f3f4f6',
    },
};

// Field Container Styles
export const LEADS_FIELD_CONTAINER_STYLES: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 3,
    p: 3,
    '@media (max-width: 900px)': {
        gridTemplateColumns: '1fr',
        gap: 2,
    },
};

// Autocomplete Styles
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

// Chip Styles
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

// Status Badge Colors
export const getStatusBadgeColor = (status: string): string => {
    const colors: Record<string, string> = {
        assigned: '#3b82f6',
        'in process': '#f59e0b',
        converted: '#10b981',
        recycled: '#64748b',
        closed: '#ef4444',
    };
    return colors[status.toLowerCase()] || '#6b7280';
};

// Source Badge Colors
export const getSourceBadgeColor = (source: string): string => {
    const colors: Record<string, string> = {
        call: '#3b82f6',
        email: '#8b5cf6',
        'existing customer': '#10b981',
        partner: '#f59e0b',
        'public relations': '#ec4899',
        campaign: '#6366f1',
        other: '#64748b',
        web: '#14b8a6',
        referral: '#f97316',
        advertisement: '#ef4444',
        social: '#a855f7',
        event: '#eab308',
        direct: '#22c55e',
    };
    return colors[source.toLowerCase()] || '#94a3b8';
};

// Badge Styles
export const LEADS_STATUS_BADGE_STYLES: SxProps<Theme> = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
};

export const LEADS_STATUS_TEXT_STYLES: SxProps<Theme> = {
    fontSize: '14px',
    color: '#374151',
    fontWeight: 400,
};

// File Upload Styles
export const LEADS_FILE_UPLOAD_BUTTON_STYLES: SxProps<Theme> = {
    backgroundColor: '#f3f4f6',
    borderRadius: '0 6px 6px 0',
    minWidth: '40px',
    height: '40px',
    border: 'none',
    '&:hover': {
        backgroundColor: '#e5e7eb',
    },
};
