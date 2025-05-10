import { createContext, useContext, useState, useEffect } from 'react';
import { getData, saveData, generateId } from '../utils/localStorageUtils';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const storedNotifications = getData('notifications');
    setNotifications(storedNotifications);
    setUnreadCount(storedNotifications.filter(n => !n.read).length);
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      id: notification.id || generateId('n'),
      type: notification.type || 'info',
      message: notification.message,
      timestamp: notification.timestamp || new Date().toISOString(),
      read: notification.read || false
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    saveData('notifications', updatedNotifications);
    setUnreadCount(prev => prev + 1);
    
    return newNotification;
  };

  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification => {
      if (notification.id === id && !notification.read) {
        setUnreadCount(prev => prev - 1);
        return { ...notification, read: true };
      }
      return notification;
    });
    
    setNotifications(updatedNotifications);
    saveData('notifications', updatedNotifications);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({ 
      ...notification, 
      read: true 
    }));
    
    setNotifications(updatedNotifications);
    saveData('notifications', updatedNotifications);
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    const notificationToDelete = notifications.find(n => n.id === id);
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    
    if (notificationToDelete && !notificationToDelete.read) {
      setUnreadCount(prev => prev - 1);
    }
    
    setNotifications(updatedNotifications);
    saveData('notifications', updatedNotifications);
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
