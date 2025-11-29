import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router';
import { CircularProgress, Box } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Refine } from '@refinedev/core';
import { RefineSnackbarProvider } from '@refinedev/mui';
import routerBindings from '@refinedev/react-router';
import { ColorModeContextProvider } from './contexts/ColorModeContext';
import './app.module.scss';
import AuthLayout from './components/Layout/AuthLayout';
import { SEOHead } from '../components/SEOHead';
import { authProvider } from './libs/authProvider';
import { API_BASE_URL } from './libs/constants';
import axiosInstance from './libs/axiosInstance';
import { customDataProvider } from './libs/customDataProvider';

// Create a QueryClient for React Query (needed for Refine hooks like useLogin)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Lazy load heavy Refine dependencies - only load when needed
const RefineApp = lazy(() => import('./RefineApp'));

// Lazy load landing page and public pages - these don't need Refine
const LandingPage = React.lazy(() => import('./modules/landing-page'));
const CollegesPage = React.lazy(() => import('./pages/CollegesPage'));
const CoursesPage = React.lazy(() => import('./pages/CoursesPage'));
const ExamsPage = React.lazy(() => import('./pages/ExamsPage'));
const ScholarshipsPage = React.lazy(() => import('./pages/ScholarshipsPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const StudyAbroadPage = React.lazy(() => import('./pages/StudyAbroadPage'));
const EducationLoansPage = React.lazy(() => import('./pages/EducationLoansPage'));
const BlogsListPage = React.lazy(() => import('./pages/Blogs/BlogsListPage'));
const BlogDetailPage = React.lazy(() => import('./pages/Blogs/BlogDetailPage'));
const TermsAndConditionsPage = React.lazy(() => import('./pages/TermsAndConditionsPage'));

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

const App: React.FC = () => {
  // const { setCompanyName, setCompanyId, companyName } = useAppContext();

  // useEffect(() => {
  //   const getConfig = async () => {
  //     const response = await axiosInstance.get(`${API_BASE_URL}/api/domains/${APP_DOMAIN}/config`);
  //     const data = response?.data?.data;
  //     setCompanyName(data?.companyName)
  //     setCompanyId(data?.companyId)
  //   }
  //   getConfig();
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeContextProvider>
        <CssBaseline />
        <GlobalStyles styles={{ html: { WebkitFontSmoothing: 'auto' } }} />
        <BrowserRouter basename="/">
          {/* Minimal Refine setup for LoginForm to work on public routes */}
          <RefineSnackbarProvider>
            <Refine
              dataProvider={{
                default: customDataProvider(`${API_BASE_URL}`, axiosInstance),
              }}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={[]}
              options={{}}
            >
              <SEOHead />
              <Routes>
          {/* Public routes - don't need Refine, load faster */}
          <Route
            element={
              <AuthLayout>
                <Outlet />
              </AuthLayout>
            }
          >
            <Route 
              path="/" 
              element={
                <LazyRoute>
                  <LandingPage />
                </LazyRoute>
              } 
            />
            <Route 
              path="/home" 
              element={
                <LazyRoute>
                  <LandingPage />
                </LazyRoute>
              } 
            />
            <Route
              path="/colleges-and-universities"
              element={
                <LazyRoute>
                  <CollegesPage />
                </LazyRoute>
              }
            />
            <Route 
              path="/courses" 
              element={
                <LazyRoute>
                  <CoursesPage />
                </LazyRoute>
              } 
            />
            <Route 
              path="/exams" 
              element={
                <LazyRoute>
                  <ExamsPage />
                </LazyRoute>
              } 
            />
            <Route
              path="/scholarships"
              element={
                <LazyRoute>
                  <ScholarshipsPage />
                </LazyRoute>
              }
            />
            <Route 
              path="/services" 
              element={
                <LazyRoute>
                  <ServicesPage />
                </LazyRoute>
              } 
            />
            <Route 
              path="/blogs" 
              element={
                <LazyRoute>
                  <BlogsListPage />
                </LazyRoute>
              } 
            />
            <Route 
              path="/blogs/:slug" 
              element={
                <LazyRoute>
                  <BlogDetailPage />
                </LazyRoute>
              } 
            />
            <Route 
              path="/blog/:slug" 
              element={
                <LazyRoute>
                  <BlogDetailPage />
                </LazyRoute>
              } 
            />
            <Route
              path="/study-abroad"
              element={
                <LazyRoute>
                  <StudyAbroadPage />
                </LazyRoute>
              }
            />
            <Route
              path="/education-loans"
              element={
                <LazyRoute>
                  <EducationLoansPage />
                </LazyRoute>
              }
            />
            <Route
              path="/terms-and-conditions"
              element={
                <LazyRoute>
                  <TermsAndConditionsPage />
                </LazyRoute>
              }
            />
          </Route>
          
          {/* All authenticated/admin routes - lazy load Refine */}
          <Route
            path="*"
            element={
              <LazyRoute>
                <RefineApp />
              </LazyRoute>
            }
          />
              </Routes>
            </Refine>
          </RefineSnackbarProvider>
        </BrowserRouter>
      </ColorModeContextProvider>
    </QueryClientProvider>
  );
};

export default App;
