import React from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import { FiChevronLeft, FiChevronRight, FiChevronDown } from 'react-icons/fi';
import { FabLeft, FabRight } from '../../../styles/CssStyled';

interface Props {
    currentPage: number;
    totalPages: number;
    recordsPerPage: number;
    onRecordsPerPageChange: (value: number) => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
    recordsOptions?: number[];
    label?: string;
}

const DEFAULT_RECORDS_OPTIONS = [10, 20, 30, 40, 50];

const SELECT_STYLES = {
    fontSize: '13px',
    fontWeight: 500,
    color: '#475569',
    borderRadius: '8px',
    height: '36px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiSelect-icon': {
        color: '#64748b',
        fontSize: '18px',
    },
    '&:hover': {
        backgroundColor: '#f8fafc',
    },
};

const ITEMS_CONTAINER_STYLES = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
};

export const IPagination: React.FC<Props> = ({
    currentPage,
    totalPages,
    recordsPerPage,
    onRecordsPerPageChange,
    onPreviousPage,
    onNextPage,
    recordsOptions = DEFAULT_RECORDS_OPTIONS,
    label = 'Records per page',
}) => {
    return (
        <>
            <Select
                value={recordsPerPage}
                onChange={(e) => onRecordsPerPageChange(Number(e.target.value))}
                IconComponent={FiChevronDown}
                sx={SELECT_STYLES}
            >
                {recordsOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option} {label}
                    </MenuItem>
                ))}
            </Select>

            {totalPages > 1 && (
                <Box sx={ITEMS_CONTAINER_STYLES}>
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
            )}
        </>
    );
};
