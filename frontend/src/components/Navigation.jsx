import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button, Stack, Paper, Box } from '@mui/material';

export default function Navigation({ onLoginClick, onRegisterClick }) {
  const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in

  return (
    <Box>
      {/* Top Navigation Bar */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 0 }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button component={Link} to="/">Home</Button>
          {!isLoggedIn && <Button onClick={onLoginClick}>Login</Button>}
          {!isLoggedIn && <Button onClick={onRegisterClick}>Register</Button>}
          {isLoggedIn && <Button component={Link} to="/doctor-register">Doctor Register</Button>}
          {isLoggedIn && <Button component={Link} to="/doctor-profile">Doctor Profile</Button>}
          {isLoggedIn && <Button component={Link} to="/doctor-appointments">Appointments</Button>}
          <Button component={Link} to="/contact">Contact</Button>
          {isLoggedIn && (
            <Button 
              onClick={() => {
                localStorage.removeItem('token'); // Logout logic
                window.location.reload(); // Refresh to reset state
              }}
            >
              Logout
            </Button>
          )}
        </Stack>
      </Paper>

      {/* Outlet for rendering nested routes */}
      <Outlet />
    </Box>
  );
}
