import React from 'react';
import { ITextField } from '../ITextField';
import { ISelect } from '../ISelect';
import { IToggle } from '../IToggle';
import { IAutocomplete } from '../IAutocomplete';
import { IFileUpload } from '../IFileUpload';
import { IFormFieldProps } from './types';
import { IMultiFileUpload, UploadedFile } from '../IMultiFileUpload';
import { IDatePicker } from '../IDatePicker';

export const IFormField: React.FC<IFormFieldProps> = ({
    field,
    value,
    error,
    onChange,
    onAutocompleteChange,
    disabled = false,
}) => {
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
                    startAdornment={field.startAdornment}
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
                    onChange={(name, newValue) => {
                        if (onAutocompleteChange) {
                            onAutocompleteChange(name, newValue);
                        } else {
                            onChange({ target: { name, value: newValue } } as any);
                        }
                    }}
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

        case 'multifile':
            return (
                <IMultiFileUpload
                    label={field.label}
                    value={value || []}
                    onChange={(files: UploadedFile[]) =>
                        onChange({ target: { name: field.name, value: files } } as any)
                    }
                    error={errorMessage}
                    disabled={disabled || field.disabled}
                    placeholder={field.placeholder}
                    accept={field.accept}
                    maxFiles={field.maxFiles}
                    maxSizeInMB={field.maxSizeInMB}
                />
            );

        case 'date':
            return (
                <IDatePicker
                    label={field.label}
                    name={field.name}
                    value={value || null}
                    onChange={onChange}
                    error={errorMessage}
                    disabled={disabled || field.disabled}
                    required={field.required}
                    placeholder={field.placeholder}
                    minDate={field.minDate}
                    maxDate={field.maxDate}
                />
            );

        default:
            return null;
    }
};
