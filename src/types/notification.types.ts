export type INotificationType = 'success' | 'error' | 'warning' | 'info';

export interface INotification {
    id: string;
    type: INotificationType;
    title: string;
    message?: string;
    duration?: number;
}
