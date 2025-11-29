import React from 'react';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  TrendingUp as LeadsIcon,
  Psychology as CounsellingIcon,
  HowToReg as AdmissionsIcon,
  Payment as PaymentsIcon,
  AccountBalance as LoansIcon,
  SchoolOutlined as ScholarshipsIcon,
  Assessment as ReportsIcon,
  Notifications as NotificationsIcon,
  Compare as CompareIcon,
  EventNote as BookCounsellingIcon,
  Quiz as ExamsIcon,
  Article as NewsIcon,
  PhoneCallback as FollowupIcon,
  CalendarToday as CalendarIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import MessagesMenuItem from '../../MessagesMenuItem';

export interface MenuItem {
  id: string;
  title: string;
  messageId: string;
  type: 'group' | 'item' | 'collapse';
  icon?: React.ReactElement;
  path?: string;
  action?: string[];
  children?: MenuItem[];
}

export const routesMenuConfig: MenuItem[] = [
  {
    id: 'App',
    title: '',
    messageId: 'sidebar.app',
    type: 'group',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        messageId: 'sidebar.portal.dashboard',
        type: 'item',
        icon: <DashboardIcon />,
        path: '/dashboard',
        action: ['DASHBOARD_MENU'],
      },
      {
        id: 'user-management',
        title: 'User Management',
        messageId: 'sidebar.portal.user-management',
        type: 'item',
        icon: <PeopleIcon />,
        path: '/providers',
        action: ['USER_MANAGEMENT_MENU'],
      },
      {
        id: 'leads',
        title: 'Leads / Walk-ins',
        messageId: 'sidebar.portal.leads-walkins',
        type: 'item',
        icon: <LeadsIcon />,
        path: '/leads-walkins',
        action: ['LEADS_WALKINS_MENU'],
      },
      {
        id: 'followups',
        title: 'Followups',
        messageId: 'sidebar.portal.followups',
        type: 'item',
        icon: <FollowupIcon />,
        path: '/followups',
        action: ['FOLLOWUP_MENU'],
      },
      {
        id: 'colleges',
        title: 'Colleges',
        messageId: 'sidebar.portal.colleges',
        type: 'item',
        icon: <SchoolIcon />,
        path: '/colleges',
        action: ['COLLEGES_MENU'],
      },
      {
        id: 'counselling',
        title: 'Counselling',
        messageId: 'sidebar.portal.counselling',
        type: 'item',
        icon: <CounsellingIcon />,
        path: '/counselling',
        action: ['COUNSELLING_MENU'],
      },
            {
              id: 'calendar',
              title: 'Calendar',
              messageId: 'sidebar.portal.calendar',
              type: 'item',
              icon: <CalendarIcon />,
              path: '/calendar',
              action: ['CALENDAR_MENU'],
            },
            {
              id: 'chatbot',
              title: 'Chatbot Responses',
              messageId: 'sidebar.portal.chatbot',
              type: 'item',
              icon: <ChatIcon />,
              path: '/chatbot-responses',
              action: ['CHATBOT_MENU'],
            },
      {
        id: 'admissions',
        title: 'Admissions',
        messageId: 'sidebar.portal.admissions',
        type: 'item',
        icon: <AdmissionsIcon />,
        path: '/admissions',
        action: ['ADMISSIONS_MENU'],
      },
      {
        id: 'payments',
        title: 'Payments',
        messageId: 'sidebar.portal.payments',
        type: 'item',
        icon: <PaymentsIcon />,
        path: '/payments',
        action: ['PAYMENTS_MENU'],
      },
      {
        id: 'loans-management',
        title: 'Loans Management',
        messageId: 'sidebar.portal.loans-management',
        type: 'item',
        icon: <LoansIcon />,
        path: '/loans-management',
        action: ['LOANS_MANAGEMENT_MENU'],
      },
      {
        id: 'scholarships-management',
        title: 'Scholarships Management',
        messageId: 'sidebar.portal.scholarships-management',
        type: 'item',
        icon: <ScholarshipsIcon />,
        path: '/scholarships-management',
        action: ['SCHOLARSHIPS_MANAGEMENT_MENU'],
      },
      {
        id: 'blogs-management',
        title: 'Blog Management',
        messageId: 'sidebar.portal.blogs-management',
        type: 'item',
        icon: <NewsIcon />,
        path: '/blogs-management',
        action: ['BLOG_MANAGEMENT_MENU'],
      },
      {
        id: 'exams-management',
        title: 'Exams Management',
        messageId: 'sidebar.portal.exams-management',
        type: 'item',
        icon: <ExamsIcon />,
        path: '/exams-management',
        action: ['EXAMS_MANAGEMENT_MENU'],
      },
      {
        id: 'reports',
        title: 'Reports',
        messageId: 'sidebar.portal.reports',
        type: 'item',
        icon: <ReportsIcon />,
        path: '/reports',
        action: ['REPORTS_MENU'],
      },
      {
        id: 'loans-overview',
        title: 'Loans Overview',
        messageId: 'sidebar.portal.loans-overview',
        type: 'item',
        icon: <LoansIcon />,
        path: '/loans-overview',
        action: ['LOANS_OVERVIEW_MENU'],
      },
      {
        id: 'scholarships-overview',
        title: 'Scholarships Overview',
        messageId: 'sidebar.portal.scholarships-overview',
        type: 'item',
        icon: <ScholarshipsIcon />,
        path: '/scholarships-overview',
        action: ['SCHOLARSHIPS_OVERVIEW_MENU'],
      },
      {
        id: 'compare',
        title: 'Compare',
        messageId: 'sidebar.portal.compare',
        type: 'item',
        icon: <CompareIcon />,
        path: '/compare',
        action: ['COMPARE_MENU'],
      },
      {
        id: 'book-counselling',
        title: 'Book Counselling',
        messageId: 'sidebar.portal.book-counselling',
        type: 'item',
        icon: <BookCounsellingIcon />,
        path: '/book-counselling',
        action: ['BOOK_COUNSELLING_MENU'],
      },
      {
        id: 'examinations',
        title: 'Exams',
        messageId: 'sidebar.portal.exams',
        type: 'item',
        icon: <ExamsIcon />,
        path: '/examinations',
        action: ['EXAMS_MENU'],
      },
      {
        id: 'admin-education-loans',
        title: 'Education Loans',
        messageId: 'sidebar.portal.education-loans',
        type: 'item',
        icon: <LoansIcon />,
        path: '/admin-education-loans',
        action: ['EDUCATION_LOANS_MENU'],
      },
      {
        id: 'admin-scholarships',
        title: 'Scholarships',
        messageId: 'sidebar.portal.scholarships',
        type: 'item',
        icon: <ScholarshipsIcon />,
        path: '/admin-scholarships',
        action: ['SCHOLARSHIPS_MENU'],
      },
      {
        id: 'latest-news',
        title: 'Blogs / Latest News',
        messageId: 'sidebar.portal.latest-news',
        type: 'item',
        icon: <NewsIcon />,
        path: '/latest-news',
        action: ['LATEST_NEWS_MENU'],
      },
      {
        id: 'messages',
        title: 'Messages',
        messageId: 'sidebar.portal.messages',
        type: 'item',
        icon: <MessagesMenuItem />,
        path: '/messages',
        action: ['MESSAGES_MENU'],
      },
      {
        id: 'notifications-alerts',
        title: 'Notifications',
        messageId: 'sidebar.portal.notifications-alerts',
        type: 'item',
        icon: <NotificationsIcon />,
        path: '/notifications',
        action: ['NOTIFICATIONS_ALERTS_MENU'],
      },
    ],
  },
];

