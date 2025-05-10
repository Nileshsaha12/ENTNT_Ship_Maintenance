import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  DirectionsBoat as ShipIcon,
  Build as ComponentIcon,
  Assignment as JobIcon,
  CheckCircle as CompletedIcon
} from '@mui/icons-material';
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { useJobs } from '../contexts/JobsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import PriorityChart from '../components/Dashboard/PriorityChart';

const DashboardPage = () => {
  const { ships } = useShips();
  const { components, getComponentsWithOverdueMaintenance } = useComponents();
  const { jobs, getJobsByStatus } = useJobs();
  
  const [overdueComponents, setOverdueComponents] = useState([]);
  const [jobsInProgress, setJobsInProgress] = useState([]);
  const [completedJobs, setCompletedJobs] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  useEffect(() => {
    setOverdueComponents(getComponentsWithOverdueMaintenance());
    setJobsInProgress(getJobsByStatus('In Progress'));
    setCompletedJobs(getJobsByStatus('Completed'));
    
    // Prepare data for charts
    const priorityCounts = jobs.reduce((acc, job) => {
      const priority = job.priority || 'Unknown';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {});
    
    setPriorityData(
      Object.keys(priorityCounts).map(key => ({
        name: key,
        value: priorityCounts[key]
      }))
    );
    
    const statusCounts = jobs.reduce((acc, job) => {
      const status = job.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    
    setStatusData(
      Object.keys(statusCounts).map(key => ({
        name: key,
        value: statusCounts[key]
      }))
    );
  }, [jobs, components]);
  
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ShipIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h5">{ships.length}</Typography>
                  <Typography variant="body2">Total Ships</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <ComponentIcon fontSize="large" color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h5">{overdueComponents.length}</Typography>
                  <Typography variant="body2">Overdue Maintenance</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <JobIcon fontSize="large" color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h5">{jobsInProgress.length}</Typography>
                  <Typography variant="body2">Jobs in Progress</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CompletedIcon fontSize="large" color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h5">{completedJobs.length}</Typography>
                  <Typography variant="body2">Completed Jobs</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%', minHeight: 350 }}>
            <Typography variant="h6" gutterBottom>
              Maintenance Jobs by Status
            </Typography>
            <Box sx={{ width: '100%', height: 250, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 25,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    height={40}
                    tickMargin={10} 
                  />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => [`${value} jobs`, 'Count']} />
                  <Bar dataKey="value" fill="#8884d8" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          {/* Replace with the new PriorityChart component */}
          <PriorityChart data={priorityData} />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%', minHeight: 350 }}>
            <Typography variant="h6" gutterBottom>
              Recent Maintenance Activities
            </Typography>
            <List>
              {jobs.slice(0, 5).map((job) => (
                <Box key={job.id}>
                  <ListItem component={Link} to={`/jobs`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItemText
                      primary={job.type}
                      secondary={`${job.status} - Priority: ${job.priority}`}
                    />
                  </ListItem>
                  <Divider />
                </Box>
              ))}
              {jobs.length === 0 && (
                <ListItem>
                  <ListItemText 
                    primary="No maintenance activities" 
                    secondary="No jobs have been created yet" 
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%', minHeight: 350 }}>
            <Typography variant="h6" gutterBottom>
              Components Needing Maintenance
            </Typography>
            <List>
              {overdueComponents.slice(0, 5).map((component) => (
                <Box key={component.id}>
                  <ListItem>
                    <ListItemText
                      primary={component.name}
                      secondary={`Serial: ${component.serialNumber} - Last Maintenance: ${component.lastMaintenanceDate}`}
                    />
                  </ListItem>
                  <Divider />
                </Box>
              ))}
              {overdueComponents.length === 0 && (
                <ListItem>
                  <ListItemText primary="No components need maintenance" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
