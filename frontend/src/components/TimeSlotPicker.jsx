// TimeSlotPicker.jsx
import React from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const TimeSlotPicker = ({ day, dayAvailability, onUpdate }) => {
  const handleDayToggle = () => {
    onUpdate(day, {
      ...dayAvailability,
      enabled: !dayAvailability.enabled,
    });
  };

  const handleTimeSlotChange = (index, field, value) => {
    const updatedTimeSlots = [...dayAvailability.timeSlots];
    updatedTimeSlots[index] = {
      ...updatedTimeSlots[index],
      [field]: value,
    };
    
    onUpdate(day, {
      ...dayAvailability,
      timeSlots: updatedTimeSlots,
    });
  };

  const handleAddTimeSlot = () => {
    const updatedTimeSlots = [...dayAvailability.timeSlots];
    updatedTimeSlots.push({
      startTime: '09:00',
      endTime: '17:00',
      enabled: true,
    });
    
    onUpdate(day, {
      ...dayAvailability,
      timeSlots: updatedTimeSlots,
    });
  };

  const handleRemoveTimeSlot = (index) => {
    const updatedTimeSlots = [...dayAvailability.timeSlots];
    updatedTimeSlots.splice(index, 1);
    
    onUpdate(day, {
      ...dayAvailability,
      timeSlots: updatedTimeSlots,
    });
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={dayAvailability.enabled}
            onChange={handleDayToggle}
          />
        }
        label={<Typography variant="h6">{day}</Typography>}
      />
      
      {dayAvailability.enabled && (
        <Box sx={{ ml: 4, mt: 1 }}>
          {dayAvailability.timeSlots.map((slot, index) => (
            <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 1 }}>
              <Grid item xs={5}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="End Time"
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ step: 300 }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton 
                  color="error" 
                  onClick={() => handleRemoveTimeSlot(index)}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          
          <Button 
            startIcon={<AddIcon />} 
            onClick={handleAddTimeSlot}
            variant="outlined"
            size="small"
            sx={{ mt: 1 }}
          >
            Add Time Slot
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default TimeSlotPicker;