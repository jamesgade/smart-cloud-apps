import React from 'react';
import { useApiUrl, useGetIdentity } from '@refinedev/core';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';

interface StatCardProps {
  title: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => (
  <Card sx={{ height: '100%', borderTop: `4px solid ${color}` }}>
    <CardContent sx={{ textAlign: 'center' }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const AdminDashboard: React.FC = () => {
  const apiUrl = useApiUrl();
  const { data: identity } = useGetIdentity();

  const [counts, setCounts] = React.useState({ loans: 0, scholarships: 0, colleges: 0 });
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [studentCounts, setStudentCounts] = React.useState({ total: 0, today: 0, assigned: 0, unassigned: 0 });
  const [appsSummary, setAppsSummary] = React.useState({ loansApplied: 0, scholarshipsApplied: 0, collegesApplied: 0 });
  const [pendingFollowups, setPendingFollowups] = React.useState(0);

  React.useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN_KEY');
        const headers = { Authorization: `Bearer ${token}` } as any;
        const [loans, sch, colleges] = await Promise.all([
          axios.get(`${apiUrl}/reports/loan`, { headers }),
          axios.get(`${apiUrl}/reports/scholarship`, { headers }),
          axios.get(`${apiUrl}/reports/college`, { headers }),
        ]);
        setCounts({
          loans: Number(loans.data) || 0,
          scholarships: Number(sch.data) || 0,
          colleges: Number(colleges.data) || 0,
        });
      } catch {}
    };

    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN_KEY');
        const res = await axios.get(`${apiUrl}/appointments`, { headers: { Authorization: `Bearer ${token}` } });
        const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        setAppointments(list);
      } catch {}
    };

    const fetchStudentsAndAssignments = async () => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN_KEY');
        const headers = { Authorization: `Bearer ${token}` } as any;
        const res = await axios.get(`${apiUrl}/reports/students/summary`, { headers });
        const { total = 0, today = 0, assigned = 0, unassigned = 0 } = res.data || {};
        setStudentCounts({ total, today, assigned, unassigned });
      } catch {
        setStudentCounts({ total: 0, today: 0, assigned: 0, unassigned: 0 });
      }
    };

    fetchReports();
    fetchAppointments();
    fetchStudentsAndAssignments();
    (async () => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN_KEY');
        const headers = { Authorization: `Bearer ${token}` } as any;
        const [apps, pending] = await Promise.all([
          axios.get(`${apiUrl}/reports/applications/summary`, { headers }),
          axios.get(`${apiUrl}/reports/followups/pending`, { headers }),
        ]);
        setAppsSummary({
          loansApplied: Number(apps.data?.loansApplied) || 0,
          scholarshipsApplied: Number(apps.data?.scholarshipsApplied) || 0,
          collegesApplied: Number(apps.data?.collegesApplied) || 0,
        });
        setPendingFollowups(Number(pending.data) || 0);
      } catch {}
    })();
  }, [apiUrl]);

  const stats = [
    { title: 'Total Students', value: studentCounts.total.toLocaleString(), color: '#0d47a1' },
    { title: 'Students Added Today', value: studentCounts.today.toLocaleString(), color: '#1976d2' },
    { title: 'Assigned to Counsellors', value: studentCounts.assigned.toLocaleString(), color: '#2e7d32' },
    { title: 'Unassigned to Counsellors', value: studentCounts.unassigned.toLocaleString(), color: '#c62828' },
    { title: 'Active Loans', value: counts.loans.toLocaleString(), color: '#ff6b35' },
    { title: 'Active Scholarships', value: counts.scholarships.toLocaleString(), color: '#4caf50' },
    { title: 'Partner Colleges', value: counts.colleges.toLocaleString(), color: '#2196f3' },
    { title: 'Appointments (My View)', value: (appointments?.length || 0).toLocaleString(), color: '#9c27b0' },
    { title: 'Loans Applied', value: appsSummary.loansApplied.toLocaleString(), color: '#6a1b9a' },
    { title: 'Scholarships Applied', value: appsSummary.scholarshipsApplied.toLocaleString(), color: '#00838f' },
    { title: 'Colleges Applied', value: appsSummary.collegesApplied.toLocaleString(), color: '#5d4037' },
    { title: 'Followups Pending', value: pendingFollowups.toLocaleString(), color: '#ef6c00' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {`Welcome, ${identity?.userName || identity?.firstName || 'Admin'}`}
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
        {stats.map((s, i) => (
          <Box key={i}>
            <StatCard {...s} />
          </Box>
        ))}
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Manage users, appointments, or announcements.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button href="/providers" variant="outlined">Users</Button>
              <Button href="/calendar" variant="outlined">Calendar</Button>
              <Button href="/scholarships-management" variant="outlined">Scholarships</Button>
              <Button href="/loans-management" variant="outlined">Loans</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;