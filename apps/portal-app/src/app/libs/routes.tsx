import LandingPage from "../modules/landing-page";
import CollegesPage from "../pages/CollegesPage";
import CoursesPage from "../pages/CoursesPage";
import ExamsPage from "../pages/ExamsPage";
import ScholarshipsPage from "../pages/ScholarshipsPage";
import ServicesPage from "../pages/ServicesPage";
import BlogsPage from "../pages/BlogsPage";
import StudyAbroadPage from "../pages/StudyAbroadPage";
import EducationLoansPage from "../pages/EducationLoansPage";
import ForgotPassword from "../components/ForgotPassword";
import TermsAndConditionsPage from "../pages/TermsAndConditionsPage";

export const publicRoutes = [
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: '/home',
        element: <LandingPage />
    },
    {
        path: '/college',
        element: <CollegesPage />
    },
    {
        path: '/courses',
        element: <CoursesPage />
    },
    {
        path: '/exams',
        element: <ExamsPage />
    },
    {
        path: '/scholarships',
        element: <ScholarshipsPage />
    },
    {
        path: '/services',
        element: <ServicesPage />
    },
    {
        path: '/blogs',
        element: <BlogsPage />
    },
    {
        path: '/study abroad',
        element: <StudyAbroadPage />
    },
    {
        path: '/education-loans',
        element: <EducationLoansPage />
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />
    },
    {
        path: '/terms-and-conditions',
        element: <TermsAndConditionsPage />
    },
];
