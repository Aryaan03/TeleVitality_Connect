import { Link, Outlet } from 'react-router-dom';
import { Button, Stack, Paper, Box } from '@mui/material';

export default function Navigation({ onLoginClick, onRegisterClick }) {
  return (
    <Box>
      {/* Top Navigation Bar */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 0 }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button component={Link} to="/">Home</Button>
          <Button onClick={onLoginClick}>Login</Button> {/* Trigger Login Modal */}
          <Button onClick={onRegisterClick}>Register</Button> {/* Trigger Register Modal */}
          <Button component={Link} to="/contact">Contact</Button>
        </Stack>
      </Paper>

      {/* Outlet for rendering nested routes */}
      <Outlet />
    </Box>
  );
}
