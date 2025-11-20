import { useState, useEffect, useCallback } from 'react';
import { fetchData } from '../../components/FetchData';
import { UsersUrl, UserUrl } from '../../services/ApiUrls';

interface User {
    id: string;
    user_details: { email: string };
    role: string;
}

export const useUsers = (tab: 'active' | 'inactive') => {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const getAuthHeaders = () => ({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Token'),
        org: localStorage.getItem('org'),
    });

    const getUsers = useCallback(async () => {
        setLoading(true);
        try {
            const offset = (currentPage - 1) * recordsPerPage;

            const res = await fetchData(
                `${UsersUrl}/?offset=${offset}&limit=${recordsPerPage}&status=${tab}`,
                'GET',
                null as any,
                getAuthHeaders()
            );

            if (!res.error) {
                setUsers(res?.users || []);
                setTotalPages(Math.ceil((res?.total_count || 0) / recordsPerPage));
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    }, [tab, currentPage, recordsPerPage]);

    const deleteUser = async (userId: string) => {
        try {
            const res = await fetchData(`${UserUrl}/${userId}/`, 'DELETE', null as any, getAuthHeaders());
            if (!res.error) {
                void getUsers();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    };

    const handleRecordsPerPage = (value: number) => {
        setRecordsPerPage(value);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    useEffect(() => {
        void getUsers();
    }, [getUsers]);

    useEffect(() => {
        setCurrentPage(1);
    }, [tab]);

    return {
        loading,
        currentUsers: users,
        currentPage,
        totalPages,
        recordsPerPage,
        handleRecordsPerPage,
        handlePreviousPage,
        handleNextPage,
        deleteUser,
        refreshUsers: getUsers,
    };
};
