import { FiBriefcase, FiFile, FiFolder, FiPhone, FiTrendingUp, FiUserPlus, FiUsers } from 'react-icons/fi';
import { routes } from '../../constants/routes';

export interface NavItem {
    key: string;
    label: string;
    icon: any;
    path: string;
    adminOnly?: boolean;
}

export const navItems: NavItem[] = [
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
