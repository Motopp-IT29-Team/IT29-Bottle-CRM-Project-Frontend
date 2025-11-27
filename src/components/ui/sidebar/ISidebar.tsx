import React, { useState } from 'react';
import { AppBar, Box, Drawer, Toolbar, Typography } from '@mui/material';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import OrganizationModal from '../../../pages/organization/OrganizationModal';
import Company from '../../../pages/company/Company';
import AddCompany from '../../../pages/company/AddCompany';
import CompanyDetails from '../../../pages/company/CompanyDetails';
import EditCompany from '../../../pages/company/EditCompany';
import { Leads } from '../../../pages/leads/Leads';
import { AddLead } from '../../../pages/leads/AddLead';
import { EditLead } from '../../../pages/leads/EditLead';
import { LeadDetails } from '../../../pages/leads/LeadDetails';
import AddContacts from '../../../pages/contacts/AddContacts';
import Contacts from '../../../pages/contacts/Contacts';
import EditContact from '../../../pages/contacts/EditContacts';
import ContactDetails from '../../../pages/contacts/ContactDetails';
import Users from '../../../pages/users/Users';
import Opportunities from '../../../pages/opportunities/Opportunities';
import Cases from '../../../pages/cases/Cases';
import Accounts from '../../../pages/accounts/Accounts';
import { AddAccount } from '../../../pages/accounts/AddAccount';
import { EditAccount } from '../../../pages/accounts/EditAccount';
import { AccountDetails } from '../../../pages/accounts/AccountDetails';
import { AddUsers } from '../../../pages/users/AddUsers';
import { EditUser } from '../../../pages/users/EditUser';
import { UserDetails } from '../../../pages/users/UserDetails';
import { AddOpportunity } from '../../../pages/opportunities/AddOpportunity';
import { EditOpportunity } from '../../../pages/opportunities/EditOpportunity';
import { OpportunityDetails } from '../../../pages/opportunities/OpportunityDetails';
import { AddCase } from '../../../pages/cases/AddCase';
import { EditCase } from '../../../pages/cases/EditCase';
import { CaseDetails } from '../../../pages/cases/CaseDetails';
import MyContext from '../../../context/Context';
import { getVisibleNavItems } from '../../../configs/sidebar/sidebarConfig';
import { ISidebarHeader } from './ISidebarHeader';
import { ISidebarNavigation } from './ISidebarNavigation';
import { ISidebarUserSection } from './ISidebarUserSection';
import { ISidebarCollapsedUser } from './ISidebarCollapsedUser';
import { useProfile } from '../../../hooks/profile/useSidebarProfile';

export const ISidebar = () => {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [organizationModal, setOrganizationModal] = useState(false);
    const drawerWidth = isCollapsed ? 80 : 240;

    const { userDetail, orgName, getInitials, getDisplayName, isAdmin } = useProfile();

    const visibleNavItems = getVisibleNavItems(isAdmin);

    const getCurrentScreen = () => {
        const pathParts = location.pathname.split('/');
        return pathParts[2] || 'leads';
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
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        backgroundColor: '#f9fafb',
                        transition: 'margin 0.3s ease',
                    }}
                >
                    <Routes>
                        <Route path="/" element={<Navigate to="/app/leads" replace />} />

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

                        {isAdmin && (
                            <>
                                <Route path="/app/users" element={<Users />} />
                                <Route path="/app/users/add-users" element={<AddUsers />} />
                                <Route path="/app/users/edit-user" element={<EditUser />} />
                                <Route path="/app/users/user-details" element={<UserDetails />} />
                            </>
                        )}

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
};
