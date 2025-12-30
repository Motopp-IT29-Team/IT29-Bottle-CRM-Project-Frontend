import React from 'react';
import { Box, Typography, Switch } from '@mui/material';
import { FIELD_BOX_STYLES, FIELD_LABEL_STYLES } from '../../styles/UIStyles';
import { TOGGLE_STYLES } from '../../styles/IToggleStyles';

interface Props {
    label: string;
    name: string;
    checked: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    helperText?: string;
}

export const IToggle: React.FC<Props> = ({ label, name, checked, onChange, disabled = false, helperText }) => {
    return (
        <Box sx={FIELD_BOX_STYLES}>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <Typography sx={FIELD_LABEL_STYLES}>{label}</Typography>
                {helperText && (
                    <Typography
                        sx={{
                            fontSize: '13px',
                            color: '#6b7280',
                            mt: 0.5,
                            lineHeight: 1.4,
                        }}
                    >
                        {helperText}
                    </Typography>
                )}
            </Box>
            <Switch checked={checked} onChange={onChange} name={name} disabled={disabled} sx={TOGGLE_STYLES} />
        </Box>
    );
};
