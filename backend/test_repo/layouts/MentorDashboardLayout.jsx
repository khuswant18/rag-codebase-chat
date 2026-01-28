import { Outlet } from "react-router-dom";
import MentorSidebar from "./MentorSidebar";
import MentorHeader from "./MentorHeader";

const MentorDashboardLayout = () => {
  return (
    <div className="flex h-screen bg-white">
      <MentorSidebar />

      <div className="flex-1 flex flex-col">
        <MentorHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MentorDashboardLayout;
