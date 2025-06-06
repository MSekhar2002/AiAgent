import React, { useContext, useEffect, useState } from 'react';
import { AbsenceContext } from '../../context/AbsenceContext';
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
import AbsenceList from './AbsenceList';
import AbsenceForm from './AbsenceForm';
import AbsenceApprovals from './AbsenceApprovals';

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`absence-tabpanel-${index}`}
      aria-labelledby={`absence-tab-${index}`}
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

const AbsenceManagement = () => {
  let { user, isAdmin } = useContext(AuthContext);
  const { 
    userAbsences, 
    pendingApprovals,
    loading, 
    error, 
    success,
    getUserAbsences,
    getPendingAbsences,
    clearErrors,
    clearSuccess
  } = useContext(AbsenceContext);

  const [tabValue, setTabValue] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
 if(!isAdmin){
  isAdmin = user?.role || 'user'
 }
  // Load user absences on component mount
  useEffect(() => {
    getUserAbsences();
    if (isAdmin) {
      getPendingAbsences();
    }
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

  const handleFormSubmitSuccess = () => {
    setShowForm(false);
    getUserAbsences();
  };

  const handleApprovalSuccess = () => {
    getPendingAbsences();
    getUserAbsences();
  };

  if (loading && !userAbsences) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography component="h1" variant="h5" color="primary" gutterBottom>
            Absence Management
          </Typography>
          
          {!showForm && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setShowForm(true)}
              sx={{ mb: 1 }}
            >
              Request Absence
            </Button>
          )}
        </Box>

        {showForm ? (
          <Box sx={{ mt: 3 }}>
            <AbsenceForm 
              onCancel={() => setShowForm(false)} 
              onSuccess={handleFormSubmitSuccess} 
            />
          </Box>
        ) : (
          <>
            <Box sx={{ width: '100%' }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="absence management tabs"
                indicatorColor="primary"
                textColor="primary"
              >
                <Tab label="My Absences" />
                {isAdmin && <Tab label="Pending Approvals" />}
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <AbsenceList absences={userAbsences} />
            </TabPanel>

            {isAdmin && (
              <TabPanel value={tabValue} index={1}>
                <AbsenceApprovals 
                  absences={pendingApprovals} 
                  onApprovalSuccess={handleApprovalSuccess} 
                />
              </TabPanel>
            )}
          </>
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

export default AbsenceManagement;