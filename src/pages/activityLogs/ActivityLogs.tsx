import React, { useState, useEffect } from 'react';
import {
    Box,
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
    Avatar,
    Stack,
    IconButton,
    Tooltip,
} from '@mui/material';
import { FiActivity, FiUser, FiCalendar, FiFilter, FiRefreshCw, FiShield, FiClock } from 'react-icons/fi';
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

const getActionIcon = (action: string) => {
    const iconProps = { size: 14 };
    switch (action) {
        case 'CREATE':
            return '✨';
        case 'UPDATE':
            return '✏️';
        case 'DELETE':
            return '🗑️';
        case 'VIEW':
            return '👁️';
        case 'LOGIN':
            return '🔓';
        case 'LOGOUT':
            return '🔒';
        default:
            return '📝';
    }
};

const getUserInitials = (firstName: string, lastName: string): string => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};

export function ActivityLogs() {
    const { isLoading, activityLogs, totalCount, canViewOthers, viewingMode, getAll } = useActivityLogs();

    const [actionFilter, setActionFilter] = useState('');
    const [entityTypeFilter, setEntityTypeFilter] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [userFilter, setUserFilter] = useState('');

    const [users, setUsers] = useState<IUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchUsers = async () => {
            if (canViewOthers) {
                setLoadingUsers(true);
                try {
                    const response = await usersService.getAll({ limit: 1000 });
                    if (!response.error) {
                        setUsers(response.users || []);
                    }
                } catch (error: any) {
                    console.log('Could not fetch users list:', error.message);
                } finally {
                    setLoadingUsers(false);
                }
            }
        };

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

    const handleRefresh = () => {
        const params = {
            action: actionFilter || undefined,
            entity_type: entityTypeFilter || undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            user_id: userFilter || undefined,
            limit: rowsPerPage,
            offset: page * rowsPerPage,
        };
        getAll(params);
    };

    return (
        <Box sx={{ p: 3 }}>
            {viewingMode === 'own' && (
                <Alert
                    severity="info"
                    icon={<FiShield size={20} />}
                    sx={{
                        mb: 3,
                        borderRadius: '12px',
                        backgroundColor: '#eff6ff',
                        border: '1px solid #bfdbfe',
                        '& .MuiAlert-icon': {
                            color: '#3b82f6',
                        },
                    }}
                >
                    You are viewing only your own activity logs. Contact an admin for access to view all organization
                    logs.
                </Alert>
            )}

            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    backgroundColor: 'white',
                }}
            >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <FiFilter size={18} color="#6b7280" />
                    <Typography
                        sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#374151',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                        }}
                    >
                        Filters
                    </Typography>
                </Stack>

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
                                        const selectedUser = users.find((u) => (u.user_details?.id || u.id) === value);
                                        if (selectedUser) {
                                            return `${selectedUser.first_name} ${selectedUser.last_name}`;
                                        }
                                        return String(value);
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '10px',
                                        backgroundColor: '#f9fafb',
                                        '&:hover': {
                                            backgroundColor: 'white',
                                        },
                                        '&.Mui-focused': {
                                            backgroundColor: 'white',
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="">All Users</MenuItem>
                                {users.map((user) => (
                                    <MenuItem key={user.id} value={user.user_details?.id || user.id}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Avatar
                                                sx={{
                                                    width: 24,
                                                    height: 24,
                                                    fontSize: '11px',
                                                    backgroundColor: '#eef2ff',
                                                    color: '#6366f1',
                                                }}
                                            >
                                                {getUserInitials(user.first_name, user.last_name)}
                                            </Avatar>
                                            <Typography sx={{ fontSize: '14px' }}>
                                                {user.first_name} {user.last_name}
                                            </Typography>
                                        </Stack>
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
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    backgroundColor: '#f9fafb',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: 'white',
                                    },
                                },
                            }}
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
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    backgroundColor: '#f9fafb',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: 'white',
                                    },
                                },
                            }}
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
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    backgroundColor: '#f9fafb',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: 'white',
                                    },
                                },
                            }}
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
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '10px',
                                    backgroundColor: '#f9fafb',
                                    '&:hover': {
                                        backgroundColor: 'white',
                                    },
                                    '&.Mui-focused': {
                                        backgroundColor: 'white',
                                    },
                                },
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper
                sx={{
                    borderRadius: '16px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                }}
            >
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
                        <CircularProgress size={40} sx={{ color: '#6366f1' }} />
                    </Box>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow
                                        sx={{
                                            backgroundColor: '#f9fafb',
                                        }}
                                    >
                                        <TableCell
                                            sx={{
                                                fontWeight: 600,
                                                color: '#374151',
                                                fontSize: '13px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                py: 2,
                                            }}
                                        >
                                            User
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontWeight: 600,
                                                color: '#374151',
                                                fontSize: '13px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                py: 2,
                                            }}
                                        >
                                            Role
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontWeight: 600,
                                                color: '#374151',
                                                fontSize: '13px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                py: 2,
                                            }}
                                        >
                                            Action
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontWeight: 600,
                                                color: '#374151',
                                                fontSize: '13px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                py: 2,
                                            }}
                                        >
                                            Entity Type
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontWeight: 600,
                                                color: '#374151',
                                                fontSize: '13px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                py: 2,
                                            }}
                                        >
                                            Entity Name
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                fontWeight: 600,
                                                color: '#374151',
                                                fontSize: '13px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                py: 2,
                                            }}
                                        >
                                            Date/Time
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {activityLogs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                                <Stack spacing={2} alignItems="center">
                                                    <Box
                                                        sx={{
                                                            width: 64,
                                                            height: 64,
                                                            borderRadius: '50%',
                                                            backgroundColor: '#f3f4f6',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                        }}
                                                    >
                                                        <FiActivity size={32} color="#9ca3af" />
                                                    </Box>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '15px',
                                                            fontWeight: 600,
                                                            color: '#6b7280',
                                                        }}
                                                    >
                                                        No activity logs found
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '13px',
                                                            color: '#9ca3af',
                                                        }}
                                                    >
                                                        Try adjusting your filters
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        activityLogs.map((log, index) => (
                                            <TableRow
                                                key={log.id}
                                                sx={{
                                                    '&:hover': {
                                                        backgroundColor: '#f9fafb',
                                                    },
                                                    borderBottom:
                                                        index === activityLogs.length - 1
                                                            ? 'none'
                                                            : '1px solid #f3f4f6',
                                                }}
                                            >
                                                <TableCell sx={{ py: 2 }}>
                                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                                        <Avatar
                                                            sx={{
                                                                width: 36,
                                                                height: 36,
                                                                fontSize: '13px',
                                                                backgroundColor: '#eef2ff',
                                                                color: '#6366f1',
                                                                fontWeight: 600,
                                                            }}
                                                        >
                                                            <FiUser size={18} />
                                                        </Avatar>
                                                        <Typography
                                                            sx={{
                                                                fontSize: '14px',
                                                                fontWeight: 500,
                                                                color: '#111827',
                                                            }}
                                                        >
                                                            {log.user_email}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell sx={{ py: 2 }}>
                                                    <Chip
                                                        icon={<FiShield size={12} />}
                                                        label={log.user_role}
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: '#f0f9ff',
                                                            color: '#0284c7',
                                                            fontWeight: 600,
                                                            fontSize: '12px',
                                                            border: '1px solid #bae6fd',
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ py: 2 }}>
                                                    <Chip
                                                        label={
                                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                                <span>{getActionIcon(log.action)}</span>
                                                                <span>{log.action_display || log.action}</span>
                                                            </Stack>
                                                        }
                                                        size="small"
                                                        color={getActionColor(log.action)}
                                                        sx={{
                                                            fontWeight: 600,
                                                            fontSize: '12px',
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ py: 2 }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '14px',
                                                            color: '#6b7280',
                                                        }}
                                                    >
                                                        {log.entity_type_display || log.entity_type || '-'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ py: 2 }}>
                                                    <Typography
                                                        sx={{
                                                            fontSize: '14px',
                                                            fontWeight: 500,
                                                            color: '#111827',
                                                        }}
                                                    >
                                                        {log.entity_name || '-'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell sx={{ py: 2 }}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <FiClock size={14} color="#9ca3af" />
                                                        <Typography
                                                            sx={{
                                                                fontSize: '13px',
                                                                color: '#6b7280',
                                                            }}
                                                        >
                                                            {log.created_on_arrow ||
                                                                new Date(log.created_at).toLocaleString()}
                                                        </Typography>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box
                            sx={{
                                borderTop: '1px solid #e5e7eb',
                                backgroundColor: '#fafafa',
                            }}
                        >
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                component="div"
                                count={totalCount}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                sx={{
                                    '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                                        fontSize: '13px',
                                        color: '#6b7280',
                                    },
                                }}
                            />
                        </Box>
                    </>
                )}
            </Paper>
        </Box>
    );
}
