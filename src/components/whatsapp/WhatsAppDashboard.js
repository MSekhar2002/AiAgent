import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
  Alert,
  Stack,
  Tabs,
  Tab,
  TextField,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';

const WhatsAppDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeTemplateTab, setActiveTemplateTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [settings, setSettings] = useState({
    enabled: true,
    autoReplyEnabled: true,
    welcomeMessage: 'Welcome to the Employee Scheduling System. How can I help you today?',
    aiProcessingEnabled: true,
    templates: {
      scheduleReminder: {
        name: 'schedule_reminder',
        language: 'en',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: '{{1}}' }, // name
              { type: 'text', text: '{{2}}' }, // date
              { type: 'text', text: '{{3}}' }, // time
              { type: 'text', text: '{{4}}' }  // location
            ]
          }
        ]
      },
      scheduleChange: {
        name: 'schedule_change',
        language: 'en',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: '{{1}}' }, // name
              { type: 'text', text: '{{2}}' }, // date
              { type: 'text', text: '{{3}}' }, // time
              { type: 'text', text: '{{4}}' }  // location
            ]
          }
        ]
      },
      generalAnnouncement: {
        name: 'general_announcement',
        language: 'en',
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: '{{1}}' }, // name
              { type: 'text', text: '{{2}}' }  // message
            ]
          }
        ]
      }
    },
    // Legacy template format for backward compatibility
    notificationTemplates: {
      scheduleReminder: 'Hello {{name}}, this is a reminder about your upcoming shift on {{date}} at {{time}} at {{location}}.',
      scheduleChange: 'Hello {{name}}, your schedule has been updated. Your new shift is on {{date}} at {{time}} at {{location}}.',
      generalAnnouncement: 'Hello {{name}}, important announcement: {{message}}'
    }
  });
  
  // Fetch conversations and settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch conversations
        const conversationsRes = await axiosInstance.get('/whatsapp/conversations');
        setConversations(conversationsRes.data);
        
        // Fetch settings
        const settingsRes = await axiosInstance.get('/whatsapp/settings');
        if (settingsRes.data) {
          setSettings(settingsRes.data);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load WhatsApp data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle settings change
  const handleSettingsChange = (e) => {
    const { name, value, checked } = e.target;
    const isSwitch = e.target.type === 'checkbox';
    
    if (name.includes('.')) {
      // Handle nested properties (for notification templates)
      const [parent, child] = name.split('.');
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent],
          [child]: isSwitch ? checked : value
        }
      });
    } else {
      setSettings({
        ...settings,
        [name]: isSwitch ? checked : value
      });
    }
  };

  // Save settings
  const handleSaveSettings = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      await axiosInstance.put('/whatsapp/settings', settings);
      setSuccess('WhatsApp settings saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError('Failed to save WhatsApp settings');
    }
  };

  // Refresh conversations
  const handleRefreshConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axiosInstance.get('/whatsapp/conversations');
      setConversations(res.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to refresh conversations');
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <WhatsAppIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
        <Typography variant="h4" component="h1">
          WhatsApp Integration
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<HistoryIcon />} label="Conversations" />
          <Tab icon={<SettingsIcon />} label="Settings" />
          <Tab icon={<PsychologyIcon />} label="AI Configuration" />
        </Tabs>
      </Paper>

      {/* Conversations Tab */}
      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" component="h2">
              Recent Conversations
            </Typography>
            <Button
              startIcon={<RefreshIcon />}
              onClick={handleRefreshConversations}
              variant="outlined"
            >
              Refresh
            </Button>
          </Box>

          {conversations.length === 0 ? (
            <Alert severity="info">No WhatsApp conversations found.</Alert>
          ) : (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {conversations.map((conversation) => (
                <React.Fragment key={conversation._id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" component="span">
                            {conversation.user.name} ({conversation.user.phone})
                          </Typography>
                          <Chip 
                            size="small" 
                            label={conversation.platform === 'voice' ? 'Voice' : 'Text'} 
                            color={conversation.platform === 'voice' ? 'secondary' : 'primary'} 
                          />
                        </Box>
                      }
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            Last message: {conversation.messages[conversation.messages.length - 1]?.content.substring(0, 50)}...
                          </Typography>
                          <Typography variant="caption" display="block">
                            {conversation.messages.length} messages - Last activity: {formatDate(conversation.lastActivity)}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Paper>
      )}

      {/* Settings Tab */}
      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" mb={3}>
            WhatsApp Configuration
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    General Settings
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enabled}
                        onChange={handleSettingsChange}
                        name="enabled"
                        color="primary"
                      />
                    }
                    label="Enable WhatsApp Integration"
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoReplyEnabled}
                        onChange={handleSettingsChange}
                        name="autoReplyEnabled"
                        color="primary"
                      />
                    }
                    label="Enable Auto-Reply"
                  />
                  
                  <TextField
                    fullWidth
                    label="Welcome Message"
                    name="welcomeMessage"
                    value={settings.welcomeMessage}
                    onChange={handleSettingsChange}
                    margin="normal"
                    multiline
                    rows={2}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Configuration
                  </Typography>
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.aiProcessingEnabled}
                        onChange={handleSettingsChange}
                        name="aiProcessingEnabled"
                        color="primary"
                      />
                    }
                    label="Enable AI Processing"
                  />
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Meta WhatsApp Templates
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    These templates must be approved in your Meta WhatsApp Business dashboard before use.
                  </Typography>
                  
                  <Tabs
                    value={activeTemplateTab}
                    onChange={(e, newValue) => setActiveTemplateTab(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ mb: 2 }}
                  >
                    <Tab label="Schedule Reminder" />
                    <Tab label="Schedule Change" />
                    <Tab label="Announcement" />
                  </Tabs>
                  
                  {/* Schedule Reminder Template */}
                  {activeTemplateTab === 0 && (
                    <Box>
                      <TextField
                        fullWidth
                        label="Template Name"
                        name="templates.scheduleReminder.name"
                        value={settings.templates?.scheduleReminder?.name || 'schedule_reminder'}
                        onChange={handleSettingsChange}
                        margin="normal"
                        helperText="Must match the template name in Meta WhatsApp dashboard"
                      />
                      <TextField
                        fullWidth
                        label="Language Code"
                        name="templates.scheduleReminder.language"
                        value={settings.templates?.scheduleReminder?.language || 'en'}
                        onChange={handleSettingsChange}
                        margin="normal"
                        helperText="e.g., en, es_ES"
                      />
                      <Typography variant="subtitle2" mt={2}>
                        Parameters:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        1. {'{{'}}1{'}}'}  - Employee Name<br />
                        2. {'{{'}}2{'}}'}  - Date<br />
                        3. {'{{'}}3{'}}'}  - Time<br />
                        4. {'{{'}}4{'}}'}  - Location
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Schedule Change Template */}
                  {activeTemplateTab === 1 && (
                    <Box>
                      <TextField
                        fullWidth
                        label="Template Name"
                        name="templates.scheduleChange.name"
                        value={settings.templates?.scheduleChange?.name || 'schedule_change'}
                        onChange={handleSettingsChange}
                        margin="normal"
                        helperText="Must match the template name in Meta WhatsApp dashboard"
                      />
                      <TextField
                        fullWidth
                        label="Language Code"
                        name="templates.scheduleChange.language"
                        value={settings.templates?.scheduleChange?.language || 'en'}
                        onChange={handleSettingsChange}
                        margin="normal"
                        helperText="e.g., en, es_ES"
                      />
                      <Typography variant="subtitle2" mt={2}>
                        Parameters:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        1. {'{{'}}1{'}}'}  - Employee Name<br />
                        2. {'{{'}}2{'}}'}  - Date<br />
                        3. {'{{'}}3{'}}'}  - Time<br />
                        4. {'{{'}}4{'}}'}  - Location
                      </Typography>
                    </Box>
                  )}
                  
                  {/* Announcement Template */}
                  {activeTemplateTab === 2 && (
                    <Box>
                      <TextField
                        fullWidth
                        label="Template Name"
                        name="templates.generalAnnouncement.name"
                        value={settings.templates?.generalAnnouncement?.name || 'general_announcement'}
                        onChange={handleSettingsChange}
                        margin="normal"
                        helperText="Must match the template name in Meta WhatsApp dashboard"
                      />
                      <TextField
                        fullWidth
                        label="Language Code"
                        name="templates.generalAnnouncement.language"
                        value={settings.templates?.generalAnnouncement?.language || 'en'}
                        onChange={handleSettingsChange}
                        margin="normal"
                        helperText="e.g., en, es_ES"
                      />
                      <Typography variant="subtitle2" mt={2}>
                        Parameters:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        1. {'{{'}}1{'}}'}  - Employee Name<br />
                        2. {'{{'}}2{'}}'}  - Message
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<SaveIcon />}
              onClick={handleSaveSettings}
            >
              Save Settings
            </Button>
          </Box>
        </Paper>
      )}

      {/* AI Configuration Tab */}
      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            AI Processing Configuration
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Settings
                  </Typography>
                  
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.aiProcessingEnabled}
                          onChange={handleSettingsChange}
                          name="aiProcessingEnabled"
                          color="primary"
                        />
                      }
                      label="Enable AI Processing for WhatsApp Messages"
                    />
                    
                    <Alert severity="info">
                      When enabled, incoming WhatsApp messages will be processed using Azure OpenAI to provide intelligent responses.
                      Voice messages will be converted to text using Azure Speech Services before processing.
                    </Alert>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    AI Response Configuration
                  </Typography>
                  
                  <Stack spacing={2}>
                    <TextField
                      label="Maximum Response Length"
                      name="maxResponseLength"
                      value={settings.maxResponseLength || 300}
                      onChange={handleSettingsChange}
                      type="number"
                      fullWidth
                      helperText="Maximum number of characters in AI-generated responses"
                    />
                    
                    <TextField
                      label="AI System Instructions"
                      name="aiSystemInstructions"
                      value={settings.aiSystemInstructions || 'You are a helpful assistant for an employee scheduling system. Provide concise and accurate information about schedules, locations, and company policies. If you don\'t know the answer, say so politely.'}
                      onChange={handleSettingsChange}
                      fullWidth
                      multiline
                      rows={4}
                      helperText="Instructions that guide how the AI responds to messages"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSettings}
                >
                  Save AI Configuration
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default WhatsAppDashboard;