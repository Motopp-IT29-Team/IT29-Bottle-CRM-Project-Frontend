import React, { createContext, useContext, useState, useCallback } from 'react';
import { Notification, NotificationType } from '../types/notification';

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (type: NotificationType, title: string, message?: string, duration?: number) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback(
        (type: NotificationType, title: string, message?: string, duration: number = 5000) => {
            const id = `notification-${Date.now()}-${Math.random()}`;
            const notification: Notification = { id, type, title, message, duration };

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
