import { SxProps, Theme } from '@mui/material';
import { CSSProperties } from 'react';

export const FIELD_BOX_STYLES: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,

    '& .MuiFormControl-root': {
        '& .MuiFormHelperText-root': {
            marginLeft: '2px !important',
            marginTop: '6px',
            fontSize: '13px',
        },
    },
};

export const FIELD_LABEL_STYLES: SxProps<Theme> = {
    fontSize: '14px',
    fontWeight: 500,
    color: '#374151',
    mb: 0.5,
};

export const REQUIRED_ASTERISK_STYLES: CSSProperties = {
    color: '#ef4444',
    marginLeft: '2px',
};

export const FIELD_CONTAINER_STYLES: SxProps<Theme> = {
    display: 'grid',
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
    gap: 3,
};
