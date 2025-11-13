import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './NotificationSystem.css';

const NotificationSystem = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Listen for custom notification events
        const handleNotification = (event) => {
            const { type, message, duration = 4000, loading = false } = event.detail;
            
            const notification = {
                id: Date.now() + Math.random(),
                type,
                message,
                loading,
                timestamp: new Date()
            };

            setNotifications(prev => [...prev, notification]);

            // Auto remove notification after duration (unless it's a loading notification)
            if (!loading) {
                setTimeout(() => {
                    removeNotification(notification.id);
                }, duration);
            }
        };

        // Listen for loading update events
        const handleLoadingUpdate = (event) => {
            const { id, message, complete } = event.detail;
            
            setNotifications(prev => prev.map(notif => {
                if (notif.id === id) {
                    if (complete) {
                        // Remove loading notification after showing completion
                        setTimeout(() => removeNotification(id), 2000);
                        return { ...notif, loading: false, message, type: 'success' };
                    }
                    return { ...notif, message };
                }
                return notif;
            }));
        };

        window.addEventListener('showNotification', handleNotification);
        window.addEventListener('updateLoadingNotification', handleLoadingUpdate);

        return () => {
            window.removeEventListener('showNotification', handleNotification);
            window.removeEventListener('updateLoadingNotification', handleLoadingUpdate);
        };
    }, []);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const getNotificationIcon = (type, loading) => {
        if (loading) {
            return <div className="loading-spinner"></div>;
        }
        
        switch (type) {
            case 'success':
                return <i className="fas fa-check-circle"></i>;
            case 'error':
                return <i className="fas fa-exclamation-circle"></i>;
            case 'warning':
                return <i className="fas fa-exclamation-triangle"></i>;
            case 'info':
                return <i className="fas fa-info-circle"></i>;
            default:
                return <i className="fas fa-bell"></i>;
        }
    };

    const getNotificationClass = (type) => {
        switch (type) {
            case 'success':
                return 'notification-success';
            case 'error':
                return 'notification-error';
            case 'warning':
                return 'notification-warning';
            case 'info':
                return 'notification-info';
            default:
                return 'notification-default';
        }
    };

    if (notifications.length === 0) return null;

    return createPortal(
        <div className="notification-container">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`notification ${getNotificationClass(notification.type)} ${
                        notification.loading ? 'notification-loading' : ''
                    }`}
                >
                    <div className="notification-content">
                        <div className="notification-icon">
                            {getNotificationIcon(notification.type, notification.loading)}
                        </div>
                        <div className="notification-message">
                            {notification.message}
                        </div>
                        {!notification.loading && (
                            <button
                                className="notification-close"
                                onClick={() => removeNotification(notification.id)}
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        )}
                    </div>
                    {notification.loading && (
                        <div className="notification-progress">
                            <div className="progress-bar"></div>
                        </div>
                    )}
                </div>
            ))}
        </div>,
        document.body
    );
};

// Helper functions to trigger notifications
export const showNotification = (type, message, options = {}) => {
    const event = new CustomEvent('showNotification', {
        detail: { type, message, ...options }
    });
    window.dispatchEvent(event);
};

export const showLoadingNotification = (message) => {
    const id = Date.now() + Math.random();
    const event = new CustomEvent('showNotification', {
        detail: { 
            type: 'info', 
            message, 
            loading: true,
            id
        }
    });
    window.dispatchEvent(event);
    return id;
};

export const updateLoadingNotification = (id, message, complete = false) => {
    const event = new CustomEvent('updateLoadingNotification', {
        detail: { id, message, complete }
    });
    window.dispatchEvent(event);
};

// Replace alert function
export const modernAlert = (message, type = 'info') => {
    showNotification(type, message);
};

export default NotificationSystem;