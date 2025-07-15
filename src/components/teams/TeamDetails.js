import React, { useState, useContext, useEffect } from 'react';
import { TeamContext } from '../../context/TeamContext';
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Paper,
  Alert
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon, ContentCopy as CopyIcon } from '@mui/icons-material';

const TeamDetails = ({ isOwner }) => {
  const { team, updateTeam, deleteTeam, addDepartment, removeDepartment } = useContext(TeamContext);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    newDepartment: ''
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (team) {
      setFormData({
        name: team?.name || '',
        description: team?.description || '',
        newDepartment: ''
      });
    }
  }, [team]);

  const { name, description, newDepartment } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddDepartment = async () => {
    if (newDepartment.trim() && !team?.departments.includes(newDepartment.trim())) {
      try {
        await addDepartment(newDepartment.trim());
        setFormData({ ...formData, newDepartment: '' });
      } catch (err) {
        console.error('Error adding department:', err);
      }
    }
  };

  const handleRemoveDepartment = async (dept) => {
    try {
      await removeDepartment(dept);
    } catch (err) {
      console.error('Error removing department:', err);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await updateTeam({
        name,
        description
      });
    } catch (err) {
      console.error('Error updating team:', err);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam();
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Error deleting team:', err);
    }
  };

  const copyJoinCode = () => {
    navigator.clipboard.writeText(team?.joinCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Team Details
      </Typography>

      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: 'background.paper' }}>
        <Typography variant="subtitle1" gutterBottom>
          Join Code
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5" component="div" sx={{ fontFamily: 'monospace', letterSpacing: 1 }}>
            {team?.joinCode}
          </Typography>
          <IconButton color="primary" onClick={copyJoinCode} sx={{ ml: 1 }}>
            <CopyIcon />
          </IconButton>
        </Box>
        {copySuccess && (
          <Alert severity="success" sx={{ mt: 1 }}>
            Join code copied to clipboard!
          </Alert>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Share this code with others to let them join your team?.
        </Typography>
      </Paper>

      {isOwner ? (
        <Box component="form" onSubmit={onSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="Team Name"
            name="name"
            value={name}
            onChange={onChange}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Team Description"
            name="description"
            value={description}
            onChange={onChange}
            multiline
            rows={3}
          />
          
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Departments
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                fullWidth
                id="newDepartment"
                label="Add Department"
                name="newDepartment"
                value={newDepartment}
                onChange={onChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddDepartment();
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddDepartment}
                sx={{ ml: 1 }}
                disabled={!newDepartment.trim()}
              >
                <AddIcon />
              </Button>
            </Box>
            
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {team?.departments.map((dept, index) => (
                <Chip
                  key={index}
                  label={dept}
                  onDelete={() => handleRemoveDepartment(dept)}
                  deleteIcon={<CloseIcon />}
                  sx={{ mb: 1 }}
                />
              ))}
            </Stack>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Update Team
            </Button>
            
            <Button
              variant="outlined"
              color="error"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Team
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Team Name:
          </Typography>
          <Typography variant="body1" paragraph>
            {team?.name}
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>
            Description:
          </Typography>
          <Typography variant="body1" paragraph>
            {team?.description || 'No description provided'}
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>
            Departments:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {team?.departments?.length > 0 ? (
              team?.departments?.map((dept, index) => (
                <Chip key={index} label={dept} sx={{ mb: 1 }} />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No departments defined
              </Typography>
            )}
          </Stack>
          
          <Typography variant="subtitle1" sx={{ mt: 2 }} gutterBottom>
            Team Owner:
          </Typography>
          <Typography variant="body1">
            {team?.owner?.name} ({team?.owner?.email})
          </Typography>
        </Box>
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Team?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your team? This action cannot be undone and will remove all team members from the team
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTeam} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamDetails;