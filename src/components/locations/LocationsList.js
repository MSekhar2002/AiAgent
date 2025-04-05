import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  LocationOn as LocationIcon,
  Traffic as TrafficIcon
} from '@mui/icons-material';

const LocationsList = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trafficData, setTrafficData] = useState({});

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axiosInstance.get('/locations');
        setLocations(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load locations');
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  // Fetch traffic data for each location
  useEffect(() => {
    const fetchTrafficData = async () => {
      if (locations.length === 0) return;

      const trafficInfo = {};
      
      for (const location of locations) {
        if (location.coordinates && location.coordinates.latitude && location.coordinates.longitude) {
          try {
            const res = await axiosInstance.get(`/locations/${location._id}/traffic`);
            trafficInfo[location._id] = res.data.traffic?.flowSegmentData || {};
          } catch (err) {
            console.error(`Failed to load traffic data for ${location.name}:`, err);
          }
        }
      }
      
      setTrafficData(trafficInfo);
    };

    fetchTrafficData();
  }, [locations]);

  // Get traffic status color
  const getTrafficStatusColor = (locationId) => {
    if (!trafficData[locationId] || !trafficData[locationId].currentSpeed || !trafficData[locationId].freeFlowSpeed) return 'default';
    
    const data = trafficData[locationId];
    const ratio = data.currentSpeed / data.freeFlowSpeed;
    
    if (ratio > 0.8) return 'success';
    if (ratio > 0.5) return 'warning';
    return 'error';
  };

  // Get traffic status text
  const getTrafficStatusText = (locationId) => {
    if (!trafficData[locationId] || !trafficData[locationId].currentSpeed || !trafficData[locationId].freeFlowSpeed) return 'Unknown';
    
    const data = trafficData[locationId];
    const ratio = data.currentSpeed / data.freeFlowSpeed;
    
    if (ratio > 0.8) return 'Clear';
    if (ratio > 0.5) return 'Moderate';
    return 'Heavy';
  };

  // Get current speed text
  const getCurrentSpeedText = (locationId) => {
    if (!trafficData[locationId] || !trafficData[locationId].currentSpeed) return 'Unknown';
    return `${trafficData[locationId].currentSpeed} mph`;
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Locations
        </Typography>
        <Button
          component={Link}
          to="/locations/new"
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Location
        </Button>
      </Box>

      {locations.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            No locations found. Click the button above to add a new location.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Traffic Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <LocationIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1">{location.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{location.address}</TableCell>
                  <TableCell>{location.city}, {location.state}</TableCell>
                  <TableCell>
                    {location.coordinates && location.coordinates.latitude ? (
                      <Tooltip title={`Current speed: ${getCurrentSpeedText(location._id)}`}>
                        <Chip
                          icon={<TrafficIcon />}
                          label={getTrafficStatusText(location._id)}
                          color={getTrafficStatusColor(location._id)}
                          size="small"
                        />
                      </Tooltip>
                    ) : (
                      <Chip label="No coordinates" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Details">
                      <IconButton
                        component={Link}
                        to={`/locations/${location._id}`}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        component={Link}
                        to={`/locations/edit/${location._id}`}
                        color="secondary"
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default LocationsList;