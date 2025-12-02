import { useState, useEffect } from 'react';
import { profileService, UserDetail } from '../services/profile.service';

export const useProfile = () => {
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
    const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
    const [orgName, setOrgName] = useState<string>('Loading...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await profileService.getProfile();

            if (data?.user_obj) {
                setUserDetail(data.user_obj);
            }

            const newRole = data?.user_obj?.role;
            if (newRole) {
                localStorage.setItem('role', newRole);
                setRole(newRole);
            }

            const organizationName = data?.current_org?.name || 'Organization';
            setOrgName(organizationName);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setOrgName('Organization');
        } finally {
            setLoading(false);
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
        refetch: fetchProfile,
    };
};
