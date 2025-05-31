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
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  completed: 'info'
};

// Type color mapping
const typeColors = {
  vacation: 'primary',
  sick: 'error',
  personal: 'info',
  other: 'default'
};

const AbsenceList = ({ absences }) => {
  if (!absences || absences.length === 0) {
    return (
      <Alert severity="info">
        You don't have any absence records yet.
      </Alert>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <TableContainer component={Paper} variant="outlined">
        <Table aria-label="absences table">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Replacement</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {absences.map((absence) => (
              <TableRow key={absence._id}>
                <TableCell>
                  <Chip 
                    label={absence.type.charAt(0).toUpperCase() + absence.type.slice(1)} 
                    color={typeColors[absence.type] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {format(new Date(absence.startDate), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  {format(new Date(absence.endDate), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {absence.reason}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={absence.status.charAt(0).toUpperCase() + absence.status.slice(1)} 
                    color={statusColors[absence.status] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {absence.replacementNeeded ? (
                    absence.replacementAssigned ? (
                      <Chip 
                        label={absence.replacement ? absence.replacement.name : 'Assigned'} 
                        color="success"
                        size="small"
                      />
                    ) : (
                      <Chip 
                        label="Needed" 
                        color="warning"
                        size="small"
                      />
                    )
                  ) : (
                    <Chip 
                      label="Not Required" 
                      color="default"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AbsenceList;