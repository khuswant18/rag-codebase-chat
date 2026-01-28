import { NavLink } from "react-router-dom";
import {
  Home,
  CalendarMinus2,
  CreditCard,
  HelpCircle,
} from "lucide-react";

const navigationItems = [
  { name: "Home", icon: Home, path: "/dashboard" },
  { name: "Meetings", icon: CalendarMinus2, path: "/dashboard/meetings" },
  { name: "Payments", icon: CreditCard, path: "/dashboard/payments" },
  { name: "Help Center", icon: HelpCircle, path: "/dashboard/help" },
];

const UserDashboardSidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img
            src="/mentorMapLogo.png"
            alt="MentorMap"
            className="w-8 h-8 object-contain cursor-pointer"
          />
          <NavLink to='/' className="text-xl font-semibold text-gray-900">MentorMap</NavLink>
        </div> 
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default UserDashboardSidebar;
