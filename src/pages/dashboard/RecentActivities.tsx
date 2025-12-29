import React from 'react';
import { Box, Paper, Typography, List, ListItem, Skeleton, Avatar } from '@mui/material';

interface ActivityItem {
    id: string;
    action: string;
    model_name: string;
    object_repr: string;
    user_email: string | null;
    created_on_arrow: string | null;
}

interface RecentActivitiesProps {
    activities: ActivityItem[];
    isLoading?: boolean;
}

const getActionColor = (action: string): string => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create')) return '#059669';
    if (actionLower.includes('update') || actionLower.includes('edit')) return '#d97706';
    if (actionLower.includes('delete')) return '#dc2626';
    return '#6366f1';
};

const getActionIcon = (action: string): string => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('create')) return '+';
    if (actionLower.includes('update') || actionLower.includes('edit')) return '✎';
    if (actionLower.includes('delete')) return '×';
    return '•';
};

export const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities, isLoading = false }) => {
    return (
        <Paper
            sx={{
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Box
                sx={{
                    px: 3,
                    py: 2,
                    borderBottom: '1px solid #e5e7eb',
                    backgroundColor: '#fafafa',
                }}
            >
                <Typography
                    sx={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#111827',
                    }}
                >
                    Recent Activities
                </Typography>
            </Box>

            <Box sx={{ flex: 1, overflow: 'auto' }}>
                {isLoading ? (
                    <List sx={{ p: 0 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <ListItem key={i} sx={{ px: 3, py: 2, borderBottom: '1px solid #f3f4f6' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                    <Skeleton variant="circular" width={36} height={36} />
                                    <Box sx={{ flex: 1 }}>
                                        <Skeleton variant="text" width="70%" height={20} />
                                        <Skeleton variant="text" width="40%" height={16} />
                                    </Box>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                ) : activities.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '200px',
                            color: '#9ca3af',
                        }}
                    >
                        <Typography sx={{ fontSize: '14px' }}>No recent activities</Typography>
                    </Box>
                ) : (
                    <List sx={{ p: 0 }}>
                        {activities.map((activity, index) => {
                            const actionColor = getActionColor(activity.action);
                            const actionIcon = getActionIcon(activity.action);
                            
                            return (
                                <ListItem
                                    key={activity.id}
                                    sx={{
                                        px: 3,
                                        py: 2,
                                        borderBottom: index < activities.length - 1 ? '1px solid #f3f4f6' : 'none',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                                        <Avatar
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                backgroundColor: `${actionColor}15`,
                                                color: actionColor,
                                                fontSize: '16px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {actionIcon}
                                        </Avatar>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                sx={{
                                                    fontSize: '13px',
                                                    color: '#111827',
                                                    lineHeight: 1.4,
                                                }}
                                            >
                                                <Box component="span" sx={{ fontWeight: 500 }}>
                                                    {activity.user_email || 'System'}
                                                </Box>
                                                {' '}
                                                <Box component="span" sx={{ color: '#6b7280' }}>
                                                    {activity.action.toLowerCase()}
                                                </Box>
                                                {' '}
                                                <Box component="span" sx={{ fontWeight: 500 }}>
                                                    {activity.model_name}
                                                </Box>
                                                {activity.object_repr && (
                                                    <>
                                                        {': '}
                                                        <Box component="span" sx={{ color: '#6366f1' }}>
                                                            {activity.object_repr}
                                                        </Box>
                                                    </>
                                                )}
                                            </Typography>
                                            {activity.created_on_arrow && (
                                                <Typography
                                                    sx={{
                                                        fontSize: '11px',
                                                        color: '#9ca3af',
                                                        mt: 0.5,
                                                    }}
                                                >
                                                    {activity.created_on_arrow}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                </ListItem>
                            );
                        })}
                    </List>
                )}
            </Box>
        </Paper>
    );
};
