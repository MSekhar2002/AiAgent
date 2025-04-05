import React, { useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
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

const NotificationDetail = () => {
  const { id } = useParams();
  const { notification, loading, error, getNotification, deleteNotification } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getNotification(id);
    // eslint-disable-next-line
  }, [id]);

  const handleDelete = () => {
    deleteNotification(id);
    navigate('/notifications');
  };

  // Get notification type icon
  const getNotificationTypeIcon = (type) => {
    switch (type) {
      case 'email':
        return <EmailIcon />;
      case 'whatsapp':
        return <WhatsAppIcon />;
      case 'both':
        return <NotificationsIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  // Get notification related icon
  const getRelatedIcon = (relatedTo) => {
    switch (relatedTo) {
      case 'schedule':
        return <ScheduleIcon />;
      case 'announcement':
        return <AnnouncementIcon />;
      case 'traffic':
        return <TrafficIcon />;
      case 'location':
        return <LocationIcon />;
      default:
        return <InfoIcon />;
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

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!notification) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Notification not found
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/notifications')} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Notification Details</Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={`Type: ${notification.type}`}>
              <Box sx={{ mr: 2 }}>{getNotificationTypeIcon(notification.type)}</Box>
            </Tooltip>
            <Typography variant="h5">{notification.subject}</Typography>
          </Box>
          <Chip 
            label={notification.status} 
            color={getStatusColor(notification.status)}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Sent At</Typography>
            <Typography variant="body1">
              {notification.sentAt ? new Date(notification.sentAt).toLocaleString() : 'Not sent yet'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
            <Typography variant="body1">{new Date(notification.createdAt).toLocaleString()}</Typography>
          </Grid>
          {notification.readAt && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Read At</Typography>
              <Typography variant="body1">{new Date(notification.readAt).toLocaleString()}</Typography>
            </Grid>
          )}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Related To</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ mr: 1 }}>{getRelatedIcon(notification.relatedTo)}</Box>
              <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>{notification.relatedTo}</Typography>
            </Box>
          </Grid>
          {user && user.role === 'admin' && notification.recipient && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Recipient</Typography>
              <Typography variant="body1">{notification.recipient.name} ({notification.recipient.email})</Typography>
            </Grid>
          )}
          {notification.createdBy && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Created By</Typography>
              <Typography variant="body1">{notification.createdBy.name}</Typography>
            </Grid>
          )}
        </Grid>

        <Typography variant="h6" gutterBottom>Content</Typography>
        <Paper variant="outlined" sx={{ p: 2, backgroundColor: '#f5f5f5', whiteSpace: 'pre-wrap' }}>
          <Typography variant="body1">{notification.content}</Typography>
        </Paper>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotificationDetail;