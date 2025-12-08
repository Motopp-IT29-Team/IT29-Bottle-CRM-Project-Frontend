import React, { createContext, useContext, useState, useCallback } from 'react';
import { INotification, INotificationType } from '../../../types';

interface NotificationContextType {
    notifications: INotification[];
    addNotification: (type: INotificationType, title: string, message?: string, duration?: number) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<INotification[]>([]);

    const addNotification = useCallback(
        (type: INotificationType, title: string, message?: string, duration: number = 5000) => {
            const id = `notification-${Date.now()}-${Math.random()}`;
            const notification: INotification = { id, type, title, message, duration };

            setNotifications((prev) => [...prev, notification]);

            setTimeout(() => {
                removeNotification(id);
            }, duration);
        },
        []
    );

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within NotificationProvider');
    }
    return context;
};
