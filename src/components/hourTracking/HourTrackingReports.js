import React, { useState, useContext, useEffect } from 'react';
import { HourTrackingContext } from '../../context/HourTrackingContext';
import { AuthContext } from '../../context/AuthContext';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

const HourTrackingReports = () => {
  const { getReports, reports, loading } = useContext(HourTrackingContext);
  const { users, getUsers } = useContext(AuthContext);
  
  const [startDate, setStartDate] = useState(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState(endOfMonth(new Date()));
  const [selectedUserId, setSelectedUserId] = useState('');
  const [reportType, setReportType] = useState('month');
  
  // Load users on component mount
  useEffect(() => {
    if (getUsers) {
      getUsers();
    }
  }, []);
  
  // Update date range when report type changes
  useEffect(() => {
    const today = new Date();
    
    switch (reportType) {
      case 'week':
        setStartDate(startOfWeek(today));
        setEndDate(endOfWeek(today));
        break;
      case 'month':
        setStartDate(startOfMonth(today));
        setEndDate(endOfMonth(today));
        break;
      case 'custom':
        // Keep current selection for custom
        break;
      default:
        setStartDate(startOfMonth(today));
        setEndDate(endOfMonth(today));
    }
  }, [reportType]);
  
  const handleGenerateReport = async () => {
    try {
      await getReports(
        startDate.toISOString(),
        endDate.toISOString(),
        selectedUserId || null
      );
    } catch (err) {
      console.error('Failed to generate report:', err);
    }
  };
  
  // Format total hours
  const formatTotalHours = (hours) => {
    if (!hours && hours !== 0) return 'N/A';
    
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    return `${wholeHours}h ${minutes}m`;
  };
  
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Hour Tracking Reports
      </Typography>
      
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Generate Report
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="report-type-label">Report Type</InputLabel>
                <Select
                  labelId="report-type-label"
                  value={reportType}
                  label="Report Type"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="week">Current Week</MenuItem>
                  <MenuItem value="month">Current Month</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                  disabled={reportType !== 'custom'}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(date) => setEndDate(date)}
                  disabled={reportType !== 'custom'}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
            </LocalizationProvider>
            
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel id="user-select-label">Employee</InputLabel>
                <Select
                  labelId="user-select-label"
                  value={selectedUserId}
                  label="Employee"
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <MenuItem value="">All Employees</MenuItem>
                  {users && users.map(user => (
                    <MenuItem key={user._id} value={user._id}>
                      {user.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateReport}
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                Generate Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      
      {loading && !reports && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {reports && (
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Report Results
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Period: {format(new Date(startDate), 'MMM dd, yyyy')} - {format(new Date(endDate), 'MMM dd, yyyy')}
              </Typography>
              {selectedUserId && users && (
                <Typography variant="subtitle2" color="text.secondary">
                  Employee: {users.find(u => u._id === selectedUserId)?.name || 'Unknown'}
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Summary
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {formatTotalHours(reports.summary.totalHours)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Hours
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {reports.summary.totalSessions}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sessions
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {formatTotalHours(reports.summary.averageHoursPerDay)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Hours/Day
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
            
            {reports.userBreakdown && reports.userBreakdown.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Employee Breakdown
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell align="right">Total Hours</TableCell>
                        <TableCell align="right">Sessions</TableCell>
                        <TableCell align="right">Avg Hours/Session</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reports.userBreakdown.map((user) => (
                        <TableRow key={user.userId}>
                          <TableCell>{user.userName}</TableCell>
                          <TableCell align="right">{formatTotalHours(user.totalHours)}</TableCell>
                          <TableCell align="right">{user.sessions}</TableCell>
                          <TableCell align="right">{formatTotalHours(user.averageHoursPerSession)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            
            {reports.dailyBreakdown && reports.dailyBreakdown.length > 0 && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Daily Breakdown
                </Typography>
                
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Total Hours</TableCell>
                        <TableCell align="right">Sessions</TableCell>
                        <TableCell align="right">Employees Present</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reports.dailyBreakdown.map((day) => (
                        <TableRow key={day.date}>
                          <TableCell>{format(new Date(day.date), 'MMM dd, yyyy')}</TableCell>
                          <TableCell align="right">{formatTotalHours(day.totalHours)}</TableCell>
                          <TableCell align="right">{day.sessions}</TableCell>
                          <TableCell align="right">{day.uniqueUsers}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default HourTrackingReports;