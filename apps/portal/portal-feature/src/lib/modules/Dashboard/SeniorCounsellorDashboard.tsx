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

const SeniorCounsellorDashboard: React.FC = () => {
  const apiUrl = useApiUrl();
  const { data: identity } = useGetIdentity();
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [escalations, setEscalations] = React.useState<number>(0);
  const [totalStudents, setTotalStudents] = React.useState<number>(0);
  const [assignedCount, setAssignedCount] = React.useState<number>(0);
  const [assignedStudentIds, setAssignedStudentIds] = React.useState<Set<string>>(new Set());
  const [appsCounts, setAppsCounts] = React.useState<{ loansApplied: number; scholarshipsApplied: number }>({ loansApplied: 0, scholarshipsApplied: 0 });
  const [pendingFollowups, setPendingFollowups] = React.useState<number>(0);

  React.useEffect(() => {
    if (!identity?.userId) return;
    const token = localStorage.getItem('ACCESS_TOKEN_KEY');
    const headers = { Authorization: `Bearer ${token}` } as any;
    const load = async () => {
      try {
        const res = await axios.get(`${apiUrl}/appointments`, { headers });
        const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
        setAppointments(list);
      } catch {}
      try {
        // Placeholder for escalations to approve
        setEscalations(0);
      } catch {}
      try {
        const summary = await axios.get(`${apiUrl}/reports/students/summary`, { headers });
        setTotalStudents(Number(summary.data?.total) || 0);
      } catch {}
      try {
        const mine = await axios.get(`${apiUrl}/reports/students/summary/${identity?.userId}`, { headers });
        setAssignedCount(Number(mine.data?.assigned) || 0);
      } catch {}
      let ids = new Set<string>();
      try {
        const assignedRes = await axios.get(`${apiUrl}/student-assignments`, { headers });
        const assigned = Array.isArray(assignedRes.data?.data) ? assignedRes.data.data : (Array.isArray(assignedRes.data) ? assignedRes.data : []);
        assigned.forEach((a: any) => {
          const sid = a.student_id || a.studentId || a.student?.student_id || a.student?.studentId;
          if (sid) ids.add(String(sid));
        });
        setAssignedStudentIds(ids);
      } catch {}
      try {
        const apps = await axios.get(`${apiUrl}/reports/applications/summary/${identity?.userId}`, { headers });
        setAppsCounts({
          loansApplied: Number(apps.data?.loansApplied) || 0,
          scholarshipsApplied: Number(apps.data?.scholarshipsApplied) || 0,
        });
      } catch {}
      try {
        const folRes = await axios.get(`${apiUrl}/auth/assigned-students/followups`, { headers });
        const followups = Array.isArray(folRes.data?.data) ? folRes.data.data : (Array.isArray(folRes.data) ? folRes.data : []);
        const pending = followups.filter((f: any) => (f.status || f.followup_status || '').toString().toUpperCase() === 'SCHEDULED').length;
        setPendingFollowups(pending);
      } catch {}
    };
    load();
  }, [apiUrl, identity?.userId]);

  const upcoming = appointments.length;

  const stats = [
    { title: 'Total Students', value: totalStudents.toLocaleString(), color: '#0d47a1' },
    { title: 'Students Assigned', value: assignedCount.toLocaleString(), color: '#2e7d32' },
    { title: 'Loans Applied', value: appsCounts.loansApplied.toLocaleString(), color: '#6a1b9a' },
    { title: 'Scholarships Applied', value: appsCounts.scholarshipsApplied.toLocaleString(), color: '#00838f' },
    { title: 'Followups Pending', value: pendingFollowups.toLocaleString(), color: '#ef6c00' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {`Welcome, ${identity?.userName || identity?.firstName || 'Senior Counsellor'}`}
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 4 }}>
        {stats.map((s, i) => (
          <Box key={i}><StatCard {...s} /></Box>
        ))}
      </Box>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Quick Actions</Typography>
              <Typography variant="body2" color="text.secondary">Review quality, schedule sessions, or manage escalations.</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button href="/calendar" variant="outlined">Calendar</Button>
              <Button href="/messages" variant="outlined">Messages</Button>
              <Button href="/followups" variant="outlined">Followups</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SeniorCounsellorDashboard;

