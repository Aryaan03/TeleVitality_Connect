/*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section */

          /*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section *//*import { useEffect, useState } from 'react';
import { 
  Box, Typography, Card, CardContent, Grid, 
  Button, Avatar, Paper, Divider 
} from '@mui/material';
import { 
  Edit as EditIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  LocalHospital as HospitalIcon,
  Badge as LicenseIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as BoardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
}));

const InfoItem = ({ label, value, icon }) => (
  <Grid container spacing={2} sx={{ mb: 2 }}>
    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ 
        color: 'text.secondary',
        mr: 2,
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ 
          fontWeight: 500,
          display: 'block',
          letterSpacing: 0.5
        }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ 
          fontWeight: 500,
          color: 'text.primary',
          mt: 0.25
        }}>
          {value || '-'}
        </Typography>
      </Box>
    </Grid>
  </Grid>
);

const SectionHeader = ({ title, icon }) => (
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    mb: 3,
    pt: 1
  }}>
    <Box sx={{ 
      mr: 1.5, 
      color: 'primary.main',
      display: 'flex',
      alignItems: 'center'
    }}>
      {icon}
    </Box>
    <Typography variant="h6" sx={{ 
      fontWeight: 600,
      color: 'text.primary',
    }}>
      {title}
    </Typography>
  </Box>
);

export default function DoctorProfileDisplay() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.getDoctorProfile();
        setProfile(profileData);
      } catch (err) {
        setError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <StyledCard>
        <CardContent>
          {/* Header Section */