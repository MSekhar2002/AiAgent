import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
  Alert,
  Stack,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Map click handler component
const LocationMarker = ({ position, setPosition }) => {
  const map = useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const LocationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    description: '',
    coordinates: {
      latitude: '',
      longitude: ''
    }
  });
  
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([37.7749, -122.4194]); // Default to San Francisco

  // Fetch location data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchLocation = async () => {
        try {
          const res = await axiosInstance.get(`/locations/${id}`);
          const locationData = res.data;
          
          setFormData({
            name: locationData.name || '',
            address: locationData.address || '',
            city: locationData.city || '',
            state: locationData.state || '',
            zipCode: locationData.zipCode || '',
            country: locationData.country || '',
            description: locationData.description || '',
            coordinates: {
              latitude: locationData.coordinates?.latitude || '',
              longitude: locationData.coordinates?.longitude || ''
            }
          });
          
          // Set map marker if coordinates exist
          if (locationData.coordinates?.latitude && locationData.coordinates?.longitude) {
            const position = [locationData.coordinates.latitude, locationData.coordinates.longitude];
            setMarkerPosition(position);
            setMapCenter(position);
          }
          
          setLoading(false);
        } catch (err) {
          setError('Failed to load location data');
          setLoading(false);
        }
      };

      fetchLocation();
    }
  }, [id, isEditMode]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'latitude' || name === 'longitude') {
      setFormData({
        ...formData,
        coordinates: {
          ...formData.coordinates,
          [name]: value
        }
      });
      
      // Update marker position if both coordinates are valid
      if (name === 'latitude' && value && formData.coordinates.longitude) {
        const newPosition = [parseFloat(value), parseFloat(formData.coordinates.longitude)];
        setMarkerPosition(newPosition);
        setMapCenter(newPosition);
      } else if (name === 'longitude' && value && formData.coordinates.latitude) {
        const newPosition = [parseFloat(formData.coordinates.latitude), parseFloat(value)];
        setMarkerPosition(newPosition);
        setMapCenter(newPosition);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle map marker position change
  const handleMarkerPositionChange = (position) => {
    setMarkerPosition(position);
    setFormData({
      ...formData,
      coordinates: {
        latitude: position[0],
        longitude: position[1]
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (isEditMode) {
        await axiosInstance.put(`/locations/${id}`, formData);
        setSuccess('Location updated successfully');
      } else {
        await axiosInstance.post('/locations', formData);
        setSuccess('Location created successfully');
      }
      
      // Navigate back to locations list after a short delay
      setTimeout(() => {
        navigate('/locations');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to save location');
      setSaving(false);
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          component={Link}
          to="/locations"
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Back to Locations
        </Button>
        <Typography variant="h4" component="h1">
          {isEditMode ? 'Edit Location' : 'Add New Location'}
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Location Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Location Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <TextField
                  label="Location Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  required
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Zip Code"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      fullWidth
                      required
                    />
                  </Grid>
                </Grid>
                
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                />
              </Stack>
            </Grid>
            
            {/* Coordinates and Map */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Location Coordinates
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Stack spacing={2}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  You can set coordinates by clicking on the map or entering them manually.
                </Alert>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Latitude"
                      name="latitude"
                      value={formData.coordinates.latitude}
                      onChange={handleChange}
                      fullWidth
                      type="number"
                      inputProps={{ step: 'any' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Longitude"
                      name="longitude"
                      value={formData.coordinates.longitude}
                      onChange={handleChange}
                      fullWidth
                      type="number"
                      inputProps={{ step: 'any' }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ height: 300, width: '100%', mt: 2 }}>
                  <MapContainer 
                    center={mapCenter} 
                    zoom={13} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker 
                      position={markerPosition} 
                      setPosition={handleMarkerPositionChange} 
                    />
                  </MapContainer>
                </Box>
              </Stack>
            </Grid>
            
            {/* Submit Button */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="flex-end">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SaveIcon />}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : isEditMode ? 'Update Location' : 'Create Location'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default LocationForm;