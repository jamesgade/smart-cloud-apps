import React, { useLayoutEffect } from 'react';
import { useLocation } from 'react-router';

const BASE_URL = 'https://campusyatra.com';

// Route to SEO configuration mapping
const routeSEOConfig: Record<string, { title: string; description: string; canonical: string }> = {
  '/': {
    title: 'CampusYatra - College Admission & Career Guidance Platform in India',
    description: 'Get expert counseling, direct admissions & personalized guidance for top Indian universities. CampusYatra simplifies your college admission journey.',
    canonical: `${BASE_URL}/`,
  },
  '/home': {
    title: 'CampusYatra - College Admission & Career Guidance Platform in India',
    description: 'Get expert counseling, direct admissions & personalized guidance for top Indian universities. CampusYatra simplifies your college admission journey.',
    canonical: `${BASE_URL}/home`,
  },
  '/colleges-and-universities': {
    title: 'Top Colleges & Universities in India | CampusYatra',
    description: 'Explore India\'s top colleges and universities with CampusYatra. Compare fees, courses, and ratings to find the best fit for your career goals.',
    canonical: `${BASE_URL}/colleges-and-universities`,
  },
  '/colleges': {
    title: 'Top Colleges & Universities in India | CampusYatra',
    description: 'Explore India\'s top colleges and universities with CampusYatra. Compare fees, courses, and ratings to find the best fit for your career goals.',
    canonical: `${BASE_URL}/colleges`,
  },
  '/courses': {
    title: 'Top Courses in India | Explore Engineering, Technology & More | CampusYatra',
    description: 'Explore 100+ courses across Engineering, Technology, and other major streams. Find your passion and build a successful career with CampusYatra\'s complete course catalog.',
    canonical: `${BASE_URL}/courses`,
  },
  '/exams': {
    title: 'Entrance Exams 2026: Dates, Schedules & Updates | CampusYatra',
    description: 'Check all 2026 entrance exam dates, schedules, and deadlines for Engineering, Medical, Management, and Law admissions. Stay updated with CampusYatra\'s admission calendar.',
    canonical: `${BASE_URL}/exams`,
  },
  '/scholarships': {
    title: 'Scholarships in India 2026 | Merit, Need & Special Category Awards | CampusYatra',
    description: 'Discover top scholarships in India for 2026. Explore merit-based, need-based, and special category scholarships to fund your education with CampusYatra.',
    canonical: `${BASE_URL}/scholarships`,
  },
  '/services': {
    title: 'College Admission & Career Guidance Services | CampusYatra',
    description: 'CampusYatra offers expert counseling, personalized mentorship, and scholarship guidance to help students find their perfect college and career path in India.',
    canonical: `${BASE_URL}/services`,
  },
  '/blogs': {
    title: 'Education Blogs & Career Insights | CampusYatra',
    description: 'Read expert blogs on education, career guidance, exams, scholarships, and study abroad tips. Stay updated with the latest insights from CampusYatra.',
    canonical: `${BASE_URL}/blogs`,
  },
  '/study-abroad': {
    title: 'Study Abroad 2026 | Top Destinations, Universities & Scholarships | CampusYatra',
    description: 'Explore world-class study abroad opportunities in the USA, UK, Canada, Australia, Germany & Singapore. Get expert guidance on admissions, visas, and scholarships with CampusYatra.',
    canonical: `${BASE_URL}/study-abroad`,
  },
  '/education-loans': {
    title: 'Education Loans in India 2026 | Compare Bank Interest Rates & Apply Online | CampusYatra',
    description: 'Explore top education loan options in India for 2026. Compare interest rates, eligibility, and benefits from major banks. Get expert help to finance your studies with CampusYatra.',
    canonical: `${BASE_URL}/education-loans`,
  },
  '/dashboard': {
    title: 'Dashboard | CampusYatra',
    description: 'Access your personalized dashboard to manage your college applications, appointments, and academic journey.',
    canonical: `${BASE_URL}/dashboard`,
  },
  '/book-counselling': {
    title: 'Book Counselling Session | CampusYatra',
    description: 'Book a personalized counseling session with our expert counselors. Get guidance on college admissions and career planning.',
    canonical: `${BASE_URL}/book-counselling`,
  },
  '/examinations': {
    title: 'Entrance Examinations | CampusYatra',
    description: 'View all entrance examinations, exam dates, application windows, and important information for college admissions.',
    canonical: `${BASE_URL}/examinations`,
  },
};

