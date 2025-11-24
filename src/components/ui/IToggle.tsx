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
}

export const IToggle: React.FC<Props> = ({ label, name, checked, onChange, disabled = false }) => {
    return (
        <Box sx={FIELD_BOX_STYLES}>
            <Typography sx={FIELD_LABEL_STYLES}>{label}</Typography>
            <Switch checked={checked} onChange={onChange} name={name} disabled={disabled} sx={TOGGLE_STYLES} />
        </Box>
    );
};
