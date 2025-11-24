import { SxProps, Theme } from '@mui/material';

export const USERS_TAB_STYLES = {
    active: {
        backgroundColor: '#F0F7FF',
        color: '#3f51b5',
    },
    inactive: {
        backgroundColor: '#284871',
        color: 'white',
    },
};

export const USERS_ADD_BUTTON_STYLES = {
    backgroundColor: '#10b981',
    textTransform: 'none',
    fontWeight: 600,
    px: 3,
    height: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.24)',
    '&:hover': {
        backgroundColor: '#059669',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.32)',
    },
    '&:disabled': {
        opacity: 0.6,
    },
};

export const USERS_PAGINATION_SELECT = {
    minWidth: '180px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e7ef' },
    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e0' },
};

export const USERS_PAGINATION_SELECT_ITEMS = {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #e0e7ef',
    height: '40px',
};

export const USERS_ACCORDION_STYLES: SxProps<Theme> = {
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb',
    '&:before': { display: 'none' },
    overflow: 'hidden',
    transition: 'all 0.2s ease',
    '&:hover': {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
    },
};

export const USERS_ACCORDION_SUMMARY_STYLES: SxProps<Theme> = {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb',
    minHeight: '64px',
    '&:hover': {
        backgroundColor: '#f1f5f9',
    },
    '& .MuiAccordionSummary-content': {
        my: 1.5,
    },
};

export const USERS_ACCORDION_TITLE_STYLES: SxProps<Theme> = {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1f2937',
    letterSpacing: '-0.01em',
};

export const USERS_EXPAND_ICON_STYLES: SxProps<Theme> = {
    backgroundColor: 'white',
    borderRadius: '50%',
    p: 0.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

export const USERS_FIELD_CONTAINER_STYLES: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    gap: 3,
    p: 3,
};

export const USER_FIELD_CONTAINER_STYLES: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    gap: 3,
};

export const USERS_FIELD_BOX_STYLES: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
};

export const USERS_FIELD_LABEL_STYLES: SxProps<Theme> = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    mb: 0.5,
};

export const USERS_TEXT_FIELD_STYLES: SxProps<Theme> = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
    },
    '& .MuiFormHelperText-root': {
        marginLeft: '2px',
        fontSize: '13px',
    },
};

export const USERS_SELECT_STYLES: SxProps<Theme> = {
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#d1d5db',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#9ca3af',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3b82f6',
    },

    borderRadius: '8px',
    transition: 'all 0.2s ease',
};

export const USERS_MENU_ITEM_STYLES: SxProps<Theme> = {
    py: 1.5,
    '&:hover': {
        backgroundColor: '#f3f4f6',
    },
    '&.Mui-selected': {
        backgroundColor: '#eff6ff',
        '&:hover': {
            backgroundColor: '#dbeafe',
        },
    },
};

export const getRoleBadgeColor = (role: string): string => {
    return role === 'ADMIN' ? '#3b82f6' : '#10b981';
};

export const USERS_ROLE_BADGE_STYLES: SxProps<Theme> = {
    width: 8,
    height: 8,
    borderRadius: '50%',
};

export const USERS_ROLE_TEXT_STYLES: SxProps<Theme> = {
    fontSize: '14px',
    fontWeight: 500,
};

export const USERS_REQUIRED_ASTERISK_STYLES: React.CSSProperties = {
    color: '#ef4444',
};

export const USER_DETAILS_PAGE_STYLES: SxProps<Theme> = {
    mt: '60px',
    backgroundColor: '#f9fafb',
};

export const USER_DETAILS_CONTAINER_STYLES: SxProps<Theme> = {
    mt: '120px',
    p: '24px',
    // maxWidth: '1400px',
    mx: 'auto',
};

export const USER_DETAILS_LOADING_CONTAINER_STYLES: SxProps<Theme> = {
    mt: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    flexDirection: 'column',
    gap: 2,
};

export const USER_DETAILS_LOADING_TEXT_STYLES: SxProps<Theme> = {
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: 500,
};

export const USER_DETAILS_LOADING_SPINNER_STYLES: SxProps<Theme> = {
    color: '#667eea',
};

