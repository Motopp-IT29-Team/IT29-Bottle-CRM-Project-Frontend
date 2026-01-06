export const validateAccountForm = (data: any): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim() === '') {
        errors.name = 'Account name is required';
    }

    // if (!data.billing_address_line || data.billing_address_line.trim() === '') {
    //     errors.billing_address_line = 'Address line is required';
    // }
    //
    // if (!data.billing_street || data.billing_street.trim() === '') {
    //     errors.billing_street = 'Street is required';
    // }
    //
    // if (!data.billing_city || data.billing_city.trim() === '') {
    //     errors.billing_city = 'City is required';
    // }
    //
    // if (!data.billing_state || data.billing_state.trim() === '') {
    //     errors.billing_state = 'State is required';
    // }
    //
    // if (!data.billing_postcode || data.billing_postcode.trim() === '') {
    //     errors.billing_postcode = 'Postal code is required';
    // }
    //
    // if (!data.billing_country || data.billing_country.trim() === '') {
    //     errors.billing_country = 'Country is required';
    // }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Invalid email format';
    }

    if (data.website && !/^https?:\/\/.+/.test(data.website)) {
        errors.website = 'Website must start with http:// or https://';
    }

    return errors;
};
