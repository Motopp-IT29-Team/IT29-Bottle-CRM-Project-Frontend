import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Box, Paper, IconButton } from '@mui/material';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FaPercent } from 'react-icons/fa';
import { ISelect, ITextField, IToggle } from '../../ui';
import {
    SALUTATIONS,
    DEPARTMENTS,
    PREFERRED_LANGUAGES,
    RATINGS,
    BUDGET_RANGES,
    DECISION_TIMEFRAMES,
} from '../../../constants/leadPicklists';
import {
    LEADS_ACCORDION_STYLES,
    LEADS_ACCORDION_SUMMARY_STYLES,
    LEADS_ACCORDION_TITLE_STYLES,
    LEADS_EXPAND_ICON_STYLES,
    LEADS_FIELD_CONTAINER_STYLES,
    getStatusBadgeColor,
    getSourceBadgeColor,
    LEADS_STATUS_BADGE_STYLES,
    LEADS_STATUS_TEXT_STYLES,
} from '../../../styles/LeadsStyles';

interface LeadInformationSectionProps {
    data: {
        salutation: string;
        account_name: string;
        opportunity_amount: string;
        website: string;
        industry: string;
        status: string;
        source: string;
        probability: number;
        department: string;
        preferred_language: string;
        rating: string;
        budget_range: string;
        decision_timeframe: string;
        do_not_call: boolean;
    };
    onChange: (e: any) => void;
    errors: Record<string, string>;
    disabled?: boolean;
    industries?: any[];
    statuses?: any[];
    sources?: any[];
}

