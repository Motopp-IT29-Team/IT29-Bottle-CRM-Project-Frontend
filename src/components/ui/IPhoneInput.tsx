import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Select, MenuItem, FormHelperText } from '@mui/material';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { FIELD_BOX_STYLES, FIELD_LABEL_STYLES, REQUIRED_ASTERISK_STYLES } from '../../styles/UIStyles';
import NL from 'country-flag-icons/react/3x2/NL';
import DE from 'country-flag-icons/react/3x2/DE';
import GB from 'country-flag-icons/react/3x2/GB';
import BE from 'country-flag-icons/react/3x2/BE';
import FR from 'country-flag-icons/react/3x2/FR';
import US from 'country-flag-icons/react/3x2/US';

interface Props {
    label: string;
    name: string;
    value: string;
    onChange: (e: any) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
}

// Custom component for digit boxes that auto-advance
const DigitInput = React.forwardRef<HTMLInputElement, {
    value: string;
    index: number;
    maxLength: number;
    onValueChange: (index: number, value: string) => void;
    onBackspace: (index: number) => void;
    disabled?: boolean;
}>(({ value, index, maxLength, onValueChange, onBackspace, disabled }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/\D/g, '');
        if (newValue.length <= maxLength) {
            onValueChange(index, newValue);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !value) {
            onBackspace(index);
        }
    };

    return (
        <input
            ref={ref}
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            maxLength={maxLength}
            style={{
                width: `${maxLength * 14 + 16}px`,
                height: '40px',
                textAlign: 'center',
                fontSize: '16px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                outline: 'none',
                transition: 'all 0.2s',
            }}
            onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
            }}
            onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
            }}
        />
    );
});

const COUNTRIES = [
    { code: 'NL', name: 'Netherlands', dialCode: '+31', FlagComponent: NL, format: [1, 4, 4] },
    { code: 'BE', name: 'Belgium', dialCode: '+32', FlagComponent: BE, format: [3, 3, 3] },
    { code: 'DE', name: 'Germany', dialCode: '+49', FlagComponent: DE, format: [3, 4, 4] },
    { code: 'FR', name: 'France', dialCode: '+33', FlagComponent: FR, format: [1, 2, 2, 2, 2] },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', FlagComponent: GB, format: [4, 3, 3] },
    { code: 'US', name: 'United States', dialCode: '+1', FlagComponent: US, format: [3, 3, 4] },
].sort((a, b) => {
    if (a.code === 'NL') return -1;
    if (b.code === 'NL') return 1;
    return a.name.localeCompare(b.name);
});

