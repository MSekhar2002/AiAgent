import React, { useState, useEffect, useContext } from 'react';
import { HourTrackingContext } from '../../context/HourTrackingContext';
import { AuthContext } from '../../context/AuthContext';
import { TrafficContext } from '../../context/TrafficContext';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimerIcon from '@mui/icons-material/Timer';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CommuteIcon from '@mui/icons-material/Commute';
import { format } from 'date-fns';

const HourTrackingClock = ({ activeSession, onClockSuccess }) => {
  const { user } = useContext(AuthContext);
  const { clockIn, clockOut, loading } = useContext(HourTrackingContext);
  const { commuteInfo, getCommuteInfo } = useContext(TrafficContext);
  
  const [notes, setNotes] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [scheduleId, setScheduleId] = useState('');
  
  // Load commute info on component mount
  useEffect(() => {
    getCommuteInfo();
  }, []);
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Calculate elapsed time if active session exists
  useEffect(() => {
    if (activeSession) {
      const clockInTime = new Date(activeSession.clockInTime);
      
      const timer = setInterval(() => {
        const now = new Date();
        const diffMs = now - clockInTime;
        const diffHours = diffMs / (1000 * 60 * 60);
        setElapsedTime(diffHours);
      }, 60000); // Update every minute
      
      // Initial calculation
      const now = new Date();
      const diffMs = now - clockInTime;
      const diffHours = diffMs / (1000 * 60 * 60);
      setElapsedTime(diffHours);
      
      return () => clearInterval(timer);
    }
  }, [activeSession]);
  
  // Format elapsed time
  const formatElapsedTime = () => {
    const hours = Math.floor(elapsedTime);
    const minutes = Math.floor((elapsedTime - hours) * 60);
    return `${hours}h ${minutes}m`;
  };
  
  // Handle clock in
  const handleClockIn = async () => {
    if (!scheduleId) return;
    
    try {
      await clockIn(scheduleId, notes);
      setNotes('');
      if (onClockSuccess) onClockSuccess();
    } catch (err) {
      console.error('Failed to clock in:', err);
    }
  };
  
  // Handle clock out
  const handleClockOut = async () => {
    if (!activeSession) return;
    
    try {
      await clockOut(activeSession._id, notes);
      setNotes('');
      if (onClockSuccess) onClockSuccess();
    } catch (err) {
      console.error('Failed to clock out:', err);
    }
  };
  
  // Find today's schedule
  const findTodaySchedule = () => {
    if (!commuteInfo || !commuteInfo.schedules || commuteInfo.schedules.length === 0) {
      return null;
    }
    
    // Return the first schedule for simplicity
    // In a real app, you might want to show a selection if multiple schedules exist
    return commuteInfo.schedules[0];
  };
  
  const todaySchedule = findTodaySchedule();
  
  // Set schedule ID when today's schedule is found
  useEffect(() => {
    if (todaySchedule && !activeSession) {
      setScheduleId(todaySchedule._id);
    }
  }, [todaySchedule, activeSession]);
  
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Current Time: {format(currentTime, 'HH:mm')}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {activeSession ? (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Active Session
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TimerIcon color="warning" sx={{ mr: 1 }} />
                    <Typography>
                      Clock In: {format(new Date(activeSession.clockInTime), 'HH:mm')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TimerOffIcon color="error" sx={{ mr: 1 }} />
                    <Typography>
                      Elapsed: {formatElapsedTime()}
                    </Typography>
                  </Box>
                  
                  {activeSession.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOnIcon color="info" sx={{ mr: 1 }} />
                      <Typography>
                        Location: {activeSession.location.name}
                      </Typography>
                    </Box>
                  )}
                  
                  <TextField
                    label="Notes for Clock Out"
                    fullWidth
                    multiline
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    margin="normal"
                  />
                  
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={handleClockOut}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <TimerOffIcon />}
                    sx={{ mt: 2 }}
                  >
                    Clock Out
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    No Active Session
                  </Typography>
                  
                  {todaySchedule ? (
                    <>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body1" gutterBottom>
                          Today's Schedule:
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
                          <Typography>
                            Time: {format(new Date(todaySchedule.startTime), 'HH:mm')} - {format(new Date(todaySchedule.endTime), 'HH:mm')}
                          </Typography>
                        </Box>
                        
                        {todaySchedule.location && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon color="info" sx={{ mr: 1 }} />
                            <Typography>
                              Location: {todaySchedule.location.name}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      
                      <TextField
                        label="Notes for Clock In"
                        fullWidth
                        multiline
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        margin="normal"
                      />
                      
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleClockIn}
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <TimerIcon />}
                        sx={{ mt: 2 }}
                      >
                        Clock In
                      </Button>
                    </>
                  ) : (
                    <Alert severity="info">
                      No schedule found for today. You cannot clock in without an assigned schedule.
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CommuteIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">
                  Traffic Information
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {commuteInfo && commuteInfo.trafficInfo ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Commute Details:
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip 
                        label={`${commuteInfo.trafficInfo.duration} (${commuteInfo.trafficInfo.distance})`}
                        color="primary"
                        variant="outlined"
                        icon={<CommuteIcon />}
                      />
                    </Box>
                    
                    <Typography variant="body2" gutterBottom>
                      Traffic Conditions: 
                      <Chip 
                        label={commuteInfo.trafficInfo.trafficCondition || 'Unknown'}
                        color={getTrafficConditionColor(commuteInfo.trafficInfo.trafficCondition)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    
                    {commuteInfo.trafficInfo.departureTime && (
                      <Typography variant="body2">
                        Suggested Departure: {format(new Date(commuteInfo.trafficInfo.departureTime), 'HH:mm')}
                      </Typography>
                    )}
                  </Box>
                  
                  {commuteInfo.trafficInfo.route && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Route Information:
                      </Typography>
                      <Typography variant="body2">
                        {commuteInfo.trafficInfo.route}
                      </Typography>
                    </Box>
                  )}
                </>
              ) : (
                <Alert severity="info">
                  No traffic information available for your commute.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper function to determine traffic condition color
const getTrafficConditionColor = (condition) => {
  if (!condition) return 'default';
  
  switch (condition.toLowerCase()) {
    case 'heavy':
      return 'error';
    case 'moderate':
      return 'warning';
    case 'light':
      return 'success';
    default:
      return 'default';
  }
};

export default HourTrackingClock;