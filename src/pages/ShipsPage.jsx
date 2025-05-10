import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import { 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useShips } from '../contexts/ShipsContext';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission, PERMISSIONS } from '../utils/roleUtils';

const ShipsPage = () => {
  const navigate = useNavigate();
  const { ships, addShip, updateShip, deleteShip } = useShips();
  const { currentUser } = useAuth();
  
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('add'); // 'add', 'edit', 'delete'
  const [selectedShip, setSelectedShip] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    imo: '',
    flag: '',
    status: 'Active'
  });
  
  // Ship statuses
  const shipStatuses = ['Active', 'Under Maintenance', 'Out of Service', 'Decommissioned'];
  
  // Open dialog for adding a new ship
  const handleAddClick = () => {
    setDialogType('add');
    setFormData({
      name: '',
      imo: '',
      flag: '',
      status: 'Active'
    });
    setOpenDialog(true);
  };
  
  // Open dialog for editing a ship
  const handleEditClick = (ship) => {
    setDialogType('edit');
    setSelectedShip(ship);
    setFormData({
      name: ship.name,
      imo: ship.imo,
      flag: ship.flag,
      status: ship.status
    });
    setOpenDialog(true);
  };
  
  // Open dialog for deleting a ship
  const handleDeleteClick = (ship) => {
    setDialogType('delete');
    setSelectedShip(ship);
    setOpenDialog(true);
  };
  
  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedShip(null);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Submit form
  const handleSubmit = () => {
    if (dialogType === 'add') {
      addShip(formData);
    } else if (dialogType === 'edit') {
      updateShip(selectedShip.id, formData);
    } else if (dialogType === 'delete') {
      deleteShip(selectedShip.id);
    }
    
    handleCloseDialog();
  };
  
  // Navigate to ship details
  const handleViewShip = (id) => {
    navigate(`/ships/${id}`);
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Under Maintenance':
        return 'warning';
      case 'Out of Service':
        return 'error';
      case 'Decommissioned':
        return 'default';
      default:
        return 'default';
    }
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Ships</Typography>
        {hasPermission(currentUser?.role, PERMISSIONS.CREATE_SHIP) && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add Ship
          </Button>
        )}
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>IMO Number</TableCell>
              <TableCell>Flag</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ships.map((ship) => (
              <TableRow key={ship.id}>
                <TableCell>{ship.name}</TableCell>
                <TableCell>{ship.imo}</TableCell>
                <TableCell>{ship.flag}</TableCell>
                <TableCell>
                  <Chip 
                    label={ship.status} 
                    color={getStatusColor(ship.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="primary"
                    onClick={() => handleViewShip(ship.id)}
                  >
                    <ViewIcon />
                  </IconButton>
                  
                  {hasPermission(currentUser?.role, PERMISSIONS.EDIT_SHIP) && (
                    <IconButton 
                      color="warning"
                      onClick={() => handleEditClick(ship)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  
                  {hasPermission(currentUser?.role, PERMISSIONS.DELETE_SHIP) && (
                    <IconButton 
                      color="error"
                      onClick={() => handleDeleteClick(ship)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {ships.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No ships found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Add/Edit/Delete Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {dialogType === 'delete' ? (
          <>
            <DialogTitle>Delete Ship</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete the ship "{selectedShip?.name}"? 
                This will also delete all components and maintenance jobs associated with this ship.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button onClick={handleSubmit} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle>{dialogType === 'add' ? 'Add New Ship' : 'Edit Ship'}</DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid item xs={12}>
                  <TextField
                    name="name"
                    label="Ship Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="imo"
                    label="IMO Number"
                    value={formData.imo}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    name="flag"
                    label="Flag"
                    value={formData.flag}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="status"
                    label="Status"
                    value={formData.status}
                    onChange={handleInputChange}
                    select
                    fullWidth
                    margin="normal"
                  >
                    {shipStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button 
                onClick={handleSubmit} 
                color="primary" 
                variant="contained"
                disabled={!formData.name || !formData.imo || !formData.flag}
              >
                {dialogType === 'add' ? 'Add' : 'Save'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ShipsPage;
