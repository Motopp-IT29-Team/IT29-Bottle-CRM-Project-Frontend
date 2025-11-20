import { ReactNode } from 'react';

export type ActionType = 'back' | 'save' | 'cancel' | 'edit' | 'delete' | 'custom';

export type ActionColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

export interface AppBarAction {
    type: ActionType;
    label?: string;
    onClick?: () => void;
    icon?: ReactNode;
    color?: ActionColor;
    disabled?: boolean;
    loading?: boolean;
}
