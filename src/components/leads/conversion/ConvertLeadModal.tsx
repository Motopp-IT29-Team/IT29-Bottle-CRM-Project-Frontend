import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Divider,
    Alert,
    CircularProgress,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormGroup,
} from '@mui/material';
import {
    Business as BusinessIcon,
    Person as PersonIcon,
    TrendingUp as OpportunityIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { ILead } from '../../../types';
import { DuplicateMatch, LeadConversionRequest, useLeads } from '../../../api';

interface ConvertLeadModalProps {
    open: boolean;
    onClose: () => void;
    lead: ILead;
    onConversionComplete: () => void;
}

const OPPORTUNITY_STAGES = [
    { value: 'QUALIFICATION', label: 'Qualification' },
    { value: 'NEEDS_ANALYSIS', label: 'Needs Analysis' },
    { value: 'VALUE_PROPOSITION', label: 'Value Proposition' },
    { value: 'PROPOSAL', label: 'Proposal' },
    { value: 'NEGOTIATION', label: 'Negotiation' },
];

export const ConvertLeadModal: React.FC<ConvertLeadModalProps> = ({ open, onClose, lead, onConversionComplete }) => {
    const { checkConversionDuplicates, convertLead, isLoading } = useLeads();

    // Duplicate check state
    const [duplicates, setDuplicates] = useState<{
        account_matches: DuplicateMatch[];
        contact_matches: DuplicateMatch[];
    } | null>(null);
    const [duplicateCheckLoading, setDuplicateCheckLoading] = useState(false);

    // Form state
    const [accountAction, setAccountAction] = useState<'create' | 'link'>('create');
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');
    const [accountName, setAccountName] = useState(lead.account_name || '');

    const [contactAction, setContactAction] = useState<'create' | 'link'>('create');
    const [selectedContactId, setSelectedContactId] = useState<string>('');

    const [createOpportunity, setCreateOpportunity] = useState(true);
    const [opportunityName, setOpportunityName] = useState(`${lead.account_name} - Opportunity`);
    const [opportunityStage, setOpportunityStage] = useState('QUALIFICATION');
    const [opportunityAmount, setOpportunityAmount] = useState(lead.opportunity_amount || '');

    // Check for duplicates when modal opens
    useEffect(() => {
        if (open && lead.id) {
            setDuplicateCheckLoading(true);
            checkConversionDuplicates(lead.id)
                .then((result) => {
                    if (result.success && result.data) {
                        setDuplicates(result.data.data);
                        // Auto-select if there are matches
                        if (result.data.data.account_matches.length > 0) {
                            setAccountAction('link');
                            setSelectedAccountId(result.data.data.account_matches[0].id);
                        }
                        if (result.data.data.contact_matches.length > 0) {
                            setContactAction('link');
                            setSelectedContactId(result.data.data.contact_matches[0].id);
                        }
                    }
                })
                .finally(() => setDuplicateCheckLoading(false));
        }
    }, [open, lead.id]);

    useEffect(() => {
        if (!open) {
            setAccountAction('create');
            setSelectedAccountId('');
            setAccountName(lead.account_name || '');
            setContactAction('create');
            setSelectedContactId('');
            setCreateOpportunity(true);
            setOpportunityName(`${lead.account_name} - Opportunity`);
            setOpportunityStage('QUALIFICATION');
            setOpportunityAmount(lead.opportunity_amount || '');
            setDuplicates(null);
        }
    }, [open, lead]);

    const handleConvert = async () => {
        const options: LeadConversionRequest = {
            account: {
                action: accountAction,
                existing_id: accountAction === 'link' ? selectedAccountId : undefined,
                name: accountAction === 'create' ? accountName : undefined,
            },
            contact: {
                action: contactAction,
                existing_id: contactAction === 'link' ? selectedContactId : undefined,
            },
            opportunity: {
                create: createOpportunity,
                name: opportunityName,
                stage: opportunityStage,
                amount: opportunityAmount ? parseFloat(opportunityAmount) : undefined,
            },
        };

        const result = await convertLead(lead.id, options);
        if (result.success) {
            onConversionComplete();
            onClose();
        }
    };

    const hasAccountDuplicates = duplicates && duplicates.account_matches.length > 0;
    const hasContactDuplicates = duplicates && duplicates.contact_matches.length > 0;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <CheckIcon color="primary" />
                    <Typography variant="h6">Convert Lead: {lead.title}</Typography>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                {duplicateCheckLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                        <CircularProgress />
                        <Typography ml={2}>Checking for existing records...</Typography>
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={3}>
                        {/* Lead Summary */}
                        <Alert severity="info">
                            Converting{' '}
                            <strong>
                                {lead.first_name} {lead.last_name}
                            </strong>{' '}
                            ({lead.email}) from <strong>{lead.account_name}</strong>
                        </Alert>

                        {/* Account Section */}
                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <BusinessIcon color="primary" />
                                <Typography variant="h6">Account</Typography>
                                {hasAccountDuplicates && (
                                    <Chip
                                        icon={<WarningIcon />}
                                        label={`${duplicates!.account_matches.length} match found`}
                                        color="warning"
                                        size="small"
                                    />
                                )}
                            </Box>

                            <RadioGroup
                                value={accountAction}
                                onChange={(e) => setAccountAction(e.target.value as 'create' | 'link')}
                            >
                                <FormControlLabel value="create" control={<Radio />} label="Create new account" />
                                {accountAction === 'create' && (
                                    <Box ml={4} mb={2}>
                                        <TextField
                                            label="Account Name"
                                            value={accountName}
                                            onChange={(e) => setAccountName(e.target.value)}
                                            fullWidth
                                            size="small"
                                        />
                                    </Box>
                                )}

                                <FormControlLabel
                                    value="link"
                                    control={<Radio />}
                                    label="Link to existing account"
                                    disabled={!hasAccountDuplicates}
                                />
                                {accountAction === 'link' && hasAccountDuplicates && (
                                    <Box ml={4} mb={2}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Select Account</InputLabel>
                                            <Select
                                                value={selectedAccountId}
                                                onChange={(e) => setSelectedAccountId(e.target.value)}
                                                label="Select Account"
                                            >
                                                {duplicates!.account_matches.map((match) => (
                                                    <MenuItem key={match.id} value={match.id}>
                                                        {match.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                )}
                            </RadioGroup>
                        </Box>

                        <Divider />

                        {/* Contact Section */}
                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <PersonIcon color="primary" />
                                <Typography variant="h6">Contact</Typography>
                                {hasContactDuplicates && (
                                    <Chip
                                        icon={<WarningIcon />}
                                        label={`${duplicates!.contact_matches.length} match found`}
                                        color="warning"
                                        size="small"
                                    />
                                )}
                            </Box>

                            <RadioGroup
                                value={contactAction}
                                onChange={(e) => setContactAction(e.target.value as 'create' | 'link')}
                            >
                                <FormControlLabel
                                    value="create"
                                    control={<Radio />}
                                    label={`Create new contact (${lead.first_name} ${lead.last_name})`}
                                />

                                <FormControlLabel
                                    value="link"
                                    control={<Radio />}
                                    label="Link to existing contact"
                                    disabled={!hasContactDuplicates}
                                />
                                {contactAction === 'link' && hasContactDuplicates && (
                                    <Box ml={4} mb={2}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Select Contact</InputLabel>
                                            <Select
                                                value={selectedContactId}
                                                onChange={(e) => setSelectedContactId(e.target.value)}
                                                label="Select Contact"
                                            >
                                                {duplicates!.contact_matches.map((match) => (
                                                    <MenuItem key={match.id} value={match.id}>
                                                        {match.name} - {match.email} ({match.match_field} match)
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                )}
                            </RadioGroup>
                        </Box>

                        <Divider />

                        {/* Opportunity Section */}
                        <Box>
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <OpportunityIcon color="primary" />
                                <Typography variant="h6">Opportunity</Typography>
                            </Box>

                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={createOpportunity}
                                            onChange={(e) => setCreateOpportunity(e.target.checked)}
                                        />
                                    }
                                    label="Create opportunity"
                                />
                            </FormGroup>

                            {createOpportunity && (
                                <Box display="flex" flexDirection="column" gap={2} mt={2} ml={2}>
                                    <TextField
                                        label="Opportunity Name"
                                        value={opportunityName}
                                        onChange={(e) => setOpportunityName(e.target.value)}
                                        fullWidth
                                        size="small"
                                    />
                                    <Box display="flex" gap={2}>
                                        <FormControl size="small" sx={{ flex: 1 }}>
                                            <InputLabel>Stage</InputLabel>
                                            <Select
                                                value={opportunityStage}
                                                onChange={(e) => setOpportunityStage(e.target.value)}
                                                label="Stage"
                                            >
                                                {OPPORTUNITY_STAGES.map((stage) => (
                                                    <MenuItem key={stage.value} value={stage.value}>
                                                        {stage.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            label="Amount"
                                            type="number"
                                            value={opportunityAmount}
                                            onChange={(e) => setOpportunityAmount(e.target.value)}
                                            size="small"
                                            sx={{ flex: 1 }}
                                            InputProps={{
                                                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                                            }}
                                        />
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={isLoading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConvert}
                    disabled={isLoading || duplicateCheckLoading}
                    startIcon={isLoading ? <CircularProgress size={20} /> : <CheckIcon />}
                >
                    {isLoading ? 'Converting...' : 'Convert Lead'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConvertLeadModal;
