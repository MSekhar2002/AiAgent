import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  FormGroup,
  FormHelperText,
  Chip,
  OutlinedInput,
  ListItemText,
  Autocomplete
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import {
  Save as SaveIcon,
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

const ScheduleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: null,
    startTime: '',
    endTime: '',
    location: '',
    assignedEmployees: [],
    notificationOptions: {
      email: true,
      whatsapp: true,
      reminderTime: 60 // minutes before schedule
    },
    status: 'scheduled'
  });
  
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Status options
  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
  
  // Reminder time options (in minutes)
  const reminderTimeOptions = [
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
    { value: 360, label: '6 hours' },
    { value: 720, label: '12 hours' },
    { value: 1440, label: '24 hours' }
  ];

  // Fetch data for form
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        
        // Fetch locations
        const locationsRes = await axiosInstance.get('/locations');
        setLocations(locationsRes.data);
        
        // Fetch employees
        const employeesRes = await axiosInstance.get('/users');
        setEmployees(employeesRes.data.filter(user => user.role !== 'admin'));
        
        // If edit mode, fetch schedule data
        if (isEditMode) {
          const scheduleRes = await axiosInstance.get(`/schedules/${id}`);
          const schedule = scheduleRes.data;
          
          setFormData({
            title: schedule.title || '',
            description: schedule.description || '',
            date: schedule.date ? new Date(schedule.date) : null,
            startTime: schedule.startTime || '',
            endTime: schedule.endTime || '',
            location: schedule.location?._id || '',
            assignedEmployees: schedule.assignedEmployees?.map(emp => emp._id) || [],
            notificationOptions: {
              email: schedule.notificationOptions?.email !== undefined ? schedule.notificationOptions.email : true,
              whatsapp: schedule.notificationOptions?.whatsapp !== undefined ? schedule.notificationOptions.whatsapp : true,
              reminderTime: schedule.notificationOptions?.reminderTime || 60
            },
            status: schedule.status || 'scheduled'
          });
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load form data');
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id, isEditMode]);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData(prevState => ({
      ...prevState,
      date
    }));
  };

  // Handle notification options change
  const handleNotificationChange = (e) => {
    const { name, checked, value } = e.target;
    const isCheckbox = e.target.type === 'checkbox';
    
    setFormData(prevState => ({
      ...prevState,
      notificationOptions: {
        ...prevState.notificationOptions,
        [name]: isCheckbox ? checked : value
      }
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const scheduleData = {
        ...formData,
        date: formData.date.toISOString()
      };
      
      let response;
      
      if (isEditMode) {
        // Update existing schedule
        response = await axiosInstance.put(`/schedules/${id}`, scheduleData);
        setSuccess('Schedule updated successfully');
      } else {
        // Create new schedule
        response = await axiosInstance.post('/schedules', scheduleData);
        setSuccess('Schedule created successfully');
      }
      
      // Redirect after short delay
      setTimeout(() => {
        navigate(`/schedules/${response.data._id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save schedule');
      setSubmitting(false);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {isEditMode ? 'Edit Schedule' : 'Create Schedule'}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          component={Link}
          to="/schedules"
        >
          Back to Schedules
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Schedule Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Schedule Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date *"
                  value={formData.date}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="Start Time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g. 09:00 AM"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                required
                fullWidth
                label="End Time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                variant="outlined"
                placeholder="e.g. 05:00 PM"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel id="location-label">Location</InputLabel>
                <Select
                  labelId="location-label"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  label="Location"
                >
                  <MenuItem value="">Select a location</MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location._id} value={location._id}>
                      {location.name} - {location.city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Assigned Employees */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Assigned Employees
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="employees-label">Assigned Employees</InputLabel>
                <Select
                  labelId="employees-label"
                  multiple
                  name="assignedEmployees"
                  value={formData.assignedEmployees}
                  onChange={handleChange}
                  input={<OutlinedInput label="Assigned Employees" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const employee = employees.find(emp => emp._id === value);
                        return (
                          <Chip 
                            key={value} 
                            label={employee ? employee.name : value} 
                            size="small" 
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {employees.map((employee) => (
                    <MenuItem key={employee._id} value={employee._id}>
                      <Checkbox checked={formData.assignedEmployees.indexOf(employee._id) > -1} />
                      <ListItemText 
                        primary={employee.name} 
                        secondary={employee.position || employee.department || 'Employee'} 
                      />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>Select employees to assign to this schedule</FormHelperText>
              </FormControl>
            </Grid>

            {/* Notification Options */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Notification Options
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.notificationOptions.email}
                      onChange={handleNotificationChange}
                      name="email"
                    />
                  }
                  label="Send Email Notifications"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.notificationOptions.whatsapp}
                      onChange={handleNotificationChange}
                      name="whatsapp"
                    />
                  }
                  label="Send WhatsApp Notifications"
                />
              </FormGroup>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="reminder-time-label">Reminder Time</InputLabel>
                <Select
                  labelId="reminder-time-label"
                  name="reminderTime"
                  value={formData.notificationOptions.reminderTime}
                  onChange={handleNotificationChange}
                  label="Reminder Time"
                >
                  {reminderTimeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label} before schedule
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>When to send reminders before the scheduled time</FormHelperText>
              </FormControl>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SaveIcon />}
                  disabled={submitting}
                >
                  {submitting ? 'Saving...' : (isEditMode ? 'Update Schedule' : 'Create Schedule')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default ScheduleForm;