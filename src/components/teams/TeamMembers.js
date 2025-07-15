import React, { useContext, useEffect, useState } from 'react';
import { TeamContext } from '../../context/TeamContext';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Chip
} from '@mui/material';
import { Delete as DeleteIcon, Person as PersonIcon, AdminPanelSettings as AdminIcon } from '@mui/icons-material';

const TeamMembers = ({ isOwner }) => {
  const { members, getTeamMembers, removeMember, team } = useContext(TeamContext);
  const [selectedMember, setSelectedMember] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  useEffect(() => {
    getTeamMembers();
    // eslint-disable-next-line
  }, []);

  const handleRemoveMember = (member) => {
    setSelectedMember(member);
    setConfirmDialogOpen(true);
  };

  const confirmRemoveMember = async () => {
    try {
      await removeMember(selectedMember._id);
      setConfirmDialogOpen(false);
    } catch (err) {
      console.error('Error removing member:', err);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Team Members ({members.length})
      </Typography>

      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {members.map((member) => (
          <React.Fragment key={member._id}>
            <ListItem
              secondaryAction={
                isOwner && team.owner._id !== member._id ? (
                  <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveMember(member)}>
                    <DeleteIcon />
                  </IconButton>
                ) : null
              }
            >
              <ListItemAvatar>
                <Avatar>
                  {team.owner._id === member._id ? <AdminIcon /> : <PersonIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {member.name}
                    {team.owner._id === member._id && (
                      <Chip 
                        label="Owner" 
                        size="small" 
                        color="primary" 
                        sx={{ ml: 1 }}
                      />
                    )}
                    {member.role === 'admin' && (
                      <Chip 
                        label="Admin" 
                        size="small" 
                        color="secondary" 
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <>
                    <Typography
                      sx={{ display: 'block' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {member.email}
                    </Typography>
                    {member.department && `Department: ${member.department}`}
                    {member.position && ` • Position: ${member.position}`}
                  </>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Remove Team Member?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove {selectedMember?.name} from the team? They will no longer have access to team resources.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmRemoveMember} color="error" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeamMembers;