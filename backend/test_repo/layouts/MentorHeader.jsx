import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SettingsModal from "@/pages/MentorDashboardLayout.jsx/SettingsModal";
import useAuthStore from "@/stores/authStore";
import AvatarImage from "@/components/ui/avatar-image";
import { preloadImage } from "@/utils/imageCache";
import api from "@/lib/api";
import {
  Home,
  Calendar,
  MessageSquare,
  Landmark,
  User,
  LogOut,
  ChevronDown,
  Bell,
  Video,
  Clock,
  Globe,
} from "lucide-react";

const MentorHeader = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();


  const { data: profileImage } = useQuery({ 
    queryKey: ['mentor-profile-image'],
    queryFn: async () => { 
      const response = await api.get("/mentor/profile");
      // console.log("mentor_header",response) 
      if (response.data.success && response.data.data) {
        const mentorProfile = response.data.data.mentorProfile || {};
        const imageUrl = mentorProfile.profileImage || null;
        
        if (imageUrl) {
          preloadImage(imageUrl).catch((err) => {
            console.error("Failed to preload image:", err);
          });
        }
         
        return imageUrl; 
      }
      return null;
    },
    staleTime: 5 * 60 * 1000, 
    refetchOnWindowFocus: false,
  });


  const { data: upcomingMeetings = [] } = useQuery({
    queryKey: ['upcoming-meetings-notifications'],
    queryFn: async () => {
      const response = await api.get("/meetings/mentor");
      if (response.data.success && response.data.data) {
        const now = new Date();
        const upcoming = response.data.data.filter(meeting => {
          const startTime = new Date(meeting.startTime);
          return (
            (meeting.status === "pending" || meeting.status === "confirmed") &&
            startTime > now
          );
        });

        return upcoming.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)).slice(0, 5);
      }
      return [];
    },
    staleTime: 2 * 60 * 1000, 
    refetchInterval: 5 * 60 * 1000, 
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      queryClient.invalidateQueries(['mentor-profile-image']);
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);
    return () =>
      window.removeEventListener("profileUpdated", handleProfileUpdate);
  }, [queryClient]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayName = user?.name || "Mentor";

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date - now;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    let timeUntil = '';
    if (diffMins < 60) {
      timeUntil = `in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
    } else if (diffHours < 24) {
      timeUntil = `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    } else {
      timeUntil = `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
    }

    return {
      date: date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      timeUntil
    };
  };

  const menuItems = [
    {
      icon: Home,
      label: "Home",
      onClick: () => {
        navigate("/dashboard/mentor");
        setIsDropdownOpen(false);
      },
    },
    {
      icon: Globe,
      label: "Landing Page",
      onClick: () => {
        navigate("/");
        setIsDropdownOpen(false);
      },
    },
    {
      icon: Calendar,
      label: "Meetings",
      onClick: () => {
        navigate("/dashboard/mentor/meetings");
        setIsDropdownOpen(false);
      },
    },
    {
      icon: MessageSquare,
      label: "Messages",
      onClick: () => {
        navigate("/dashboard/mentor/messages");
        setIsDropdownOpen(false);
      },
    },
    {
      icon: Landmark,
      label: "Payouts",
      onClick: () => {
        navigate("/dashboard/mentor/payouts");
        setIsDropdownOpen(false);
      },
    },
    {
      icon: User,
      label: "Edit Profile",
      onClick: () => {
        setIsDropdownOpen(false);
        setIsSettingsOpen(true);
      },
    },
    {
      icon: LogOut,
      label: "Logout",
      onClick: () => {
        logout();
        navigate("/login");
        setIsDropdownOpen(false);
      },
      danger: true,
    },
  ];

  return (
    <>
      <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-end px-6 gap-4">

        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {upcomingMeetings.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>


          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900">Upcoming Meetings</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {upcomingMeetings.length} session{upcomingMeetings.length !== 1 ? 's' : ''} scheduled
                </p>
              </div>

              <div className="overflow-y-auto flex-1">
                {upcomingMeetings.length > 0 ? (
                  <div className="py-2">
                    {upcomingMeetings.map((meeting) => {
                      const { date, time, timeUntil } = formatDateTime(meeting.startTime);
                      return (
                        <button
                          key={meeting.id}
                          onClick={() => {
                            navigate(`/dashboard/mentor/meetings`);
                            setIsNotificationOpen(false);
                          }}
                          className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <Video className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-medium text-gray-900 text-sm truncate">
                                  {meeting.title || 'Mentorship Session'}
                                </h4>
                                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                                  meeting.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {meeting.status}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">
                                with {meeting.user?.name || 'Mentee'}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {time}
                                </span>
                              </div>
                              <p className="text-xs text-blue-600 font-medium mt-1">
                                {timeUntil}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">No upcoming meetings</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Your scheduled sessions will appear here
                    </p>
                  </div>
                )}
              </div>

              {upcomingMeetings.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => {
                      navigate('/dashboard/mentor/meetings');
                      setIsNotificationOpen(false);
                    }}
                    className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  >
                    View All Meetings →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 transition-colors cursor-pointer"
          >
            <AvatarImage src={profileImage} alt={displayName} size="sm" />
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "mentor@example.com"}
                </p>
              </div>

              <div className="py-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={item.onClick}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors cursor-pointer ${
                        item.danger
                          ? "text-red-600 hover:bg-red-50"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};

export default MentorHeader;
