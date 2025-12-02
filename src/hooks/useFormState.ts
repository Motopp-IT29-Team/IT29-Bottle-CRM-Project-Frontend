import { useMemo } from 'react';
import { IFormConfig, FormData } from '../components/ui/form';
import {
    getRequiredFields,
    areRequiredFieldsFilled,
    hasFormChanges,
    getAllFieldNames,
} from '../utils/form/formHelpers';

interface UseFormStateOptions {
    /**
     * Form configuration object
     */
    formConfig: IFormConfig;

    /**
     * Current form data
     */
    formData: FormData;

    /**
     * Initial form data (for edit forms to detect changes)
     * Set to null for create forms
     */
    initialData?: FormData | null;

    /**
     * Whether the form is currently submitting
     */
    isSubmitting?: boolean;

    /**
     * Custom fields to check for changes (optional)
     * If not provided, will check all fields from formConfig
     */
    fieldsToCheckForChanges?: string[];

    /**
     * Additional validation function
     * Return true if form is valid, false otherwise
     */
    customValidation?: (formData: FormData) => boolean;
}

interface UseFormStateReturn {
    /**
     * Whether the form can be submitted
     * True if all required fields are filled, there are changes (for edit), and not submitting
     */
    canSubmit: boolean;

    /**
     * Whether all required fields are filled
     */
    isValid: boolean;

    /**
     * Whether there are changes compared to initial data (edit mode only)
     */
    hasChanges: boolean;

    /**
     * Array of required field names
     */
    requiredFields: string[];
}

/**
 * Universal hook for managing form state, validation, and submission readiness
 *
 * @example
 * // For CREATE forms:
 * const { canSubmit, isValid } = useFormState({
 *   formConfig: getAddUserFormConfig(),
 *   formData,
 *   isSubmitting,
 * });
 *
 * @example
 * // For EDIT forms:
 * const { canSubmit, isValid, hasChanges } = useFormState({
 *   formConfig: getEditUserFormConfig(),
 *   formData,
 *   initialData,
 *   isSubmitting,
 * });
 */
export const useFormState = ({
    formConfig,
    formData,
    initialData = null,
    isSubmitting = false,
    fieldsToCheckForChanges,
    customValidation,
}: UseFormStateOptions): UseFormStateReturn => {
    // Extract required fields from config
    const requiredFields = useMemo(() => getRequiredFields(formConfig), [formConfig]);

    // Check if all required fields are filled
    const isValid = useMemo(() => {
        const requiredFieldsValid = areRequiredFieldsFilled(formData, requiredFields);

        if (customValidation) {
            return requiredFieldsValid && customValidation(formData);
        }

        return requiredFieldsValid;
    }, [formData, requiredFields, customValidation]);

    // Check if there are changes (for edit mode)
    const hasChanges = useMemo(() => {
        if (!initialData) {
            // Create mode - always consider as having "changes"
            return true;
        }

        // Edit mode - check for actual changes
        const fields = fieldsToCheckForChanges || getAllFieldNames(formConfig);
        return hasFormChanges(formData, initialData, fields);
    }, [formData, initialData, fieldsToCheckForChanges, formConfig]);

    // Determine if form can be submitted
    const canSubmit = useMemo(() => {
        return isValid && hasChanges && !isSubmitting;
    }, [isValid, hasChanges, isSubmitting]);

    return {
        canSubmit,
        isValid,
        hasChanges,
        requiredFields,
    };
};
