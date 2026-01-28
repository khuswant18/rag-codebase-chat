import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  UserRoundPlus,
  Gift,
  Landmark,
  Star,
  Settings,
  CalendarPlus,
  HelpCircle,
  User,
  Clock,
  Tag,
  UserPen,
  IndianRupee,
  CalendarMinus2,
  MessageSquareMore

} from "lucide-react";

import SettingsModal from "@/pages/MentorDashboardLayout.jsx/SettingsModal";

const MentorSidebar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState("availability");

  const navItems = [
    { name: "Home", path: "/dashboard/mentor", icon: Home },
    { name: "My Meetings", path: "/dashboard/mentor/meetings", icon: CalendarMinus2 },
    { name: "Messages", path: "/dashboard/mentor/messages", icon: MessageSquareMore },
    { name: "Get Mentees", path: "/dashboard/mentor/get-mentees", icon: UserRoundPlus },
    { name: "My Payouts", path: "/dashboard/mentor/payouts", icon: Landmark },
    { name: "Help Center", path: "/dashboard/mentor/help", icon: HelpCircle },
    // { name: "Referrals", path: "/dashboard/mentor/referrals", icon: Gift }, 
    { name: "Testimonials", path: "/dashboard/mentor/testimonials", icon: Star },
    // { name: "Service Request", path: "/dashboard/mentor/service", icon: HelpCircle },
  ];   

  const handleOpenSettings = (tab) => {
    setDefaultTab(tab);
    setIsSettingsOpen(true);
  };

  const configItems = [
    { name: "Edit Profile", icon: Settings, action: () => handleOpenSettings("profile") },
    { name: "My Availability", icon: CalendarPlus, action: () => handleOpenSettings("availability") },
    { name: "Pricing", icon: IndianRupee, action: () => handleOpenSettings("pricing") }, 
  ]; 

  return (
    <>
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="/mentorMapLogo.png"
              alt="MentorMap"
              className="w-8 h-8 object-contain"
            />
            <NavLink to='/' className="text-xl font-bold text-gray-900">MentorMap</NavLink>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4"> 
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard/mentor"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "text-blue-600 bg-blue-50 border-r-2 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`
              }
            > 
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto text-xs text-red-500 font-medium">{item.badge}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-gray-200 py-4 px-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Configure
          </h3>
          {configItems.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors cursor-pointer"
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
              {item.badge && (
                <span className="ml-auto text-xs text-red-500 font-medium">{item.badge}</span>
              )}
            </button>
          ))}
        </div>
      </aside>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => {
          setIsSettingsOpen(false);
          setDefaultTab("availability");
        }} 
        defaultTab={defaultTab}
      />
    </>
  );
};

export default MentorSidebar;
