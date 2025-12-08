import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Container, Typography, Paper, CircularProgress, Grid } from '@mui/material';
import { AppBarAction, IModernAppBar } from '../../components/ui';

import { routes } from '../../constants/routes';
import { useCompanies } from '../../api';
import { ICompany } from '../../types';

function DetailField({ label, value }: { label: string; value?: string | null }) {
    return (
        <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 0.5 }}>
                {label}
            </Typography>
            <Typography variant="body1" sx={{ color: '#1A3353', fontWeight: 500 }}>
                {value || '-'}
            </Typography>
        </Box>
    );
}

export function CompanyDetails() {
    const navigate = useNavigate();
    const location = useLocation();
    const { getById } = useCompanies();

    const companyId = location.state?.companyId;

    const [company, setCompany] = useState<ICompany | null>(null);
    const [loading, setLoading] = useState(true);

    // Load company data
    useEffect(() => {
        if (!companyId) {
            navigate(routes.companies.main);
            return;
        }

        const loadData = async () => {
            setLoading(true);
            const result = await getById(companyId);

            if (result.success && result.data) {
                // setCompany(result.data.data);
            } else {
                navigate(routes.companies.main);
            }

            setLoading(false);
        };

        loadData();
    }, [companyId]);

    const handleBack = () => {
        navigate(routes.companies.main);
    };

    const handleEdit = () => {
        navigate(routes.companies.edit, {
            state: { companyId, fromDetails: true },
        });
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!company) {
        return null;
    }

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Users', onClick: handleBack },
        { type: 'edit', onClick: handleEdit },
    ];

    return (
        <>
            <IModernAppBar module="company" crntPage="Company Details" actions={actions} />

            <Container maxWidth="lg" sx={{ mb: 4 }}>
                {/* Header Section */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h4" sx={{ color: '#1A3353', fontWeight: 600, mb: 1 }}>
                        {company.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                        Company ID: {company.id}
                    </Typography>
                </Paper>

                {/* Company Information */}
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ color: '#1A3353', fontWeight: 600, mb: 3 }}>
                        Company Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <DetailField label="Company Name" value={company.name} />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {/*<DetailField*/}
                            {/*    label="Created At"*/}
                            {/*    value={*/}
                            {/*        company.created_at ? new Date(company.created_at).toLocaleDateString() : undefined*/}
                            {/*    }*/}
                            {/*/>*/}
                        </Grid>
                    </Grid>
                </Paper>

                {/* Additional Info */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ color: '#1A3353', fontWeight: 600, mb: 3 }}>
                        System Information
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <DetailField label="Organization ID" value={company.org} />
                        </Grid>
                        {/*{company.created_by && (*/}
                        {/*    <Grid item xs={12} md={6}>*/}
                        {/*        <DetailField label="Created By" value={company.created_by} />*/}
                        {/*    </Grid>*/}
                        {/*)}*/}
                    </Grid>
                </Paper>
            </Container>
        </>
    );
}
