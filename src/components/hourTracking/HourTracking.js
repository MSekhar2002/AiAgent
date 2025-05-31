import React, { useContext, useEffect, useState } from 'react';
import { HourTrackingContext } from '../../context/HourTrackingContext';
import { AuthContext } from '../../context/AuthContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import HourTrackingList from './HourTrackingList';
import HourTrackingClock from './HourTrackingClock';
import HourTrackingReports from './HourTrackingReports';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`hour-tracking-tabpanel-${index}`}
      aria-labelledby={`hour-tracking-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const HourTracking = () => {
  const { user, isAdmin } = useContext(AuthContext);
  const { 
    userRecords, 
    records,
    activeSession,
    loading, 
    error, 
    success,
    getUserRecords,
    getRecords,
    checkActiveSession,
    clearErrors,
    clearSuccess
  } = useContext(HourTrackingContext);

  const [tabValue, setTabValue] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Load hour tracking data on component mount
  useEffect(() => {
    const loadData = async () => {
      await checkActiveSession();
      await getUserRecords();
      if (isAdmin) {
        await getRecords();
      }
    };
    
    loadData();
  }, []);

  // Show snackbar when success or error changes
  useEffect(() => {
    if (success || error) {
      setSnackbarOpen(true);
    }
  }, [success, error]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    if (success) clearSuccess();
    if (error) clearErrors();
  };

  const handleClockSuccess = () => {
    getUserRecords();
    checkActiveSession();
  };

  if (loading && !userRecords) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Typography component="h1" variant="h5" color="primary" gutterBottom>
            Hour Tracking
          </Typography>
          
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="hour tracking tabs"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Clock In/Out" />
            <Tab label="My Records" />
            {isAdmin && <Tab label="All Records" />}
            {isAdmin && <Tab label="Reports" />}
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <HourTrackingClock 
            activeSession={activeSession} 
            onClockSuccess={handleClockSuccess} 
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <HourTrackingList 
            records={userRecords} 
            title="My Hour Tracking Records" 
          />
        </TabPanel>

        {isAdmin && (
          <TabPanel value={tabValue} index={2}>
            <HourTrackingList 
              records={records} 
              title="All Hour Tracking Records" 
              showUser={true}
            />
          </TabPanel>
        )}

        {isAdmin && (
          <TabPanel value={tabValue} index={3}>
            <HourTrackingReports />
          </TabPanel>
        )}
      </Paper>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? 'error' : 'success'} 
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default HourTracking;