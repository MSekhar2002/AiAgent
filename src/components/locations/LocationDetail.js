import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  Chip,
  Alert,
  Stack,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  Traffic as TrafficIcon,
  DirectionsCar as DirectionsCarIcon,
  Speed as SpeedIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axiosInstance from '../../utils/axiosConfig';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const LocationDetail = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch location details
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationRes = await axiosInstance.get(`/locations/${id}`);
        setLocation(locationRes.data);
        
        // Fetch traffic data if coordinates exist
        if (locationRes.data.coordinates && 
            locationRes.data.coordinates.latitude && 
            locationRes.data.coordinates.longitude) {
          const trafficRes = await axiosInstance.get(`/locations/${id}/traffic`);
          setTrafficData(trafficRes.data);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load location details');
        setLoading(false);
      }
    };

    fetchLocationData();
  }, [id]);

  // Calculate traffic congestion percentage
  const calculateCongestion = () => {
    if (!trafficData) return 0;
    
    const ratio = trafficData.currentSpeed / trafficData.freeFlowSpeed;
    return Math.max(0, Math.min(100, (1 - ratio) * 100));
  };

  // Get traffic status color
  const getTrafficStatusColor = () => {
    if (!trafficData) return '#9e9e9e';
    
    const congestion = calculateCongestion();
    
    if (congestion < 20) return '#4caf50'; // Green - Clear
    if (congestion < 50) return '#ff9800'; // Orange - Moderate
    return '#f44336'; // Red - Heavy
  };

  // Get traffic status text
  const getTrafficStatusText = () => {
    if (!trafficData) return 'Unknown';
    
    const congestion = calculateCongestion();
    
    if (congestion < 20) return 'Clear';
    if (congestion < 50) return 'Moderate';
    return 'Heavy';
  };

  // Get estimated travel time text
  const getEstimatedTravelTime = () => {
    if (!trafficData || !trafficData.travelTimeMinutes) return 'Unknown';
    
    const minutes = trafficData.travelTimeMinutes;
    if (minutes < 60) {
      return `${Math.round(minutes)} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} minutes` : ''}`;
    }
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

  if (!location) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Location not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          component={Link}
          to="/locations"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Locations
        </Button>
        <Button
          component={Link}
          to={`/locations/edit/${id}`}
          variant="contained"
          color="secondary"
          startIcon={<EditIcon />}
        >
          Edit Location
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Location Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <LocationIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h4" component="h1">
                {location.name}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body1" gutterBottom>
              <strong>Address:</strong> {location.address}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>City:</strong> {location.city}, {location.state} {location.zipCode}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Country:</strong> {location.country}
            </Typography>
            
            {location.description && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" gutterBottom>
                  <strong>Description:</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {location.description}
                </Typography>
              </>
            )}
          </Paper>
        </Grid>

        {/* Traffic Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <TrafficIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h4" component="h2">
                Traffic Information
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {location.coordinates && location.coordinates.latitude ? (
              <Stack spacing={3}>
                <Box>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Typography variant="body1">
                      <strong>Traffic Status:</strong>
                    </Typography>
                    <Chip 
                      icon={<TrafficIcon />} 
                      label={getTrafficStatusText()} 
                      sx={{ bgcolor: getTrafficStatusColor(), color: 'white' }} 
                    />
                  </Box>
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Congestion Level:
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateCongestion()} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      bgcolor: 'rgba(0,0,0,0.1)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getTrafficStatusColor()
                      }
                    }} 
                  />
                </Box>
                
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <SpeedIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      <strong>Current Speed:</strong> {trafficData ? `${Math.round(trafficData.currentSpeed)} mph` : 'Unknown'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <SpeedIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      <strong>Normal Speed:</strong> {trafficData ? `${Math.round(trafficData.freeFlowSpeed)} mph` : 'Unknown'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <DirectionsCarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      <strong>Traffic Confidence:</strong> {trafficData ? `${trafficData.confidence}%` : 'Unknown'}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <AccessTimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      <strong>Estimated Travel Time:</strong> {getEstimatedTravelTime()}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="caption" color="textSecondary">
                  Last updated: {trafficData ? new Date(trafficData.timestamp).toLocaleString() : 'Unknown'}
                </Typography>
              </Stack>
            ) : (
              <Alert severity="info" sx={{ mt: 2 }}>
                No coordinates available for this location. Traffic information cannot be displayed.
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* Map */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Location Map
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            {location.coordinates && location.coordinates.latitude ? (
              <Box sx={{ height: 400, width: '100%' }}>
                <MapContainer 
                  center={[location.coordinates.latitude, location.coordinates.longitude]} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[location.coordinates.latitude, location.coordinates.longitude]}>
                    <Popup>
                      <strong>{location.name}</strong><br />
                      {location.address}, {location.city}<br />
                      {location.state}, {location.zipCode}
                    </Popup>
                  </Marker>
                  
                  {/* Traffic congestion visualization */}
                  {trafficData && (
                    <Circle 
                      center={[location.coordinates.latitude, location.coordinates.longitude]}
                      radius={500}
                      pathOptions={{
                        fillColor: getTrafficStatusColor(),
                        fillOpacity: 0.3,
                        color: getTrafficStatusColor(),
                        weight: 2
                      }}
                    />
                  )}
                </MapContainer>
              </Box>
            ) : (
              <Alert severity="info">
                No coordinates available for this location. Map cannot be displayed.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LocationDetail;