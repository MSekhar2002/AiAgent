import React, { createContext, useReducer, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import languageReducer from '../reducers/languageReducer';

// Create context
export const LanguageContext = createContext();

// Available languages
export const availableLanguages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Spanish (Spain)' },
  { code: 'fr-FR', name: 'French (France)' },
  { code: 'de-DE', name: 'German (Germany)' },
  { code: 'it-IT', name: 'Italian (Italy)' },
  { code: 'pt-BR', name: 'Portuguese (Brazil)' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'ja-JP', name: 'Japanese (Japan)' },
  { code: 'ko-KR', name: 'Korean (Korea)' },
  { code: 'ar-SA', name: 'Arabic (Saudi Arabia)' },
  { code: 'hi-IN', name: 'Hindi (India)' }
];

// Initial state
const initialState = {
  settings: null,
  loading: true,
  error: null,
  success: null
};

// Provider component
export const LanguageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(languageReducer, initialState);

  // Get user's language settings
  const getLanguageSettings = async () => {
    try {
      setLoading();
      const res = await axiosInstance.get('/language-settings');

      dispatch({
        type: 'GET_LANGUAGE_SETTINGS',
        payload: res.data
      });
      
      return res.data;
    } catch (err) {
      dispatch({
        type: 'LANGUAGE_ERROR',
        payload: err.response?.data?.msg || 'Failed to fetch language settings'
      });
      return null;
    }
  };

  // Update language settings
  const updateLanguageSettings = async (settings) => {
    try {
      setLoading();
      const res = await axiosInstance.put('/language-settings', settings);

      dispatch({
        type: 'UPDATE_LANGUAGE_SETTINGS',
        payload: res.data
      });

      return res.data;
    } catch (err) {
      dispatch({
        type: 'LANGUAGE_ERROR',
        payload: err.response?.data?.msg || 'Failed to update language settings'
      });
      throw err;
    }
  };

  // Get language name from code
  const getLanguageName = (code) => {
    const language = availableLanguages.find(lang => lang.code === code);
    return language ? language.name : code;
  };

  // Set loading
  const setLoading = () => dispatch({ type: 'SET_LOADING' });

  // Clear errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  // Clear success message
  const clearSuccess = () => dispatch({ type: 'CLEAR_SUCCESS' });

  // Load language settings on initial render
  useEffect(() => {
    getLanguageSettings();
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        settings: state.settings,
        loading: state.loading,
        error: state.error,
        success: state.success,
        availableLanguages,
        getLanguageSettings,
        updateLanguageSettings,
        getLanguageName,
        clearErrors,
        clearSuccess
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};