import { FiBriefcase, FiFile, FiFolder, FiPhone, FiTrendingUp, FiUserPlus, FiUsers } from 'react-icons/fi';

export interface NavItem {
    key: string;
    label: string;
    icon: any;
    path: string;
    adminOnly?: boolean;
}

export const navItems: NavItem[] = [
    { key: 'leads', label: 'Leads', icon: FiUsers, path: '/app/leads' },
    { key: 'contacts', label: 'Contacts', icon: FiPhone, path: '/app/contacts' },
    { key: 'opportunities', label: 'Opportunities', icon: FiTrendingUp, path: '/app/opportunities' },
    { key: 'accounts', label: 'Accounts', icon: FiFolder, path: '/app/accounts' },
    { key: 'companies', label: 'Companies', icon: FiFile, path: '/app/companies' },
    { key: 'users', label: 'Users', icon: FiUserPlus, path: '/app/users', adminOnly: true },
    { key: 'cases', label: 'Cases', icon: FiBriefcase, path: '/app/cases' },
];

export const getVisibleNavItems = (isAdmin: boolean): NavItem[] => {
    return isAdmin ? navItems : navItems.filter((item) => !item.adminOnly);
};
