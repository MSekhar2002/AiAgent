import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import { LocationContext } from '../../context/LocationContext';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  TextField,
  Typography,
  Alert
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const { locations, getLocations, loading: locationsLoading } = useContext(LocationContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'employee',
    department: '',
    position: '',
    defaultLocation: '',
    notificationPreferences: {
      email: true,
      whatsapp: false
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    getLocations();
    if (isEditMode) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setFetchLoading(true);
      const res = await axiosInstance.get(`/users/${id}`);
      const userData = res.data;
      
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        password: '',
        confirmPassword: '',
        phone: userData.phone || '',
        role: userData.role || 'employee',
        department: userData.department || '',
        position: userData.position || '',
        defaultLocation: userData.defaultLocation?._id || '',
        notificationPreferences: userData.notificationPreferences || {
          email: true,
          whatsapp: false
        }
      });
      
      setFetchLoading(false);
    } catch (err) {
      setError('Failed to load user data');
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear field-specific error when user makes changes
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: undefined
      });
    }
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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!isEditMode && !formData.password) {
      errors.password = 'Password is required';
    } else if (!isEditMode && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!isEditMode && formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.phone && !/^\+?[0-9\s-()]+$/.test(formData.phone)) {
      errors.phone = 'Phone number is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        department: formData.department,
        position: formData.position,
        defaultLocation: formData.defaultLocation || undefined,
        notificationPreferences: formData.notificationPreferences
      };
      
      // Only include password for new users or if changed for existing users
      if (!isEditMode || formData.password) {
        userData.password = formData.password;
      }
      
      if (isEditMode) {
        await axiosInstance.put(`/users/${id}`, userData);
      } else {
        await axiosInstance.post('/users', userData);
      }
      
      navigate('/users');
    } catch (err) {
      setError(
        err.response?.data?.msg ||
        `Failed to ${isEditMode ? 'update' : 'create'} user. Please try again.`
      );
      setLoading(false);
    }
  };

  if (fetchLoading) {
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            {isEditMode ? 'Edit User' : 'Create User'}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/users')}
          >
            Back to Users
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={Boolean(formErrors.name)}
                helperText={formErrors.name}
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
                error={Boolean(formErrors.email)}
                helperText={formErrors.email}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={isEditMode ? "New Password (leave blank to keep current)" : "Password"}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(formErrors.password)}
                helperText={formErrors.password}
                required={!isEditMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={Boolean(formErrors.confirmPassword)}
                helperText={formErrors.confirmPassword}
                required={!isEditMode || Boolean(formData.password)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={Boolean(formErrors.phone)}
                helperText={formErrors.phone || 'For WhatsApp notifications'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="employee">Employee</MenuItem>
                  <MenuItem value="admin">Administrator</MenuItem>
                </Select>
                <FormHelperText>
                  Administrators have full access to all features
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Position"
                name="position"
                value={formData.position}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="default-location-label">Default Location</InputLabel>
                <Select
                  labelId="default-location-label"
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
                <FormHelperText>
                  User's default location for traffic and commute calculations
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
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
                    disabled={!formData.phone}
                  />
                }
                label="WhatsApp Notifications"
              />
              {!formData.phone && formData.notificationPreferences.whatsapp && (
                <FormHelperText error>
                  Phone number is required for WhatsApp notifications
                </FormHelperText>
              )}
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default UserForm;