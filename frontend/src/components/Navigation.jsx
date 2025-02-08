import { Link, Outlet } from 'react-router-dom';
import { Button, Stack, Paper, Box } from '@mui/material';

export default function Navigation() {
  return (
    <Box>
      {/* Top Navigation Bar */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 0 }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button component={Link} to="/">Home</Button>
          <Button component={Link} to="/login">Login</Button>
          <Button component={Link} to="/register">Register</Button>
          <Button component={Link} to="/contact">Contact</Button>
        </Stack>
      </Paper>

      {/* Outlet for rendering nested routes */}
      <Outlet />
    </Box>
  );
}
