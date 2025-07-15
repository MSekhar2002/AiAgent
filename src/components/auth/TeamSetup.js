import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { TeamContext } from '../../context/TeamContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  CircularProgress
} from '@mui/material';
import TeamCreate from '../teams/TeamCreate';
import TeamJoin from '../teams/TeamJoin';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`team-setup-tabpanel-${index}`}
      aria-labelledby={`team-setup-tab-${index}`}
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

const TeamSetup = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user } = useContext(AuthContext);
  const { team, loading } = useContext(TeamContext);
  const navigate = useNavigate();

  // Redirect to dashboard if user already has a team
  React.useEffect(() => {
    if (team) {
      navigate('/');
    }
  }, [team, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Welcome, {user?.name}!
      </Typography>
      <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
        To continue, please create a new team or join an existing one.
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Create Team" />
            <Tab label="Join Team" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <TeamCreate isSetup={true} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <TeamJoin isSetup={true} />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default TeamSetup;