import React, { createContext, useReducer } from 'react';
import axiosInstance from '../utils/axiosConfig';
import locationReducer from '../reducers/locationReducer';

// Create context
export const LocationContext = createContext();

// Initial state
const initialState = {
  locations: [],
  location: null,
  trafficData: {},
  loading: true,
  error: null
};

// Provider component
export const LocationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(locationReducer, initialState);

  // Get all locations
  const getLocations = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axiosInstance.get('/locations');
      
      dispatch({
        type: 'GET_LOCATIONS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'LOCATION_ERROR',
        payload: err.response?.data?.msg || 'Failed to load locations'
      });
    }
  };

  // Get location by ID
  const getLocation = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axiosInstance.get(`/locations/${id}`);
      
      dispatch({
        type: 'GET_LOCATION',
        payload: res.data
      });
      
      // Get traffic data if coordinates exist
      if (res.data.coordinates && res.data.coordinates.latitude) {
        getTrafficData(id);
      }
    } catch (err) {
      dispatch({
        type: 'LOCATION_ERROR',
        payload: err.response?.data?.msg || 'Failed to load location'
      });
    }
  };

  // Get traffic data for a location
  const getTrafficData = async (locationId) => {
    try {
      const res = await axiosInstance.get(`/locations/${locationId}/traffic`);
      
      dispatch({
        type: 'GET_TRAFFIC_DATA',
        payload: {
          locationId,
          data: res.data
        }
      });
    } catch (err) {
      console.error('Failed to load traffic data:', err);
      // Don't set error state for traffic data failures
    }
  };

  // Create location
  const createLocation = async (locationData) => {
    try {
      const res = await axiosInstance.post('/locations', locationData);
      
      dispatch({
        type: 'CREATE_LOCATION',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'LOCATION_ERROR',
        payload: err.response?.data?.msg || 'Failed to create location'
      });
      throw err;
    }
  };

  // Update location
  const updateLocation = async (id, locationData) => {
    try {
      const res = await axiosInstance.put(`/locations/${id}`, locationData);
      
      dispatch({
        type: 'UPDATE_LOCATION',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'LOCATION_ERROR',
        payload: err.response?.data?.msg || 'Failed to update location'
      });
      throw err;
    }
  };

  // Clear current location
  const clearLocation = () => {
    dispatch({ type: 'CLEAR_LOCATION' });
  };

  // Clear errors
  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <LocationContext.Provider
      value={{
        locations: state.locations,
        location: state.location,
        trafficData: state.trafficData,
        loading: state.loading,
        error: state.error,
        getLocations,
        getLocation,
        getTrafficData,
        createLocation,
        updateLocation,
        clearLocation,
        clearErrors
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};