// Traffic reducer handles traffic awareness state changes
const trafficReducer = (state, action) => {
  switch (action.type) {
    case 'GET_COMMUTE_INFO':
      return {
        ...state,
        commuteInfo: action.payload,
        loading: false
      };
    case 'GET_ROUTE_DETAILS':
      return {
        ...state,
        routeDetails: action.payload,
        loading: false
      };
    case 'TRAFFIC_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  };
};

export default trafficReducer;