import { createContext, useContext } from 'react';

const DashboardDataContext = createContext();

export const DashboardDataProvider = ({ children, data, refetch, cancelMeeting }) => {
  return (
    <DashboardDataContext.Provider value={{ 
      dashboardData: data, 
      refetchDashboard: refetch,
      cancelMeeting 
    }}>
      {children} 
    </DashboardDataContext.Provider>
  );
};

export const useDashboardData = () => {
  const context = useContext(DashboardDataContext);
  if (!context) {
    throw new Error('useDashboardData must be used within a DashboardDataProvider');
  } 
  return context;
}; 