export const USER_PROFILE_HEADER_CARD_STYLES: SxProps<Theme> = {
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    mb: 3,
    overflow: 'hidden',
};

export const USER_PROFILE_HEADER_GRADIENT_STYLES: SxProps<Theme> = {
    height: '120px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
};

export const USER_PROFILE_HEADER_CONTENT_STYLES: SxProps<Theme> = {
    px: 3,
    pb: 3,
};

export const USER_PROFILE_HEADER_FLEX_STYLES: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 3,
    mt: -4,
};

export const USER_PROFILE_AVATAR_STYLES: SxProps<Theme> = {
    width: 100,
    height: 100,
    border: '4px solid white',
    fontSize: '32px',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
};

export const USER_PROFILE_INFO_CONTAINER_STYLES: SxProps<Theme> = {
    flex: 1,
};

export const USER_PROFILE_EMAIL_STYLES: SxProps<Theme> = {
    fontSize: '28px',
    fontWeight: 700,
    color: '#111827',
    mb: 0.5,
};

export const USER_PROFILE_CHIPS_CONTAINER_STYLES: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
};

export const USER_PROFILE_ROLE_CHIP_STYLES: SxProps<Theme> = {
    backgroundColor: '#ede9fe',
    color: '#6d28d9',
    fontWeight: 600,
    fontSize: '12px',
    paddingX: '10px',
};

export const USER_PROFILE_ACTIVE_CHIP_STYLES: SxProps<Theme> = {
    backgroundColor: '#d1fae5',
    color: '#065f46',
    fontWeight: 600,
    fontSize: '12px',
    paddingX: '10px',
};

export const USER_PROFILE_INACTIVE_CHIP_STYLES: SxProps<Theme> = {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    fontWeight: 600,
    fontSize: '12px',
    paddingX: '10px',
};

export const INFO_CARD_PAPER_STYLES: SxProps<Theme> = {
    p: 2.5,
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s ease',
};

export const getInfoCardHoverStyles = (color: string): SxProps<Theme> => ({
    ...INFO_CARD_PAPER_STYLES,
    '&:hover': {
        borderColor: color,
        boxShadow: `0 4px 12px ${color}20`,
        transform: 'translateY(-2px)',
    },
});

export const INFO_CARD_FLEX_STYLES: SxProps<Theme> = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 1.5,
};

export const getInfoCardIconContainerStyles = (color: string): SxProps<Theme> => ({
    width: 40,
    height: 40,
    borderRadius: '10px',
    background: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    flexShrink: 0,
});

export const INFO_CARD_CONTENT_STYLES: SxProps<Theme> = {
    flex: 1,
    minWidth: 0,
};

export const INFO_CARD_LABEL_STYLES: SxProps<Theme> = {
    fontSize: '12px',
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    mb: 0.5,
};

export const INFO_CARD_VALUE_STYLES: SxProps<Theme> = {
    fontSize: '15px',
    fontWeight: 600,
    color: '#111827',
    wordBreak: 'break-word',
};

export const USER_SECTION_CONTAINER_STYLES: SxProps<Theme> = {
    mb: 3,
};

export const USER_SECTION_TITLE_STYLES: SxProps<Theme> = {
    fontSize: '20px',
    fontWeight: 700,
    color: '#111827',
    mb: 2,
    display: 'flex',
    alignItems: 'center',
    gap: 1,
};

export const USER_SECTION_GRID_STYLES: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 2,
};

export const CHIP_ICON_STYLES = {
    fontSize: '14px',
};

export const RESEND_INVITATION_BUTTON_STYLES: SxProps<Theme> = {
    textTransform: 'none',
    borderColor: '#667eea',
    color: '#667eea',
    fontWeight: 600,
    fontSize: '12px',
    borderRadius: '8px',
    marginLeft: 'auto',
    '&:hover': {
        borderColor: '#5568d3',
        backgroundColor: '#667eea10',
    },
    '&:disabled': {
        borderColor: '#d1d5db',
        color: '#9ca3af',
    },
};