export const LeadInformationSection: React.FC<LeadInformationSectionProps> = ({
    data,
    onChange,
    errors,
    disabled = false,
    industries = [],
    statuses = [],
    sources = [],
}) => {
    const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange({
            target: {
                name: event.target.name,
                value: event.target.checked,
            },
        });
    };

    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const industryOptions = industries.map((opt) => ({
        value: opt[0],
        label: capitalize(opt[1]),
    }));
    const statusOptions = statuses.map((opt) => ({ value: opt[0], label: opt[1] }));
    const sourceOptions = sources.map((opt) => ({ value: opt[0], label: opt[1] }));

    return (
        <Paper elevation={0} sx={{ mb: 3 }}>
            <Accordion defaultExpanded sx={LEADS_ACCORDION_STYLES}>
                <AccordionSummary
                    expandIcon={
                        <Box sx={LEADS_EXPAND_ICON_STYLES}>
                            <FiChevronDown style={{ fontSize: '20px', color: '#6b7280' }} />
                        </Box>
                    }
                    sx={LEADS_ACCORDION_SUMMARY_STYLES}
                >
                    <Typography sx={LEADS_ACCORDION_TITLE_STYLES}>Lead Information</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ p: 0 }}>
                    <Box sx={LEADS_FIELD_CONTAINER_STYLES}>
                        {/* Company Name - REQUIRED */}
                        <ITextField
                            label="Company Name"
                            name="account_name"
                            value={data.account_name}
                            onChange={onChange}
                            error={errors.account_name}
                            disabled={disabled}
                            required
                            placeholder="Enter company name"
                        />

                        {/* Salutation */}
                        <ISelect
                            label="Salutation"
                            name="salutation"
                            value={data.salutation}
                            options={SALUTATIONS}
                            onChange={onChange}
                            error={errors.salutation}
                            disabled={disabled}
                            placeholder="Select salutation"
                        />

                        {/* Lead Source - REQUIRED */}
                        <ISelect
                            label="Lead Source"
                            name="source"
                            value={data.source}
                            options={sourceOptions}
                            onChange={onChange}
                            error={errors.source}
                            disabled={disabled}
                            required
                            placeholder="Select source"
                            renderBadge={(option) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box
                                        sx={{
                                            ...LEADS_STATUS_BADGE_STYLES,
                                            backgroundColor: getSourceBadgeColor(option.label),
                                        }}
                                    />
                                    <Typography sx={LEADS_STATUS_TEXT_STYLES}>{option.label}</Typography>
                                </Box>
                            )}
                        />

                        {/* Industry */}
                        <ISelect
                            label="Industry"
                            name="industry"
                            value={data.industry}
                            options={industryOptions}
                            onChange={onChange}
                            error={errors.industry}
                            disabled={disabled}
                            placeholder="Select industry"
                        />

                        {/* Status - REQUIRED */}
                        <ISelect
                            label="Status"
                            name="status"
                            value={data.status}
                            options={statusOptions}
                            onChange={onChange}
                            error={errors.status}
                            disabled={disabled}
                            required
                            placeholder="Select status"
                            renderBadge={(option) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <Box
                                        sx={{
                                            ...LEADS_STATUS_BADGE_STYLES,
                                            backgroundColor: getStatusBadgeColor(option.label),
                                        }}
                                    />
                                    <Typography sx={LEADS_STATUS_TEXT_STYLES}>
                                        {option.label.charAt(0).toUpperCase() + option.label.slice(1).toLowerCase()}
                                    </Typography>
                                </Box>
                            )}
                        />

                        {/* Department */}
                        <ISelect
                            label="Department"
                            name="department"
                            value={data.department}
                            options={DEPARTMENTS}
                            onChange={onChange}
                            error={errors.department}
                            disabled={disabled}
                        />

                        {/* Preferred Language */}
                        <ISelect
                            label="Preferred Language"
                            name="preferred_language"
                            value={data.preferred_language}
                            options={PREFERRED_LANGUAGES}
                            onChange={onChange}
                            error={errors.preferred_language}
                            disabled={disabled}
                        />

                        {/* Rating */}
                        <ISelect
                            label="Rating"
                            name="rating"
                            value={data.rating}
                            options={RATINGS}
                            onChange={onChange}
                            error={errors.rating}
                            disabled={disabled}
                            placeholder="Select rating"
                        />

                        {/* Budget Range */}
                        <ISelect
                            label="Budget Range"
                            name="budget_range"
                            value={data.budget_range}
                            options={BUDGET_RANGES}
                            onChange={onChange}
                            error={errors.budget_range}
                            disabled={disabled}
                            placeholder="Select budget range"
                        />

                        {/* Decision Timeframe */}
                        <ISelect
                            label="Decision Timeframe"
                            name="decision_timeframe"
                            value={data.decision_timeframe}
                            options={DECISION_TIMEFRAMES}
                            onChange={onChange}
                            error={errors.decision_timeframe}
                            disabled={disabled}
                            placeholder="Select timeframe"
                        />

                        {/* Website */}
                        <ITextField
                            label="Website"
                            name="website"
                            value={data.website}
                            onChange={onChange}
                            error={errors.website}
                            disabled={disabled}
                            placeholder="https://company.com"
                        />

                        {/* Opportunity Amount */}
                        <ITextField
                            label="Opportunity Amount"
                            name="opportunity_amount"
                            type="number"
                            value={data.opportunity_amount}
                            onChange={onChange}
                            error={errors.opportunity_amount}
                            disabled={disabled}
                            placeholder="0"
                        />

                        {/* Probability */}
                        <ITextField
                            label="Probability (%)"
                            name="probability"
                            type="number"
                            value={data.probability}
                            onChange={onChange}
                            error={errors.probability}
                            disabled={disabled}
                            placeholder="50"
                            endAdornment={
                                <IconButton
                                    disableFocusRipple
                                    disableTouchRipple
                                    sx={{
                                        backgroundColor: '#f3f4f6',
                                        width: '40px',
                                        borderRadius: '0 6px 6px 0',
                                        mr: '-14px',
                                        cursor: 'initial',
                                    }}
                                >
                                    <FaPercent style={{ width: '12px', color: '#6b7280' }} />
                                </IconButton>
                            }
                        />

                        {/* Do Not Call */}
                        <IToggle
                            label="Do Not Call"
                            name="do_not_call"
                            checked={data.do_not_call}
                            onChange={handleToggleChange}
                            disabled={disabled}
                        />
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};
