import { createContext, useContext, useState, useEffect } from 'react';
import { getData, saveData, generateId } from '../utils/localStorageUtils';
import { useNotifications } from './NotificationsContext';

const JobsContext = createContext();

export const useJobs = () => useContext(JobsContext);

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    setJobs(getData('jobs'));
    setLoading(false);
  }, []);

  const addJob = (jobData) => {
    const newJob = {
      id: generateId('j'),
      ...jobData,
      status: jobData.status || 'Open',
      scheduledDate: jobData.scheduledDate || new Date().toISOString().slice(0, 10)
    };
    
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    saveData('jobs', updatedJobs);
    
    addNotification({
      id: generateId('n'),
      type: 'info',
      message: `New ${newJob.type} job created with ${newJob.priority} priority`,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    return newJob;
  };

  const updateJob = (id, jobData) => {
    const currentJob = jobs.find(job => job.id === id);
    const updatedJob = { ...currentJob, ...jobData };
    const updatedJobs = jobs.map(job => 
      job.id === id ? updatedJob : job
    );
    
    setJobs(updatedJobs);
    saveData('jobs', updatedJobs);
    
    // If status was updated, create a notification
    if (jobData.status && jobData.status !== currentJob.status) {
      addNotification({
        id: generateId('n'),
        type: jobData.status === 'Completed' ? 'success' : 'info',
        message: `Job status updated to ${jobData.status}`,
        timestamp: new Date().toISOString(),
        read: false
      });
      
      // If the job is completed, update the component's last maintenance date
      if (jobData.status === 'Completed') {
        const components = getData('components');
        const updatedComponents = components.map(component => {
          if (component.id === currentJob.componentId) {
            return {
              ...component,
              lastMaintenanceDate: new Date().toISOString().slice(0, 10)
            };
          }
          return component;
        });
        saveData('components', updatedComponents);
      }
    }
    
    return updatedJob;
  };

  const deleteJob = (id) => {
    const jobToDelete = jobs.find(job => job.id === id);
    const updatedJobs = jobs.filter(job => job.id !== id);
    
    setJobs(updatedJobs);
    saveData('jobs', updatedJobs);
    
    addNotification({
      id: generateId('n'),
      type: 'warning',
      message: `Maintenance job has been deleted`,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    return true;
  };

  const getJobById = (id) => {
    return jobs.find(job => job.id === id) || null;
  };

  const getJobsByShipId = (shipId) => {
    return jobs.filter(job => job.shipId === shipId);
  };

  const getJobsByComponentId = (componentId) => {
    return jobs.filter(job => job.componentId === componentId);
  };
  
  const getJobsByStatus = (status) => {
    return jobs.filter(job => job.status === status);
  };
  
  const getJobsByPriority = (priority) => {
    return jobs.filter(job => job.priority === priority);
  };
  
  const getJobsForDate = (date) => {
    const formattedDate = date instanceof Date 
      ? date.toISOString().slice(0, 10) 
      : date;
      
    return jobs.filter(job => job.scheduledDate === formattedDate);
  };

  const getJobsForRange = (startDate, endDate) => {
    return jobs.filter(job => {
      const jobDate = new Date(job.scheduledDate);
      return jobDate >= new Date(startDate) && jobDate <= new Date(endDate);
    });
  };

  const value = {
    jobs,
    loading,
    addJob,
    updateJob,
    deleteJob,
    getJobById,
    getJobsByShipId,
    getJobsByComponentId,
    getJobsByStatus,
    getJobsByPriority,
    getJobsForDate,
    getJobsForRange
  };

  return (
    <JobsContext.Provider value={value}>
      {children}
    </JobsContext.Provider>
  );
};
