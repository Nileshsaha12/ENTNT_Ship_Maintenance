import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Alert, 
  Grid 
} from '@mui/material';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect to dashboard
  if (currentUser) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = login(email, password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Failed to log in');
      console.error(error);
    }

    setLoading(false);
  };

  // Demo credentials for quick login
  const loginAsAdmin = () => {
    setEmail('admin@entnt.in');
    setPassword('admin123');
  };

  const loginAsInspector = () => {
    setEmail('inspector@entnt.in');
    setPassword('inspect123');
  };

  const loginAsEngineer = () => {
    setEmail('engineer@entnt.in');
    setPassword('engine123');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" gutterBottom>
          ENTNT Ship Maintenance
        </Typography>
        
        <Card sx={{ width: '100%', mt: 2 }}>
          <CardContent>
            <Typography component="h2" variant="h5" align="center" gutterBottom>
              Sign In
            </Typography>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                Sign In
              </Button>
            </Box>
            
            <Typography variant="body2" align="center" sx={{ mb: 1 }}>
              Quick Login Options:
            </Typography>
            
            <Grid container spacing={1}>
              <Grid item xs={4}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  fullWidth
                  onClick={loginAsAdmin}
                >
                  Admin
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  fullWidth
                  onClick={loginAsInspector}
                >
                  Inspector
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  fullWidth
                  onClick={loginAsEngineer}
                >
                  Engineer
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;
