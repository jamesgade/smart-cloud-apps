import React from 'react';
import { useGetIdentity } from '@refinedev/core';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import CounsellorDashboard from './CounsellorDashboard';
import SeniorCounsellorDashboard from './SeniorCounsellorDashboard';

export const Dashboard: React.FC = () => {
  const { data: identity, isLoading } = useGetIdentity();

  if (isLoading) return null;

  const isAdmin = identity?.userTypeName === 'Admin' || identity?.roleName === 'Admin' || identity?.roles?.some((r: any) => r.name === 'Admin');
  const isManager = identity?.userTypeName === 'Manager' || identity?.roleName === 'Manager' || identity?.roles?.some((r: any) => r.name === 'Manager');
  const isSeniorCounsellor = identity?.userTypeName === 'Senior Counsellor' || identity?.roleName === 'Senior Counsellor' || identity?.roles?.some((r: any) => r.name === 'Senior Counsellor');
  const isCounsellor = identity?.userTypeName === 'Counsellor' || identity?.roleName === 'Counsellor' || identity?.roles?.some((r: any) => r.name === 'Counsellor');
  const isStudent = identity?.userTypeName === 'Student' || identity?.roleName === 'Student' || identity?.roles?.some((r: any) => r.name === 'Student');

  if (isStudent) return <StudentDashboard />;
  // Prioritize specific counselling roles before admin in case of multi-role users
  if (isSeniorCounsellor) return <SeniorCounsellorDashboard />;
  if (isCounsellor) return <CounsellorDashboard />;
  if (isManager) return <ManagerDashboard />;
  if (isAdmin) return <AdminDashboard />;

  return <StudentDashboard />;
};

export default Dashboard;