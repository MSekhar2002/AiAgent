import React, { useState, useContext } from 'react';
import { TeamContext } from '../../context/TeamContext';
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Stack,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

const TeamCreate = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department: '',
    departments: []
  });

  const { createTeam } = useContext(TeamContext);

  const { name, description, department, departments } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addDepartment = () => {
    if (department.trim() && !departments.includes(department.trim())) {
      setFormData({
        ...formData,
        departments: [...departments, department.trim()],
        department: ''
      });
    }
  };

  const removeDepartment = (deptToRemove) => {
    setFormData({
      ...formData,
      departments: departments.filter(dept => dept !== deptToRemove)
    });
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await createTeam({
        name,
        description,
        departments
      });
    } catch (err) {
      console.error('Error creating team:', err);
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        Create a New Team
      </Typography>
      
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
      
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Departments
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            fullWidth
            id="department"
            label="Add Department"
            name="department"
            value={department}
            onChange={onChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addDepartment();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={addDepartment}
            sx={{ ml: 1 }}
            disabled={!department.trim()}
          >
            <AddIcon />
          </Button>
        </Box>
        
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {departments.map((dept, index) => (
            <Chip
              key={index}
              label={dept}
              onDelete={() => removeDepartment(dept)}
              deleteIcon={<CloseIcon />}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </Box>
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={!name.trim()}
      >
        Create Team
      </Button>
    </Box>
  );
};

export default TeamCreate;