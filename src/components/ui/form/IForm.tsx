import React from 'react';
import { Box } from '@mui/material';
import { IFormProps } from './types';
import { IFormSection } from './IFormSection';

export const IForm: React.FC<IFormProps> = ({ config, formData, errors, onChange, disabled = false }) => {
    return (
        <Box>
            {config.sections.map((section, index) => (
                <IFormSection
                    key={`section-${index}`}
                    section={section}
                    formData={formData}
                    errors={errors}
                    onChange={onChange}
                    disabled={disabled}
                />
            ))}
        </Box>
    );
};
