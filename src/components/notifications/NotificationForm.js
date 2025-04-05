import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Alert,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Grid
} from '@mui/material';
import { NotificationContext } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';
import axiosInstance from '../../utils/axiosConfig';

const NotificationForm = () => {
  const [formData, setFormData] = useState({
    type: 'email',
    recipients: [],
    subject: '',
    content: '',
    relatedTo: 'other',
    relatedId: ''
  });
  const [users, setUsers] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const { createNotification } = useContext(NotificationContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users for recipients selection
        const usersRes = await axiosInstance.get('/users');
        setUsers(usersRes.data);
        
        // Fetch schedules for related items
        const schedulesRes = await axiosInstance.get('schedules');
        setSchedules(schedulesRes.data);
        
        // Fetch locations for related items
        const locationsRes = await axiosInstance.get('/locations');
        setLocations(locationsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setSubmitError('Failed to load required data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const { type, recipients, subject, content, relatedTo, relatedId } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear field-specific error when user types
    if (formErrors[e.target.name]) {
      setFormErrors({
        ...formErrors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!type) {
      errors.type = 'Notification type is required';
    }
    
    if (!recipients || recipients.length === 0) {
      errors.recipients = 'At least one recipient is required';
    }
    
    if (!subject) {
      errors.subject = 'Subject is required';
    }
    
    if (!content) {
      errors.content = 'Content is required';
    }
    
    if (relatedTo !== 'other' && !relatedId) {
      errors.relatedId = 'Related item is required when relation type is specified';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);
    
    if (validateForm()) {
      setLoading(true);
      try {
        await createNotification(formData);
        setSubmitSuccess(true);
        setTimeout(() => {
          navigate('/notifications');
        }, 2000);
      } catch (err) {
        setSubmitError(err.response?.data.msg || 'Failed to create notification');
      } finally {
        setLoading(false);
      }
    }
  };

  // Get related items based on relatedTo selection
  const getRelatedItems = () => {
    switch (relatedTo) {
      case 'schedule':
        return schedules.map(schedule => ({
          id: schedule._id,
          name: `${schedule.title} (${new Date(schedule.date).toLocaleDateString()})`
        }));
      case 'location':
        return locations.map(location => ({
          id: location._id,
          name: location.name
        }));
      default:
        return [];
    }
  };

  if (loading && users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create Notification
      </Typography>

      <Paper elevation={2} sx={{ p: 3 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Notification created successfully!
          </Alert>
        )}

        <Box component="form" onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.type}>
                <InputLabel id="type-label">Notification Type</InputLabel>
                <Select
                  labelId="type-label"
                  id="type"
                  name="type"
                  value={type}
                  label="Notification Type"
                  onChange={onChange}
                >
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="whatsapp">WhatsApp</MenuItem>
                  <MenuItem value="both">Both Email & WhatsApp</MenuItem>
                </Select>
                {formErrors.type && <FormHelperText>{formErrors.type}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.relatedTo}>
                <InputLabel id="related-to-label">Related To</InputLabel>
                <Select
                  labelId="related-to-label"
                  id="relatedTo"
                  name="relatedTo"
                  value={relatedTo}
                  label="Related To"
                  onChange={onChange}
                >
                  <MenuItem value="schedule">Schedule</MenuItem>
                  <MenuItem value="announcement">Announcement</MenuItem>
                  <MenuItem value="traffic">Traffic</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {relatedTo !== 'other' && (
              <Grid item xs={12}>
                <FormControl fullWidth error={!!formErrors.relatedId}>
                  <InputLabel id="related-id-label">Related Item</InputLabel>
                  <Select
                    labelId="related-id-label"
                    id="relatedId"
                    name="relatedId"
                    value={relatedId}
                    label="Related Item"
                    onChange={onChange}
                  >
                    {getRelatedItems().map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.relatedId && <FormHelperText>{formErrors.relatedId}</FormHelperText>}
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.recipients}>
                <InputLabel id="recipients-label">Recipients</InputLabel>
                <Select
                  labelId="recipients-label"
                  id="recipients"
                  name="recipients"
                  multiple
                  value={recipients}
                  onChange={onChange}
                  input={<OutlinedInput label="Recipients" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const selectedUser = users.find(u => u._id === value);
                        return (
                          <Chip 
                            key={value} 
                            label={selectedUser ? selectedUser.name : value} 
                            size="small" 
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {users.map((user) => (
                    <MenuItem key={user._id} value={user._id}>
                      <Checkbox checked={recipients.indexOf(user._id) > -1} />
                      <ListItemText primary={`${user.name} (${user.email})`} />
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.recipients && <FormHelperText>{formErrors.recipients}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Subject"
                name="subject"
                value={subject}
                onChange={onChange}
                error={!!formErrors.subject}
                helperText={formErrors.subject}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Content"
                name="content"
                value={content}
                onChange={onChange}
                multiline
                rows={6}
                error={!!formErrors.content}
                helperText={formErrors.content}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/notifications')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Send Notification'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotificationForm;