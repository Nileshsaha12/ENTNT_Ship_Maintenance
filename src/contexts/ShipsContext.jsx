import { createContext, useContext, useState, useEffect } from 'react';
import { getData, saveData, generateId } from '../utils/localStorageUtils';
import { useNotifications } from './NotificationsContext';

const ShipsContext = createContext();

export const useShips = () => useContext(ShipsContext);

export const ShipsProvider = ({ children }) => {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    setShips(getData('ships'));
    setLoading(false);
  }, []);

  const addShip = (shipData) => {
    const newShip = {
      id: generateId('s'),
      ...shipData
    };
    
    const updatedShips = [...ships, newShip];
    setShips(updatedShips);
    saveData('ships', updatedShips);
    addNotification({
      id: generateId('n'),
      type: 'info',
      message: `Ship ${newShip.name} has been added`,
      timestamp: new Date().toISOString(),
      read: false
    });
    return newShip;
  };

  const updateShip = (id, shipData) => {
    const updatedShips = ships.map(ship => 
      ship.id === id ? { ...ship, ...shipData } : ship
    );
    
    setShips(updatedShips);
    saveData('ships', updatedShips);
    addNotification({
      id: generateId('n'),
      type: 'info',
      message: `Ship ${shipData.name} has been updated`,
      timestamp: new Date().toISOString(),
      read: false
    });
    return updatedShips.find(ship => ship.id === id);
  };

  const deleteShip = (id) => {
    const shipToDelete = ships.find(ship => ship.id === id);
    const updatedShips = ships.filter(ship => ship.id !== id);
    
    setShips(updatedShips);
    saveData('ships', updatedShips);
    
    // Delete associated components and jobs
    const components = getData('components');
    const filteredComponents = components.filter(component => component.shipId !== id);
    saveData('components', filteredComponents);
    
    const jobs = getData('jobs');
    const filteredJobs = jobs.filter(job => job.shipId !== id);
    saveData('jobs', filteredJobs);
    
    addNotification({
      id: generateId('n'),
      type: 'warning',
      message: `Ship ${shipToDelete.name} has been deleted`,
      timestamp: new Date().toISOString(),
      read: false
    });
    
    return true;
  };

  const getShipById = (id) => {
    return ships.find(ship => ship.id === id) || null;
  };

  const value = {
    ships,
    loading,
    addShip,
    updateShip,
    deleteShip,
    getShipById
  };

  return (
    <ShipsContext.Provider value={value}>
      {children}
    </ShipsContext.Provider>
  );
};
