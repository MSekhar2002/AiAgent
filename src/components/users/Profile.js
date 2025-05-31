import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { LocationContext } from '../../context/LocationContext';
import axiosInstance from '../../utils/axiosConfig';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const Profile = () => {
  const { user, loadUser } = useContext(AuthContext);
  const { locations, getLocations, loading: locationsLoading } = useContext(LocationContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    defaultLocation: '',
    notificationPreferences: {
      email: true,
      whatsapp: false
    },
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [passwordMode, setPasswordMode] = useState(false);

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        position: user.position || '',
        defaultLocation: user.defaultLocation?._id || '',
        notificationPreferences: user.notificationPreferences || {
          email: true,
          whatsapp: false
        }
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setFormData({
      ...formData,
      notificationPreferences: {
        ...formData.notificationPreferences,
        [e.target.name]: e.target.checked
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let endpoint = '/users/profile';
      let dataToSend = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        notificationPreferences: formData.notificationPreferences
      };

      if (passwordMode) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError('New passwords do not match');
          setLoading(false);
          return;
        }
        endpoint = '/users/password';
        dataToSend = {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        };
      } else if (formData.defaultLocation) {
        // Update default location if it has changed
        await axiosInstance.put('/users/default-location', {
          locationId: formData.defaultLocation
        });
      }

      await axiosInstance.put(endpoint, dataToSend);
      setSuccess(true);
      loadUser(); // Refresh user data
      
      if (passwordMode) {
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setPasswordMode(false);
      }
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        'Failed to update profile. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" onClose={() => setSuccess(false)}>
            Profile updated successfully!
          </Alert>
        </Snackbar>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                  alt={user.name}
                  src="/static/images/avatar/1.jpg"
                >
                  {user.name?.charAt(0)}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {user.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                </Typography>

                <List sx={{ mt: 2 }}>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Email" secondary={user.email} />
                  </ListItem>
                  {user.phone && (
                    <ListItem>
                      <ListItemIcon>
                        <PhoneIcon />
                      </ListItemIcon>
                      <ListItemText primary="Phone" secondary={user.phone} />
                    </ListItem>
                  )}
                  {user.department && (
                    <ListItem>
                      <ListItemIcon>
                        <BusinessIcon />
                      </ListItemIcon>
                      <ListItemText primary="Department" secondary={user.department} />
                    </ListItem>
                  )}
                  {user.position && (
                    <ListItem>
                      <ListItemIcon>
                        <WorkIcon />
                      </ListItemIcon>
                      <ListItemText primary="Position" secondary={user.position} />
                    </ListItem>
                  )}
                  {user.defaultLocation && (
                    <ListItem>
                      <ListItemIcon>
                        <LocationIcon />
                      </ListItemIcon>
                      <ListItemText primary="Default Location" secondary={user.defaultLocation.name} />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant={!passwordMode ? "contained" : "outlined"}
                    onClick={() => setPasswordMode(false)}
                    sx={{ mr: 1 }}
                  >
                    Profile Information
                  </Button>
                  <Button
                    variant={passwordMode ? "contained" : "outlined"}
                    onClick={() => setPasswordMode(true)}
                  >
                    Change Password
                  </Button>
                </Box>

                <form onSubmit={handleSubmit}>
                  {!passwordMode ? (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Position"
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                            <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Default Location
                          </Typography>
                          <FormControl fullWidth margin="normal">
                            <InputLabel id="default-location-label">Default Location</InputLabel>
                            <Select
                              labelId="default-location-label"
                              id="default-location"
                              name="defaultLocation"
                              value={formData.defaultLocation}
                              onChange={handleChange}
                              label="Default Location"
                            >
                              <MenuItem value="">None</MenuItem>
                              {locations.map(location => (
                                <MenuItem key={location._id} value={location._id}>
                                  {location.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                            <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Notification Preferences
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.notificationPreferences.email}
                                onChange={handleNotificationChange}
                                name="email"
                                color="primary"
                              />
                            }
                            label="Email Notifications"
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={formData.notificationPreferences.whatsapp}
                                onChange={handleNotificationChange}
                                name="whatsapp"
                                color="primary"
                              />
                            }
                            label="WhatsApp Notifications"
                          />
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Current Password"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            margin="normal"
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            margin="normal"
                            required
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Confirm New Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            margin="normal"
                            required
                          />
                        </Grid>
                      </Grid>
                    </>
                  )}

                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Box>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;