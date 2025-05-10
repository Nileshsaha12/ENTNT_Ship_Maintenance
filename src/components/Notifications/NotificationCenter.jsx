import { useState } from 'react';
import { 
  Drawer, 
  Box, 
  Typography, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Button,
  Chip
} from '@mui/material';
import {
  Close as CloseIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNotifications } from '../../contexts/NotificationsContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = ({ open, onClose }) => {
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  
  // Get icon based on notification type
  const getIcon = (type) => {
    switch(type) {
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'success':
        return <SuccessIcon color="success" />;
      case 'info':
      default:
        return <InfoIcon color="info" />;
    }
  };
  
  // Format timestamp
  const formatTime = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };
  
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100%', sm: 400 } } }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Notifications</Typography>
        <Box>
          <Button 
            size="small" 
            onClick={markAllAsRead}
            sx={{ mr: 1 }}
          >
            Mark all as read
          </Button>
          <IconButton onClick={onClose} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Divider />
      
      <List sx={{ overflow: 'auto', flexGrow: 1 }}>
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              No notifications
            </Typography>
          </Box>
        ) : (
          notifications.map((notification) => (
            <ListItem
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              secondaryAction={
                <IconButton 
                  edge="end" 
                  aria-label="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              }
              sx={{
                bgcolor: notification.read ? 'transparent' : 'action.hover',
                '&:hover': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <Box sx={{ mr: 2 }}>
                {getIcon(notification.type)}
              </Box>
              <ListItemText
                primary={notification.message}
                secondary={formatTime(notification.timestamp)}
                primaryTypographyProps={{
                  variant: 'body1',
                  fontWeight: notification.read ? 'normal' : 'bold',
                }}
              />
            </ListItem>
          ))
        )}
      </List>
    </Drawer>
  );
};

export default NotificationCenter;
