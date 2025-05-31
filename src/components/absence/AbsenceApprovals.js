import React, { useState, useContext } from 'react';
import { AbsenceContext } from '../../context/AbsenceContext';
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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert
} from '@mui/material';
import { format } from 'date-fns';

// Type color mapping
const typeColors = {
  vacation: 'primary',
  sick: 'error',
  personal: 'info',
  other: 'default'
};

const AbsenceApprovals = ({ absences, onApprovalSuccess }) => {
  const { updateAbsenceStatus, loading, error } = useContext(AbsenceContext);
  
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState('');
  const [notes, setNotes] = useState('');
  const [assignReplacement, setAssignReplacement] = useState(false);
  
  if (!absences || absences.length === 0) {
    return (
      <Alert severity="info">
        There are no pending absence requests to approve.
      </Alert>
    );
  }

  const handleOpenDialog = (absence, actionType) => {
    setSelectedAbsence(absence);
    setAction(actionType);
    setNotes('');
    setAssignReplacement(absence.replacementNeeded);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAbsence(null);
  };

  const handleSubmit = async () => {
    if (!selectedAbsence) return;
    
    try {
      await updateAbsenceStatus({
        absenceId: selectedAbsence._id,
        status: action,
        notes,
        replacementAssigned: action === 'approved' && assignReplacement
      });
      
      handleCloseDialog();
      if (onApprovalSuccess) onApprovalSuccess();
    } catch (err) {
      console.error('Failed to update absence status:', err);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <TableContainer component={Paper} variant="outlined">
        <Table aria-label="absence approvals table">
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Dates</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Replacement</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {absences.map((absence) => (
              <TableRow key={absence._id}>
                <TableCell>
                  {absence.user?.name || 'Unknown User'}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={absence.type.charAt(0).toUpperCase() + absence.type.slice(1)} 
                    color={typeColors[absence.type] || 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {format(new Date(absence.startDate), 'MMM dd')} - {format(new Date(absence.endDate), 'MMM dd, yyyy')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {absence.reason}
                  </Typography>
                </TableCell>
                <TableCell>
                  {absence.replacementNeeded ? (
                    <Chip 
                      label="Needed" 
                      color="warning"
                      size="small"
                    />
                  ) : (
                    <Chip 
                      label="Not Required" 
                      color="default"
                      size="small"
                      variant="outlined"
                    />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      onClick={() => handleOpenDialog(absence, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleOpenDialog(absence, 'rejected')}
                    >
                      Reject
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Approval/Rejection Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>
          {action === 'approved' ? 'Approve Absence Request' : 'Reject Absence Request'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {action === 'approved' 
              ? 'Are you sure you want to approve this absence request?' 
              : 'Are you sure you want to reject this absence request?'}
          </DialogContentText>
          
          {selectedAbsence?.replacementNeeded && action === 'approved' && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={assignReplacement}
                  onChange={(e) => setAssignReplacement(e.target.checked)}
                  color="primary"
                />
              }
              label="Assign Replacement"
              sx={{ mt: 2, display: 'block' }}
            />
          )}
          
          <TextField
            autoFocus
            margin="dense"
            id="notes"
            label="Notes"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            color={action === 'approved' ? 'success' : 'error'}
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {action === 'approved' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AbsenceApprovals;