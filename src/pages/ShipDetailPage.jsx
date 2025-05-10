import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Tabs, 
  Tab, 
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Build as BuildIcon
} from '@mui/icons-material';
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';
import { useJobs } from '../contexts/JobsContext';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission, PERMISSIONS } from '../utils/roleUtils';

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ShipDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { getShipById } = useShips();
  const { components, getComponentsByShipId, addComponent, updateComponent, deleteComponent } = useComponents();
  const { jobs, getJobsByShipId, addJob } = useJobs();
  
  const [ship, setShip] = useState(null);
  const [shipComponents, setShipComponents] = useState([]);
  const [shipJobs, setShipJobs] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  
  // Dialog states
  const [openComponentDialog, setOpenComponentDialog] = useState(false);
  const [componentDialogType, setComponentDialogType] = useState('add');
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [componentFormData, setComponentFormData] = useState({
    name: '',
    serialNumber: '',
    installDate: new Date().toISOString().slice(0, 10),
    lastMaintenanceDate: new Date().toISOString().slice(0, 10)
  });
  
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    type: 'Inspection',
    priority: 'Medium',
    status: 'Open',
    assignedEngineerId: '',
    scheduledDate: new Date().toISOString().slice(0, 10),
    componentId: ''
  });
  
  // Load ship data
  useEffect(() => {
    const shipData = getShipById(id);
    if (!shipData) {
      navigate('/ships');
      return;
    }
    setShip(shipData);
    
    // Load components and jobs
    const componentsData = getComponentsByShipId(id);
    setShipComponents(componentsData);
    
    const jobsData = getJobsByShipId(id);
    setShipJobs(jobsData);
  }, [id, getShipById, getComponentsByShipId, getJobsByShipId, components, jobs, navigate]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Under Maintenance':
        return 'warning';
      case 'Out of Service':
      case 'Decommissioned':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Job priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'info';
      default:
        return 'default';
    }
  };
  
  // Job status colors
  const getJobStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'info';
      case 'In Progress':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  
  // Handle component dialog
  const handleOpenComponentDialog = (type, component = null) => {
    setComponentDialogType(type);
    if (component) {
      setSelectedComponent(component);
      setComponentFormData({
        name: component.name,
        serialNumber: component.serialNumber,
        installDate: component.installDate,
        lastMaintenanceDate: component.lastMaintenanceDate
      });
    } else {
      setComponentFormData({
        name: '',
        serialNumber: '',
        installDate: new Date().toISOString().slice(0, 10),
        lastMaintenanceDate: new Date().toISOString().slice(0, 10)
      });
    }
    setOpenComponentDialog(true);
  };
  
  const handleCloseComponentDialog = () => {
    setOpenComponentDialog(false);
    setSelectedComponent(null);
  };
  
  // Handle component form input change
  const handleComponentInputChange = (e) => {
    const { name, value } = e.target;
    setComponentFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Submit component form
  const handleComponentSubmit = () => {
    if (componentDialogType === 'add') {
      addComponent({ ...componentFormData, shipId: ship.id });
    } else if (componentDialogType === 'edit') {
      updateComponent(selectedComponent.id, componentFormData);
    } else if (componentDialogType === 'delete') {
      deleteComponent(selectedComponent.id);
    }
    handleCloseComponentDialog();
  };
  
  // Handle job dialog
  const handleOpenJobDialog = (component) => {
    setJobFormData({
      type: 'Inspection',
      priority: 'Medium',
      status: 'Open',
      assignedEngineerId: '',
      scheduledDate: new Date().toISOString().slice(0, 10),
      componentId: component.id
    });
    setOpenJobDialog(true);
  };
  
  const handleCloseJobDialog = () => {
    setOpenJobDialog(false);
  };
  
  // Handle job form input change
  const handleJobInputChange = (e) => {
    const { name, value } = e.target;
    setJobFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Submit job form
  const handleJobSubmit = () => {
    addJob({
      ...jobFormData,
      shipId: ship.id
    });
    handleCloseJobDialog();
  };
  
  if (!ship) {
    return (
      <Container maxWidth="xl">
        <Typography>Loading...</Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          {ship.name}
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Ship Information</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">IMO Number:</Typography>
                  <Typography variant="body1">{ship.imo}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Flag:</Typography>
                  <Typography variant="body1">{ship.flag}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">Status:</Typography>
                  <Chip 
                    label={ship.status} 
                    color={getStatusColor(ship.status)} 
                    size="small" 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Components</Typography>
                <Typography variant="h3" align="center">{shipComponents.length}</Typography>
                <Typography variant="body2" align="center">Total Components</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Maintenance Jobs</Typography>
                <Typography variant="h3" align="center">{shipJobs.length}</Typography>
                <Typography variant="body2" align="center">Total Jobs</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Components" />
            <Tab label="Maintenance History" />
          </Tabs>
        </Box>
        
        {/* Components Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Installed Components</Typography>
            {hasPermission(currentUser?.role, PERMISSIONS.CREATE_COMPONENT) && (
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenComponentDialog('add')}
              >
                Add Component
              </Button>
            )}
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Serial Number</TableCell>
                  <TableCell>Installation Date</TableCell>
                  <TableCell>Last Maintenance</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shipComponents.map(component => (
                  <TableRow key={component.id}>
                    <TableCell>{component.name}</TableCell>
                    <TableCell>{component.serialNumber}</TableCell>
                    <TableCell>{component.installDate}</TableCell>
                    <TableCell>{component.lastMaintenanceDate}</TableCell>
                    <TableCell>
                      {hasPermission(currentUser?.role, PERMISSIONS.CREATE_JOB) && (
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenJobDialog(component)}
                          title="Create Maintenance Job"
                        >
                          <BuildIcon />
                        </IconButton>
                      )}
                      
                      {hasPermission(currentUser?.role, PERMISSIONS.EDIT_COMPONENT) && (
                        <IconButton
                          color="warning"
                          onClick={() => handleOpenComponentDialog('edit', component)}
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      
                      {hasPermission(currentUser?.role, PERMISSIONS.DELETE_COMPONENT) && (
                        <IconButton
                          color="error"
                          onClick={() => handleOpenComponentDialog('delete', component)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {shipComponents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No components installed
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Maintenance History Tab */}
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>Maintenance History</Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Component</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Scheduled Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shipJobs.map(job => {
                  const component = shipComponents.find(c => c.id === job.componentId);
                  return (
                    <TableRow key={job.id}>
                      <TableCell>{component ? component.name : 'Unknown'}</TableCell>
                      <TableCell>{job.type}</TableCell>
                      <TableCell>
                        <Chip 
                          label={job.priority} 
                          color={getPriorityColor(job.priority)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={job.status} 
                          color={getJobStatusColor(job.status)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>{job.scheduledDate}</TableCell>
                    </TableRow>
                  );
                })}
                {shipJobs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No maintenance history
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>
      
      {/* Component Dialog */}
      <Dialog open={openComponentDialog} onClose={handleCloseComponentDialog} maxWidth="sm" fullWidth>
        {componentDialogType === 'delete' ? (
          <>
            <DialogTitle>Delete Component</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete the component "{selectedComponent?.name}"?
                This will also delete all maintenance jobs associated with this component.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseComponentDialog}>Cancel</Button>
              <Button onClick={handleComponentSubmit} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>
              {componentDialogType === 'add' ? 'Add New Component' : 'Edit Component'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Component Name"
                    value={componentFormData.name}
                    onChange={handleComponentInputChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="serialNumber"
                    label="Serial Number"
                    value={componentFormData.serialNumber}
                    onChange={handleComponentInputChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="installDate"
                    label="Installation Date"
                    type="date"
                    value={componentFormData.installDate}
                    onChange={handleComponentInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="lastMaintenanceDate"
                    label="Last Maintenance Date"
                    type="date"
                    value={componentFormData.lastMaintenanceDate}
                    onChange={handleComponentInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseComponentDialog}>Cancel</Button>
              <Button 
                onClick={handleComponentSubmit} 
                color="primary" 
                variant="contained"
                disabled={!componentFormData.name || !componentFormData.serialNumber}
              >
                {componentDialogType === 'add' ? 'Add' : 'Save'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Job Dialog */}
      <Dialog open={openJobDialog} onClose={handleCloseJobDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create Maintenance Job</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="type"
                label="Job Type"
                value={jobFormData.type}
                onChange={handleJobInputChange}
                select
                fullWidth
                margin="normal"
              >
                <MenuItem value="Inspection">Inspection</MenuItem>
                <MenuItem value="Repair">Repair</MenuItem>
                <MenuItem value="Replacement">Replacement</MenuItem>
                <MenuItem value="Calibration">Calibration</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="priority"
                label="Priority"
                value={jobFormData.priority}
                onChange={handleJobInputChange}
                select
                fullWidth
                margin="normal"
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="status"
                label="Status"
                value={jobFormData.status}
                onChange={handleJobInputChange}
                select
                fullWidth
                margin="normal"
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="assignedEngineerId"
                label="Assigned Engineer"
                value={jobFormData.assignedEngineerId}
                onChange={handleJobInputChange}
                select
                fullWidth
                margin="normal"
              >
                <MenuItem value="3">Engineer (engineer@entnt.in)</MenuItem>
                <MenuItem value="">Unassigned</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="scheduledDate"
                label="Scheduled Date"
                type="date"
                value={jobFormData.scheduledDate}
                onChange={handleJobInputChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJobDialog}>Cancel</Button>
          <Button 
            onClick={handleJobSubmit} 
            color="primary" 
            variant="contained"
          >
            Create Job
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ShipDetailPage;
