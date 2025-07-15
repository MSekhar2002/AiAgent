import React, { useContext, useEffect, useState } from 'react';
import { TeamContext } from '../../context/TeamContext';
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
import TeamDetails from './TeamDetails';
import TeamMembers from './TeamMembers';
import TeamJoin from './TeamJoin';
import TeamCreate from './TeamCreate';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`team-tabpanel-${index}`}
      aria-labelledby={`team-tab-${index}`}
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

const TeamManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user } = useContext(AuthContext);
  const { 
    team, 
    loading, 
    error, 
    success, 
    getTeam, 
    clearErrors, 
    clearSuccess 
  } = useContext(TeamContext);

  useEffect(() => {
    getTeam();
    // eslint-disable-next-line
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    clearErrors();
    clearSuccess();
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Team Management
      </Typography>

      <Snackbar 
        open={!!error || !!success} 
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

      {!team ? (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Create Team" />
              <Tab label="Join Team" />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <TeamCreate />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TeamJoin />
          </TabPanel>
        </Paper>
      ) : (
        <Paper sx={{ p: 3, mt: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Team Details" />
              <Tab label="Team Members" />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <TeamDetails isOwner={team?.owner?._id === user?._id} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <TeamMembers isOwner={team?.owner?._id === user?._id} />
          </TabPanel>
        </Paper>
      )}
    </Container>
  );
};

export default TeamManagement;