// Default SEO configuration
const defaultSEO = {
  title: 'CampusYatra - College Admission & Career Guidance Platform in India',
  description: 'Get expert counseling, direct admissions & personalized guidance for top Indian universities. CampusYatra simplifies your college admission journey.',
  canonical: BASE_URL,
};

export const SEOHead: React.FC = () => {
  const location = useLocation();
  const pathname = location?.pathname || (typeof window !== 'undefined' ? window.location.pathname : '');

  useLayoutEffect(() => {
    if (typeof document === 'undefined' || !pathname) return;
    
    // Handle dynamic routes (e.g., /blogs/:slug, /blog/:slug)
    let routeKey = pathname;
    let canonicalUrl = `${BASE_URL}${pathname}`;
    
    // Match blog routes
    if (pathname.match(/^\/blogs?\/[^/]+$/)) {
      routeKey = '/blogs';
      canonicalUrl = `${BASE_URL}${pathname}`;
    }
    
    // Get SEO config for current route or use default
    const baseConfig = routeSEOConfig[routeKey] || defaultSEO;
    const seoConfig = {
      ...baseConfig,
      canonical: baseConfig.canonical || canonicalUrl,
    };

    // Update document title
    document.title = seoConfig.title;

    // Helper function to get or create meta tag
    const getOrCreateMeta = (nameOrProperty: string, isProperty: boolean = false): HTMLMetaElement => {
      const selector = isProperty 
        ? `meta[property="${nameOrProperty}"]` 
        : `meta[name="${nameOrProperty}"]`;
      
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', nameOrProperty);
        } else {
          element.setAttribute('name', nameOrProperty);
        }
        // Insert after viewport meta tag for better organization
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport && viewport.nextSibling) {
          document.head.insertBefore(element, viewport.nextSibling);
        } else {
          document.head.appendChild(element);
        }
      }
      
      return element;
    };

    // Helper function to get or create link tag
    const getOrCreateLink = (rel: string): HTMLLinkElement => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        // Insert after base tag if it exists
        const base = document.querySelector('base');
        if (base && base.nextSibling) {
          document.head.insertBefore(element, base.nextSibling);
        } else {
          document.head.insertBefore(element, document.head.firstChild);
        }
      }
      
      return element;
    };

    // Update canonical link
    const canonicalLink = getOrCreateLink('canonical');
    canonicalLink.setAttribute('href', seoConfig.canonical);

    // Update meta description
    const descriptionMeta = getOrCreateMeta('description');
    descriptionMeta.setAttribute('content', seoConfig.description);

    // Update Open Graph tags
    const ogTitleMeta = getOrCreateMeta('og:title', true);
    ogTitleMeta.setAttribute('content', seoConfig.title);

    const ogDescriptionMeta = getOrCreateMeta('og:description', true);
    ogDescriptionMeta.setAttribute('content', seoConfig.description);

    const ogUrlMeta = getOrCreateMeta('og:url', true);
    ogUrlMeta.setAttribute('content', seoConfig.canonical);

    // Update Twitter card tags
    const twitterTitleMeta = getOrCreateMeta('twitter:title');
    twitterTitleMeta.setAttribute('content', seoConfig.title);

    const twitterDescriptionMeta = getOrCreateMeta('twitter:description');
    twitterDescriptionMeta.setAttribute('content', seoConfig.description);
  }, [pathname]);

  return null;
};

