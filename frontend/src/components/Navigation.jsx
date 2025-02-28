import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button, Stack, Paper, Box, Typography, Avatar } from '@mui/material';
import { MedicalServices, Home, Person, CalendarToday, Logout, Login, HowToReg, ContactMail } from '@mui/icons-material';

export default function Navigation({ onLoginClick, onRegisterClick }) {
  const isLoggedIn = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const navButtonStyles = {
    minWidth: '120px',
    borderRadius: '20px',
    textTransform: 'none',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 2
    }
  };

  return (
    <Box>
      {/* Top Navigation Bar */}
      <Paper elevation={1} sx={{ 
        p: 2, 
        borderRadius: 0,
        background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      }}>
        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="space-between"
          alignItems="center"
        >
          {/* Logo/Branding Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <MedicalServices sx={{ 
              fontSize: '2rem', 
              color: 'primary.main',
              mr: 1
            }} />
            <Typography 
              variant="h6" 
              component={Link} 
              to="/" 
              sx={{ 
                textDecoration: 'none',
                color: 'text.primary',
                fontWeight: '600',
                '&:hover': {
                  color: 'primary.main'
                }
              }}
            >
              TeleVitality Connect
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Button 
              component={Link} 
              to="/" 
              startIcon={<Home />}
              sx={navButtonStyles}
            >
              Home
            </Button>

            {!isLoggedIn && (
              <>
                <Button 
                  onClick={onLoginClick}
                  startIcon={<Login />}
                  sx={{
                    ...navButtonStyles,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark'
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  onClick={onRegisterClick}
                  startIcon={<HowToReg />}
                  sx={{
                    ...navButtonStyles,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'primary.light'
                    }
                  }}
                >
                  Register
                </Button>
              </>
            )}

            {isLoggedIn && role === "doctor" && (
              <Button 
                component={Link} 
                to="/doctor-profile"
                startIcon={<Person />}
                sx={navButtonStyles}
              >
                Profile
              </Button>
            )}

            {isLoggedIn && role === "patient" && (
              <Button 
                component={Link} 
                to="/profile"
                startIcon={<Person />}
                sx={navButtonStyles}
              >
                Profile
              </Button>
            )}

            {isLoggedIn && role === "patient" && (
              <Button 
                component={Link} 
                to="/appointments"
                startIcon={<CalendarToday />}
                sx={navButtonStyles}
              >
                Appointments
              </Button>
            )}

            {isLoggedIn && role === "doctor" && (
              <Button 
                component={Link} 
                to="/doctor-appointments"
                startIcon={<CalendarToday />}
                sx={navButtonStyles}
              >
                Appointments
              </Button>
            )}

            <Button 
              component={Link} 
              to="/contact"
              startIcon={<ContactMail />}
              sx={navButtonStyles}
            >
              Contact
            </Button>

            {isLoggedIn && (
              <Button 
                onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/');
                }}
                startIcon={<Logout />}
                sx={{
                  ...navButtonStyles,
                  backgroundColor: 'error.light',
                  color: 'error.contrastText',
                  '&:hover': {
                    backgroundColor: 'error.main'
                  }
                }}
              >
                Logout
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Outlet for rendering nested routes */}
      <Outlet />
    </Box>
  );
}