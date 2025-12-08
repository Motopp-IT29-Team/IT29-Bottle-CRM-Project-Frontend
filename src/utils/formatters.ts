import {
    LEAD_BUDGET_RANGE,
    LEAD_DECISION_TIMEFRAME,
    LEAD_INDUSTRY,
    LEAD_RATING,
    LEAD_SOURCE,
    LEAD_STATUS,
} from '../constants/lead';

export const formatIndustry = (industry: string): string => {
    return LEAD_INDUSTRY.find((item) => item.value === industry)?.label || industry;
};

export const formatBudgetRange = (budgetRange: string): string => {
    return LEAD_BUDGET_RANGE.find((item) => item.value === budgetRange)?.label || budgetRange;
};

export const formatDecisionTimeframe = (timeframe: string): string => {
    return LEAD_DECISION_TIMEFRAME.find((item) => item.value === timeframe)?.label || timeframe;
};

export const formatLeadStatus = (status: string): string => {
    return LEAD_STATUS.find((item) => item.value === status)?.label || status;
};

export const formatLeadSource = (source: string): string => {
    return LEAD_SOURCE.find((item) => item.value === source)?.label || source;
};

export const formatLeadRating = (rating: string): string => {
    return LEAD_RATING.find((item) => item.value === rating)?.label || rating;
};
