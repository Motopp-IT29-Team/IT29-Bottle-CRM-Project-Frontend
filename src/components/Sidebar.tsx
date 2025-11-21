import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Avatar,
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    Divider,
    Tooltip,
} from '@mui/material';
import {
    FiUsers,
    FiPhone,
    FiTrendingUp,
    FiFolder,
    FiFile,
    FiUserPlus,
    FiBriefcase,
    FiMenu,
    FiLogOut,
    FiSettings,
} from 'react-icons/fi';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { fetchData } from './FetchData';
import { ProfileUrl } from '../services/ApiUrls';
import { Header1 } from './FetchData';
import OrganizationModal from '../pages/organization/OrganizationModal';
import Company from '../pages/company/Company';
import AddCompany from '../pages/company/AddCompany';
import CompanyDetails from '../pages/company/CompanyDetails';
import EditCompany from '../pages/company/EditCompany';
import Leads from '../pages/leads/Leads';
import AddContacts from '../pages/contacts/AddContacts';
import { EditLead } from '../pages/leads/EditLead';
import LeadDetails from '../pages/leads/LeadDetails';
import Contacts from '../pages/contacts/Contacts';
import EditContact from '../pages/contacts/EditContacts';
import ContactDetails from '../pages/contacts/ContactDetails';
import Users from '../pages/users/Users';
import Opportunities from '../pages/opportunities/Opportunities';
import Cases from '../pages/cases/Cases';
import { AddLead } from '../pages/leads/AddLead';
import Accounts from '../pages/accounts/Accounts';
import { AddAccount } from '../pages/accounts/AddAccount';
import { EditAccount } from '../pages/accounts/EditAccount';
import { AccountDetails } from '../pages/accounts/AccountDetails';
import { AddUsers } from '../pages/users/AddUsers';
import { EditUser } from '../pages/users/EditUser';
import UserDetails from '../pages/users/UserDetails';
import { AddOpportunity } from '../pages/opportunities/AddOpportunity';
import { EditOpportunity } from '../pages/opportunities/EditOpportunity';
import { OpportunityDetails } from '../pages/opportunities/OpportunityDetails';
import { AddCase } from '../pages/cases/AddCase';
import { EditCase } from '../pages/cases/EditCase';
import { CaseDetails } from '../pages/cases/CaseDetails';
import MyContext from '../context/Context';

