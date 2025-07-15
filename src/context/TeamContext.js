import React, { createContext, useReducer, useEffect, useContext } from 'react';
import axiosInstance from '../utils/axiosConfig';
import teamReducer from '../reducers/teamReducer';
import { AuthContext } from './AuthContext';

// Create context
export const TeamContext = createContext();

// Initial state
const initialState = {
  team: null,
  members: [],
  loading: true,
  error: null,
  success: null
};

// Provider component
export const TeamProvider = ({ children }) => {
  const { loadUser } = useContext(AuthContext);
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);

  const initialState = {
    team: null,
    members: [],
    loading: true,
    error: null,
    success: null
  };

  const [state, dispatch] = useReducer(teamReducer, initialState);

  // Get user's team
  const getTeam = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: false });

      const res = await axiosInstance.get('/teams/my-team');
      dispatch({
        type: 'GET_TEAM_SUCCESS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'TEAM_ERROR',
        payload: err.response?.data?.msg || 'Error fetching team'
      });
    }
  };

  // Load team data when component mounts
  useEffect(() => {
    // Only load team when user is authenticated and not loading
    if (isAuthenticated && !authLoading && user) {
      getTeam();
    } else if (!authLoading && !isAuthenticated) {
      // If not authenticated, set loading to false
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [isAuthenticated, authLoading, user]);
  
  // Create a team
  const createTeam = async (teamData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axiosInstance.post('/teams', teamData);
      dispatch({
        type: 'CREATE_TEAM_SUCCESS',
        payload: res.data
      });
      
      // Reload user data to get updated isTeamAdmin status
      if (loadUser) loadUser();
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'TEAM_ERROR',
        payload: err.response?.data?.msg || 'Error creating team'
      });
      throw err;
    }
  };

  // Update team
  const updateTeam = async (teamData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axiosInstance.put('/teams', teamData);
      dispatch({
        type: 'UPDATE_TEAM_SUCCESS',
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'TEAM_ERROR',
        payload: err.response?.data?.msg || 'Error updating team'
      });
      throw err;
    }
  };

  // Join team
  const joinTeam = async (joinCode) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axiosInstance.post('/teams/join', { joinCode });
      dispatch({
        type: 'JOIN_TEAM_SUCCESS',
        payload: res.data.team
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'TEAM_ERROR',
        payload: err.response?.data?.msg || 'Error joining team'
      });
      throw err;
    }
  };

  // Get team members
  const getTeamMembers = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axiosInstance.get('/teams/members');
      dispatch({
        type: 'GET_MEMBERS_SUCCESS',
        payload: res.data
      });
    } catch (err) {
      dispatch({
        type: 'TEAM_ERROR',
        payload: err.response?.data?.msg || 'Error fetching team members'
      });
    }
  };

  // Remove member from team
  const removeMember = async (memberId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await axiosInstance.delete(`/teams/members/${memberId}`);
      dispatch({
        type: 'REMOVE_MEMBER_SUCCESS',
        payload: memberId
      });
    } catch (err) {
      dispatch({
        type: 'TEAM_ERROR',
        payload: err.response?.data?.msg || 'Error removing team member'
      });
      throw err;
    }
  };

  // Add department
  const addDepartment = async (department) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axiosInstance.post('/teams/departments', { department });
      dispatch({
        type: 'UPDATE_TEAM_SUCCESS',
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'TEAM_ERROR',
        payload: err.response?.data?.msg || 'Error adding department'
      });
      throw err;
    }
  };

  // Remove department
  const removeDepartment = async (department) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axiosInstance.delete(`/teams/departments/${department}`);
      dispatch({
        type: 'UPDATE_TEAM_SUCCESS',
        payload: res.data
      });
      return res.data;
    } catch (err) {
      dispatch({
        type: 'TEAM_ERROR',
        payload: err.response?.data?.msg || 'Error removing department'
      });
      throw err;
    }
  };

  // Delete team
  const deleteTeam = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await axiosInstance.delete('/teams');
      dispatch({ type: 'DELETE_TEAM_SUCCESS' });
    } catch (err) {
      dispatch({
        type: 'TEAM_ERROR',
        payload: err.response?.data?.msg || 'Error deleting team'
      });
      throw err;
    }
  };

  // Clear errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  // Clear success message
  const clearSuccess = () => dispatch({ type: 'CLEAR_SUCCESS' });

  // Promote user to admin
  const promoteToAdmin = async (userId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axiosInstance.put(`/teams/admins/${userId}`);
      
      dispatch({
        type: 'PROMOTE_ADMIN_SUCCESS',
        payload: res.data
      });
      
      // Refresh member list
      getTeamMembers();
    } catch (err) {
      dispatch({
        type: 'TEAM_ERROR',
        payload: err.response?.data?.msg || 'Error promoting admin'
      });
    }
  };

  // Demote admin to regular member
  const demoteAdmin = async (userId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      
      const res = await axiosInstance.delete(`/teams/admins/${userId}`);
      
      dispatch({
        type: 'DEMOTE_ADMIN_SUCCESS',
        payload: res.data
      });
      
      // Refresh member list
      getTeamMembers();
    } catch (err) {
      dispatch({
        type: 'TEAM_ERROR',
        payload: err.response?.data?.msg || 'Error demoting admin'
      });
    }
  };

  return (
    <TeamContext.Provider
      value={{
        team: state.team,
        members: state.members,
        loading: state.loading,
        error: state.error,
        success: state.success,
        getTeam,
        createTeam,
        updateTeam,
        deleteTeam,
        joinTeam,
        getTeamMembers,
        removeMember,
        addDepartment,
        removeDepartment,
        promoteToAdmin,
        demoteAdmin,
        clearErrors,
        clearSuccess
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};