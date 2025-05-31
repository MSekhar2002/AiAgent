// Absence reducer handles absence state changes
const absenceReducer = (state, action) => {
  switch (action.type) {
    case 'GET_ABSENCES':
      return {
        ...state,
        absences: action.payload,
        loading: false
      };
    case 'GET_USER_ABSENCES':
      return {
        ...state,
        userAbsences: action.payload,
        loading: false
      };
    case 'GET_PENDING_ABSENCES':
      return {
        ...state,
        pendingAbsences: action.payload,
        loading: false
      };
    case 'GET_ABSENCE':
      return {
        ...state,
        currentAbsence: action.payload,
        loading: false
      };
    case 'CREATE_ABSENCE':
      return {
        ...state,
        userAbsences: [action.payload, ...state.userAbsences],
        loading: false,
        success: 'Absence request submitted successfully'
      };
    case 'UPDATE_ABSENCE':
      return {
        ...state,
        absences: state.absences.map(absence =>
          absence._id === action.payload._id ? action.payload : absence
        ),
        pendingAbsences: state.pendingAbsences.filter(
          absence => absence._id !== action.payload._id
        ),
        userAbsences: state.userAbsences.map(absence =>
          absence._id === action.payload._id ? action.payload : absence
        ),
        loading: false,
        success: 'Absence status updated successfully'
      };
    case 'DELETE_ABSENCE':
      return {
        ...state,
        absences: state.absences.filter(
          absence => absence._id !== action.payload
        ),
        userAbsences: state.userAbsences.filter(
          absence => absence._id !== action.payload
        ),
        loading: false,
        success: 'Absence request deleted successfully'
      };
    case 'ABSENCE_ERROR':
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

export default absenceReducer;