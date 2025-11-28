import { IconType } from 'react-icons';
import { ReactNode, ChangeEvent } from 'react';

export type FieldType =
    | 'text'
    | 'email'
    | 'number'
    | 'tel'
    | 'select'
    | 'toggle'
    | 'textarea'
    | 'autocomplete'
    | 'file'
    | 'multifile'
    | 'date';

export interface SelectOption {
    value: string | number;
    label: string;
    badge?: string;
}

export interface UploadedFile {
    id?: string;
    name: string;
    size?: number;
    url?: string;
    file?: File;
    isNew?: boolean;
}

export interface IFormFieldConfig {
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
    disabled?: boolean;

    multiline?: boolean;
    rows?: number;
    endAdornment?: ReactNode;

    options?: SelectOption[];
    renderBadge?: (option: any) => ReactNode;

    getOptionLabel?: (option: any) => string;
    limitTags?: number;
    fullWidth?: boolean;

    accept?: string;
    maxFiles?: number;
    maxSizeInMB?: number;

    minDate?: string;
    maxDate?: string;
}

export interface IFormSectionConfig {
    title: string;
    icon?: IconType;
    defaultExpanded?: boolean;
    fields: IFormFieldConfig[];
}

export interface IFormConfig {
    sections: IFormSectionConfig[];
}

export type FormData = Record<string, any>;

export type FormErrors = Record<string, string[] | undefined>;

export interface IFormProps {
    config: IFormConfig;
    formData: FormData;
    errors?: FormErrors;
    onChange: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
    ) => void;
    onAutocompleteChange?: (name: string, value: any[]) => void;
    disabled?: boolean;
}

export interface IFormSectionProps {
    section: IFormSectionConfig;
    formData: FormData;
    errors?: FormErrors;
    onChange: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
    ) => void;
    onAutocompleteChange?: (name: string, value: any[]) => void;
    disabled?: boolean;
}

export interface IFormFieldProps {
    field: IFormFieldConfig;
    value: any;
    error?: string[];
    onChange: (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: any } }
    ) => void;
    onAutocompleteChange?: (name: string, value: any[]) => void;
    disabled?: boolean;
}
