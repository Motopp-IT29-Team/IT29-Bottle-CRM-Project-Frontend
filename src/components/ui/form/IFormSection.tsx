import React, { useState } from 'react';
import { Paper, Box, Typography, Collapse, IconButton } from '@mui/material';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FIELD_CONTAINER_STYLES } from '../../../styles/UIStyles';
import { IFormSectionProps } from './types';
import { IFormField } from './IFormField';

export const IFormSection: React.FC<IFormSectionProps> = ({
    section,
    formData,
    errors,
    onChange,
    disabled = false,
}) => {
    const [isExpanded, setIsExpanded] = useState(section.defaultExpanded ?? true);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                mb: 3,
                transition: 'all 0.3s ease',
            }}
        >
            {/* Section Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    mb: isExpanded ? 3 : 0,
                    transition: 'margin 0.3s ease',
                }}
                onClick={toggleExpanded}
            >
                <Typography
                    sx={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#111827',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    {section.icon && <section.icon size={20} />}
                    {section.title}
                </Typography>

                <IconButton
                    size="small"
                    sx={{
                        color: '#6b7280',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                            backgroundColor: '#f3f4f6',
                        },
                    }}
                >
                    {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                </IconButton>
            </Box>

            {/* Section Fields */}
            <Collapse in={isExpanded} timeout={300}>
                <Box sx={FIELD_CONTAINER_STYLES}>
                    {section.fields.map((field) => (
                        <IFormField
                            key={field.name}
                            field={field}
                            value={formData[field.name]}
                            error={errors?.[field.name]}
                            onChange={onChange}
                            disabled={disabled}
                        />
                    ))}
                </Box>
            </Collapse>
        </Paper>
    );
};
