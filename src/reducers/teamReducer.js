const teamReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
  return {
    ...state,
    loading: action.payload !== undefined ? action.payload : true
  };
    case 'GET_TEAM_SUCCESS':
      return {
        ...state,
        team: action.payload,
        loading: false
      };
    case 'CREATE_TEAM_SUCCESS':
      return {
        ...state,
        team: action.payload,
        loading: false,
        success: 'Team created successfully'
      };
    case 'UPDATE_TEAM_SUCCESS':
      return {
        ...state,
        team: action.payload,
        loading: false,
        success: 'Team updated successfully'
      };
    case 'JOIN_TEAM_SUCCESS':
      return {
        ...state,
        team: action.payload,
        loading: false,
        success: 'Joined team successfully'
      };
    case 'GET_MEMBERS_SUCCESS':
      return {
        ...state,
        members: action.payload,
        loading: false
      };
    case 'REMOVE_MEMBER_SUCCESS':
      return {
        ...state,
        members: state.members.filter(member => member._id !== action.payload),
        loading: false,
        success: 'Member removed successfully'
      };
    case 'DELETE_TEAM_SUCCESS':
      return {
        ...state,
        team: null,
        members: [],
        loading: false,
        success: 'Team deleted successfully'
      };
    case 'TEAM_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
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
  }
};

export default teamReducer;