import { IFormConfig, FormData } from '../components/ui/form';

export const getRequiredFields = (formConfig: IFormConfig): string[] => {
    const requiredFields: string[] = [];

    formConfig.sections.forEach((section) => {
        section.fields.forEach((field) => {
            if (field.required) {
                requiredFields.push(field.name);
            }
        });
    });

    return requiredFields;
};

export const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'number') return false;
    if (typeof value === 'boolean') return false;
    return false;
};

export const areRequiredFieldsFilled = (formData: FormData, requiredFields: string[]): boolean => {
    return requiredFields.every((field) => !isEmpty(formData[field]));
};

export const hasFormChanges = (
    currentData: FormData,
    initialData: FormData | null,
    fieldsToCheck?: string[]
): boolean => {
    if (!initialData) return false;

    const fields = fieldsToCheck || Object.keys(currentData);

    return fields.some((field) => {
        const currentValue = currentData[field];
        const initialValue = initialData[field];

        if (Array.isArray(currentValue) && Array.isArray(initialValue)) {
            if (currentValue.length !== initialValue.length) return true;
            return currentValue.some((val, idx) => val !== initialValue[idx]);
        }

        return currentValue !== initialValue;
    });
};

export const getAllFieldNames = (formConfig: IFormConfig): string[] => {
    const fieldNames: string[] = [];

    formConfig.sections.forEach((section) => {
        section.fields.forEach((field) => {
            fieldNames.push(field.name);
        });
    });

    return fieldNames;
};
