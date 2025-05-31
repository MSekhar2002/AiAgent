// Language settings reducer handles language state changes
const languageReducer = (state, action) => {
  switch (action.type) {
    case 'GET_LANGUAGE_SETTINGS':
      return {
        ...state,
        settings: action.payload,
        loading: false
      };
    case 'UPDATE_LANGUAGE_SETTINGS':
      return {
        ...state,
        settings: action.payload,
        loading: false,
        success: 'Language settings updated successfully'
      };
    case 'LANGUAGE_ERROR':
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

export default languageReducer;