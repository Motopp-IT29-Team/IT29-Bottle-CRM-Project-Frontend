import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Table,
    TableBody,
    TableContainer,
    TableRow,
    Tabs,
    Paper,
    TableCell,
    IconButton,
    Select,
    MenuItem,
    Container,
    Typography,
    Stack,
} from '@mui/material';
import { FiPlus } from '@react-icons/all-files/fi/FiPlus';
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft';
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { EnhancedTableHead } from '../../components/EnchancedTableHead';
import { getComparator, stableSort } from '../../components/Sorting';
import { DeleteModal } from '../../components/DeleteModal';
import { Spinner } from '../../components/Spinner';
import { fetchData } from '../../components/FetchData';
import { UsersUrl, UserUrl } from '../../services/ApiUrls';
import { CustomTab, CustomToolbar, FabLeft, FabRight } from '../../styles/CssStyled';

interface HeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}

const headCells: readonly HeadCell[] = [
    {
        id: 'email',
        numeric: false,
        disablePadding: false,
        label: 'Email Address',
    },
    {
        id: 'role',
        numeric: false,
        disablePadding: false,
        label: 'Role',
    },
    {
        id: 'actions',
        numeric: false,
        disablePadding: false,
        label: 'Actions',
    },
];

interface User {
    id: string;
    user_details: {
        email: string;
    };
    phone?: string;
    role: string;
}

