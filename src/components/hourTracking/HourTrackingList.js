import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert
} from '@mui/material';
import { format } from 'date-fns';

// Status color mapping
const statusColors = {
  active: 'warning',
  completed: 'success',
  adjusted: 'info'
};

const HourTrackingList = ({ records, title, showUser = false }) => {
  if (!records || records.length === 0) {
    return (
      <Alert severity="info">
        No hour tracking records found.
      </Alert>
    );
  }

  // Helper function to format duration
  const formatDuration = (totalHours) => {
    if (!totalHours && totalHours !== 0) return 'N/A';
    
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <Box sx={{ mt: 2 }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      
      <TableContainer component={Paper} variant="outlined">
        <Table aria-label="hour tracking records table">
          <TableHead>
            <TableRow>
              {showUser && <TableCell>Employee</TableCell>}
              <TableCell>Date</TableCell>
              <TableCell>Clock In</TableCell>
              <TableCell>Clock Out</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record._id}>
                {showUser && (
                  <TableCell>
                    {record.user?.name || 'Unknown User'}
                  </TableCell>
                )}
                <TableCell>
                  {record.date ? format(new Date(record.date), 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
                <TableCell>
                  {record.clockInTime ? format(new Date(record.clockInTime), 'HH:mm') : 'N/A'}
                </TableCell>
                <TableCell>
                  {record.clockOutTime ? format(new Date(record.clockOutTime), 'HH:mm') : 'N/A'}
                </TableCell>
                <TableCell>
                  {formatDuration(record.totalHours)}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={record.status.charAt(0).toUpperCase() + record.status.slice(1)} 
                    color={statusColors[record.status] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {record.location?.name || 'N/A'}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                    {record.notes || 'N/A'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HourTrackingList;