const navItems = [
    { key: 'leads', label: 'Leads', icon: FiUsers, path: '/app/leads' },
    { key: 'contacts', label: 'Contacts', icon: FiPhone, path: '/app/contacts' },
    { key: 'opportunities', label: 'Opportunities', icon: FiTrendingUp, path: '/app/opportunities' },
    { key: 'accounts', label: 'Accounts', icon: FiFolder, path: '/app/accounts' },
    { key: 'companies', label: 'Companies', icon: FiFile, path: '/app/companies' },
    { key: 'users', label: 'Users', icon: FiUserPlus, path: '/app/users' },
    { key: 'cases', label: 'Cases', icon: FiBriefcase, path: '/app/cases' },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [userDetail, setUserDetail] = useState<any>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [organizationModal, setOrganizationModal] = useState(false);

    const drawerWidth = isCollapsed ? 80 : 240;

    useEffect(() => {
        userProfile();
    }, []);

    const userProfile = () => {
        fetchData(`${ProfileUrl}/`, 'GET', null as any, Header1)
            .then((res: any) => {
                if (res?.user_obj) {
                    setUserDetail(res?.user_obj);
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const getCurrentScreen = () => {
        const pathParts = location.pathname.split('/');
        const screen = pathParts[2] || 'leads';
        return screen;
    };

    const isActive = (path: string) => {
        return location.pathname.startsWith(path);
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const context = { drawerWidth, screen: getCurrentScreen() };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Header */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml: `${drawerWidth}px`,
                    backgroundColor: 'white',
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'width 0.3s ease, margin 0.3s ease',
                    height: '60px',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar sx={{ minHeight: '60px !important', justifyContent: 'space-between' }}>
                    <Typography
                        sx={{
                            fontSize: '20px',
                            fontWeight: 700,
                            color: '#111827',
                            textTransform: 'capitalize',
                            letterSpacing: '-0.5px',
                        }}
                    >
                        {getCurrentScreen()}
                    </Typography>

                    <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                        <Avatar
                            sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: '#6366f1',
                                fontSize: '16px',
                                fontWeight: 600,
                            }}
                        >
                            {userDetail?.user_details?.email?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                borderRadius: '12px',
                                minWidth: 220,
                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                            },
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>
                                {userDetail?.user_details?.email}
                            </Typography>
                            <Typography sx={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                                {userDetail?.role?.toLowerCase()}
                            </Typography>
                        </Box>
                        <Divider />
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                setOrganizationModal(true);
                            }}
                            sx={{ gap: 1.5, py: 1.5 }}
                        >
                            <FiSettings size={18} />
                            Organization
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                handleMenuClose();
                                handleLogout();
                            }}
                            sx={{ gap: 1.5, py: 1.5, color: '#ef4444' }}
                        >
                            <FiLogOut size={18} />
                            Sign Out
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        backgroundColor: '#1e293b',
                        borderRight: 'none',
                        transition: 'width 0.3s ease',
                        overflowX: 'hidden',
                    },
                }}
            >
                {/* Logo & Toggle */}
                <Box
                    sx={{
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'space-between',
                        px: isCollapsed ? 0 : 2,
                        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            opacity: isCollapsed ? 0 : 1,
                            transition: 'opacity 0.2s ease',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            display: isCollapsed ? 'none' : 'block',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '20px',
                                fontWeight: 700,
                                color: 'white',
                                letterSpacing: '-0.5px',
                            }}
                        >
                            Bottle CRM
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        sx={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            flexShrink: 0,
                            '&:hover': {
                                color: 'white',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        <FiMenu size={20} />
                    </IconButton>
                </Box>

                {/* Navigation */}
                <List sx={{ px: 1.5, py: 2, flex: 1 }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);

                        return (
                            <Tooltip key={item.key} title={isCollapsed ? item.label : ''} placement="right">
                                <ListItem disablePadding sx={{ mb: 0.5 }}>
                                    <Box
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                            px: 2,
                                            py: 1.5,
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            color: active ? 'white' : 'rgba(255, 255, 255, 0.6)',
                                            backgroundColor: active ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                            position: 'relative',
                                            overflow: 'hidden',
                                            '&:hover': {
                                                backgroundColor: active
                                                    ? 'rgba(99, 102, 241, 0.2)'
                                                    : 'rgba(255, 255, 255, 0.05)',
                                                color: 'white',
                                            },
                                            '&::before': active
                                                ? {
                                                      content: '""',
                                                      position: 'absolute',
                                                      left: 0,
                                                      top: '50%',
                                                      transform: 'translateY(-50%)',
                                                      width: '3px',
                                                      height: '60%',
                                                      backgroundColor: '#6366f1',
                                                      borderRadius: '0 2px 2px 0',
                                                  }
                                                : {},
                                        }}
                                    >
                                        <Box sx={{ flexShrink: 0, display: 'flex' }}>
                                            <Icon size={20} />
                                        </Box>
                                        <Box
                                            sx={{
                                                opacity: isCollapsed ? 0 : 1,
                                                transition: 'opacity 0.2s ease',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: '14px',
                                                    fontWeight: active ? 600 : 500,
                                                }}
                                            >
                                                {item.label}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </ListItem>
                            </Tooltip>
                        );
                    })}
                </List>

                {/* User Profile at Bottom */}
                <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <Tooltip title={isCollapsed ? userDetail?.user_details?.email : ''} placement="right">
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 1.5,
                                borderRadius: '10px',
                                // cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                overflow: 'hidden',
                                // '&:hover': {
                                //     backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                // },
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 36,
                                    height: 36,
                                    backgroundColor: '#6366f1',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    flexShrink: 0,
                                }}
                            >
                                {userDetail?.user_details?.email?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                            <Box
                                sx={{
                                    flex: 1,
                                    minWidth: 0,
                                    opacity: isCollapsed ? 0 : 1,
                                    transition: 'opacity 0.2s ease',
                                    overflow: 'hidden',
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: 'white',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {userDetail?.user_details?.email?.split('@')[0] || 'User'}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '11px',
                                        color: 'rgba(255, 255, 255, 0.5)',
                                        textTransform: 'capitalize',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {userDetail?.role?.toLowerCase() || 'User'}
                                </Typography>
                            </Box>
                        </Box>
                    </Tooltip>
                </Box>
            </Drawer>

            {/* Main Content */}
            <MyContext.Provider value={context}>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        backgroundColor: '#f9fafb',
                        transition: 'margin 0.3s ease',
                    }}
                >
                    <Routes>
                        <Route index element={<Leads />} />
                        <Route path="/app/leads" element={<Leads />} />
                        <Route path="/app/leads/add-leads" element={<AddLead />} />
                        <Route path="/app/leads/edit-lead" element={<EditLead />} />
                        <Route path="/app/leads/lead-details" element={<LeadDetails />} />
                        <Route path="/app/companies" element={<Company />} />
                        <Route path="/app/companies/add-company" element={<AddCompany />} />
                        <Route path="/app/companies/edit-company" element={<EditCompany />} />
                        <Route path="/app/companies/company-details" element={<CompanyDetails />} />
                        <Route path="/app/contacts" element={<Contacts />} />
                        <Route path="/app/contacts/add-contacts" element={<AddContacts />} />
                        <Route path="/app/contacts/contact-details" element={<ContactDetails />} />
                        <Route path="/app/contacts/edit-contact" element={<EditContact />} />
                        <Route path="/app/accounts" element={<Accounts />} />
                        <Route path="/app/accounts/add-account" element={<AddAccount />} />
                        <Route path="/app/accounts/account-details" element={<AccountDetails />} />
                        <Route path="/app/accounts/edit-account" element={<EditAccount />} />
                        <Route path="/app/users" element={<Users />} />
                        <Route path="/app/users/add-users" element={<AddUsers />} />
                        <Route path="/app/users/edit-user" element={<EditUser />} />
                        <Route path="/app/users/user-details" element={<UserDetails />} />
                        <Route path="/app/opportunities" element={<Opportunities />} />
                        <Route path="/app/opportunities/add-opportunity" element={<AddOpportunity />} />
                        <Route path="/app/opportunities/opportunity-details" element={<OpportunityDetails />} />
                        <Route path="/app/opportunities/edit-opportunity" element={<EditOpportunity />} />
                        <Route path="/app/cases" element={<Cases />} />
                        <Route path="/app/cases/add-case" element={<AddCase />} />
                        <Route path="/app/cases/edit-case" element={<EditCase />} />
                        <Route path="/app/cases/case-details" element={<CaseDetails />} />
                    </Routes>
                </Box>
            </MyContext.Provider>

            <OrganizationModal open={organizationModal} handleClose={() => setOrganizationModal(false)} />
        </Box>
    );
}
