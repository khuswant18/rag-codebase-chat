import { lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RootLayout from "./RootLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ScrollToTop from "./components/ScrollToTop";
import { SuspenseFallback } from "./components/ui/SuspenseFallback";

const Home = lazy(() => import("./pages/Home"));
const Layout = lazy(() => import("./Layout"));
const Error = lazy(() => import("./Error"));
const CollegeMentorsPage = lazy(() => import("./pages/CollegeMentorsPage"));
const AllMentorsPage = lazy(() => import("./pages/AllMentorsPage"));
const VerifyEmailPage = lazy(() => import("./pages/Auth/VerifyEmailPage"));
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/Auth/SignupPage"));
const UserDashboardContainer = lazy(() => import("./components/UserDashboardContainer"));
const MentorDashboardContainer = lazy(() => import("./components/MentorDashboardContainer"));
const CollegesPage = lazy(() => import("./pages/CollegesPage"));
const MentorMeetings = lazy(() => import("./pages/Mentor/dashboard/Meetings"));
const MentorMessages = lazy(() => import("./pages/Mentor/dashboard/messages"));
const MentorPayouts = lazy(() => import("./pages/Mentor/dashboard/Payouts"));
const MentorTestimonials = lazy(() => import("./pages/Mentor/dashboard/Testimonials"));
const MentorGetMentees = lazy(() => import("./pages/Mentor/dashboard/GetMentees"));
const MentorHelp = lazy(() => import("./pages/Mentor/dashboard/Help"));
const MentorDashboard = lazy(() => import("./pages/Mentor/dashboard/Home"));
const BecomeMentor = lazy(() => import("./pages/BecomeMentor"));
const MentorProfilePage = lazy(() => import("./pages/MentorProfilePage"));
const MeetingRoom = lazy(() => import("./pages/VideoCall"));
const MeetingEnded = lazy(() => import("./pages/MeetingEnded"));
const Meetings = lazy(() => import("./pages/User/userMeeting"));
const Payments = lazy(() => import("./pages/User/userPayment"));
const Help = lazy(() => import("./pages/User/userHelp"));
const UserDashboard = lazy(() => import("./pages/User/Home"));
const AdminDashboard = lazy(() => import("./pages/Admin/AdminDashboard"));

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { Analytics } from '@vercel/analytics/react';
import MentorDashboardLayout from "./layouts/MentorDashboardLayout";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, 
      cacheTime: 10 * 60 * 1000, 
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, 
    children: [
  { 
    path: "login",
    element: (
      <Suspense fallback={<SuspenseFallback message="Loading login page..." />}> 
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "signup",
    element: (
      <Suspense fallback={<SuspenseFallback message="Loading signup page..." />}>
        <PublicRoute>
          <SignupPage />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "profile/:mentorId",
    element: (
      <Suspense fallback={<SuspenseFallback message="Loading mentor profile..." />}>
        <PublicRoute>
          <MentorProfilePage />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/room/:meetingId",
    element: (
      <Suspense fallback={<SuspenseFallback message="Joining meeting room..." />}>
        <MeetingRoom />
      </Suspense>
    ),
  },
  {
    path: "/meeting-ended/:meetingId",
    element: (
      <Suspense fallback={<SuspenseFallback message="Loading meeting summary..." />}>
        <MeetingEnded />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <Suspense fallback={<SuspenseFallback message="Loading MentorMap..." />}>
        <Layout />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<SuspenseFallback message="Loading..." />}>
        <Error />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<SuspenseFallback message="Loading home page..." />}>
            <PublicRoute>
              <Home />
            </PublicRoute>
          </Suspense>
        ),
      },
      {
        path: "colleges",
        element: (
          <Suspense fallback={<SuspenseFallback message="Exploring colleges..." />}>
            <PublicRoute>
              <CollegesPage />
            </PublicRoute>
          </Suspense>
        ),
      },
      {
        path: "mentors",
        element: (
          <Suspense fallback={<SuspenseFallback message="Finding mentors..." />}>
            <PublicRoute>
              <AllMentorsPage />
            </PublicRoute>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "verify-email",
    element: (
      <Suspense fallback={<SuspenseFallback message="Verifying email..." />}>
        <VerifyEmailPage />
      </Suspense>
    ),
  },
  {
    path: "dashboard/admin",
    element: (
      <Suspense fallback={<SuspenseFallback message="Loading admin panel..." />}>
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      </Suspense>
    ),
  },
  {
    path: "terms-and-conditions",
    element: <TermsAndConditions />
  },
  {
    path: "privacy-policy",
    element: <PrivacyPolicy />
  },
  {
    path: "become-mentor",
    element: (
      <Suspense fallback={<SuspenseFallback message="Loading mentor application..." />}>

          <BecomeMentor />

      </Suspense>
    ),
  },
  {
    path: "colleges/:collegeName/mentors",
    element: (
      <Suspense fallback={<SuspenseFallback message="Loading mentors..." />}>
        <PublicRoute restrictMentors={true}>
          <CollegeMentorsPage />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "dashboard",
    element: (
      <Suspense fallback={<SuspenseFallback message="Loading dashboard..." />}>
        <ProtectedRoute requireUser>
          <UserDashboardContainer />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<SuspenseFallback message="Loading your dashboard..." />}>
            <UserDashboard />
          </Suspense>
        ),
      },
      {
        path: "meetings",
        element: (
          <Suspense fallback={<SuspenseFallback message="Loading meetings..." />}>
            <Meetings />
          </Suspense>
        ),
      },
      {
        path: "payments",
        element: (
          <Suspense fallback={<SuspenseFallback message="Loading payments..." />}>
            <Payments />
          </Suspense>
        ),
      },
      {
        path: "help",
        element: (
          <Suspense fallback={<SuspenseFallback message="Loading help center..." />}>
            <Help />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "dashboard/mentor",
    element: (
      <Suspense fallback={<SuspenseFallback message="Loading mentor dashboard..." />}>
        <ProtectedRoute requireMentor>
          <MentorDashboardContainer />
        </ProtectedRoute>
      </Suspense>
    ),
    children: [
      {
        path: "",
        element: <MentorDashboardLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<SuspenseFallback message="Loading dashboard overview..." />}>
                <MentorDashboard />
              </Suspense>
            ),
          },
          {
            path: "meetings",
            element: (
              <Suspense fallback={<SuspenseFallback message="Loading meetings..." />}>
                <MentorMeetings />
              </Suspense>
            ),
          },
          {
            path: "messages",
            element: (
              <Suspense fallback={<SuspenseFallback message="Loading messages..." />}>
                <MentorMessages />
              </Suspense>
            ),
          },
          {
            path: "get-mentees",
            element: (
              <Suspense fallback={<SuspenseFallback message="Loading mentees..." />}>
                <MentorGetMentees />
              </Suspense>
            ),
          },
          {
            path: "payouts",
            element: (
              <Suspense fallback={<SuspenseFallback message="Loading payouts..." />}>
                <MentorPayouts />
              </Suspense>
            ),
          },
          {
            path: "help",
            element: (
              <Suspense fallback={<SuspenseFallback message="Loading help center..." />}>
                <MentorHelp />
              </Suspense>
            ),
          },
          {
            path: "testimonials",
            element: (
              <Suspense fallback={<SuspenseFallback message="Loading testimonials..." />}>
                <MentorTestimonials />
              </Suspense>
            ),
          },
        ],
      },
    ],
  }], 
}]);

const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")).render(
  <>
    <Suspense fallback={<SuspenseFallback message="Initializing MentorMap..." />}>
      <Toaster position="top-right" />
      <GoogleOAuthProvider clientId={clientID}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </Suspense>
    <Analytics />
  </>
);
