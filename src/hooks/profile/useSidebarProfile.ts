import { useState, useEffect } from 'react';
import { fetchData, Header1 } from '../../components/FetchData';
import { ProfileUrl } from '../../services/ApiUrls';

interface UserDetail {
    first_name?: string;
    last_name?: string;
    role?: string;
    user_details?: {
        email?: string;
        profile_pic?: string;
    };
}

export const useProfile = () => {
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
    const [orgName, setOrgName] = useState<string>('Loading...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProfile();
        fetchOrgInfo();
    }, []);

    const fetchUserProfile = async () => {
        try {
            const res: any = await fetchData(`${ProfileUrl}/`, 'GET', null as any, Header1);
            if (res?.user_obj) {
                setUserDetail(res.user_obj);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchOrgInfo = async () => {
        const token = localStorage.getItem('Token');
        const org = localStorage.getItem('org');

        if (!token || !org) {
            setOrgName('Organization');
            return;
        }

        try {
            const profile: any = await fetchData(`${ProfileUrl}/`, 'GET', undefined, {
                Authorization: token,
                org,
                Accept: 'application/json',
            });

            const newRole = profile?.user_obj?.role;
            if (newRole) {
                localStorage.setItem('role', newRole);
                setRole(newRole);
            }

            const organizationName = profile?.current_org?.name || 'Organization';
            setOrgName(organizationName);
        } catch (err) {
            console.error('Error fetching organization info:', err);
            setOrgName('Organization');
        }
    };

    const getInitials = (): string => {
        if (userDetail?.first_name) {
            const firstInitial = userDetail.first_name.charAt(0).toUpperCase();
            const lastInitial = userDetail.last_name?.charAt(0).toUpperCase() || '';
            return `${firstInitial}${lastInitial}`;
        }
        return userDetail?.user_details?.email?.charAt(0).toUpperCase() || 'U';
    };

    const getDisplayName = (): string => {
        const fullName = `${userDetail?.first_name || ''} ${userDetail?.last_name || ''}`.trim();
        if (fullName) return fullName;
        return userDetail?.user_details?.email?.split('@')[0] || 'User';
    };

    const isAdmin = (role || '').toUpperCase() === 'ADMIN';

    return {
        userDetail,
        role,
        orgName,
        loading,
        getInitials,
        getDisplayName,
        isAdmin,
    };
};
