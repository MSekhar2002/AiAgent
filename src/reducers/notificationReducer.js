// Notification reducer handles notification state changes
const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'GET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        loading: false
      };
    case 'GET_NOTIFICATION':
      return {
        ...state,
        notification: action.payload,
        loading: false
      };
    case 'CREATE_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        loading: false
      };
    case 'UPDATE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification._id === action.payload._id ? action.payload : notification
        ),
        loading: false
      };
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification._id !== action.payload
        ),
        loading: false
      };
    case 'SEND_TRAFFIC_ALERTS':
      return {
        ...state,
        loading: false
      };
    case 'NOTIFICATION_ERROR':
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
  }
};

export default notificationReducer;