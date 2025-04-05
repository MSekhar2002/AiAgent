const locationReducer = (state, action) => {
  switch (action.type) {
    case 'GET_LOCATIONS':
      return {
        ...state,
        locations: action.payload,
        loading: false,
        error: null
      };
    
    case 'GET_LOCATION':
      return {
        ...state,
        location: action.payload,
        loading: false,
        error: null
      };
    
    case 'GET_TRAFFIC_DATA':
      return {
        ...state,
        trafficData: {
          ...state.trafficData,
          [action.payload.locationId]: action.payload.data
        }
      };
    
    case 'CREATE_LOCATION':
      return {
        ...state,
        locations: [action.payload, ...state.locations],
        loading: false,
        error: null
      };
    
    case 'UPDATE_LOCATION':
      return {
        ...state,
        locations: state.locations.map(location =>
          location._id === action.payload._id ? action.payload : location
        ),
        location: action.payload,
        loading: false,
        error: null
      };
    
    case 'CLEAR_LOCATION':
      return {
        ...state,
        location: null
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    
    case 'LOCATION_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export default locationReducer;