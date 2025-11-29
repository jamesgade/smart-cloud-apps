import React from 'react';
import { useApiUrl, useGetIdentity } from '@refinedev/core';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';

interface StatCardProps { title: string; value: string | number; color: string; }
const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <Card sx={{ height: '100%', borderTop: `4px solid ${color}` }}>
    <CardContent sx={{ textAlign: 'center' }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>{title}</Typography>
      <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>{value}</Typography>
    </CardContent>
  </Card>
);

const ManagerDashboard: React.FC = () => {
  const apiUrl = useApiUrl();
  const { data: identity } = useGetIdentity();
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [counts, setCounts] = React.useState({ loans: 0, scholarships: 0, colleges: 0 });
  const [studentCounts, setStudentCounts] = React.useState<{ total?: number; today?: number; assigned?: number; unassigned?: number }>({});
  const [appsSummary, setAppsSummary] = React.useState<{ loansApplied?: number; scholarshipsApplied?: number; collegesApplied?: number }>({});
  const [pendingFollowups, setPendingFollowups] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    const token = localStorage.getItem('ACCESS_TOKEN_KEY');
    const headers = { Authorization: `Bearer ${token}` } as any;
    const load = async () => {
      try {
        const res = await axios.get(`${apiUrl}/appointments`, { headers });
        const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        setAppointments(list);
      } catch {}
      try {
        const [loans, sch, colleges] = await Promise.all([
          axios.get(`${apiUrl}/reports/loan`, { headers }),
          axios.get(`${apiUrl}/reports/scholarship`, { headers }),
          axios.get(`${apiUrl}/reports/college`, { headers }),
        ]);
        setCounts({ loans: Number(loans.data)||0, scholarships: Number(sch.data)||0, colleges: Number(colleges.data)||0 });
      } catch {}
      try {
        const res = await axios.get(`${apiUrl}/reports/students/summary`, { headers });
        const { total, today, assigned, unassigned } = res.data || {};
        setStudentCounts({ total, today, assigned, unassigned });
      } catch {}
      try {
        const [apps, pending] = await Promise.all([
          axios.get(`${apiUrl}/reports/applications/summary`, { headers }),
          axios.get(`${apiUrl}/reports/followups/pending`, { headers }),
        ]);
        setAppsSummary({ loansApplied: apps.data?.loansApplied, scholarshipsApplied: apps.data?.scholarshipsApplied, collegesApplied: apps.data?.collegesApplied });
        setPendingFollowups(Number(pending.data));
      } catch {}
    };
    load();
  }, [apiUrl]);

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  const dateOnly = (d: string) => {
    const dt = new Date(d);
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  };

  const todayCount = appointments.filter((a: any) => a.appointment_date && +dateOnly(a.appointment_date) === +startOfDay).length;
  const weekAhead = new Date(startOfDay.getTime() + 7*24*60*60*1000);
  const thisWeekCount = appointments.filter((a: any) => a.appointment_date && +dateOnly(a.appointment_date) >= +startOfDay && +dateOnly(a.appointment_date) <= +weekAhead).length;

  const stats = [
    { title: 'Total Students', value: (studentCounts.total ?? '—') as any, color: '#0d47a1' },
    { title: 'Students Added Today', value: (studentCounts.today ?? '—') as any, color: '#1976d2' },
    { title: 'Assigned to Counsellors', value: (studentCounts.assigned ?? '—') as any, color: '#2e7d32' },
    { title: 'Unassigned to Counsellors', value: (studentCounts.unassigned ?? '—') as any, color: '#c62828' },
    { title: 'Today Sessions', value: todayCount.toLocaleString(), color: '#ff6b35' },
    { title: 'This Week Sessions', value: thisWeekCount.toLocaleString(), color: '#4caf50' },
    { title: 'Active Scholarships', value: counts.scholarships.toLocaleString(), color: '#2196f3' },
    { title: 'Active Loans', value: counts.loans.toLocaleString(), color: '#9c27b0' },
    { title: 'Loans Applied', value: (appsSummary.loansApplied ?? '—') as any, color: '#6a1b9a' },
    { title: 'Scholarships Applied', value: (appsSummary.scholarshipsApplied ?? '—') as any, color: '#00838f' },
    { title: 'Colleges Applied', value: (appsSummary.collegesApplied ?? '—') as any, color: '#5d4037' },
    { title: 'Followups Pending', value: (pendingFollowups ?? '—') as any, color: '#ef6c00' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {`Welcome, ${identity?.userName || identity?.firstName || 'Manager'}`}
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        {stats.map((s, i) => (
          <Box key={i}><StatCard {...s} /></Box>
        ))}
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Quick Actions</Typography>
              <Typography variant="body2" color="text.secondary">Assign students, schedule sessions, or review pipeline.</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button href="/calendar" variant="outlined">Calendar</Button>
              <Button href="/followups" variant="outlined">Followups</Button>
              <Button href="/messages" variant="outlined">Messages</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ManagerDashboard;

