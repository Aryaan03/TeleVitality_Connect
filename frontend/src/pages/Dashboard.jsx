// src/pages/Dashboard.jsx
import { Box, Typography, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    axios.get('http://localhost:8080/api/protected/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error('Error fetching protected dashboard:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Patient Dashboard</Typography>
      <Box sx={{ mt: 3 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography>{message || "No data available."}</Typography>
        )}
      </Box>
    </Box>
  );
}