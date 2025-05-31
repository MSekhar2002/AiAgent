import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  Alert,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Notifications as NotificationsIcon,
  WhatsApp as WhatsAppIcon,
  Traffic as TrafficIcon,
  AccessTime as AccessTimeIcon,
  Speed as SpeedIcon,
  Visibility as VisibilityIcon,
  EventNote as AbsenceIcon,
  Translate as LanguageIcon,
  DirectionsCar as CommuteIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import axiosInstance from '../../utils/axiosConfig';

const DashboardHome = () => {
  const { user } = useContext(AuthContext);
  const { notifications } = useContext(NotificationContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    schedules: 0,
    locations: 0,
    notifications: 0,
    whatsappMessages: 0
  });
  const [trafficData, setTrafficData] = useState([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch statistics
        const statsRes = await axiosInstance.get('/dashboard/stats');
        setStats(statsRes.data);

        // Fetch traffic data for locations
        const locationsRes = await axiosInstance.get('/locations');
        const locations = locationsRes.data;
        
        const trafficInfo = [];
        for (const location of locations.slice(0, 5)) { // Get top 5 locations
          if (location.coordinates && location.coordinates.latitude) {
            try {
              const trafficRes = await axiosInstance.get(`/locations/${location._id}/traffic`);
              trafficInfo.push({
                location: location.name,
                // Extract flow segment data from the nested structure
                currentSpeed: trafficRes.data.traffic?.flowSegmentData?.currentSpeed || 0,
                freeFlowSpeed: trafficRes.data.traffic?.flowSegmentData?.freeFlowSpeed || 0,
                locationId: location._id
              });
            } catch (err) {
              console.error(`Failed to load traffic data for ${location.name}:`, err);
            }
          }
        }
        setTrafficData(trafficInfo);

        // Fetch upcoming schedules
        const schedulesRes = await axiosInstance.get('/schedules/upcoming');
        setUpcomingSchedules(schedulesRes.data);

        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate traffic congestion percentage
  const calculateCongestion = (data) => {
    if (!data || !data.currentSpeed || !data.freeFlowSpeed || data.freeFlowSpeed === 0) return 0;
    const ratio = data.currentSpeed / data.freeFlowSpeed;
    return Math.max(0, Math.min(100, (1 - ratio) * 100));
  };

  // Get traffic status color
  const getTrafficStatusColor = (data) => {
    if (!data || !data.currentSpeed || !data.freeFlowSpeed) return '#9e9e9e';
    const congestion = calculateCongestion(data);
    if (congestion < 20) return '#4caf50'; // Green - Clear
    if (congestion < 50) return '#ff9800'; // Orange - Moderate
    return '#f44336'; // Red - Heavy
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format time
  const formatTime = (timeString) => {
    return timeString || 'N/A';
  };

  // Get current speed text safely
  const getCurrentSpeedText = (data) => {
    if (!data || !data.currentSpeed) return 'Unknown';
    return `${Math.round(data.currentSpeed)} mph`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Welcome back, {user?.name || 'User'}! Here's an overview of your scheduling system.
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <PeopleIcon color="primary" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h5" component="div">
                  {stats.users}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Employees
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <EventIcon color="secondary" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h5" component="div">
                  {stats.schedules}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Schedules
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <LocationIcon color="error" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h5" component="div">
                  {stats.locations}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Locations
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <NotificationsIcon color="warning" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h5" component="div">
                  {stats.notifications}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Notifications
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <WhatsAppIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h5" component="div">
                  {stats.whatsappMessages}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  WhatsApp Messages
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Access Cards */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Quick Access
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Card 
              component={Link} 
              to="/hours" 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                textDecoration: 'none',
                color: 'inherit',
                bgcolor: '#e3f2fd',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <AccessTimeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body1" align="center">
                Hour Tracking
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Card 
              component={Link} 
              to="/absences" 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                textDecoration: 'none',
                color: 'inherit',
                bgcolor: '#e8f5e9',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <AbsenceIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body1" align="center">
                Absence Management
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Card 
              component={Link} 
              to="/language" 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                textDecoration: 'none',
                color: 'inherit',
                bgcolor: '#fff3e0',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <LanguageIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body1" align="center">
                Language Settings
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Card 
              component={Link} 
              to="/traffic" 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                textDecoration: 'none',
                color: 'inherit',
                bgcolor: '#f3e5f5',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <CommuteIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body1" align="center">
                Traffic Awareness
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Card 
              component={Link} 
              to="/schedules" 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                textDecoration: 'none',
                color: 'inherit',
                bgcolor: '#e8eaf6',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <EventIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body1" align="center">
                Schedules
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={3} lg={2}>
            <Card 
              component={Link} 
              to="/notifications" 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                textDecoration: 'none',
                color: 'inherit',
                bgcolor: '#fce4ec',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <NotificationsIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="body1" align="center">
                Notifications
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Upcoming Schedules */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2">
                Upcoming Schedules
              </Typography>
              <Button
                component={Link}
                to="/schedules"
                size="small"
                endIcon={<VisibilityIcon />}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {upcomingSchedules.length === 0 ? (
              <Typography variant="body2" color="textSecondary" align="center">
                No upcoming schedules found.
              </Typography>
            ) : (
              <List>
                {upcomingSchedules.map((schedule) => (
                  <ListItem key={schedule._id} divider>
                    <ListItemIcon>
                      <EventIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={schedule.title}
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="span">
                            {formatDate(schedule.date)} • {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                          </Typography>
                          <br />
                          <Typography variant="body2" component="span" color="textSecondary">
                            Location: {schedule.location?.name || 'Not specified'}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Traffic Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2">
                Traffic Status
              </Typography>
              <Button
                component={Link}
                to="/locations"
                size="small"
                endIcon={<VisibilityIcon />}
              >
                View All Locations
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {trafficData.length === 0 ? (
              <Typography variant="body2" color="textSecondary" align="center">
                No traffic data available.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {trafficData.map((data, index) => (
                  <Box key={index}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body1">
                        {data.location}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <TrafficIcon sx={{ color: getTrafficStatusColor(data), mr: 1 }} />
                        <Typography variant="body2">
                          {getCurrentSpeedText(data)}
                        </Typography>
                      </Box>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={100 - calculateCongestion(data)}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        bgcolor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getTrafficStatusColor(data)
                        }
                      }}
                    />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="caption" color="textSecondary">
                        Heavy Traffic
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Clear
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Recent Notifications */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2">
                Recent Notifications
              </Typography>
              <Button
                component={Link}
                to="/notifications"
                size="small"
                endIcon={<VisibilityIcon />}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            {!notifications || notifications.length === 0 ? (
              <Typography variant="body2" color="textSecondary" align="center">
                No notifications found.
              </Typography>
            ) : (
              <List>
                {notifications.slice(0, 5).map((notification) => (
                  <ListItem 
                    key={notification._id} 
                    divider
                    component={Link}
                    to={`/notifications/${notification._id}`}
                    sx={{ 
                      textDecoration: 'none', 
                      color: 'inherit',
                      backgroundColor: notification.status !== 'read' ? 'rgba(25, 118, 210, 0.08)' : 'inherit',
                    }}
                  >
                    <ListItemIcon>
                      <NotificationsIcon color={notification.status !== 'read' ? 'primary' : 'action'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: notification.status !== 'read' ? 'bold' : 'normal' }}>
                          {notification.subject}
                        </Typography>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography variant="body2" component="span" sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                          }}>
                            {notification.content}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="textSecondary">
                            {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardHome;