import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';

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
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  Chip
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Description as DescriptionIcon,
  Notifications as NotificationsIcon,
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';

const ScheduleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch schedule details
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/schedules/${id}`);
        setSchedule(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load schedule details');
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'in-progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
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
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/schedules"
          sx={{ mt: 2 }}
        >
          Back to Schedules
        </Button>
      </Container>
    );
  }

  if (!schedule) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Schedule not found</Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/schedules"
          sx={{ mt: 2 }}
        >
          Back to Schedules
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/schedules"
        >
          Back to Schedules
        </Button>
        {user && user.role === 'admin' && (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<EditIcon />}
            component={Link}
            to={`/schedules/edit/${schedule._id}`}
          >
            Edit Schedule
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            {schedule.title}
          </Typography>
          <Chip 
            label={schedule.status || 'scheduled'} 
            color={getStatusColor(schedule.status || 'scheduled')} 
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Schedule Details
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <AccessTimeIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Date and Time" 
                      secondary={`${formatDate(schedule.date)} • ${schedule.startTime} - ${schedule.endTime}`} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Description" 
                      secondary={schedule.description || 'No description provided'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <NotificationsIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Notifications" 
                      secondary={
                        <Stack direction="row" spacing={1} mt={1}>
                          {schedule.notificationOptions?.email && (
                            <Chip 
                              icon={<EmailIcon />} 
                              label="Email" 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          )}
                          {schedule.notificationOptions?.whatsapp && (
                            <Chip 
                              icon={<WhatsAppIcon />} 
                              label="WhatsApp" 
                              size="small" 
                              color="success" 
                              variant="outlined"
                            />
                          )}
                          {!schedule.notificationOptions?.email && !schedule.notificationOptions?.whatsapp && 'No notifications configured'}
                        </Stack>
                      } 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            {schedule.location && (
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Location
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <LocationIcon />
                      </ListItemIcon>
                      <ListItemText 
                        primary={schedule.location.name} 
                        secondary={
                          <>
                            {schedule.location.address}<br />
                            {schedule.location.city}, {schedule.location.state} {schedule.location.zipCode}
                          </>
                        } 
                      />
                    </ListItem>
                  </List>
                  <Button
                    variant="outlined"
                    startIcon={<LocationIcon />}
                    component={Link}
                    to={`/locations/${schedule.location._id}`}
                    sx={{ mt: 1 }}
                    size="small"
                  >
                    View Location Details
                  </Button>
                </CardContent>
              </Card>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Assigned Employees
                </Typography>
                {schedule.assignedEmployees && schedule.assignedEmployees.length > 0 ? (
                  <List>
                    {schedule.assignedEmployees.map((employee) => (
                      <ListItem key={employee._id}>
                        <ListItemAvatar>
                          <Avatar>{employee.name.charAt(0)}</Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={employee.name} 
                          secondary={employee.position || employee.department || 'Employee'} 
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No employees assigned to this schedule.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ScheduleDetail;