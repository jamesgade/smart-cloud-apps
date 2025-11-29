import React, { useEffect, Suspense, lazy } from "react";
import { Box, CircularProgress } from "@mui/material";
// Header and Footer are handled by AuthLayout

// Critical above-the-fold content - load immediately
import HeroSection from "./HeroSection";

// Lazy load below-the-fold content for better initial load
const HowItWorks = lazy(() => import("./HowItWorks"));
const PartnerInstitutions = lazy(() => import("./PartnerInstitutions"));
const CourseCatalog = lazy(() => import("./CourseCatalog"));
const ScholarshipInfo = lazy(() => import("./ScholarshipInfo"));
const AdmissionCalendar = lazy(() => import("./AdmissionCalendar"));
const ChatBot = lazy(() => import("./ChatBot"));

// Loading fallback for lazy components
const SectionLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
    <CircularProgress size={24} />
  </Box>
);

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'white',
        color: 'black',
        // Smooth scrolling
        scrollBehavior: 'smooth',
        // Mobile optimizations
        WebkitOverflowScrolling: 'touch',
        // Prevent horizontal scroll on mobile
        overflowX: 'hidden',
        maxWidth: '100vw'
      }}
    >
      {/* Hero Section - Critical, load immediately */}
      <HeroSection />

      {/* Below-the-fold sections - lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <HowItWorks />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <PartnerInstitutions />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <CourseCatalog />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <ScholarshipInfo />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <AdmissionCalendar />
      </Suspense>

      {/* Chat Bot - Load after main content */}
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>

      {/* Footer is handled by AuthLayout */}
    </Box>
  );
};

export default LandingPage;
