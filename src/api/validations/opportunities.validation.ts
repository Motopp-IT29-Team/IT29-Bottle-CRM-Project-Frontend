export const validateOpportunityForm = (data: any): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim() === '') {
        errors.name = 'Opportunity name is required';
    }

    if (!data.account) {
        errors.account = 'Account is required';
    }

    if (!data.stage) {
        errors.stage = 'Stage is required';
    }

    if (data.probability && (data.probability < 0 || data.probability > 100)) {
        errors.probability = 'Probability must be between 0 and 100';
    }

    if (data.amount && isNaN(Number(data.amount))) {
        errors.amount = 'Amount must be a valid number';
    }

    return errors;
};
