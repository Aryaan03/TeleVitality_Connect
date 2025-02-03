import { Box, Typography } from '@mui/material';

export default function Dashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Patient Dashboard</Typography>
      <Box sx={{ mt: 3 }}>
        <Typography>Upcoming Appointments</Typography>
        {/* Will add appointment cards later */}
      </Box>
    </Box>
  );
}
