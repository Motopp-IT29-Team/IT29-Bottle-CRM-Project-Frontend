import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarGroup, Box, Button, Stack, Tabs, Typography, Link, MenuItem, Select } from '@mui/material';
import { LeadUrl } from '../../services/ApiUrls';
import { Label } from '../../components/Label';
import { fetchData } from '../../components/FetchData';
import { Spinner } from '../../components/Spinner';
import FormateTime from '../../components/FormateTime';
import { FiChevronUp } from '@react-icons/all-files/fi/FiChevronUp';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FiPlus } from '@react-icons/all-files/fi/FiPlus';
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft';
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight';
import { CustomTab, CustomToolbar, FabLeft, FabRight } from '../../styles/CssStyled';
import '../../styles/style.css';

interface Lead {
    id: string;
    title: string;
    country?: string;
    source?: string;
    status?: string;
    tags: any[];
    team?: any[];
    first_name?: string;
    last_name?: string;
    created_at: string;
    created_by?: {
        profile_pic?: string;
    };
}

export function Leads() {
    const navigate = useNavigate();
    const location = useLocation();
    const [tab, setTab] = useState<string>('open');
    const [loading, setLoading] = useState(true);

    // Leads data
    const [openLeads, setOpenLeads] = useState<Lead[]>([]);
    const [closedLeads, setClosedLeads] = useState<Lead[]>([]);

    // Filter data
    const [contacts, setContacts] = useState([]);
    const [status, setStatus] = useState([]);
    const [source, setSource] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [tags, setTags] = useState([]);
    const [users, setUsers] = useState([]);
    const [countries, setCountries] = useState([]);
    const [industries, setIndustries] = useState([]);

    // UI state
    const [selectOpen, setSelectOpen] = useState(false);

    // Pagination for open leads
    const [openCurrentPage, setOpenCurrentPage] = useState(1);
    const [openRecordsPerPage, setOpenRecordsPerPage] = useState(10);
    const [openTotalPages, setOpenTotalPages] = useState(0);

    // Pagination for closed leads
    const [closedCurrentPage, setClosedCurrentPage] = useState(1);
    const [closedRecordsPerPage, setClosedRecordsPerPage] = useState(10);
    const [closedTotalPages, setClosedTotalPages] = useState(0);

    useEffect(() => {
        if (localStorage.getItem('org')) {
            getLeads();
        }
    }, []);

    useEffect(() => {
        if (location.pathname === '/' || location.pathname === '/app' || location.pathname === '/app/') {
            navigate('/app/leads', { replace: true });
        }
    }, [location.pathname, navigate]);

    useEffect(() => {
        getLeads();
    }, [openCurrentPage, openRecordsPerPage, closedCurrentPage, closedRecordsPerPage]);

    const getLeads = async () => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org'),
        };

        try {
            const offset =
                tab === 'open'
                    ? (openCurrentPage - 1) * openRecordsPerPage
                    : (closedCurrentPage - 1) * closedRecordsPerPage;
            const limit = tab === 'open' ? openRecordsPerPage : closedRecordsPerPage;

            const res = await fetchData(`${LeadUrl}/?offset=${offset}&limit=${limit}`, 'GET', null as any, Header);

            if (!res.error) {
                setOpenLeads(res?.open_leads?.open_leads || []);
                setOpenTotalPages(Math.ceil((res?.open_leads?.leads_count || 0) / openRecordsPerPage));

                setClosedLeads(res?.close_leads?.close_leads || []);
                setClosedTotalPages(Math.ceil((res?.close_leads?.leads_count || 0) / closedRecordsPerPage));

                setContacts(res?.contacts || []);
                setStatus(res?.status || []);
                setSource(res?.source || []);
                setCompanies(res?.companies || []);
                setTags(res?.tags || []);
                setUsers(res?.users || []);
                setCountries(res?.countries || []);
                setIndustries(res?.industries || []);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
            setLoading(false);
        }
    };

    const handleChangeTab = (e: SyntheticEvent, val: string) => {
        if (!val) return;
        setTab(val);
    };

    const handleRecordsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(event.target.value);

        if (tab === 'open') {
            setOpenRecordsPerPage(value);
            setOpenCurrentPage(1);
        } else {
            setClosedRecordsPerPage(value);
            setClosedCurrentPage(1);
        }
    };

    const handlePreviousPage = () => {
        if (tab === 'open') {
            setOpenCurrentPage((prev) => Math.max(prev - 1, 1));
        } else {
            setClosedCurrentPage((prev) => Math.max(prev - 1, 1));
        }
    };

    const handleNextPage = () => {
        if (tab === 'open') {
            setOpenCurrentPage((prev) => Math.min(prev + 1, openTotalPages));
        } else {
            setClosedCurrentPage((prev) => Math.min(prev + 1, closedTotalPages));
        }
    };

    const onAddHandle = () => {
        if (!loading) {
            navigate('/app/leads/add-leads', {
                state: {
                    detail: false,
                    contacts,
                    status,
                    source,
                    companies,
                    tags,
                    users,
                    countries,
                    industries,
                },
            });
        }
    };

    const selectLeadList = (leadId: string) => {
        navigate(`/app/leads/lead-details?id=${leadId}`);
    };

    const recordsList = [10, 20, 30, 40, 50];

    const renderLead = (item: Lead, index: number) => (
        <Box key={item.id || index} className="lead-box">
            <Box className="lead-box1">
                <Stack className="lead-row1">
                    <div
                        style={{
                            color: '#1A3353',
                            fontSize: '1rem',
                            fontWeight: '500',
                            cursor: 'pointer',
                        }}
                        onClick={() => selectLeadList(item.id)}
                    >
                        {item.title}
                    </div>
                </Stack>

                <Stack className="lead-row2">
                    <div className="lead-row2-col1">
                        <div
                            style={{
                                color: 'gray',
                                fontSize: '16px',
                                textTransform: 'capitalize',
                            }}
                        >
                            {item.country || ''} - source{' '}
                            <span style={{ color: '#1a3353', fontWeight: 500 }}>{item.source || '--'}</span> - status{' '}
                            <span style={{ color: '#1a3353', fontWeight: 500 }}>{item.status || '--'}</span>
                        </div>

                        <Box sx={{ ml: 1 }}>
                            {item.tags.slice(0, 4).map((tagData: any, idx: number) => (
                                <Label tags={tagData} key={idx} />
                            ))}
                            {item.tags.length > 4 && <Link sx={{ ml: 1 }}>+{item.tags.length - 4}</Link>}
                        </Box>

                        {item.team && item.team.length > 0 && (
                            <Box sx={{ ml: 1 }}>
                                <AvatarGroup max={3}>
                                    {item.team.map((team: any, idx: number) => (
                                        <Avatar key={idx} alt={team} src={team}>
                                            {team}
                                        </Avatar>
                                    ))}
                                </AvatarGroup>
                            </Box>
                        )}
                    </div>

                    <div className="lead-row2-col2">
                        created {FormateTime(item.created_at)} by
                        <Avatar
                            alt={item.first_name}
                            src={item.created_by?.profile_pic}
                            sx={{ ml: 1, display: 'inline-flex' }}
                        />
                        &nbsp;{item.first_name} {item.last_name}
                    </div>
                </Stack>
            </Box>
        </Box>
    );

    const currentLeads = tab === 'open' ? openLeads : closedLeads;
    const currentPage = tab === 'open' ? openCurrentPage : closedCurrentPage;
    const totalPages = tab === 'open' ? openTotalPages : closedTotalPages;
    const recordsPerPage = tab === 'open' ? openRecordsPerPage : closedRecordsPerPage;

    return (
        <Box sx={{ mt: '60px' }}>
            <CustomToolbar>
                <Tabs value={tab} onChange={handleChangeTab} sx={{ mt: '26px' }}>
                    <CustomTab
                        value="open"
                        label="Open"
                        sx={{
                            backgroundColor: tab === 'open' ? '#F0F7FF' : '#284871',
                            color: tab === 'open' ? '#3f51b5' : 'white',
                        }}
                    />
                    <CustomTab
                        value="closed"
                        label="Closed"
                        sx={{
                            backgroundColor: tab === 'closed' ? '#F0F7FF' : '#284871',
                            color: tab === 'closed' ? '#3f51b5' : 'white',
                            ml: '5px',
                        }}
                    />
                </Tabs>

                <Stack direction="row" alignItems="center">
                    <Select
                        value={recordsPerPage}
                        onChange={(e: any) => handleRecordsPerPage(e)}
                        open={selectOpen}
                        onOpen={() => setSelectOpen(true)}
                        onClose={() => setSelectOpen(false)}
                        className="custom-select"
                        onClick={() => setSelectOpen(!selectOpen)}
                        IconComponent={() => (
                            <div onClick={() => setSelectOpen(!selectOpen)} className="custom-select-icon">
                                {selectOpen ? (
                                    <FiChevronUp style={{ marginTop: '12px' }} />
                                ) : (
                                    <FiChevronDown style={{ marginTop: '12px' }} />
                                )}
                            </div>
                        )}
                        sx={{
                            '& .MuiSelect-select': {
                                overflow: 'visible !important',
                            },
                        }}
                    >
                        {recordsList.map((num) => (
                            <MenuItem key={num} value={num}>
                                {num} Records per page
                            </MenuItem>
                        ))}
                    </Select>

                    <Box
                        sx={{
                            borderRadius: '7px',
                            backgroundColor: 'white',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            mr: 1,
                        }}
                    >
                        <FabLeft onClick={handlePreviousPage} disabled={currentPage === 1}>
                            <FiChevronLeft style={{ height: '15px' }} />
                        </FabLeft>
                        <Typography
                            sx={{
                                fontSize: '15px',
                                color: '#1A3353',
                                textAlign: 'center',
                            }}
                        >
                            {currentPage} to {totalPages}
                        </Typography>
                        <FabRight onClick={handleNextPage} disabled={currentPage === totalPages}>
                            <FiChevronRight style={{ height: '15px' }} />
                        </FabRight>
                    </Box>

                    <Button
                        variant="contained"
                        startIcon={<FiPlus className="plus-icon" />}
                        onClick={onAddHandle}
                        className="add-button"
                    >
                        Add Lead
                    </Button>
                </Stack>
            </CustomToolbar>

            <Box sx={{ p: '10px', mt: '5px' }}>
                {loading ? (
                    <Spinner />
                ) : currentLeads.length > 0 ? (
                    currentLeads.map((item, index) => renderLead(item, index))
                ) : (
                    <Typography sx={{ textAlign: 'center', mt: 4, color: 'gray' }}>No {tab} leads found</Typography>
                )}
            </Box>
        </Box>
    );
}
