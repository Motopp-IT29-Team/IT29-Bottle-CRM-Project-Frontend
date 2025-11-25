import React, { useState } from 'react';
import { Paper, TableContainer, Table, TableBody, TableRow, TableCell, Typography } from '@mui/material';
import { EnhancedTableHead } from '../../EnchancedTableHead';
import { Spinner } from '../../Spinner';

export interface ITableColumn {
    id: string;
    label: string;
    numeric?: boolean;
    disablePadding?: boolean;
    sortable?: boolean;
    width?: string | number;
}

interface ITableProps<T> {
    data: T[];
    columns: ITableColumn[];
    loading?: boolean;
    emptyMessage?: string;
    renderRow: (row: T, index: number) => React.ReactNode;
    getRowKey: (row: T) => string | number;
    sortable?: boolean;
    defaultOrderBy?: string;
    defaultOrder?: 'asc' | 'desc';
    customSort?: (data: T[], order: 'asc' | 'desc', orderBy: string) => T[];
}

export function ITable<T>({
    data,
    columns,
    loading = false,
    emptyMessage = 'No data found',
    renderRow,
    getRowKey,
    sortable = true,
    defaultOrderBy,
    defaultOrder = 'asc',
    customSort,
}: ITableProps<T>) {
    const [order, setOrder] = useState<'asc' | 'desc'>(defaultOrder);
    const [orderBy, setOrderBy] = useState(defaultOrderBy || columns[0]?.id || '');

    const handleRequestSort = (event: any, property: string) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortData = (data: T[]) => {
        if (!sortable || !orderBy) return data;

        // Use custom sort function if provided
        if (customSort) {
            return customSort(data, order, orderBy);
        }

        // Default sorting for simple fields
        return [...data].sort((a: any, b: any) => {
            const aValue = a[orderBy];
            const bValue = b[orderBy];

            if (aValue === bValue) return 0;

            if (order === 'asc') {
                return aValue < bValue ? -1 : 1;
            } else {
                return aValue > bValue ? -1 : 1;
            }
        });
    };

    const sortedData = sortData(data);

    // Convert columns to headCells format for EnhancedTableHead
    const headCells = columns.map((col) => ({
        id: col.id,
        label: col.label,
        numeric: col.numeric || false,
        disablePadding: col.disablePadding || false,
    }));

    return (
        <Paper elevation={0} sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e7ef' }}>
            <TableContainer>
                <Table>
                    {sortable && (
                        <EnhancedTableHead
                            numSelected={0}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={() => {}}
                            onRequestSort={handleRequestSort}
                            rowCount={data.length}
                            headCells={headCells}
                            numSelectedId={[]}
                            isSelectedId={[]}
                        />
                    )}
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} sx={{ border: 0, textAlign: 'center', py: 8 }}>
                                    <Spinner />
                                </TableCell>
                            </TableRow>
                        ) : sortedData.length > 0 ? (
                            sortedData.map((row, index) => (
                                <React.Fragment key={getRowKey(row)}>{renderRow(row, index)}</React.Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ border: 0, py: 8 }}>
                                    <Typography color="text.secondary">{emptyMessage}</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}
