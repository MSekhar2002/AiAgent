import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationIcon,
  Announcement as AnnouncementIcon,
  Traffic as TrafficIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';

const NotificationsList = () => {
  const { notifications, loading, error, getNotifications, getAdminNotifications, markAsRead, deleteNotification } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const [tabValue, setTabValue] = useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role === 'admin' && tabValue === 1) {
      getAdminNotifications();
    } else {
      getNotifications();
    }
    // eslint-disable-next-line
  }, [tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    navigate(`/notifications/${notification._id}`);
  };

  const handleMenuOpen = (event, notification) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = (event) => {
    event.stopPropagation();
    if (selectedNotification) {
      markAsRead(selectedNotification._id);
    }
    handleMenuClose();
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    if (selectedNotification) {
      deleteNotification(selectedNotification._id);
    }
    handleMenuClose();
  };

  // Get notification type icon
  const getNotificationTypeIcon = (type) => {
    switch (type) {
      case 'email':
        return <EmailIcon fontSize="small" />;
      case 'whatsapp':
        return <WhatsAppIcon fontSize="small" />;
      case 'both':
        return <NotificationsIcon fontSize="small" />;
      default:
        return <NotificationsIcon fontSize="small" />;
    }
  };

  // Get notification related icon
  const getRelatedIcon = (relatedTo) => {
    switch (relatedTo) {
      case 'schedule':
        return <ScheduleIcon fontSize="small" />;
      case 'announcement':
        return <AnnouncementIcon fontSize="small" />;
      case 'traffic':
        return <TrafficIcon fontSize="small" />;
      case 'location':
        return <LocationIcon fontSize="small" />;
      default:
        return <InfoIcon fontSize="small" />;
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'sent':
        return 'info';
      case 'delivered':
        return 'success';
      case 'read':
        return 'default';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {user && user.role === 'admin' && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="My Notifications" />
            <Tab label="All Notifications (Admin)" />
          </Tabs>
        </Box>
      )}

      {user && user.role === 'admin' && tabValue === 0 && (
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/notifications/new')}
          >
            Create Notification
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={() => navigate('/notifications/traffic-alerts')}
            sx={{ ml: 2 }}
          >
            Send Traffic Alerts
          </Button>
        </Box>
      )}

      <Paper elevation={2}>
        {notifications.length > 0 ? (
          <List>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification._id}>
                <ListItem 
                  alignItems="flex-start" 
                  sx={{
                    cursor: 'pointer',
                    backgroundColor: notification.status !== 'read' ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                  }}
                  onClick={() => handleNotificationClick(notification)}
                  secondaryAction={
                    <Box>
                      <Tooltip title="Options">
                        <IconButton edge="end" onClick={(e) => handleMenuOpen(e, notification)}>
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <Box sx={{ display: 'flex', width: '100%' }}>
                    <Box sx={{ mr: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Tooltip title={`Type: ${notification.type}`}>
                        <Box>{getNotificationTypeIcon(notification.type)}</Box>
                      </Tooltip>
                      <Box sx={{ mt: 1 }}>
                        <Tooltip title={`Related to: ${notification.relatedTo}`}>
                          <Box>{getRelatedIcon(notification.relatedTo)}</Box>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: notification.status !== 'read' ? 'bold' : 'normal' }}>
                          {notification.subject}
                        </Typography>
                        <Chip 
                          label={notification.status} 
                          size="small" 
                          color={getStatusColor(notification.status)}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {notification.content}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                        {tabValue === 1 && notification.recipient && (
                          <Typography variant="caption" color="text.secondary">
                            To: {notification.recipient.name}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No notifications found
            </Typography>
          </Box>
        )}
      </Paper>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {selectedNotification && selectedNotification.status !== 'read' && (
          <MenuItem onClick={handleMarkAsRead}>Mark as read</MenuItem>
        )}
        <MenuItem onClick={handleDelete}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default NotificationsList;