// Helper function to filter menu items based on user permissions only
export const filterMenuByPermissions = (
  menuItems: MenuItem[],
  hasPermission: (actionName: string) => boolean,
  userType: string
): MenuItem[] => {
  return menuItems.map(item => {
    // Clone the item
    const filteredItem = { ...item };

    // Filter children recursively
    if (item.children) {
      const filteredChildren = filterMenuByPermissions(item.children, hasPermission, userType);
      
      // Only include children that the user has permission for
      filteredItem.children = filteredChildren.filter(child => {
        // If it's a group or collapse item, include if it has any visible children
        if (child.type === 'group' || child.type === 'collapse') {
          return child.children && child.children.length > 0;
        }
        
        // For items, check permissions only
        if (child.action && child.action.length > 0) {
          // Check if user has all required permissions
          return child.action.every(action => hasPermission(action));
        }

        // If no action is defined, show the item (like Dashboard, Profile, student notifications)
        return true;
      });
    }

    return filteredItem;
  }).filter(item => {
    // Filter out empty groups/collapses
    if (item.type === 'group' || item.type === 'collapse') {
      return item.children && item.children.length > 0;
    }
    
    // For direct items in the root, apply same permission logic
    if (item.action && item.action.length > 0) {
      return item.action.every(action => hasPermission(action));
    }
    
    return true;
  });
};

// Helper function to get flat menu items for navigation
export const getFlatMenuItems = (menuItems: MenuItem[]): MenuItem[] => {
  const flatItems: MenuItem[] = [];
  
  const flatten = (items: MenuItem[]) => {
    items.forEach(item => {
      if (item.type === 'item' && item.path) {
        flatItems.push(item);
      }
      if (item.children) {
        flatten(item.children);
      }
    });
  };
  
  flatten(menuItems);
  return flatItems;
};