import React, { Suspense } from 'react';
import { Authenticated, Refine } from '@refinedev/core';
import { RefineKbar, RefineKbarProvider } from '@refinedev/kbar';
import { RefineSnackbarProvider } from '@refinedev/mui';
import routerBindings, {
  CatchAllNavigate,
  NavigateToResource,
  UnsavedChangesNotifier,
} from '@refinedev/react-router';
import { customDataProvider } from './libs/customDataProvider';
import { Outlet, Route, Routes } from 'react-router';
import { authProvider } from './libs/authProvider';
import { API_BASE_URL } from './libs/constants';
import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { customNotificationProvider } from './libs/notificationProvider';
import { appResources } from './libs/appResources';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axiosInstance from './libs/axiosInstance';
import AppLayout from './components/Layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { Box, CircularProgress } from '@mui/material';
import { SEOHead } from '../components/SEOHead';

// Lazy load all route components for code splitting
const AdminLogin = React.lazy(() => import('@smart-cloud-apps/portal-feature').then(module => ({ default: module.AdminLogin })));
const UserList = React.lazy(() => import('@smart-cloud-apps/portal-feature').then(module => ({ default: module.UserList })));
const ActiveProvider = React.lazy(() => import('@smart-cloud-apps/portal-feature').then(module => ({ default: module.ActiveProvider })));
const Calendar = React.lazy(() => import('@smart-cloud-apps/portal-feature').then(module => ({ default: module.Calendar })));
const CollegeList = React.lazy(() => import('@smart-cloud-apps/portal-feature').then(module => ({ default: module.CollegeList })));
const StudentsListPage = React.lazy(() => import('@smart-cloud-apps/portal-feature').then(module => ({ default: module.StudentsListPage })));
const LoanList = React.lazy(() => import('@smart-cloud-apps/portal-feature').then(module => ({ default: module.LoanList })));
const ScholarshipList = React.lazy(() => import('@smart-cloud-apps/portal-feature').then(module => ({ default: module.ScholarshipList })));
const FollowupsPage = React.lazy(() => import('@smart-cloud-apps/portal-feature').then(module => ({ default: module.FollowupsPage })));
const ChatBotList = React.lazy(() => import('@smart-cloud-apps/portal-feature').then(module => ({ default: module.ChatBotList })));
const Dashboard = React.lazy(() => import('@smart-cloud-apps/portal-feature').then(module => ({ default: module.Dashboard })));
const ExamsList = React.lazy(() => import('@smart-cloud-apps/portal-feature').then(module => ({ default: module.ExamsList })));
const BlogList = React.lazy(() => import('@smart-cloud-apps/portal-feature').then(module => ({ default: module.BlogList })));
const CollegeCompare = React.lazy(() => import('./components/CollegeCompare'));
const StudentLoansList = React.lazy(() => import('./components/StudentLoansList'));
const StudentScholarshipsList = React.lazy(() => import('./components/StudentScholarshipsList'));
const NotificationsAlerts = React.lazy(() => import('./components/NotificationsAlerts'));
const MessagingWrapper = React.lazy(() => import('./components/MessagingWrapper'));
const BlogsListPage = React.lazy(() => import('./pages/Blogs/BlogsListPage'));
const BlogDetailPage = React.lazy(() => import('./pages/Blogs/BlogDetailPage'));
const CollegesPage = React.lazy(() => import('./pages/CollegesPage'));
const StudentExamsList = React.lazy(() => import('./components/StudentExamsList'));
const AppointmentsList = React.lazy(() => import('./modules/counselling').then(module => ({ default: module.AppointmentsList })));
const CoursesPage = React.lazy(() => import('./pages/CoursesPage'));
const ExamsPage = React.lazy(() => import('./pages/ExamsPage'));
const ScholarshipsPage = React.lazy(() => import('./pages/ScholarshipsPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const StudyAbroadPage = React.lazy(() => import('./pages/StudyAbroadPage'));
const EducationLoansPage = React.lazy(() => import('./pages/EducationLoansPage'));
const VideoCallRoom = React.lazy(() => import('./modules/video-call/VideoCallRoom'));
const ComingSoonPage = React.lazy(() => import('./pages/ComingSoonPage'));
const ForgotPassword = React.lazy(() => import('./components/ForgotPassword'));

// Loading fallback component
const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

// Helper component to wrap lazy-loaded components with Suspense
const LazyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
);

const RefineApp: React.FC = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <RefineKbarProvider>
        <RefineSnackbarProvider>
          <Refine
            dataProvider={{
              default: customDataProvider(`${API_BASE_URL}`, axiosInstance),
            }}
            notificationProvider={customNotificationProvider}
            routerProvider={routerBindings}
            authProvider={authProvider}
            resources={appResources}
            options={{}}
          >
            <SEOHead />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick={false}
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Bounce}
            />
            <Routes>
              {/* ===================== Authenticated routes =========================== */}
              <Route
                element={
                  <Authenticated
                    key="authenticated-routes"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <AppLayout>
                      <Outlet />
                    </AppLayout>
                  </Authenticated>
                }
              >
                {/* Dashboard - role-specific via wrapper */}
                <Route
                  path="/dashboard"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['DASHBOARD_MENU']}
                      >
                        <Dashboard />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* User Management */}
                <Route
                  path="/providers"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['USER_MANAGEMENT_MENU']}
                      >
                        <UserList />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Leads / Walk-ins */}
                <Route
                  path="/leads-walkins"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['LEADS_WALKINS_MENU']}
                      >
                        <StudentsListPage />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Counselling */}
                <Route
                  path="/counselling"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['COUNSELLING_MENU']}
                      >
                        <AppointmentsList />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Calendar */}
                <Route
                  path="/calendar"
                  element={
                    <LazyRoute>
                      <ProtectedRoute requiredPermissions={['CALENDAR_MENU']}>
                        <Calendar />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />
                <Route
                  path="/chatbot-responses"
                  element={
                    <LazyRoute>
                      <ProtectedRoute requiredPermissions={['CHATBOT_MENU']}>
                        <ChatBotList />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Admissions */}
                <Route
                  path="/admissions"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['ADMISSIONS_MENU']}
                      >
                        <ComingSoonPage
                          title="Admissions"
                          message="The Admissions Management module is currently under development. This feature will allow you to track and manage student admissions efficiently."
                        />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Payments */}
                <Route
                  path="/payments"
                  element={
                    <LazyRoute>
                      <ProtectedRoute requiredPermissions={['PAYMENTS_MENU']}>
                        <ComingSoonPage
                          title="Payments"
                          message="The Payments Management module is currently under development. This feature will allow you to track and manage payment transactions."
                        />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Loans Management */}
                <Route
                  path="/loans-management"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['LOANS_MANAGEMENT_MENU']}
                      >
                        <LoanList />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />
                <Route
                  path="/scholarships-management"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['SCHOLARSHIPS_MANAGEMENT_MENU']}
                      >
                        <ScholarshipList />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Blog Management */}
                <Route
                  path="/blogs-management"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['BLOG_MANAGEMENT_MENU']}
                      >
                        <BlogList />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Reports */}
                <Route
                  path="/exams-management"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['EXAMS_MANAGEMENT_MENU']}
                      >
                        <ExamsList />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                <Route
                  path="/reports"
                  element={
                    <LazyRoute>
                      <ProtectedRoute requiredPermissions={['REPORTS_MENU']}>
                        <ComingSoonPage
                          title="Reports"
                          message="The Reports & Analytics module is currently under development. This feature will provide comprehensive insights and analytics for your institution."
                        />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Notifications / Alerts */}
                <Route
                  path="/notifications"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['NOTIFICATIONS_ALERTS_MENU']}
                      >
                        <NotificationsAlerts />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Loans Overview */}
                <Route
                  path="/loans-overview"
                  element={
                    <ProtectedRoute
                      requiredPermissions={['LOANS_OVERVIEW_MENU']}
                    >
                      <h1>loans overview</h1>
                    </ProtectedRoute>
                  }
                />

                {/* Scholarships Overview */}
                <Route
                  path="/scholarships-overview"
                  element={
                    <ProtectedRoute
                      requiredPermissions={['SCHOLARSHIPS_OVERVIEW_MENU']}
                    >
                      <h1>scholarships overview</h1>
                    </ProtectedRoute>
                  }
                />

                {/* Loans Assistance */}
                <Route
                  path="/loans-assistance"
                  element={
                    <ProtectedRoute
                      requiredPermissions={['LOANS_ASSISTANCE_MENU']}
                    >
                      <h1>loans assistance</h1>
                    </ProtectedRoute>
                  }
                />

                {/* Scholarships Guidance */}
                <Route
                  path="/scholarships-guidance"
                  element={
                    <ProtectedRoute
                      requiredPermissions={['SCHOLARSHIPS_GUIDANCE_MENU']}
                    >
                      <h1>scholarships guidance</h1>
                    </ProtectedRoute>
                  }
                />

                {/* Colleges */}
                <Route
                  path="/colleges"
                  element={
                    <LazyRoute>
                      <ProtectedRoute requiredPermissions={['COLLEGES_MENU']}>
                        <CollegeList />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Compare */}
                <Route
                  path="/compare"
                  element={
                    <LazyRoute>
                      <ProtectedRoute requiredPermissions={['COMPARE_MENU']}>
                        <CollegeCompare />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Book Counselling */}
                <Route
                  path="/book-counselling"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['BOOK_COUNSELLING_MENU']}
                      >
                        <Calendar />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Exams */}
                <Route
                  path="/examinations"
                  element={
                    <LazyRoute>
                      <ProtectedRoute requiredPermissions={['EXAMS_MENU']}>
                        <StudentExamsList />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Education Loans */}
                <Route
                  path="/admin-education-loans"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['EDUCATION_LOANS_MENU']}
                      >
                        <StudentLoansList />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Scholarships */}
                <Route
                  path="/admin-scholarships"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['SCHOLARSHIPS_MENU']}
                      >
                        <StudentScholarshipsList />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Blogs / Latest News - List View */}
                <Route
                  path="/latest-news"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['LATEST_NEWS_MENU']}
                      >
                        <BlogsListPage />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Blog Detail View - Student Route */}
                <Route
                  path="/latest-news/:slug"
                  element={
                    <LazyRoute>
                      <ProtectedRoute
                        requiredPermissions={['LATEST_NEWS_MENU']}
                      >
                        <BlogDetailPage />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Resources / Guides */}
                <Route
                  path="/resources"
                  element={
                    <ProtectedRoute
                      requiredPermissions={['RESOURCES_GUIDES_MENU']}
                    >
                      <h1>resources / guides</h1>
                    </ProtectedRoute>
                  }
                />

                {/* Messages */}
                <Route
                  path="/messages"
                  element={
                    <LazyRoute>
                      <ProtectedRoute requiredPermissions={['MESSAGES_MENU']}>
                        <MessagingWrapper />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Followups */}
                <Route
                  path="/followups"
                  element={
                    <LazyRoute>
                      <ProtectedRoute requiredPermissions={['FOLLOWUP_MENU']}>
                        <FollowupsPage />
                      </ProtectedRoute>
                    </LazyRoute>
                  }
                />

                {/* Settings */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute requiredPermissions={['SETTINGS_MENU']}>
                      <h1>settings</h1>
                    </ProtectedRoute>
                  }
                />

                {/* Video Call Room */}
                <Route
                  path="/video-call/:sessionId"
                  element={
                    <LazyRoute>
                      <VideoCallRoom />
                    </LazyRoute>
                  }
                />

                {/* Legacy student-only routes */}
                <Route
                  path="/my-courses"
                  element={
                    <ProtectedRoute
                      allowedUserTypes={['Student']}
                      requiredPermissions={['VIEW_COURSES']}
                    >
                      <h1>courses</h1>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assignments"
                  element={
                    <ProtectedRoute
                      allowedUserTypes={['Student']}
                      requiredPermissions={['VIEW_ASSIGNMENTS']}
                    >
                      <h1>assignments</h1>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowedUserTypes={['Student']}>
                      <h1>profile</h1>
                    </ProtectedRoute>
                  }
                />
              </Route>
              {/* ========================= Un-Authenticate routes ================= */}
              <Route
                element={
                  <Authenticated
                    key="unauthenticated-routes"
                    fallback={<Outlet />}
                  >
                    <NavigateToResource resource="dashboard" />
                  </Authenticated>
                }
              >
                {/* Admin login route - standalone without AuthLayout */}
                <Route 
                  path="/admin" 
                  element={
                    <LazyRoute>
                      <AdminLogin />
                    </LazyRoute>
                  } 
                />

                {/* Active provider route - standalone without AuthLayout */}
                <Route
                  path="/active-provider"
                  element={
                    <LazyRoute>
                      <ActiveProvider />
                    </LazyRoute>
                  }
                />
                <Route
                    path="/forgot-password"
                    element={
                      <LazyRoute>
                        <ForgotPassword />
                      </LazyRoute>
                    }
                  />
              </Route>
            </Routes>
            <RefineKbar />
            <UnsavedChangesNotifier />
          </Refine>
        </RefineSnackbarProvider>
      </RefineKbarProvider>
    </LocalizationProvider>
  );
};

export default RefineApp;

