import React from 'react';
import { TableCell, TableRow, IconButton, Tooltip, Box } from '@mui/material';
import { FaTrashAlt } from 'react-icons/fa';
import { ICompany } from '../../types';

interface CompaniesTableRowProps {
    company: ICompany;
    index: number;
    onClick: (company: ICompany) => void;
    onDelete: (id: string) => void;
}

export function CompaniesTableRow({ company, index, onClick, onDelete }: CompaniesTableRowProps) {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(company.id);
    };

    return (
        <TableRow
            hover
            onClick={() => onClick(company)}
            sx={{
                cursor: 'pointer',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
            }}
        >
            {/* Index */}
            <TableCell sx={{ width: 60 }}>{index + 1}</TableCell>

            {/* Company Name */}
            <TableCell>
                <Box
                    sx={{
                        color: '#3E79F7',
                        fontWeight: 500,
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    }}
                >
                    {company.name}
                </Box>
            </TableCell>

            {/* Actions */}
            <TableCell sx={{ width: 100 }} align="center">
                <Tooltip title="Delete Company">
                    <IconButton
                        size="small"
                        onClick={handleDelete}
                        sx={{
                            color: '#f44336',
                            '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.04)',
                            },
                        }}
                    >
                        <FaTrashAlt size={16} />
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    );
}
