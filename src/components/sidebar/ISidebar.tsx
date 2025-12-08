import React, { createContext, useState } from 'react';
import { AppBar, Box, Drawer, Toolbar, Typography } from '@mui/material';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import OrganizationModal from '../../pages/organization/OrganizationModal';
import { Companies } from '../../pages/сompanies/Companies';
import { AddCompany } from '../../pages/сompanies/AddCompany';
import { CompanyDetails } from '../../pages/сompanies/CompanyDetails';
import { EditCompany } from '../../pages/сompanies/EditCompany';
import { Leads } from '../../pages/leads/Leads';
import { AddLead } from '../../pages/leads/AddLead';
import { EditLead } from '../../pages/leads/EditLead';
import { LeadDetails } from '../../pages/leads/LeadDetails';
import { AddContacts } from '../../pages/contacts/AddContacts';
import { Contacts } from '../../pages/contacts/Contacts';
import { EditContact } from '../../pages/contacts/EditContacts';
import { ContactDetails } from '../../pages/contacts/ContactDetails';
import { Users } from '../../pages/users/Users';
import { Opportunities } from '../../pages/opportunities/Opportunities';
import { Cases } from '../../pages/cases/Cases';
import { Accounts } from '../../pages/accounts/Accounts';
import { AddAccount } from '../../pages/accounts/AddAccount';
import { EditAccount } from '../../pages/accounts/EditAccount';
import { AccountDetails } from '../../pages/accounts/AccountDetails';
import { AddUsers } from '../../pages/users/AddUsers';
import { EditUser } from '../../pages/users/EditUser';
import { UserDetails } from '../../pages/users/UserDetails';
import { AddOpportunity } from '../../pages/opportunities/AddOpportunity';
import { EditOpportunity } from '../../pages/opportunities/EditOpportunity';
import { OpportunityDetails } from '../../pages/opportunities/OpportunityDetails';
import { AddCase } from '../../pages/cases/AddCase';
import { EditCase } from '../../pages/cases/EditCase';
import { CaseDetails } from '../../pages/cases/CaseDetails';
import { ISidebarHeader } from './ISidebarHeader';
import { ISidebarNavigation } from './ISidebarNavigation';
import { ISidebarUserSection } from './ISidebarUserSection';
import { ISidebarCollapsedUser } from './ISidebarCollapsedUser';

import { routes } from '../../constants/routes';
import { FiBriefcase, FiFile, FiFolder, FiPhone, FiTrendingUp, FiUserPlus, FiUsers } from 'react-icons/fi';
import { useProfile } from '../../api';

export interface NavItem {
    key: string;
    label: string;
    icon: any;
    path: string;
    adminOnly?: boolean;
}

const navItems: NavItem[] = [
    { key: 'leads', label: 'Leads', icon: FiUsers, path: routes.leads.main },
    { key: 'contacts', label: 'Contacts', icon: FiPhone, path: routes.contacts.main },
    { key: 'opportunities', label: 'Opportunities', icon: FiTrendingUp, path: routes.opportunities.main },
    { key: 'accounts', label: 'Accounts', icon: FiFolder, path: routes.accounts.main },
    { key: 'companies', label: 'Companies', icon: FiFile, path: routes.companies.main },
    { key: 'users', label: 'Users', icon: FiUserPlus, path: routes.users.main, adminOnly: true },
    { key: 'cases', label: 'Cases', icon: FiBriefcase, path: routes.cases.main },
];

export const getVisibleNavItems = (isAdmin: boolean): NavItem[] => {
    return isAdmin ? navItems : navItems.filter((item) => !item.adminOnly);
};

const MyContext = createContext<any>(undefined);

export const ISidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [organizationModal, setOrganizationModal] = useState(false);
    const drawerWidth = isCollapsed ? 80 : 240;

    const { userDetail, orgName, getInitials, getDisplayName, isAdmin } = useProfile();

    const visibleNavItems = getVisibleNavItems(isAdmin);

    const getCurrentScreen = () => {
        const pathParts = location.pathname.split('/');
        return pathParts[1] || 'leads';
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
                <Toolbar sx={{ minHeight: '60px !important' }}>
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
                <ISidebarHeader isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />

                <ISidebarNavigation navItems={visibleNavItems} isCollapsed={isCollapsed} />

                {!isCollapsed ? (
                    <ISidebarUserSection
                        userDetail={userDetail}
                        orgName={orgName}
                        getInitials={getInitials}
                        getDisplayName={getDisplayName}
                        onOrganizationClick={() => setOrganizationModal(true)}
                    />
                ) : (
                    <ISidebarCollapsedUser
                        userDetail={userDetail}
                        getInitials={getInitials}
                        getDisplayName={getDisplayName}
                    />
                )}
            </Drawer>

            {/* Main Content */}
            <MyContext.Provider value={context}>
                <Box component="main" sx={{ flexGrow: 1, mt: '60px' }}>
                    <Routes>
                        <Route path="/" element={<Navigate to={routes.leads.main} replace />} />

                        <Route path={routes.leads.main} element={<Leads />} />
                        <Route path={routes.leads.create} element={<AddLead />} />
                        <Route path={routes.leads.edit} element={<EditLead />} />
                        <Route path={routes.leads.details} element={<LeadDetails />} />

                        <Route path={routes.companies.main} element={<Companies />} />
                        <Route path={routes.companies.create} element={<AddCompany />} />
                        <Route path={routes.companies.edit} element={<EditCompany />} />
                        <Route path={routes.companies.details} element={<CompanyDetails />} />

                        <Route path={routes.contacts.main} element={<Contacts />} />
                        <Route path={routes.contacts.create} element={<AddContacts />} />
                        <Route path={routes.contacts.details} element={<ContactDetails />} />
                        <Route path={routes.contacts.edit} element={<EditContact />} />

                        <Route path={routes.accounts.main} element={<Accounts />} />
                        <Route path={routes.accounts.create} element={<AddAccount />} />
                        <Route path={routes.accounts.details} element={<AccountDetails />} />
                        <Route path={routes.accounts.edit} element={<EditAccount />} />

                        {isAdmin && (
                            <>
                                <Route path={routes.users.main} element={<Users />} />
                                <Route path={routes.users.create} element={<AddUsers />} />
                                <Route path={routes.users.edit} element={<EditUser />} />
                                <Route path={routes.users.details} element={<UserDetails />} />
                            </>
                        )}

                        <Route path={routes.opportunities.main} element={<Opportunities />} />
                        <Route path={routes.opportunities.create} element={<AddOpportunity />} />
                        <Route path={routes.opportunities.details} element={<OpportunityDetails />} />
                        <Route path={routes.opportunities.edit} element={<EditOpportunity />} />

                        <Route path={routes.cases.main} element={<Cases />} />
                        <Route path={routes.cases.create} element={<AddCase />} />
                        <Route path={routes.cases.edit} element={<EditCase />} />
                        <Route path={routes.cases.details} element={<CaseDetails />} />
                    </Routes>
                </Box>
            </MyContext.Provider>

            <OrganizationModal open={organizationModal} handleClose={() => setOrganizationModal(false)} />
        </Box>
    );
};
