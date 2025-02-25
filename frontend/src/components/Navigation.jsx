import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button, Stack, Paper, Box } from '@mui/material';

export default function Navigation({ onLoginClick, onRegisterClick }) {
  const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  return (
    <Box>
      {/* Top Navigation Bar */}
      <Paper elevation={3} sx={{ p: 2, borderRadius: 0 }}>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button component={Link} to="/">Home</Button>
          {!isLoggedIn && <Button onClick={onLoginClick}>Login</Button>}
          {!isLoggedIn && <Button onClick={onRegisterClick}>Register</Button>}

          {isLoggedIn && role =="doctor" && <Button component={Link} to="/doctor-profile">Profile</Button>}
          {isLoggedIn && role =="patient" && <Button component={Link} to="/profile">Profile</Button>}
          {isLoggedIn && role =="patient" && <Button component={Link} to="/appointments">Appointments</Button>} {/* TO BE IMPLEMENTED */}
          {isLoggedIn && role =="doctor" && <Button component={Link} to="/doctor-appointments">Appointments</Button>} {/* TO BE IMPLEMENTED */}
          <Button component={Link} to="/contact">Contact</Button>
          {isLoggedIn && (
            <Button 
              onClick={() => {
                localStorage.removeItem('token'); // Logout logic
                navigate('/');
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
