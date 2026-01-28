import UserDashboardSidebar from "./UserDashboardSidebar";
import UserDashboardHeader from "./UserDashboardHeader";

export const UserDashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex w-full">
      <UserDashboardSidebar /> 

      <div className="flex-1 flex flex-col">
        <UserDashboardHeader />

        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}; 

export default UserDashboardLayout;
