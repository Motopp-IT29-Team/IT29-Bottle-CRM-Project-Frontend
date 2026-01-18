import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
    Card,
    CardContent,
    Stack,
    Divider,
    Alert,
    CircularProgress,
} from '@mui/material';
import { FiFileText, FiDownload, FiSettings } from 'react-icons/fi';
import { reportsApi } from '../../api';

const REPORT_TYPES = [
    { value: 'leads', label: 'Leads Report' },
    { value: 'accounts', label: 'Accounts Report' },
    { value: 'contacts', label: 'Contacts Report' },
    { value: 'opportunities', label: 'Opportunities Report' },
    { value: 'companies', label: 'Companies Report' },
    { value: 'activity', label: 'Activity Logs Report' },
];

const DATE_PRESETS = [
    { value: 'today', label: 'Today' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'this_quarter', label: 'This Quarter' },
    { value: 'this_year', label: 'This Year' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_60_days', label: 'Last 60 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' },
];

// Base grouping options
const BASE_GROUPING_OPTIONS = {
    daily: { value: 'daily', label: 'Daily' },
    weekly: { value: 'weekly', label: 'Weekly' },
    monthly: { value: 'monthly', label: 'Monthly' },
    user: { value: 'user', label: 'By User' },
    status: { value: 'status', label: 'By Status' },
    source: { value: 'source', label: 'By Source' },
    action: { value: 'action', label: 'By Action' },
    stage: { value: 'stage', label: 'By Stage' },
};

// Dynamic grouping options per report type
const GROUPING_OPTIONS_BY_REPORT_TYPE: Record<string, { value: string; label: string }[]> = {
    leads: [
        BASE_GROUPING_OPTIONS.daily,
        BASE_GROUPING_OPTIONS.weekly,
        BASE_GROUPING_OPTIONS.monthly,
        BASE_GROUPING_OPTIONS.status,
        BASE_GROUPING_OPTIONS.source,
        BASE_GROUPING_OPTIONS.user,
    ],
    accounts: [
        BASE_GROUPING_OPTIONS.daily,
        BASE_GROUPING_OPTIONS.weekly,
        BASE_GROUPING_OPTIONS.monthly,
        BASE_GROUPING_OPTIONS.status,
    ],
    contacts: [
        BASE_GROUPING_OPTIONS.daily,
        BASE_GROUPING_OPTIONS.weekly,
        BASE_GROUPING_OPTIONS.monthly,
        BASE_GROUPING_OPTIONS.status,
    ],
    opportunities: [
        BASE_GROUPING_OPTIONS.daily,
        BASE_GROUPING_OPTIONS.weekly,
        BASE_GROUPING_OPTIONS.monthly,
        BASE_GROUPING_OPTIONS.stage,
        BASE_GROUPING_OPTIONS.source,
        BASE_GROUPING_OPTIONS.user,
    ],
    companies: [
        BASE_GROUPING_OPTIONS.daily,
        BASE_GROUPING_OPTIONS.weekly,
        BASE_GROUPING_OPTIONS.monthly,
    ],
    activity: [
        BASE_GROUPING_OPTIONS.daily,
        BASE_GROUPING_OPTIONS.weekly,
        BASE_GROUPING_OPTIONS.monthly,
        BASE_GROUPING_OPTIONS.action,
        BASE_GROUPING_OPTIONS.user,
    ],
};

// Default grouping per report type
const DEFAULT_GROUPING_BY_REPORT_TYPE: Record<string, string> = {
    leads: 'status',
    accounts: 'status',
    contacts: 'status',
    opportunities: 'stage',
    companies: 'monthly',
    activity: 'action',
};

export const ReportConfigure: React.FC = () => {
    const [reportType, setReportType] = useState('leads');
    const [datePreset, setDatePreset] = useState('this_month');
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');
    const [grouping, setGrouping] = useState(DEFAULT_GROUPING_BY_REPORT_TYPE['leads']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Report format options
    const [includeSummary, setIncludeSummary] = useState(true);
    const [includeCharts, setIncludeCharts] = useState(true);
    const [includeTables, setIncludeTables] = useState(true);
    const [includeLogo, setIncludeLogo] = useState(false);

    // Graphics configuration
    const [includeGraphics, setIncludeGraphics] = useState(true);
    const [showBarChart, setShowBarChart] = useState(true);
    const [showPieChart, setShowPieChart] = useState(true);
    const [chartColors, setChartColors] = useState(['#1976d2', '#dc004e', '#f50057', '#9c27b0', '#3f51b5']);

    // Get available grouping options for current report type
    const availableGroupingOptions = GROUPING_OPTIONS_BY_REPORT_TYPE[reportType] || [];

    // Handle report type change - reset grouping to default for that type
    const handleReportTypeChange = (newReportType: string) => {
        setReportType(newReportType);
        const defaultGrouping = DEFAULT_GROUPING_BY_REPORT_TYPE[newReportType] || 'monthly';
        setGrouping(defaultGrouping);
    };

    const handleGenerateReport = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const config = {
                report_type: reportType,
                date_preset: datePreset === 'custom' ? null : datePreset,
                date_from: datePreset === 'custom' && dateFrom ? dateFrom : null,
                date_to: datePreset === 'custom' && dateTo ? dateTo : null,
                grouping,
                include_summary: includeSummary,
                include_charts: includeCharts,
                include_tables: includeTables,
                include_logo: includeLogo,
                include_graphics: includeGraphics,
                graphics_config: {
                    show_bar_chart: showBarChart,
                    show_pie_chart: showPieChart,
                    colors: chartColors,
                },
            };

            console.log('Generating report with config:', config);
            
            const report = await reportsApi.generateReport(config);
            console.log('Report generated:', report);

            if (report && report.id) {
                setSuccess('Report generated successfully! Downloading...');
                
                // Download the report
                await reportsApi.triggerReportDownload(report.id.toString(), report.file_name);
            } else {
                setError('Unable to generate the report. Please check your settings and try again.');
            }
        } catch (err: any) {
            console.error('Error generating report:', err);
            console.error('Error response:', err.response);
            // Extract the user-friendly message from the backend
            const errorMessage = err.response?.data?.message || err.message || 'Something went wrong while generating the report. Please try again.';
            setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, backgroundColor: '#f9fafb', minHeight: 'calc(100vh - 60px)' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    sx={{
                        fontSize: '24px',
                        fontWeight: 700,
                        color: '#111827',
                        mb: 0.5,
                    }}
                >
                    <FiFileText style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                    Generate Report
                </Typography>
                <Typography
                    sx={{
                        fontSize: '14px',
                        color: '#6b7280',
                    }}
                >
                    Configure your report settings and generate a PDF
                </Typography>
            </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
                        {success}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    {/* Left Column - Configuration */}
                    <Grid item xs={12} lg={8}>
                        <Stack spacing={3}>
                            {/* Report Type */}
                            <Card elevation={0} sx={{ borderRadius: '12px' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        Report Type
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Select Report Type</InputLabel>
                                        <Select
                                            value={reportType}
                                            onChange={(e) => handleReportTypeChange(e.target.value)}
                                            label="Select Report Type"
                                        >
                                            {REPORT_TYPES.map((type) => (
                                                <MenuItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </CardContent>
                            </Card>

                            {/* Date Range */}
                            <Card elevation={0} sx={{ borderRadius: '12px' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        Date Range
                                    </Typography>
                                    <Stack spacing={2}>
                                        <FormControl fullWidth>
                                            <InputLabel>Date Preset</InputLabel>
                                            <Select
                                                value={datePreset}
                                                onChange={(e) => setDatePreset(e.target.value)}
                                                label="Date Preset"
                                            >
                                                {DATE_PRESETS.map((preset) => (
                                                    <MenuItem key={preset.value} value={preset.value}>
                                                        {preset.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                        {datePreset === 'custom' && (
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="From Date"
                                                        type="date"
                                                        value={dateFrom}
                                                        onChange={(e) => setDateFrom(e.target.value)}
                                                        fullWidth
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        label="To Date"
                                                        type="date"
                                                        value={dateTo}
                                                        onChange={(e) => setDateTo(e.target.value)}
                                                        fullWidth
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>

                            {/* Grouping */}
                            <Card elevation={0} sx={{ borderRadius: '12px' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        Data Grouping
                                    </Typography>
                                    <FormControl fullWidth>
                                        <InputLabel>Group By</InputLabel>
                                        <Select
                                            value={grouping}
                                            onChange={(e) => setGrouping(e.target.value)}
                                            label="Group By"
                                        >
                                            {availableGroupingOptions.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </CardContent>
                            </Card>

                            {/* Graphics Configuration */}
                            <Card elevation={0} sx={{ borderRadius: '12px' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        <FiSettings style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                        Graphics Configuration
                                    </Typography>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={includeGraphics}
                                                    onChange={(e) => setIncludeGraphics(e.target.checked)}
                                                />
                                            }
                                            label="Include Graphics in Report"
                                        />
                                        {includeGraphics && (
                                            <Box sx={{ ml: 4, mt: 1 }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={showBarChart}
                                                            onChange={(e) => setShowBarChart(e.target.checked)}
                                                        />
                                                    }
                                                    label="Show Bar Chart"
                                                />
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={showPieChart}
                                                            onChange={(e) => setShowPieChart(e.target.checked)}
                                                        />
                                                    }
                                                    label="Show Pie Chart"
                                                />
                                            </Box>
                                        )}
                                    </FormGroup>
                                </CardContent>
                            </Card>
                        </Stack>
                    </Grid>

                    {/* Right Column - Report Options */}
                    <Grid item xs={12} lg={4}>
                        <Stack spacing={3}>
                            {/* Report Format Options */}
                            <Card elevation={0} sx={{ borderRadius: '12px' }}>
                                <CardContent>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                                        Report Format
                                    </Typography>
                                    <FormGroup>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={includeSummary}
                                                    onChange={(e) => setIncludeSummary(e.target.checked)}
                                                />
                                            }
                                            label="Include Summary"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={includeCharts}
                                                    onChange={(e) => setIncludeCharts(e.target.checked)}
                                                />
                                            }
                                            label="Include Charts"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={includeTables}
                                                    onChange={(e) => setIncludeTables(e.target.checked)}
                                                />
                                            }
                                            label="Include Data Tables"
                                        />
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={includeLogo}
                                                    onChange={(e) => setIncludeLogo(e.target.checked)}
                                                />
                                            }
                                            label="Include Logo"
                                        />
                                    </FormGroup>
                                </CardContent>
                            </Card>

                            {/* Generate Button */}
                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <FiDownload />}
                                onClick={handleGenerateReport}
                                disabled={isLoading}
                                sx={{
                                    backgroundColor: '#6366f1',
                                    color: 'white',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    py: 1.5,
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
                                    '&:hover': {
                                        backgroundColor: '#4f46e5',
                                        boxShadow: '0 6px 16px rgba(99, 102, 241, 0.3)',
                                    },
                                    '&:disabled': {
                                        backgroundColor: '#9ca3af',
                                    },
                                }}
                            >
                                {isLoading ? 'Generating Report...' : 'Generate Report'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
    );
};
