import { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { useJobs } from '../contexts/JobsContext';
import { useShips } from '../contexts/ShipsContext';
import { useComponents } from '../contexts/ComponentsContext';

const CalendarPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const calendarRef = useRef(null);
  
  const { jobs } = useJobs();
  const { ships } = useShips();
  const { components } = useComponents();
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Format jobs data for the calendar
  const events = jobs.map(job => {
    const ship = ships.find(s => s.id === job.shipId);
    const component = components.find(c => c.id === job.componentId);
    
    // Generate colors based on priority
    let backgroundColor, borderColor, textColor;
    switch(job.priority) {
      case 'High':
        backgroundColor = theme.palette.error.light;
        borderColor = theme.palette.error.main;
        textColor = theme.palette.error.contrastText;
        break;
      case 'Medium':
        backgroundColor = theme.palette.warning.light;
        borderColor = theme.palette.warning.main;
        textColor = theme.palette.warning.contrastText;
        break;
      case 'Low':
        backgroundColor = theme.palette.info.light;
        borderColor = theme.palette.info.main;
        textColor = theme.palette.info.contrastText;
        break;
      default:
        backgroundColor = theme.palette.primary.light;
        borderColor = theme.palette.primary.main;
        textColor = theme.palette.primary.contrastText;
    }
    
    return {
      id: job.id,
      title: `${job.type} - ${ship?.name || 'Unknown Ship'}`,
      start: job.scheduledDate,
      allDay: true,
      backgroundColor,
      borderColor,
      textColor,
      extendedProps: {
        job,
        ship,
        component
      }
    };
  });
  
  // Handle event click
  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setOpenDialog(true);
  };
  
  // Handle date click
  const handleDateClick = (arg) => {
    // If you want to do something when a date is clicked
    console.log('Date clicked:', arg.dateStr);
  };
  
  // Close event detail dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Get status color
  const getStatusColor = (status) => {
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
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Maintenance Calendar
        </Typography>
      </Box>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ height: isMobile ? 'auto' : 700 }}>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView={isMobile ? 'listMonth' : 'dayGridMonth'}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,listMonth'
            }}
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
            height="100%"
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
            buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week',
              list: 'List'
            }}
            firstDay={0} // Sunday
            nowIndicator={true}
            dayMaxEvents={3} // Show 'more' link when too many events
            views={{
              dayGrid: {
                dayMaxEvents: 3
              },
              timeGrid: {
                dayMaxEvents: true
              }
            }}
            // Make the calendar look nicer
            eventBorderRadius={4}
            eventDisplay="block"
            dayHeaderFormat={{ weekday: 'short' }}
            slotLabelFormat={{
              hour: 'numeric',
              minute: '2-digit',
              omitZeroMinute: false,
              meridiem: 'short'
            }}
          />
        </Box>
      </Paper>
      
      {/* Event Detail Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle sx={{ 
              borderLeft: 6, 
              borderLeftColor: selectedEvent.extendedProps.job.priority === 'High' 
                ? 'error.main' 
                : selectedEvent.extendedProps.job.priority === 'Medium' 
                  ? 'warning.main' 
                  : 'info.main',
              pl: 3
            }}>
              {selectedEvent.title}
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                      Status:
                    </Typography>
                    <Chip 
                      label={selectedEvent.extendedProps.job.status} 
                      color={getStatusColor(selectedEvent.extendedProps.job.status)}
                      size="small"
                    />
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Ship</Typography>
                      <Typography variant="body1">{selectedEvent.extendedProps.ship?.name || 'Unknown Ship'}</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Component</Typography>
                      <Typography variant="body1">{selectedEvent.extendedProps.component?.name || 'Unknown Component'}</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Job Type</Typography>
                      <Typography variant="body1">{selectedEvent.extendedProps.job.type}</Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Priority</Typography>
                      <Typography 
                        variant="body1" 
                        color={selectedEvent.extendedProps.job.priority === 'High' 
                          ? 'error.main' 
                          : selectedEvent.extendedProps.job.priority === 'Medium' 
                            ? 'warning.main' 
                            : 'info.main'}
                      >
                        {selectedEvent.extendedProps.job.priority}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Scheduled Date</Typography>
                      <Typography variant="body1">
                        {new Date(selectedEvent.extendedProps.job.scheduledDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">Assigned To</Typography>
                      <Typography variant="body1">
                        {selectedEvent.extendedProps.job.assignedEngineerId ? 'Engineer' : 'Unassigned'}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  {selectedEvent.extendedProps.component && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>Component Details</Typography>
                      
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">Serial Number</Typography>
                          <Typography variant="body1">{selectedEvent.extendedProps.component.serialNumber}</Typography>
                        </Grid>
                        
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" color="text.secondary">Installation Date</Typography>
                          <Typography variant="body1">
                            {new Date(selectedEvent.extendedProps.component.installDate).toLocaleDateString()}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">Last Maintenance Date</Typography>
                          <Typography variant="body1">
                            {new Date(selectedEvent.extendedProps.component.lastMaintenanceDate).toLocaleDateString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default CalendarPage;
