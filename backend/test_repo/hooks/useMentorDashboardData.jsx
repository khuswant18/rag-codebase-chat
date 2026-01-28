import { createContext, useContext } from 'react';

const MentorDashboardDataContext = createContext(null);

export const MentorDashboardDataProvider = ({ children, data, cancelMeeting }) => {
  return (
    <MentorDashboardDataContext.Provider value={{ data, cancelMeeting }}>
      {children}
    </MentorDashboardDataContext.Provider>
  );
};

export const useMentorDashboardData = () => {
  const context = useContext(MentorDashboardDataContext);
  if (context === undefined) {
    throw new Error('useMentorDashboardData must be used within a MentorDashboardDataProvider');
  }
  return context;
};
