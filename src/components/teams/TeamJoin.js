import React, { useState, useContext } from 'react';
import { TeamContext } from '../../context/TeamContext';
import {
  Box,
  TextField,
  Button,
  Typography
} from '@mui/material';

const TeamJoin = () => {
  const [joinCode, setJoinCode] = useState('');
  const { joinTeam } = useContext(TeamContext);

  const onChange = e => {
    setJoinCode(e.target.value);
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await joinTeam(joinCode);
    } catch (err) {
      console.error('Error joining team:', err);
    }
  };

  return (
    <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
      <Typography variant="h6" gutterBottom>
        Join an Existing Team
      </Typography>
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="joinCode"
        label="Team Join Code"
        name="joinCode"
        value={joinCode}
        onChange={onChange}
        helperText="Enter the 8-character join code provided by the team owner"
      />
      
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={joinCode.length < 8}
      >
        Join Team
      </Button>
    </Box>
  );
};

export default TeamJoin;