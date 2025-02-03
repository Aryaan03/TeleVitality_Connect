import { Link } from 'react-router-dom';
import { Button, Stack } from '@mui/material';

export default function Navigation() {
  return (
    <Stack direction="row" spacing={2} sx={{ p: 2 }}>
      <Button component={Link} to="/login">Login</Button>
      <Button component={Link} to="/register">Register</Button>
      <Button component={Link} to="/dashboard">Dashboard</Button>
    </Stack>
  );
}
