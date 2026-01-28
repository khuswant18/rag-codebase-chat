import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Home,
  Calendar,
  HelpCircle,
  LogOut,
  ChevronDown,
  Bell,
  AlertCircle,
  Mail,
  Video,
  Clock,
  Globe,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuthStore from "@/stores/authStore";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

const UserDashboardHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isResending, setIsResending] = useState(false);
  
  const [isNotificationDismissed, setIsNotificationDismissed] = useState(() => {
    if (!user?.email) return false;
    const sessionDismissed = sessionStorage.getItem(`notification-dismissed-${user.email}`);
    return sessionDismissed === 'true';
  });

  const isEmailVerified = user?.isEmailVerified || false;


  const { data: upcomingMeetings = [] } = useQuery({
    queryKey: ['upcoming-meetings-user-notifications'],
    queryFn: async () => {
      const response = await api.get("/meetings");
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
    if (isEmailVerified && isNotificationDismissed) {
      sessionStorage.removeItem(`notification-dismissed-${user?.email}`);
      setIsNotificationDismissed(false);
    }
  }, [isEmailVerified, isNotificationDismissed, user?.email]);

  const shouldShowNotification = !isEmailVerified && !isNotificationDismissed;
  const totalNotifications = shouldShowNotification ? 1 : 0;
  const upcomingMeetingsCount = upcomingMeetings.length;
  const totalNotificationCount = totalNotifications + upcomingMeetingsCount;

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

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        toast.success("Logged out successfully!");
        window.location.href = "/";
      } else {
        toast.error("Failed to logout. Please try again.");
      }
    } catch {
      toast.error("An error occurred during logout.");
      localStorage.removeItem('auth-storage');
      sessionStorage.removeItem('auth-storage');
      window.location.href = "/";
    }
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const response = await api.post("/auth/resend-verification");
      if (response.data.success) {
        toast.success("Verification email sent! Please check your inbox.");
      } else {
        toast.error(response.data.message || "Failed to send verification email.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send verification email.");
    } finally {
      setIsResending(false);
    }
  };

  const handleMarkAsRead = () => {
    if (!user?.email) return;
    sessionStorage.setItem(`notification-dismissed-${user.email}`, 'true');
    setIsNotificationDismissed(true);
    toast.success("Notification dismissed");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div>
        <p className="text-lg font-semibold text-gray-900">Dashboard</p>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Bell className="w-5 h-5 text-gray-600" />
              {totalNotificationCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white"></span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 max-h-[500px] overflow-hidden p-0">
            <DropdownMenuLabel>
              <div className="flex items-center justify-between">
                <span>Notifications</span>
                {totalNotificationCount > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {totalNotificationCount} New
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <div className="max-h-[400px] overflow-y-auto">
              {shouldShowNotification && (
                <div className="p-4 border-b border-gray-200">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">
                          Verify your email address
                        </p>
                        <p className="text-xs text-gray-600">
                          Please verify your email to access all features and secure your account.
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleResendVerification}
                          disabled={isResending}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          {isResending ? "Sending..." : "Resend email"}
                        </button>
                        <span className="text-gray-300">•</span>
                        <button
                          onClick={handleMarkAsRead}
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-700"
                        >
                          Mark as read
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}


              {upcomingMeetings.length > 0 && (
                <div className="py-2">
                  {upcomingMeetings.map((meeting) => {
                    const { date, time, timeUntil } = formatDateTime(meeting.startTime);
                    return (
                      <button
                        key={meeting.id}
                        onClick={() => navigate('/dashboard/meetings')}
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
                              with {meeting.mentor?.name || 'Mentor'}
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
              )}


              {!shouldShowNotification && upcomingMeetings.length === 0 && (
                <div className="p-8 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Bell className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No new notifications</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Your notifications will appear here
                  </p>
                </div>
              )}
            </div>


            {upcomingMeetings.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => navigate('/dashboard/meetings')}
                  className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                >
                  View All Meetings →
                </button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1 pr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer">
              <Avatar className="h-8 w-8">
                {user?.profilePicture ? (
                  <AvatarImage src={user.profilePicture} alt={user?.name} />
                ) : null}
                <AvatarFallback className="bg-blue-600 text-white font-semibold text-sm">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "User"}
                </p>
                <p className="text-xs leading-none text-gray-500">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate("/dashboard")}
              className="cursor-pointer"
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/")}
              className="cursor-pointer"
            >
              <Globe className="mr-2 h-4 w-4" />
              <span>Landing Page</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/dashboard/meetings")}
              className="cursor-pointer"
            >
              <Calendar className="mr-2 h-4 w-4" />
              <span>Meetings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/dashboard/help")}
              className="cursor-pointer"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default UserDashboardHeader;
