import React from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { FiChevronLeft } from '@react-icons/all-files/fi/FiChevronLeft';
import { FiChevronRight } from '@react-icons/all-files/fi/FiChevronRight';
import { FiChevronDown } from '@react-icons/all-files/fi/FiChevronDown';
import { FabLeft, FabRight } from '../../styles/CssStyled';
import { USERS_PAGINATION_SELECT, USERS_PAGINATION_SELECT_ITEMS } from '../../styles/UsersStyles';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    recordsPerPage: number;
    onRecordsPerPageChange: (value: number) => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
}

const recordsList = [
    [10, '10 Records per page'],
    [20, '20 Records per page'],
    [30, '30 Records per page'],
    [40, '40 Records per page'],
    [50, '50 Records per page'],
];

export const UsersPagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    recordsPerPage,
    onRecordsPerPageChange,
    onPreviousPage,
    onNextPage,
}) => {
    return (
        <>
            <Select
                value={recordsPerPage}
                onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
                IconComponent={FiChevronDown}
                sx={USERS_PAGINATION_SELECT}
            >
                {recordsList.map((item, i) => (
                    <MenuItem key={i} value={item[0]}>
                        {item[1]}
                    </MenuItem>
                ))}
            </Select>

            <Box sx={USERS_PAGINATION_SELECT_ITEMS}>
                <FabLeft
                    onClick={onPreviousPage}
                    disabled={currentPage === 1}
                    sx={{ '&:disabled': { opacity: 0.5, cursor: 'not-allowed' } }}
                >
                    <FiChevronLeft />
                </FabLeft>
                <Typography sx={{ px: 2, fontSize: '14px', fontWeight: 500, color: '#475569' }}>
                    {currentPage} / {totalPages}
                </Typography>
                <FabRight
                    onClick={onNextPage}
                    disabled={currentPage === totalPages}
                    sx={{ '&:disabled': { opacity: 0.5, cursor: 'not-allowed' } }}
                >
                    <FiChevronRight />
                </FabRight>
            </Box>
        </>
    );
};
