import React from 'react';
import { Box } from '@mui/material';
import { IFormProps } from './types';
import { IFormSection } from './IFormSection';

export const IForm: React.FC<IFormProps> = ({
    config,
    formData,
    errors,
    onChange,
    onAutocompleteChange,
    disabled = false,
}) => {
    return (
        <Box sx={{ p: 3 }}>
            {config.sections.map((section, index) => (
                <IFormSection
                    key={`section-${index}`}
                    section={section}
                    formData={formData}
                    errors={errors}
                    onChange={onChange}
                    onAutocompleteChange={onAutocompleteChange}
                    disabled={disabled}
                />
            ))}
        </Box>
    );
};
