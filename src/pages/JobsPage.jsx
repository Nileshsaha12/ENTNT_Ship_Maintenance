import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  IconButton,
} from "@mui/material";
import { Edit as EditIcon, Close as CancelIcon } from "@mui/icons-material";
import { useJobs } from "../contexts/JobsContext";
import { useShips } from "../contexts/ShipsContext";
import { useComponents } from "../contexts/ComponentsContext";
import { useAuth } from "../contexts/AuthContext";
import { hasPermission, PERMISSIONS } from "../utils/roleUtils";

const JobsPage = () => {
  const { jobs, updateJob } = useJobs();
  const { ships } = useShips();
  const { components } = useComponents();
  const { currentUser } = useAuth();

  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    shipId: "",
    status: "",
    priority: "",
  });

  const [editJob, setEditJob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [jobFormData, setJobFormData] = useState({
    status: "",
    priority: "",
    assignedEngineerId: "",
  });

  // Apply filters and set filtered jobs
  useEffect(() => {
    let result = [...jobs];

    if (filters.shipId) {
      result = result.filter((job) => job.shipId === filters.shipId);
    }

    if (filters.status) {
      result = result.filter((job) => job.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter((job) => job.priority === filters.priority);
    }

    setFilteredJobs(result);
  }, [jobs, filters]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Job priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "info";
      default:
        return "default";
    }
  };

  // Job status colors
  const getJobStatusColor = (status) => {
    switch (status) {
      case "Open":
        return "info";
      case "In Progress":
        return "warning";
      case "Completed":
        return "success";
      case "Cancelled":
        return "error";
      default:
        return "default";
    }
  };

  // Get ship name by id
  const getShipName = (shipId) => {
    const ship = ships.find((s) => s.id === shipId);
    return ship ? ship.name : "Unknown Ship";
  };

  // Get component name by id
  const getComponentName = (componentId) => {
    const component = components.find((c) => c.id === componentId);
    return component ? component.name : "Unknown Component";
  };

  // Open edit dialog
  const handleEditClick = (job) => {
    setEditJob(job);
    setJobFormData({
      status: job.status,
      priority: job.priority,
      assignedEngineerId: job.assignedEngineerId || "",
    });
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditJob(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = () => {
    updateJob(editJob.id, jobFormData);
    handleCloseDialog();
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Maintenance Jobs
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="ship-filter">Ship</InputLabel>
              <Select
                id="ship-filter"
                name="shipId"
                value={filters.shipId}
                onChange={handleFilterChange}
                label="Ship"
                sx={{ minWidth: "100px", width: "100%" }}
              >
                <MenuItem value="">
                  <em>All Ships</em>
                </MenuItem>
                {ships.map((ship) => (
                  <MenuItem key={ship.id} value={ship.id}>
                    {ship.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="status-filter">Status</InputLabel>
              <Select
                id="status-filter"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
                sx={{ minWidth: "100px", width: "100%" }}
              >
                <MenuItem value="">
                  <em>All Statuses</em>
                </MenuItem>
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="priority-filter">Priority</InputLabel>
              <Select
                id="priority-filter"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                label="Priority"
                sx={{ minWidth: "100px", width: "100%" }}
              >
                <MenuItem value="">
                  <em>All Priorities</em>
                </MenuItem>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Jobs Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ship</TableCell>
              <TableCell>Component</TableCell>
              <TableCell>Job Type</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Scheduled Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{getShipName(job.shipId)}</TableCell>
                <TableCell>{getComponentName(job.componentId)}</TableCell>
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
                <TableCell>
                  {hasPermission(currentUser?.role, PERMISSIONS.EDIT_JOB) && (
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(job)}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredJobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No jobs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Job Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Update Maintenance Job</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid item xs={12}>
              <TextField
                disabled
                fullWidth
                margin="normal"
                label="Ship"
                value={editJob ? getShipName(editJob.shipId) : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                disabled
                fullWidth
                margin="normal"
                label="Component"
                value={editJob ? getComponentName(editJob.componentId) : ""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="status"
                label="Status"
                value={jobFormData.status}
                onChange={handleInputChange}
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
                name="priority"
                label="Priority"
                value={jobFormData.priority}
                onChange={handleInputChange}
                select
                fullWidth
                margin="normal"
              >
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="assignedEngineerId"
                label="Assigned Engineer"
                value={jobFormData.assignedEngineerId}
                onChange={handleInputChange}
                select
                fullWidth
                margin="normal"
              >
                <MenuItem value="3">Engineer (engineer@entnt.in)</MenuItem>
                <MenuItem value="">Unassigned</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default JobsPage;
