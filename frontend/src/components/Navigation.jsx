import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Container, Button, Box, Typography, 
  IconButton, Menu, MenuItem, Avatar, Badge, Stack,
  styled
} from '@mui/material';
import { 
  MedicalServices, Home, Person, CalendarToday, Logout, 
  Login, HowToReg, ContactMail, Menu as MenuIcon, 
  Notifications, Search
} from '@mui/icons-material';

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #147EFF 0%, #0E5FD9 100%)',
  borderRadius: '12px',
  padding: theme.spacing(1),
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 60%)',
    transform: 'rotate(30deg)'
  }
}));

const LogoText = styled(Typography)({
  fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  fontWeight: 700,
  letterSpacing: '-0.5px',
  background: 'linear-gradient(90deg, #fff 0%, #e6f1ff 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
});

export default function Navigation({ onLoginClick, onRegisterClick }) {
  const isLoggedIn = !!localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState(null);
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState(null);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
    handleProfileMenuClose();
  };

  return (
    <Box sx={{ flexGrow: 1, fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          py: { xs: 1, md: 0 }
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
          <Toolbar disableGutters sx={{ minHeight: '64px !important', gap: 2 }}>
            {/* Logo Section */}
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                mr: { md: 4 }
              }}
            >
              <LogoContainer>
                <MedicalServices sx={{ 
                  fontSize: 28, 
                  color: 'white',
                  mr: 1,
                  zIndex: 1,
                  filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.2))'
                }} />
                <LogoText variant="h6">
                  TeleVitality
                </LogoText>
              </LogoContainer>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ 
              flexGrow: 1, 
              display: { xs: 'none', md: 'flex' },
              gap: 2,
              alignItems: 'center'
            }}>
              {!isLoggedIn && (
                <Button
                  component={Link}
                  to="/"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    px: 2,
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(20, 126, 255, 0.05)'
                    }
                  }}
                >
                  Home
                </Button>
              )}
              
              {isLoggedIn && (
                <Button
                  component={Link}
                  to={role === "doctor" ? "/doctor-appointments" : "/appointments"}
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    px: 2,
                    '&:hover': {
                      color: 'primary.main',
                      backgroundColor: 'rgba(20, 126, 255, 0.05)'
                    }
                  }}
                >
                  Appointments
                </Button>
              )}

              <Button
                component={Link}
                to="/contact"
                sx={{
                  color: 'text.primary',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  px: 2,
                  '&:hover': {
                    color: 'primary.main',
                    backgroundColor: 'rgba(20, 126, 255, 0.05)'
                  }
                }}
              >
                Contact
              </Button>
            </Box>

            {/* Right-side Actions */}
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ 
                ml: 'auto',
                alignItems: 'center'
              }}
            >
              {isLoggedIn ? (
                <>
                  <IconButton sx={{ color: 'text.secondary' }}>
                    <Search fontSize="medium" />
                  </IconButton>
                  
                  <IconButton sx={{ color: 'text.secondary' }}>
                    <Badge badgeContent={4} color="error">
                      <Notifications fontSize="medium" />
                    </Badge>
                  </IconButton>
                  
                  <Avatar 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: 'primary.main',
                      cursor: 'pointer'
                    }}
                    onClick={handleProfileMenuOpen}
                  >
                    {localStorage.getItem('name')?.charAt(0) || 'U'}
                  </Avatar>
                  
                  <Menu
                    anchorEl={profileMenuAnchor}
                    open={Boolean(profileMenuAnchor)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                      elevation: 1,
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      }
                    }}
                  >
                    <MenuItem 
                      component={Link} 
                      to={role === "doctor" ? "/doctor/profile" : "/profile"} 
                      onClick={handleProfileMenuClose}
                    >
                      <Person sx={{ mr: 1.5 }} /> Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Logout sx={{ mr: 1.5 }} /> Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    variant="text"
                    onClick={onLoginClick}
                    sx={{
                      color: 'text.primary',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      '&:hover': {
                        color: 'primary.main'
                      }
                    }}
                  >
                    Sign In
                  </Button>
                  
                  <Button
                    variant="contained"
                    onClick={onRegisterClick}
                    sx={{
                      px: 3,
                      fontWeight: 700,
                      textTransform: 'none',
                      borderRadius: '8px',
                      boxShadow: 'none',
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        boxShadow: 'none',
                        backgroundColor: 'primary.dark'
                      }
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <IconButton
                size="large"
                color="inherit"
                onClick={handleMobileMenuOpen}
                sx={{ 
                  display: { xs: 'flex', md: 'none' },
                  color: 'text.primary'
                }}
              >
                <MenuIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMobileMenuClose}
        PaperProps={{
          elevation: 1,
          sx: {
            mt: 1.5,
            width: '90%',
            maxWidth: '400px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        {!isLoggedIn && (
          <MenuItem 
            component={Link} 
            to="/" 
            onClick={handleMobileMenuClose}
          >
            <Home sx={{ mr: 1.5 }} /> Home
          </MenuItem>
        )}
        
        {isLoggedIn && (
          <MenuItem 
            component={Link} 
            to={role === "doctor" ? "/doctor-appointments" : "/appointments"} 
            onClick={handleMobileMenuClose}
          >
            <CalendarToday sx={{ mr: 1.5 }} /> Appointments
          </MenuItem>
        )}
        
        <MenuItem 
          component={Link} 
          to="/contact" 
          onClick={handleMobileMenuClose}
        >
          <ContactMail sx={{ mr: 1.5 }} /> Contact
        </MenuItem>
        
        {!isLoggedIn && (
          <>
            <MenuItem onClick={() => {
              handleMobileMenuClose();
              onLoginClick();
            }}>
              <Login sx={{ mr: 1.5 }} /> Sign In
            </MenuItem>
            <MenuItem onClick={() => {
              handleMobileMenuClose();
              onRegisterClick();
            }}>
              <HowToReg sx={{ mr: 1.5 }} /> Get Started
            </MenuItem>
          </>
        )}
        
        {isLoggedIn && (
          <MenuItem onClick={() => {
            handleMobileMenuClose();
            handleLogout();
          }}>
            <Logout sx={{ mr: 1.5 }} /> Logout
          </MenuItem>
        )}
      </Menu>

      <Outlet />
    </Box>
  );
}