export const IPhoneInput: React.FC<Props> = ({
    label,
    name,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    placeholder = '',
}) => {
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [digits, setDigits] = useState<string[]>([]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Initialize digits array based on format
        const totalDigits = selectedCountry.format.reduce((sum, group) => sum + group, 0);
        setDigits(new Array(totalDigits).fill(''));

        // Parse existing value if provided
        if (value && value.startsWith(selectedCountry.dialCode)) {
            const phoneNumber = value.replace(selectedCountry.dialCode, '').replace(/\D/g, '');
            const newDigits = phoneNumber.split('');
            setDigits([...newDigits, ...new Array(Math.max(0, totalDigits - newDigits.length)).fill('')]);
        }
    }, [selectedCountry]);

    const handleCountryChange = (e: any) => {
        const country = COUNTRIES.find((c) => c.code === e.target.value);
        if (country) {
            setSelectedCountry(country);
            setDigits([]);
            onChange({ target: { name, value: country.dialCode } });
        }
    };

    const handleDigitChange = (groupIndex: number, digitIndex: number, value: string) => {
        const absoluteIndex = selectedCountry.format
            .slice(0, groupIndex)
            .reduce((sum, group) => sum + group, 0) + digitIndex;

        const newDigits = [...digits];

        // Handle multiple digits pasted
        if (value.length > 1) {
            const chars = value.split('');
            let currentIndex = absoluteIndex;
            chars.forEach((char) => {
                if (currentIndex < newDigits.length) {
                    newDigits[currentIndex] = char;
                    currentIndex++;
                }
            });
            setDigits(newDigits);

            // Focus next empty input or last input
            const nextIndex = Math.min(currentIndex, newDigits.length - 1);
            if (inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex]?.focus();
            }
        } else {
            newDigits[absoluteIndex] = value;
            setDigits(newDigits);

            // Auto-advance to next input
            if (value && absoluteIndex < newDigits.length - 1) {
                if (inputRefs.current[absoluteIndex + 1]) {
                    inputRefs.current[absoluteIndex + 1]?.focus();
                }
            }
        }

        // Update the full phone number
        const phoneNumber = selectedCountry.dialCode + newDigits.join('');
        onChange({ target: { name, value: phoneNumber } });
    };

    const handleBackspace = (groupIndex: number, digitIndex: number) => {
        const absoluteIndex = selectedCountry.format
            .slice(0, groupIndex)
            .reduce((sum, group) => sum + group, 0) + digitIndex;

        if (absoluteIndex > 0) {
            if (inputRefs.current[absoluteIndex - 1]) {
                inputRefs.current[absoluteIndex - 1]?.focus();
            }
        }
    };

    const renderDigitGroups = () => {
        let digitIndex = 0;
        return selectedCountry.format.map((groupSize, groupIndex) => {
            const groupDigits = [];
            for (let i = 0; i < groupSize; i++) {
                const currentDigitIndex = digitIndex;
                groupDigits.push(
                    <DigitInput
                        key={`${groupIndex}-${i}`}
                        ref={(el) => {
                            if (el) {
                                inputRefs.current[currentDigitIndex] = el;
                            }
                        }}
                        value={digits[currentDigitIndex] || ''}
                        index={currentDigitIndex}
                        maxLength={1}
                        onValueChange={(_, val) => handleDigitChange(groupIndex, i, val)}
                        onBackspace={() => handleBackspace(groupIndex, i)}
                        disabled={disabled}
                    />
                );
                digitIndex++;
            }
            return (
                <Box key={groupIndex} sx={{ display: 'flex', gap: '4px' }}>
                    {groupDigits}
                </Box>
            );
        });
    };

    return (
        <Box sx={FIELD_BOX_STYLES}>
            <Typography sx={FIELD_LABEL_STYLES}>
                {label} {required && <span style={REQUIRED_ASTERISK_STYLES}>*</span>}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                {/* Country Selector */}
                <Select
                    value={selectedCountry.code}
                    onChange={handleCountryChange}
                    disabled={disabled}
                    size="small"
                    renderValue={(value) => {
                        const country = COUNTRIES.find((c) => c.code === value);
                        if (!country) return value;
                        const Flag = country.FlagComponent;
                        return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: '24px', height: '16px', display: 'flex', alignItems: 'center' }}>
                                    <Flag style={{ width: '100%', height: '100%', borderRadius: '2px' }} />
                                </Box>
                                <span style={{ fontWeight: 500 }}>{country.dialCode}</span>
                            </Box>
                        );
                    }}
                    sx={{
                        minWidth: '200px',
                        height: '40px',
                        backgroundColor: '#ffffff',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#d1d5db',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#9ca3af',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#6366f1',
                        },
                    }}
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                mt: 1,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                borderRadius: '8px',
                                maxHeight: '300px',
                            },
                        },
                    }}
                >
                    {COUNTRIES.map((country) => {
                        const Flag = country.FlagComponent;
                        return (
                            <MenuItem key={country.code} value={country.code}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                                    <Box sx={{ width: '28px', height: '20px', display: 'flex', alignItems: 'center' }}>
                                        <Flag style={{ width: '100%', height: '100%', borderRadius: '2px' }} />
                                    </Box>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <span style={{ fontWeight: 500, fontSize: '14px' }}>{country.name}</span>
                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{country.dialCode}</span>
                                    </Box>
                                </Box>
                            </MenuItem>
                        );
                    })}
                </Select>

                {/* Digit Groups */}
                <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                    {renderDigitGroups()}
                </Box>
            </Box>
            {error && (
                <FormHelperText error sx={{ mt: 0.5, ml: 1.75 }}>
                    {error}
                </FormHelperText>
            )}
        </Box>
    );
};
