import React, { SyntheticEvent } from 'react';
import { Tabs, Button, Stack } from '@mui/material';
import { FiPlus } from 'react-icons/fi';
import { CustomTab, CustomToolbar } from '../../../styles/CssStyled';

interface TabConfig {
    value: string;
    label: string;
}

interface ITableToolbarProps {
    tabs?: TabConfig[];
    currentTab?: string;
    onTabChange?: (e: SyntheticEvent, val: string) => void;
    addButtonLabel?: string;
    onAdd?: () => void;
    loading?: boolean;
    children?: React.ReactNode;
}

const TAB_STYLES = {
    active: {
        backgroundColor: 'white !important',
        color: '#667eea !important',
        fontSize: '13px',
        textTransform: 'capitalize' as const,
        fontWeight: 500,
        minHeight: '36px',
        borderRadius: '8px',
    },
    inactive: {
        backgroundColor: '#667eea !important',
        color: 'white !important',
        fontSize: '13px',
        textTransform: 'capitalize' as const,
        fontWeight: 500,
        minHeight: '36px',
        borderRadius: '8px',
    },
};

const ADD_BUTTON_STYLES = {
    backgroundColor: '#667eea',
    color: 'white',
    textTransform: 'none' as const,
    fontSize: '13px',
    fontWeight: 500,
    px: 2,
    py: 1,
    borderRadius: '8px',
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: '#5568d3',
        boxShadow: 'none',
    },
};

export const ITableToolbar: React.FC<ITableToolbarProps> = ({
    tabs,
    currentTab,
    onTabChange,
    addButtonLabel = 'Add',
    onAdd,
    loading = false,
    children,
}) => {
    const getTabStyle = (tabValue: string) => {
        const isActive = currentTab === tabValue;
        const baseStyle = isActive ? TAB_STYLES.active : TAB_STYLES.inactive;
        const marginStyle = tabs && tabs.findIndex((t) => t.value === tabValue) > 0 ? { ml: '5px' } : {};

        return {
            ...baseStyle,
            ...marginStyle,
        };
    };

    return (
        <CustomToolbar>
            <Tabs
                value={currentTab}
                onChange={onTabChange}
                sx={{
                    mt: '26px',
                    '& .MuiTabs-indicator': {
                        display: 'none',
                    },
                }}
            >
                {tabs?.map((tab) => (
                    <CustomTab key={tab.value} value={tab.value} label={tab.label} sx={getTabStyle(tab.value)} />
                ))}
            </Tabs>

            <Stack direction="row" spacing={1.5} alignItems="center">
                {children}

                {onAdd && (
                    <Button
                        variant="contained"
                        startIcon={<FiPlus />}
                        onClick={onAdd}
                        disabled={loading}
                        sx={ADD_BUTTON_STYLES}
                    >
                        {addButtonLabel}
                    </Button>
                )}
            </Stack>
        </CustomToolbar>
    );
};
