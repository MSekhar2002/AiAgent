import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../../context/LanguageContext';
import {
  Container,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import LanguageIcon from '@mui/icons-material/Language';

const LanguageSettings = () => {
  const { 
    settings, 
    availableLanguages,
    loading, 
    error, 
    success,
    getLanguageSettings,
    updateLanguageSettings,
    getLanguageName,
    clearErrors,
    clearSuccess
  } = useContext(LanguageContext);

  const [formData, setFormData] = useState({
    preferredLanguage: 'en-US',
    interfaceLanguage: 'en-US',
    voiceRecognitionLanguage: 'en-US',
    autoTranslateEnabled: false
  });
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Load language settings on component mount
  useEffect(() => {
    getLanguageSettings();
  }, []);

  // Update form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData({
        preferredLanguage: settings.preferredLanguage,
        interfaceLanguage: settings.interfaceLanguage,
        voiceRecognitionLanguage: settings.voiceRecognitionLanguage,
        autoTranslateEnabled: settings.autoTranslateEnabled
      });
    }
  }, [settings]);

  // Show snackbar when success or error changes
  useEffect(() => {
    if (success || error) {
      setSnackbarOpen(true);
    }
  }, [success, error]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'autoTranslateEnabled' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateLanguageSettings(formData);
    } catch (err) {
      console.error('Failed to update language settings:', err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    if (success) clearSuccess();
    if (error) clearErrors();
  };

  if (loading && !settings) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography component="h1" variant="h5" color="primary" gutterBottom>
          Language Settings
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TranslateIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Content Languages
                    </Typography>
                  </Box>
                  
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="preferred-language-label">Preferred Language</InputLabel>
                    <Select
                      labelId="preferred-language-label"
                      id="preferredLanguage"
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleChange}
                      label="Preferred Language"
                    >
                      {availableLanguages.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      This language will be used for WhatsApp messages and notifications.
                    </Typography>
                  </FormControl>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.autoTranslateEnabled}
                        onChange={handleChange}
                        name="autoTranslateEnabled"
                        color="primary"
                      />
                    }
                    label="Auto-translate content"
                  />
                  <Typography variant="caption" color="text.secondary" display="block">
                    When enabled, content will be automatically translated to your preferred language.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LanguageIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6">
                      Interface & Voice
                    </Typography>
                  </Box>
                  
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="interface-language-label">Interface Language</InputLabel>
                    <Select
                      labelId="interface-language-label"
                      id="interfaceLanguage"
                      name="interfaceLanguage"
                      value={formData.interfaceLanguage}
                      onChange={handleChange}
                      label="Interface Language"
                    >
                      {availableLanguages.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      This language will be used for the web interface.
                    </Typography>
                  </FormControl>
                  
                  <FormControl fullWidth>
                    <InputLabel id="voice-recognition-language-label">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SettingsVoiceIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Voice Recognition Language
                      </Box>
                    </InputLabel>
                    <Select
                      labelId="voice-recognition-language-label"
                      id="voiceRecognitionLanguage"
                      name="voiceRecognitionLanguage"
                      value={formData.voiceRecognitionLanguage}
                      onChange={handleChange}
                      label="Voice Recognition Language"
                    >
                      {availableLanguages.map((lang) => (
                        <MenuItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      This language will be used for voice message recognition.
                    </Typography>
                  </FormControl>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              Save Settings
            </Button>
          </Box>
        </form>
      </Paper>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? 'error' : 'success'} 
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LanguageSettings;