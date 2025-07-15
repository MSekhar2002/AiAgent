import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { TeamContext } from '../../context/TeamContext';
import axiosInstance from '../../utils/axiosConfig';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Divider,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Person as PersonIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Search as SearchIcon,
  AddIcCallOutlined
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`user-management-tabpanel-${index}`}
      aria-labelledby={`user-management-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const UserManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const { user } = useContext(AuthContext);
  const {
    team,
    members,
    loading,
    error,
    success,
    getTeam,
    getTeamMembers,
    removeMember,
    updateTeam,
    addDepartment,
    removeDepartment,
    deleteTeam,
    promoteToAdmin,
    demoteAdmin,
    clearErrors,
    clearSuccess
  } = useContext(TeamContext);

  // State for team editing
  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
    newDepartment: ''
  });
  
  // Dialog states
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // User administration states
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteUserDialogOpen, setDeleteUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Check if user is team owner
  const isOwner = team?.owner?._id === user?._id;
  
  // Check if user is admin
  const isAdmin = user?.isTeamAdmin || isOwner;

  useEffect(() => {
    getTeam();
    getTeamMembers();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (team) {
      setTeamData({
        name: team.name || '',
        description: team.description || '',
        newDepartment: ''
      });
    }
  }, [team]);

  // Fetch users for admin tab
  useEffect(() => {
    if (isAdmin && tabValue === (isOwner ? 2 : 1)) {
      fetchUsers();
    }
  }, [isAdmin, tabValue, isOwner]);

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const res = await axiosInstance.get('/users');
      setUsers(res.data);
      setUsersLoading(false);
    } catch (err) {
      setUsersError('Failed to load users');
      setUsersLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    clearErrors();
    clearSuccess();
  };

  const { name, description, newDepartment } = teamData;

  const onChange = e => {
    setTeamData({ ...teamData, [e.target.name]: e.target.value });
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      addDepartment(newDepartment.trim());
      setTeamData({ ...teamData, newDepartment: '' });
    }
  };

  const handleRemoveDepartment = (department) => {
    removeDepartment(department);
  };

  const onSubmit = e => {
    e.preventDefault();
    updateTeam({
      name,
      description
    });
  };

  const handleDeleteTeam = () => {
    deleteTeam();
    setDeleteDialogOpen(false);
  };

  const copyJoinCode = () => {
    navigator.clipboard.writeText(team?.joinCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleRemoveMember = (member) => {
    setSelectedMember(member);
    setRemoveDialogOpen(true);
  };

  const confirmRemoveMember = async () => {
    try {
      await removeMember(selectedMember._id);
      setRemoveDialogOpen(false);
    } catch (err) {
      console.error('Error removing member:', err);
    }
  };

  const handlePromoteToAdmin = (member) => {
    promoteToAdmin(member._id);
  };

  const handleDemoteAdmin = (member) => {
    demoteAdmin(member._id);
  };

  // User administration functions
  const handleDeleteUserClick = (user) => {
    setUserToDelete(user);
    setDeleteUserDialogOpen(true);
  };

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;

    try {
      await axiosInstance.delete(`/users/${userToDelete._id}`);
      setUsers(users.filter(user => user._id !== userToDelete._id));
      setDeleteUserDialogOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setUsersError('Failed to delete user');
      setDeleteUserDialogOpen(false);
    }
  };

  const handleDeleteUserCancel = () => {
    setDeleteUserDialogOpen(false);
    setUserToDelete(null);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTermLower) ||
      user.email.toLowerCase().includes(searchTermLower) ||
      (user.department && user.department.toLowerCase().includes(searchTermLower)) ||
      (user.position && user.position.toLowerCase().includes(searchTermLower))
    );
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Team & User Management
      </Typography>

      <Snackbar 
        open={!!error || !!success} 
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

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Team Members" />
            {isOwner && <Tab label="Team Settings" />}
            {isAdmin && <Tab label="User Administration" />}
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Team Members ({members.length})
            </Typography>
            <Box>
              <Button 
                variant="outlined" 
                startIcon={<PersonAddIcon />}
                onClick={() => {/* Open invite dialog */}}
                sx={{ mr: 1 }}
              >
                Invite User
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<CopyIcon />}
                onClick={copyJoinCode}
              >
                Copy Join Code
              </Button>
            </Box>
          </Box>
          
          {copySuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Join code copied to clipboard!
            </Alert>
          )}

          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {members.map((member) => (
              <React.Fragment key={member._id}>
                <ListItem
                  secondaryAction={
                    isAdmin && team.owner._id !== member._id ? (
                      <Box>
                        {isOwner && (
                          member.isTeamAdmin ? (
                            <Button 
                              size="small" 
                              onClick={() => handleDemoteAdmin(member)}
                              sx={{ mr: 1 }}
                            >
                              Remove Admin
                            </Button>
                          ) : (
                            <Button 
                              size="small" 
                              onClick={() => handlePromoteToAdmin(member)}
                              sx={{ mr: 1 }}
                            >
                              Make Admin
                            </Button>
                          )
                        )}
                        <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveMember(member)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
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
                        {member.isTeamAdmin && team.owner._id !== member._id && (
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
        </TabPanel>

        {isOwner && (
          <TabPanel value={tabValue} index={1}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Team Information
              </Typography>
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
                Share this code with others to let them join your team.
              </Typography>
            </Paper>

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
                    Add
                  </Button>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {team?.departments.map((dept, index) => (
                    <Chip
                      key={index}
                      label={dept}
                      onDelete={() => handleRemoveDepartment(dept)}
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
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
          </TabPanel>
        )}

        {isAdmin && (
          <TabPanel value={tabValue} index={isOwner ? 2 : 1}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" component="h2">
                User Administration
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcCallOutlined />}
                component={Link}
                to="/users/new"
              >
                Add User
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {usersError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {usersError}
              </Alert>
            )}

            <Box mb={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search users by name, email, department, or position"
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {usersLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell>Position</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user._id}>
                          <TableCell>{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.role}
                              color={user.role === 'admin' ? 'secondary' : 'primary'}
                              size="small"
                              icon={<PersonIcon />}
                            />
                          </TableCell>
                          <TableCell>{user.department || '-'}</TableCell>
                          <TableCell>{user.position || '-'}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              component={Link}
                              to={`/users/${user._id}`}
                              color="primary"
                              size="small"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteUserClick(user)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        )}
      </Paper>

      {/* Remove Member Dialog */}
      <Dialog
        open={removeDialogOpen}
        onClose={() => setRemoveDialogOpen(false)}
      >
        <DialogTitle>Remove Team Member?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove {selectedMember?.name} from the team? They will no longer have access to team resources.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmRemoveMember} color="error" autoFocus>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Team Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Team?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your team? This action cannot be undone and will remove all team members from the team.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteTeam} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={deleteUserDialogOpen}
        onClose={handleDeleteUserCancel}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user {userToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteUserCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUserConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagement;