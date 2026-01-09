import React, { useEffect, useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { ITable, ITableColumn, ITableToolbar, IPagination } from '../../components/ui';
import { useAccounts } from '../../api';
import { routes } from '../../constants/routes';
import { IAccount } from '../../types';
import { AccountsTableRow } from '../../components/accounts/AccountsTableRow';

const columns: ITableColumn[] = [
    { id: 'name', label: 'Name', sortable: true },
    { id: 'website', label: 'Website', sortable: false },
    { id: 'created_by', label: 'Created By', sortable: false },
    { id: 'country', label: 'Country', sortable: true },
];

export function Accounts() {
    const navigate = useNavigate();
    const { getAll, isLoading } = useAccounts();

    const [tab, setTab] = useState<'open' | 'closed'>('open');
    const [openAccounts, setOpenAccounts] = useState<IAccount[]>([]);
    const [closedAccounts, setClosedAccounts] = useState<IAccount[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [openAccountsCount, setOpenAccountsCount] = useState(0);
    const [closedAccountsCount, setClosedAccountsCount] = useState(0);

    useEffect(() => {
        fetchAccounts();
    }, [currentPage, recordsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [tab]);

    const fetchAccounts = async () => {
        const offset = (currentPage - 1) * recordsPerPage;
        const result = await getAll({ offset, limit: recordsPerPage });

        if (result.success && result.data) {
            const openAccs = result.data.active_accounts.open_accounts;
            const closedAccs = result.data.closed_accounts.close_accounts;

            setOpenAccounts(openAccs);
            setClosedAccounts(closedAccs);
            setOpenAccountsCount(openAccs.length);
            setClosedAccountsCount(closedAccs.length);

            const currentCount = tab === 'open' ? openAccs.length : closedAccs.length;
            setTotalPages(Math.ceil(currentCount / recordsPerPage));
        }
    };

    const handleTabChange = (e: SyntheticEvent, value: string) => {
        setTab(value as 'open' | 'closed');
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

    const handleRowClick = (id: string) => {
        navigate(routes.accounts.details + `?id=${id}`);
    };

    const handleAddAccount = () => {
        if (!isLoading) navigate(routes.accounts.create);
    };

    const sortAccounts = (accounts: IAccount[], order: 'asc' | 'desc', orderBy: string) => {
        return [...accounts].sort((a, b) => {
            let aValue: any;
            let bValue: any;

            if (orderBy === 'name') {
                aValue = a.name?.toLowerCase() || '';
                bValue = b.name?.toLowerCase() || '';
            } else if (orderBy === 'country') {
                aValue = a.billing_country?.toLowerCase() || '';
                bValue = b.billing_country?.toLowerCase() || '';
            } else {
                return 0;
            }

            if (order === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });
    };

    const tabs = [
        { value: 'open', label: `Open (${openAccountsCount})` },
        { value: 'closed', label: `Closed (${closedAccountsCount})` },
    ];

    const currentAccounts = tab === 'open' ? openAccounts : closedAccounts;

    return (
        <Box>
            <ITableToolbar
                tabs={tabs}
                currentTab={tab}
                onTabChange={handleTabChange}
                addButtonLabel="Add Account"
                onAdd={handleAddAccount}
                loading={isLoading}
            >
                <IPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    recordsPerPage={recordsPerPage}
                    onRecordsPerPageChange={handleRecordsPerPage}
                    onPreviousPage={handlePreviousPage}
                    onNextPage={handleNextPage}
                />
            </ITableToolbar>

            <ITable
                data={currentAccounts}
                columns={columns}
                loading={isLoading}
                emptyMessage={`No ${tab} accounts found`}
                renderRow={(account) => (
                    <AccountsTableRow key={account.id} account={account} onRowClick={handleRowClick} />
                )}
                getRowKey={(account) => account.id}
                sortable={true}
                defaultOrderBy="name"
                customSort={sortAccounts}
            />
        </Box>
    );
}
