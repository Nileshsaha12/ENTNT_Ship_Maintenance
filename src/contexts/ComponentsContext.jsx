import { createContext, useContext, useState, useEffect } from 'react';
import { getData, saveData, generateId } from '../utils/localStorageUtils';
import { useNotifications } from './NotificationsContext';

const ComponentsContext = createContext();

export const useComponents = () => useContext(ComponentsContext);

export const ComponentsProvider = ({ children }) => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    setComponents(getData('components'));
    setLoading(false);
  }, []);

  const addComponent = (componentData) => {
    const newComponent = {
      id: generateId('c'),
      ...componentData,
      installDate: componentData.installDate || new Date().toISOString().slice(0, 10),
      lastMaintenanceDate: componentData.lastMaintenanceDate || new Date().toISOString().slice(0, 10)
    };
    
    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);
    saveData('components', updatedComponents);
    
    addNotification({
      id: generateId('n'),
      type: 'info',
      message: `Component ${newComponent.name} has been added to ship`,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    return newComponent;
  };

  const updateComponent = (id, componentData) => {
    const updatedComponents = components.map(component => 
      component.id === id ? { ...component, ...componentData } : component
    );
    
    setComponents(updatedComponents);
    saveData('components', updatedComponents);
    
    addNotification({
      id: generateId('n'),
      type: 'info',
      message: `Component ${componentData.name} has been updated`,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    return updatedComponents.find(component => component.id === id);
  };

  const deleteComponent = (id) => {
    const componentToDelete = components.find(component => component.id === id);
    const updatedComponents = components.filter(component => component.id !== id);
    
    setComponents(updatedComponents);
    saveData('components', updatedComponents);
    
    // Delete associated jobs
    const jobs = getData('jobs');
    const filteredJobs = jobs.filter(job => job.componentId !== id);
    saveData('jobs', filteredJobs);
    
    addNotification({
      id: generateId('n'),
      type: 'warning',
      message: `Component ${componentToDelete.name} has been deleted`,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    return true;
  };

  const getComponentById = (id) => {
    return components.find(component => component.id === id) || null;
  };

  const getComponentsByShipId = (shipId) => {
    return components.filter(component => component.shipId === shipId);
  };

  const getComponentsWithOverdueMaintenance = () => {
    const today = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    return components.filter(component => {
      const lastMaintDate = new Date(component.lastMaintenanceDate);
      return lastMaintDate < sixMonthsAgo;
    });
  };

  const value = {
    components,
    loading,
    addComponent,
    updateComponent,
    deleteComponent,
    getComponentById,
    getComponentsByShipId,
    getComponentsWithOverdueMaintenance
  };

  return (
    <ComponentsContext.Provider value={value}>
      {children}
    </ComponentsContext.Provider>
  );
};
