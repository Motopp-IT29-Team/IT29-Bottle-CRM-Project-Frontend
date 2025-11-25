import React from 'react';
import { ITextField } from '../ITextField';
import { ISelect } from '../ISelect';
import { IToggle } from '../IToggle';
import { IAutocomplete } from '../IAutocomplete';
import { IFileUpload } from '../IFileUpload';
import { IFormFieldProps } from './types';

export const IFormField: React.FC<IFormFieldProps> = ({ field, value, error, onChange, disabled = false }) => {
    const errorMessage = error?.[0];

    switch (field.type) {
        case 'text':
        case 'email':
        case 'number':
        case 'tel':
            return (
                <ITextField
                    label={field.label}
                    name={field.name}
                    value={value || ''}
                    onChange={onChange}
                    error={errorMessage}
                    disabled={disabled || field.disabled}
                    required={field.required}
                    placeholder={field.placeholder}
                    type={field.type}
                    multiline={field.multiline}
                    rows={field.rows}
                    endAdornment={field.endAdornment}
                />
            );

        case 'textarea':
            return (
                <ITextField
                    label={field.label}
                    name={field.name}
                    value={value || ''}
                    onChange={onChange}
                    error={errorMessage}
                    disabled={disabled || field.disabled}
                    required={field.required}
                    placeholder={field.placeholder}
                    type="text"
                    multiline={true}
                    rows={field.rows || 4}
                />
            );

        case 'select':
            return (
                <ISelect
                    label={field.label}
                    name={field.name}
                    value={value || ''}
                    options={field.options || []}
                    onChange={onChange}
                    error={errorMessage}
                    disabled={disabled || field.disabled}
                    required={field.required}
                    placeholder={field.placeholder}
                    renderBadge={field.renderBadge}
                />
            );

        case 'toggle':
            return (
                <IToggle
                    label={field.label}
                    name={field.name}
                    checked={Boolean(value)}
                    onChange={(e) => onChange({ target: { name: field.name, value: e.target.checked } } as any)}
                    disabled={disabled || field.disabled}
                />
            );

        case 'autocomplete':
            return (
                <IAutocomplete
                    label={field.label}
                    name={field.name}
                    value={value || []}
                    options={field.options || []}
                    onChange={(name, newValue) => onChange({ target: { name, value: newValue } } as any)}
                    getOptionLabel={field.getOptionLabel || ((option: any) => option.label || option)}
                    error={errorMessage}
                    disabled={disabled || field.disabled}
                    placeholder={field.placeholder}
                    limitTags={field.limitTags}
                    fullWidth={field.fullWidth}
                />
            );

        case 'file':
            return (
                <IFileUpload
                    label={field.label}
                    name={field.name}
                    value={value || null}
                    onChange={(file) => onChange({ target: { name: field.name, value: file } } as any)}
                    error={errorMessage}
                    disabled={disabled || field.disabled}
                    placeholder={field.placeholder}
                    accept={field.accept}
                />
            );

        default:
            return null;
    }
};
