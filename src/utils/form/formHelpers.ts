import { IFormConfig, FormData } from '../../components/ui/form';

/**
 * Extracts all required field names from form configuration
 * @param formConfig - The form configuration object
 * @returns Array of required field names
 */
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

/**
 * Checks if a value is considered empty
 * @param value - The value to check
 * @returns true if the value is empty
 */
export const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'number') return false; // Numbers are never empty (including 0)
    if (typeof value === 'boolean') return false; // Booleans are never empty
    return false;
};

/**
 * Validates if all required fields are filled
 * @param formData - Current form data
 * @param requiredFields - Array of required field names
 * @returns true if all required fields are filled
 */
export const areRequiredFieldsFilled = (formData: FormData, requiredFields: string[]): boolean => {
    return requiredFields.every((field) => !isEmpty(formData[field]));
};

/**
 * Compares two form data objects to detect changes
 * @param currentData - Current form data
 * @param initialData - Initial form data
 * @param fieldsToCheck - Optional array of specific fields to check. If not provided, checks all fields.
 * @returns true if there are changes
 */
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

        // Handle arrays (like assigned_to, tags)
        if (Array.isArray(currentValue) && Array.isArray(initialValue)) {
            if (currentValue.length !== initialValue.length) return true;
            return currentValue.some((val, idx) => val !== initialValue[idx]);
        }

        // Handle different types
        return currentValue !== initialValue;
    });
};

/**
 * Gets all field names from form configuration
 * @param formConfig - The form configuration object
 * @returns Array of all field names
 */
export const getAllFieldNames = (formConfig: IFormConfig): string[] => {
    const fieldNames: string[] = [];

    formConfig.sections.forEach((section) => {
        section.fields.forEach((field) => {
            fieldNames.push(field.name);
        });
    });

    return fieldNames;
};
