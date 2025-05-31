// Hour tracking reducer handles hour tracking state changes
const hourTrackingReducer = (state, action) => {
  switch (action.type) {
    case 'GET_RECORDS':
      return {
        ...state,
        records: action.payload,
        loading: false
      };
    case 'GET_USER_RECORDS':
      return {
        ...state,
        userRecords: action.payload,
        loading: false
      };
    case 'GET_RECORD':
      return {
        ...state,
        currentRecord: action.payload,
        loading: false
      };
    case 'GET_ACTIVE_SESSION':
      return {
        ...state,
        activeSession: action.payload,
        loading: false
      };
    case 'CLOCK_IN':
      return {
        ...state,
        activeSession: action.payload,
        userRecords: [action.payload, ...state.userRecords],
        loading: false,
        success: 'Clocked in successfully'
      };
    case 'CLOCK_OUT':
      return {
        ...state,
        activeSession: null,
        userRecords: state.userRecords.map(record =>
          record._id === action.payload._id ? action.payload : record
        ),
        loading: false,
        success: 'Clocked out successfully'
      };
    case 'GET_REPORTS':
      return {
        ...state,
        reports: action.payload,
        loading: false
      };
    case 'HOUR_TRACKING_ERROR':
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
    case 'CLEAR_SUCCESS':
      return {
        ...state,
        success: null
      };
    default:
      return state;
  };
};

export default hourTrackingReducer;