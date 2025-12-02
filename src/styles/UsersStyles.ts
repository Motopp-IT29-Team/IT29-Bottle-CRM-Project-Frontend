import { SxProps, Theme } from '@mui/material';

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