export default function Users() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<'active' | 'inactive'>('active');
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState('email');

    const [activeUsers, setActiveUsers] = useState<User[]>([]);
    const [activeCurrentPage, setActiveCurrentPage] = useState(1);
    const [activeRecordsPerPage, setActiveRecordsPerPage] = useState(10);
    const [activeTotalPages, setActiveTotalPages] = useState(0);

    const [inactiveUsers, setInactiveUsers] = useState<User[]>([]);
    const [inactiveCurrentPage, setInactiveCurrentPage] = useState(1);
    const [inactiveRecordsPerPage, setInactiveRecordsPerPage] = useState(10);
    const [inactiveTotalPages, setInactiveTotalPages] = useState(0);

    const [deleteRowModal, setDeleteRowModal] = useState(false);
    const [selectedId, setSelectedId] = useState('');
    const [selectOpen, setSelectOpen] = useState(false);

    useEffect(() => {
        getUsers();
    }, [activeCurrentPage, activeRecordsPerPage, inactiveCurrentPage, inactiveRecordsPerPage, tab]);

    const handleChangeTab = (e: SyntheticEvent, val: 'active' | 'inactive') => {
        if (!val) return;
        setTab(val);
    };

    const getUsers = async () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org'),
        };

        try {
            const offset =
                tab === 'active'
                    ? (activeCurrentPage - 1) * activeRecordsPerPage
                    : (inactiveCurrentPage - 1) * inactiveRecordsPerPage;

            const limit = tab === 'active' ? activeRecordsPerPage : inactiveRecordsPerPage;

            const res = await fetchData(`${UsersUrl}/?offset=${offset}&limit=${limit}`, 'GET', null as any, Header);

            if (!res.error) {
                setActiveUsers(res?.active_users?.active_users || []);
                setActiveTotalPages(Math.ceil((res?.active_users?.active_users_count || 0) / activeRecordsPerPage));

                setInactiveUsers(res?.inactive_users?.inactive_users || []);
                setInactiveTotalPages(
                    Math.ceil((res?.inactive_users?.inactive_users_count || 0) / inactiveRecordsPerPage)
                );

                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const handleRecordsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(event.target.value);
        if (tab === 'active') {
            setActiveRecordsPerPage(value);
            setActiveCurrentPage(1);
        } else {
            setInactiveRecordsPerPage(value);
            setInactiveCurrentPage(1);
        }
    };

    const handlePreviousPage = () => {
        if (tab === 'active') {
            setActiveCurrentPage((prev) => Math.max(prev - 1, 1));
        } else {
            setInactiveCurrentPage((prev) => Math.max(prev - 1, 1));
        }
    };

    const handleNextPage = () => {
        if (tab === 'active') {
            setActiveCurrentPage((prev) => Math.min(prev + 1, activeTotalPages));
        } else {
            setInactiveCurrentPage((prev) => Math.min(prev + 1, inactiveTotalPages));
        }
    };

    const handleRequestSort = (event: any, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const userDetail = (userId: string) => {
        navigate(`/app/users/user-details`, {
            state: { userId, detail: true },
        });
    };

    const deleteRow = (id: string) => {
        setSelectedId(id);
        setDeleteRowModal(true);
    };

    const deleteRowModalClose = () => {
        setDeleteRowModal(false);
        setSelectedId('');
    };

    const DeleteItem = async () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org'),
        };

        try {
            const res = await fetchData(`${UserUrl}/${selectedId}/`, 'DELETE', null as any, Header);
            if (!res.error) {
                deleteRowModalClose();
                getUsers();
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const getUserDetail = async (id: string) => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org'),
        };

        try {
            const res = await fetchData(`${UserUrl}/${id}/`, 'GET', null as any, Header);
            if (!res.error) {
                const data = res?.data?.profile_obj;
                navigate('/app/users/edit-user', {
                    state: {
                        value: {
                            email: data?.user_details?.email,
                            role: data?.role,
                            phone: data?.phone,
                            alternate_phone: data?.alternate_phone,
                            address_line: data?.address?.address_line,
                            street: data?.address?.street,
                            city: data?.address?.city,
                            state: data?.address?.state,
                            pincode: data?.address?.postcode,
                            country: data?.address?.country,
                            profile_pic: data?.user_details?.profile_pic,
                            has_sales_access: data?.has_sales_access,
                            has_marketing_access: data?.has_marketing_access,
                            is_organization_admin: data?.is_organization_admin,
                        },
                        id: id,
                        edit: true,
                    },
                });
            }
        } catch (error) {
            console.error('Error fetching user detail:', error);
        }
    };

    const onAddUser = () => {
        if (!loading) {
            navigate('/app/users/add-users');
        }
    };

    const recordsList = [
        [10, '10 Records per page'],
        [20, '20 Records per page'],
        [30, '30 Records per page'],
        [40, '40 Records per page'],
        [50, '50 Records per page'],
    ];

    const currentUsers = tab === 'active' ? activeUsers : inactiveUsers;
    const currentPage = tab === 'active' ? activeCurrentPage : inactiveCurrentPage;
    const totalPages = tab === 'active' ? activeTotalPages : inactiveTotalPages;
    const recordsPerPage = tab === 'active' ? activeRecordsPerPage : inactiveRecordsPerPage;

    return (
        <Box sx={{ mt: '60px' }}>
            <CustomToolbar>
                <Tabs defaultValue={tab} onChange={handleChangeTab} sx={{ mt: '26px' }}>
                    <CustomTab
                        value="active"
                        label="Active"
                        sx={{
                            backgroundColor: tab === 'active' ? '#F0F7FF' : '#284871',
                            color: tab === 'active' ? '#3f51b5' : 'white',
                        }}
                    ></CustomTab>
                    <CustomTab
                        value="inactive"
                        label="In Active"
                        sx={{
                            backgroundColor: tab === 'inactive' ? '#F0F7FF' : '#284871',
                            color: tab === 'inactive' ? '#3f51b5' : 'white',
                            ml: '5px',
                        }}
                    ></CustomTab>
                </Tabs>

                <Stack direction="row" spacing={1.5} alignItems="center">
                    {/* Records Per Page Select */}
                    <Select
                        value={recordsPerPage}
                        onChange={(e: any) => handleRecordsPerPage(e)}
                        open={selectOpen}
                        onOpen={() => setSelectOpen(true)}
                        onClose={() => setSelectOpen(false)}
                        onClick={() => setSelectOpen(!selectOpen)}
                        IconComponent={() => (
                            <Box
                                onClick={() => setSelectOpen(!selectOpen)}
                                sx={{
                                    mr: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}
                            >
                                {selectOpen ? <FiChevronUp /> : <FiChevronDown />}
                            </Box>
                        )}
                        sx={{
                            minWidth: '180px',
                            height: '40px',
                            borderRadius: '8px',
                            backgroundColor: '#ffffff',
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#e0e7ef',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#cbd5e0',
                            },
                        }}
                    >
                        {recordsList.map((item, i) => (
                            <MenuItem key={i} value={item[0]}>
                                {item[1]}
                            </MenuItem>
                        ))}
                    </Select>

                    {/* Pagination Controls */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            border: '1px solid #e0e7ef',
                            height: '40px',
                        }}
                    >
                        <FabLeft
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            sx={{
                                '&:disabled': {
                                    opacity: 0.5,
                                    cursor: 'not-allowed',
                                },
                            }}
                        >
                            <FiChevronLeft />
                        </FabLeft>
                        <Typography
                            sx={{
                                px: 2,
                                fontSize: '14px',
                                fontWeight: 500,
                                color: '#475569',
                            }}
                        >
                            {currentPage} / {totalPages}
                        </Typography>
                        <FabRight
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            sx={{
                                '&:disabled': {
                                    opacity: 0.5,
                                    cursor: 'not-allowed',
                                },
                            }}
                        >
                            <FiChevronRight />
                        </FabRight>
                    </Box>

                    {/* Add User Button */}
                    <Button
                        variant="contained"
                        startIcon={<FiPlus />}
                        onClick={onAddUser}
                        sx={{
                            backgroundColor: '#10b981',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            height: '40px',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.24)',
                            '&:hover': {
                                backgroundColor: '#059669',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.32)',
                            },
                        }}
                    >
                        Add User
                    </Button>
                </Stack>
            </CustomToolbar>

            {/* Table Container */}
            <Container sx={{ maxWidth: '100%', px: 3, py: 3 }}>
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid #e0e7ef',
                    }}
                >
                    <TableContainer>
                        <Table>
                            <EnhancedTableHead
                                numSelected={0}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={() => {}}
                                onRequestSort={handleRequestSort}
                                rowCount={currentUsers.length}
                                headCells={headCells}
                                numSelectedId={[]}
                                isSelectedId={[]}
                            />
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            sx={{
                                                border: 0,
                                                textAlign: 'center',
                                                py: 8,
                                            }}
                                        >
                                            <Spinner />
                                        </TableCell>
                                    </TableRow>
                                ) : currentUsers.length > 0 ? (
                                    stableSort(currentUsers, getComparator(order, orderBy)).map((user: User) => (
                                        <TableRow
                                            key={user.id}
                                            sx={{
                                                '&:nth-of-type(even)': {
                                                    backgroundColor: '#f9fafb',
                                                },
                                                '&:hover': {
                                                    backgroundColor: '#f1f5f9',
                                                },
                                                transition: 'background-color 0.2s',
                                            }}
                                        >
                                            <TableCell
                                                onClick={() => userDetail(user.id)}
                                                sx={{
                                                    border: 0,
                                                    color: '#1976d2',
                                                    cursor: 'pointer',
                                                    fontWeight: 500,
                                                    '&:hover': {
                                                        textDecoration: 'underline',
                                                    },
                                                }}
                                            >
                                                {user.user_details?.email || '---'}
                                            </TableCell>
                                            <TableCell
                                                sx={{
                                                    border: 0,
                                                    color: '#475569',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {user.role || '---'}
                                            </TableCell>
                                            <TableCell sx={{ border: 0 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        gap: 1,
                                                    }}
                                                >
                                                    <IconButton
                                                        onClick={() => getUserDetail(user.id)}
                                                        sx={{
                                                            color: '#1976d2',
                                                            backgroundColor: '#e3f2fd',
                                                            borderRadius: '8px',
                                                            p: 1,
                                                            '&:hover': {
                                                                backgroundColor: '#bbdefb',
                                                            },
                                                        }}
                                                    >
                                                        <FaEdit size={16} />
                                                    </IconButton>
                                                    <IconButton
                                                        onClick={() => deleteRow(user.id)}
                                                        sx={{
                                                            color: '#ef4444',
                                                            backgroundColor: '#fef2f2',
                                                            borderRadius: '8px',
                                                            p: 1,
                                                            '&:hover': {
                                                                backgroundColor: '#fee2e2',
                                                            },
                                                        }}
                                                    >
                                                        <FaTrashAlt size={14} />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={3}
                                            sx={{
                                                border: 0,
                                                textAlign: 'center',
                                                py: 8,
                                            }}
                                        >
                                            <Typography color="text.secondary">No {tab} users found</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Container>

            {/* Delete Modal */}
            <DeleteModal
                onClose={deleteRowModalClose}
                open={deleteRowModal}
                id={selectedId}
                modalDialog="Are you sure you want to delete this user?"
                modalTitle="Delete User"
                DeleteItem={DeleteItem}
            />
        </Box>
    );
}
