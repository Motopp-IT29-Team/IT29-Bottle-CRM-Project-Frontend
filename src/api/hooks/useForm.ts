import { useMemo } from 'react';
import { IFormConfig, FormData } from '../../components/ui/form';
import { getRequiredFields, areRequiredFieldsFilled, hasFormChanges, getAllFieldNames } from '../../utils/formHelpers';

interface UseFormStateOptions {
    formConfig: IFormConfig;
    formData: FormData;
    initialData?: FormData | null;
    isSubmitting?: boolean;
    fieldsToCheckForChanges?: string[];
    customValidation?: (formData: FormData) => boolean;
}

interface UseFormStateReturn {
    canSubmit: boolean;
    isValid: boolean;
    hasChanges: boolean;
    requiredFields: string[];
}

export const useForm = ({
    formConfig,
    formData,
    initialData = null,
    isSubmitting = false,
    fieldsToCheckForChanges,
    customValidation,
}: UseFormStateOptions): UseFormStateReturn => {
    const requiredFields = useMemo(() => getRequiredFields(formConfig), [formConfig]);

    const isValid = useMemo(() => {
        const requiredFieldsValid = areRequiredFieldsFilled(formData, requiredFields);

        if (customValidation) return requiredFieldsValid && customValidation(formData);

        return requiredFieldsValid;
    }, [formData, requiredFields, customValidation]);

    const hasChanges = useMemo(() => {
        if (!initialData) return true;

        const fields = fieldsToCheckForChanges || getAllFieldNames(formConfig);
        return hasFormChanges(formData, initialData, fields);
    }, [formData, initialData, fieldsToCheckForChanges, formConfig]);

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
