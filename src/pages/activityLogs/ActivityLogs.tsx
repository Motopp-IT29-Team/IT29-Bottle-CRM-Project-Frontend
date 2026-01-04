import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    MenuItem,
    Grid,
    Chip,
    CircularProgress,
    TablePagination,
    Alert,
} from '@mui/material';
import { useActivityLogs } from '../../api/hooks/useActivityLogs';
import { usersService } from '../../api/services/users.service';
import { IUser } from '../../types';

const actionOptions = [
    { value: '', label: 'All Actions' },
    { value: 'CREATE', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' },
    { value: 'VIEW', label: 'View' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGOUT', label: 'Logout' },
];

const entityTypeOptions = [
    { value: '', label: 'All Entities' },
    { value: 'Lead', label: 'Lead' },
    { value: 'Account', label: 'Account' },
    { value: 'Contact', label: 'Contact' },
    { value: 'Opportunity', label: 'Opportunity' },
    { value: 'Case', label: 'Case' },
    { value: 'User', label: 'User' },
    { value: 'System', label: 'System' },
];

const getActionColor = (action: string): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    switch (action) {
        case 'CREATE':
            return 'success';
        case 'UPDATE':
            return 'info';
        case 'DELETE':
            return 'error';
        case 'VIEW':
            return 'info';
        case 'LOGIN':
            return 'success';
        case 'LOGOUT':
            return 'warning';
        default:
            return 'default';
    }
};

export function ActivityLogs() {
    const { isLoading, activityLogs, totalCount, canViewOthers, viewingMode, getAll } = useActivityLogs();

    // Filters
    const [actionFilter, setActionFilter] = useState('');
    const [entityTypeFilter, setEntityTypeFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [userFilter, setUserFilter] = useState('');

    // Users list for filter
    const [users, setUsers] = useState<IUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch users list if user can view others
    useEffect(() => {
        const fetchUsers = async () => {
            if (canViewOthers) {
                setLoadingUsers(true);
                try {
                    const response = await usersService.getAll({ limit: 1000 });
                    if (!response.error) {
                        setUsers(response.users || []);
                    } else {
                        // Handle error response gracefully
                        console.log('Could not fetch users list - permission denied or error');
                    }
                } catch (error: any) {
                    // Silently handle errors - user might not have permission
                    console.log('Could not fetch users list:', error.message);
                } finally {
                    setLoadingUsers(false);
                }
            }
        };

        // Only fetch if canViewOthers is explicitly true
        if (canViewOthers) {
            fetchUsers();
        }
    }, [canViewOthers]);

    useEffect(() => {
        const fetchLogs = async () => {
            const params = {
                action: actionFilter || undefined,
                entity_type: entityTypeFilter || undefined,
                date_from: dateFrom || undefined,
                date_to: dateTo || undefined,
                user_id: userFilter || undefined,
                limit: rowsPerPage,
                offset: page * rowsPerPage,
            };
            await getAll(params);
        };

        fetchLogs();
    }, [actionFilter, entityTypeFilter, dateFrom, dateTo, userFilter, page, rowsPerPage, getAll]);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterChange = () => {
        setPage(0);
    };

    return (
        <Box sx={{ mt: '60px' }}>
            <Container sx={{ maxWidth: '100% !important', px: 3, py: 3 }}>
                <Typography variant="h5" sx={{ mb: 3 }}>
                    Activity Log
                </Typography>

                {viewingMode === 'own' && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        You are viewing only your own activity logs. Contact an admin for access to view all
                        organization logs.
                    </Alert>
                )}

                {/* Filters */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2}>
                        {canViewOthers && (
                            <Grid item xs={12} sm={6} md={2.4}>
                                <TextField
                                    select
                                    fullWidth
                                    value={userFilter}
                                    onChange={(e) => {
                                        setUserFilter(e.target.value);
                                        handleFilterChange();
                                    }}
                                    size="small"
                                    disabled={loadingUsers}
                                    SelectProps={{
                                        displayEmpty: true,
                                        renderValue: (value: unknown): string => {
                                            if (!value || value === '') {
                                                return 'All Users';
                                            }
                                            const selectedUser = users.find(
                                                (u) => (u.user_details?.id || u.id) === value
                                            );
                                            if (selectedUser) {
                                                return `${selectedUser.first_name} ${selectedUser.last_name} (${selectedUser.user_details?.email})`;
                                            }
                                            return String(value);
                                        },
                                    }}
                                >
                                    <MenuItem value="">All Users</MenuItem>
                                    {users.map((user) => (
                                        <MenuItem key={user.id} value={user.user_details?.id || user.id}>
                                            {user.first_name} {user.last_name} ({user.user_details?.email})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        )}
                        <Grid item xs={12} sm={6} md={canViewOthers ? 2.4 : 3}>
                            <TextField
                                select
                                fullWidth
                                label="Action"
                                value={actionFilter}
                                onChange={(e) => {
                                    setActionFilter(e.target.value);
                                    handleFilterChange();
                                }}
                                size="small"
                            >
                                {actionOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={canViewOthers ? 2.4 : 3}>
                            <TextField
                                select
                                fullWidth
                                label="Entity Type"
                                value={entityTypeFilter}
                                onChange={(e) => {
                                    setEntityTypeFilter(e.target.value);
                                    handleFilterChange();
                                }}
                                size="small"
                            >
                                {entityTypeOptions.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={6} md={canViewOthers ? 2.4 : 3}>
                            <TextField
                                type="date"
                                fullWidth
                                label="Date From"
                                value={dateFrom}
                                onChange={(e) => {
                                    setDateFrom(e.target.value);
                                    handleFilterChange();
                                }}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={canViewOthers ? 2.4 : 3}>
                            <TextField
                                type="date"
                                fullWidth
                                label="Date To"
                                value={dateTo}
                                onChange={(e) => {
                                    setDateTo(e.target.value);
                                    handleFilterChange();
                                }}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Table */}
                <TableContainer component={Paper}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Entity Type</TableCell>
                                        <TableCell>Entity Name</TableCell>
                                        <TableCell>Date/Time</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {activityLogs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center">
                                                <Typography color="textSecondary">No activity logs found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        activityLogs.map((log) => (
                                            <TableRow key={log.id}>
                                                <TableCell>{log.user_email}</TableCell>
                                                <TableCell>
                                                    <Chip label={log.user_role} size="small" variant="outlined" />
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={log.action_display || log.action}
                                                        size="small"
                                                        color={getActionColor(log.action)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {log.entity_type_display || log.entity_type || '-'}
                                                </TableCell>
                                                <TableCell>{log.entity_name || '-'}</TableCell>
                                                <TableCell>
                                                    {log.created_on_arrow || new Date(log.created_at).toLocaleString()}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                component="div"
                                count={totalCount}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </>
                    )}
                </TableContainer>
            </Container>
        </Box>
    );
}
