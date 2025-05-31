import React, { useState, useContext, useEffect } from 'react';
import { AbsenceContext } from '../../context/AbsenceContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  CircularProgress,
  Alert,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axiosInstance from '../../utils/axiosConfig';

const AbsenceForm = ({ onCancel, onSuccess }) => {
  const { createAbsence, loading: absenceLoading, error: absenceError } = useContext(AbsenceContext);
  
  const [formData, setFormData] = useState({
    scheduleId: '',
    startDate: null,
    endDate: null,
    type: 'sick',
    reason: '',
    replacementNeeded: true,
    notes: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [schedules, setSchedules] = useState([]);
  const [schedulesLoading, setSchedulesLoading] = useState(false);
  const [schedulesError, setSchedulesError] = useState('');

  // Fetch schedules on component mount
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setSchedulesLoading(true);
        setSchedulesError('');
        const res = await axiosInstance.get('/schedules');
        setSchedules(res.data);
        setSchedulesLoading(false);
      } catch (err) {
        setSchedulesError('Failed to load schedules');
        setSchedulesLoading(false);
        console.error('Error fetching schedules:', err);
      }
    };
    fetchSchedules();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'replacementNeeded' ? checked : value
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleDateChange = (name, date) => {
    setFormData({
      ...formData,
      [name]: date
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.scheduleId) {
      errors.scheduleId = 'Schedule selection is required';
    }
    
    if (!formData.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      errors.endDate = 'End date is required';
    } else if (formData.startDate && formData.endDate < formData.startDate) {
      errors.endDate = 'End date must be after start date';
    }
    
    if (!formData.reason.trim()) {
      errors.reason = 'Reason is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const absenceData = {
        scheduleId: formData.scheduleId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        type: formData.type,
        reason: formData.reason,
        replacementNeeded: formData.replacementNeeded,
        notes: formData.notes
      };
      
      await createAbsence(absenceData);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to create absence:', err);
    }
  };

  const formatScheduleDisplay = (schedule) => {
    const date = new Date(schedule.date).toLocaleDateString();
    const location = schedule.location?.name || 'No location';
    return `${schedule.title} - ${date} (${schedule.startTime} - ${schedule.endTime}) - ${location}`;
  };

  return (
    <Paper elevation={0} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Request Absence
      </Typography>
      
      {(absenceError || schedulesError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {absenceError || schedulesError}
        </Alert>
      )}
      
      {schedulesLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ ml: 1 }}>
            Loading schedules...
          </Typography>
        </Box>
      )}
      
      <form onSubmit={handleSubmit}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.scheduleId} disabled={schedulesLoading}>
                <InputLabel id="schedule-select-label">Select Schedule</InputLabel>
                <Select
                  labelId="schedule-select-label"
                  id="scheduleId"
                  name="scheduleId"
                  value={formData.scheduleId}
                  onChange={handleChange}
                  label="Select Schedule"
                  required
                >
                  {schedules.map((schedule) => (
                    <MenuItem key={schedule._id} value={schedule._id}>
                      {formatScheduleDisplay(schedule)}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.scheduleId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                    {formErrors.scheduleId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => handleDateChange('startDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!formErrors.startDate,
                    helperText: formErrors.startDate
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(date) => handleDateChange('endDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!formErrors.endDate,
                    helperText: formErrors.endDate
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="absence-type-label">Type</InputLabel>
                <Select
                  labelId="absence-type-label"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                >
                  <MenuItem value="sick">Sick Leave</MenuItem>
                  <MenuItem value="vacation">Vacation</MenuItem>
                  <MenuItem value="personal">Personal Leave</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.replacementNeeded}
                    onChange={handleChange}
                    name="replacementNeeded"
                    color="primary"
                  />
                }
                label="Replacement Needed"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                id="reason"
                name="reason"
                label="Reason"
                fullWidth
                required
                value={formData.reason}
                onChange={handleChange}
                error={!!formErrors.reason}
                helperText={formErrors.reason}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                id="notes"
                name="notes"
                label="Additional Notes"
                fullWidth
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </LocalizationProvider>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={onCancel}
            sx={{ mr: 1 }}
            disabled={absenceLoading || schedulesLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={absenceLoading || schedulesLoading}
            startIcon={(absenceLoading || schedulesLoading) && <CircularProgress size={20} />}
          >
            Submit Request
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AbsenceForm;