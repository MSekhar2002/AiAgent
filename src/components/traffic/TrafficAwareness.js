import React, { useContext, useEffect, useState } from 'react';
import { TrafficContext } from '../../context/TrafficContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button
} from '@mui/material';
import CommuteIcon from '@mui/icons-material/Commute';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DirectionsIcon from '@mui/icons-material/Directions';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import { format } from 'date-fns';
import TrafficMap from './TrafficMap';

const TrafficAwareness = () => {
  const { commuteInfo, getCommuteInfo, loading, error } = useContext(TrafficContext);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // Load commute info on component mount
  useEffect(() => {
    getCommuteInfo();
  }, []);

  // Set first schedule as selected when data loads
  useEffect(() => {
    if (commuteInfo && commuteInfo.schedules && commuteInfo.schedules.length > 0) {
      setSelectedSchedule(commuteInfo.schedules[0]);
    }
  }, [commuteInfo]);

  const handleRefresh = () => {
    getCommuteInfo();
  };

  const handleSelectSchedule = (schedule) => {
    setSelectedSchedule(schedule);
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

  if (loading && !commuteInfo) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography component="h1" variant="h5" color="primary">
            Traffic Awareness
          </Typography>
          
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {!commuteInfo || !commuteInfo.schedules || commuteInfo.schedules.length === 0 ? (
          <Alert severity="info">
            No schedules found for today. Traffic information is only available for days with scheduled work.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Today's Schedules
                  </Typography>
                  
                  <List>
                    {commuteInfo.schedules.map((schedule) => (
                      <ListItem 
                        key={schedule._id} 
                        button 
                        selected={selectedSchedule && selectedSchedule._id === schedule._id}
                        onClick={() => handleSelectSchedule(schedule)}
                        sx={{ 
                          borderRadius: 1,
                          mb: 1,
                          '&.Mui-selected': {
                            backgroundColor: 'primary.light',
                            color: 'primary.contrastText',
                          }
                        }}
                      >
                        <ListItemIcon>
                          <AccessTimeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={`${format(new Date(schedule.startTime), 'HH:mm')} - ${format(new Date(schedule.endTime), 'HH:mm')}`}
                          secondary={schedule.location ? schedule.location.name : 'No location'}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
              
              {selectedSchedule && commuteInfo.trafficInfo && (
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Commute Details
                    </Typography>
                    
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CommuteIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Travel Time"
                          secondary={commuteInfo.trafficInfo.duration || 'Unknown'}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <DirectionsIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Distance"
                          secondary={commuteInfo.trafficInfo.distance || 'Unknown'}
                        />
                      </ListItem>
                      
                      <ListItem>
                        <ListItemIcon>
                          <WarningIcon color={getTrafficConditionColor(commuteInfo.trafficInfo.trafficCondition)} />
                        </ListItemIcon>
                        <ListItemText 
                          primary="Traffic Conditions"
                          secondary={
                            <Chip 
                              label={commuteInfo.trafficInfo.trafficCondition || 'Unknown'}
                              color={getTrafficConditionColor(commuteInfo.trafficInfo.trafficCondition)}
                              size="small"
                            />
                          }
                        />
                      </ListItem>
                      
                      {commuteInfo.trafficInfo.departureTime && (
                        <ListItem>
                          <ListItemIcon>
                            <AccessTimeIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Suggested Departure"
                            secondary={format(new Date(commuteInfo.trafficInfo.departureTime), 'HH:mm')}
                          />
                        </ListItem>
                      )}
                      
                      {selectedSchedule.location && (
                        <ListItem>
                          <ListItemIcon>
                            <LocationOnIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Destination"
                            secondary={selectedSchedule.location.name}
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              )}
            </Grid>
            
            <Grid item xs={12} md={8}>
              {selectedSchedule && commuteInfo.trafficInfo ? (
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent sx={{ height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      Route Map
                    </Typography>
                    
                    <Box sx={{ height: 'calc(100% - 40px)', minHeight: '400px' }}>
                      <TrafficMap 
                        origin={commuteInfo.defaultLocation}
                        destination={selectedSchedule.location}
                        route={commuteInfo.trafficInfo.route}
                      />
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
                  </CardContent>
                </Card>
              ) : (
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <CardContent>
                    <Alert severity="info" sx={{ width: '100%' }}>
                      Select a schedule to view route information and map.
                    </Alert>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        )}
      </Paper>
    </Container>
  );
};

export default TrafficAwareness;