import React from 'react';
import { useApiUrl, useGetIdentity } from '@refinedev/core';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import axios from 'axios';
import AssessmentTestModal from './AssessmentTestModal';
import StudentProfileModal from './StudentProfileModal';

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

export const StudentDashboard: React.FC = () => {
  const apiUrl = useApiUrl();
  const { data: identity } = useGetIdentity();
  const studentId = identity?.userId;

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [reportCounts, setReportCounts] = React.useState({
    loans: 0,
    scholarships: 0,
    colleges: 0,
    courses: 0,
    counsells: 0,
  });

  React.useEffect(() => {
    let isMounted = true;
    const fetchReports = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('ACCESS_TOKEN_KEY');
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const [loansRes, scholarshipsRes, collegesRes, coursesRes, counsellsRes] = await Promise.all([
          fetch(`${apiUrl}/reports/loan`, { headers }).then((r) => r.json()),
          fetch(`${apiUrl}/reports/scholarship`, { headers }).then((r) => r.json()),
          fetch(`${apiUrl}/reports/college`, { headers }).then((r) => r.json()),
          fetch(`${apiUrl}/reports/course`, { headers }).then((r) => r.json()),
          studentId
            ? fetch(`${apiUrl}/reports/counsells/${studentId}`, { headers }).then((r) => r.json())
            : Promise.resolve(0),
        ]);

        if (!isMounted) return;
        setReportCounts({
          loans: Number(loansRes) || 0,
          scholarships: Number(scholarshipsRes) || 0,
          colleges: Number(collegesRes) || 0,
          courses: Number(coursesRes) || 0,
          counsells: Number(counsellsRes) || 0,
        });
      } catch (e: any) {
        if (!isMounted) return;
        setError('Failed to load dashboard data');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    };

    fetchReports();
    return () => {
      isMounted = false;
    };
  }, [apiUrl, studentId]);

  const stats = [
    { title: 'Available Loans', value: reportCounts.loans.toLocaleString(), color: '#ff6b35' },
    { title: 'Available Scholarships', value: reportCounts.scholarships.toLocaleString(), color: '#4caf50' },
    { title: 'Partner Colleges', value: reportCounts.colleges.toLocaleString(), color: '#2196f3' },
    ...(studentId ? [{ title: 'My Counselling Sessions', value: reportCounts.counsells.toLocaleString(), color: '#673ab7' }] : []),
  ];

  // Removed static recent activities and quick actions

  const [assessmentOpen, setAssessmentOpen] = React.useState(false);

  // Upcoming sessions (appointments) for current student
  interface AppointmentItem {
    appointmentId?: string;
    scheduledAt?: string;
    scheduledDate?: string;
    startTime?: string;
    endTime?: string;
    counsellorName?: string;
    status?: string;
    [key: string]: any;
  }

  const [appointments, setAppointments] = React.useState<AppointmentItem[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = React.useState<boolean>(false);
  const [appointmentsError, setAppointmentsError] = React.useState<string | null>(null);
  // Profile status
  const [profile, setProfile] = React.useState<any>(null);
  const [studentInfo, setStudentInfo] = React.useState<any>(null);
  const [profileOpen, setProfileOpen] = React.useState(false);
  const completionPercent = React.useMemo(() => {
    if (!profile) return 0;
    const fields = [
      profile?.tenthMarksPercent,
      profile?.interFirstYearPercent,
      profile?.interSecondYearPercent,
      Array.isArray(profile?.competitiveExams) && profile.competitiveExams.length > 0 ? 'x' : null,
    ];
    const total = fields.length;
    const filled = fields.filter((v) => v !== null && v !== undefined && v !== '').length;
    return Math.round((filled / total) * 100);
  }, [profile]);

  React.useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setAppointmentsLoading(true);
        setAppointmentsError(null);
        const token = localStorage.getItem('ACCESS_TOKEN_KEY');
        const response = await axios.get(`${apiUrl}/appointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const list = Array.isArray(response.data?.data)
          ? response.data.data
          : (Array.isArray(response.data) ? response.data : []);
        setAppointments(list);
      } catch (e: any) {
        setAppointmentsError(e?.response?.data?.message || 'Failed to load upcoming sessions');
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchAppointments();
    // fetch profile
    (async () => {
      try {
        const token = localStorage.getItem('ACCESS_TOKEN_KEY');
        const headers = { Authorization: `Bearer ${token}` } as any;
        const [profileRes, detailsRes] = await Promise.all([
          axios.get(`${apiUrl}/auth/student/profile`, { headers }),
          axios.get(`${apiUrl}/auth/student/details`, { headers }),
        ]);
        setProfile(profileRes.data?.profile || profileRes.data || {});
        setStudentInfo(detailsRes.data?.student || detailsRes.data || {});
      } catch {}
    })();
  }, [apiUrl]);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
        <Typography variant="body1">Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          {`Welcome, ${identity?.userName || `${identity?.firstName || ''} ${identity?.lastName || ''}`.trim() || 'Student'}`}
        </Typography>
      </Box>

      {/* Profile Status */}
      <Card sx={{ mt: 3, mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Profile Status</Typography>
              <Typography variant="body2" color="text.secondary">Complete your academic details to reach 100%</Typography>
            </Box>
            <Button variant="outlined" onClick={() => setProfileOpen(true)}>Update Profile</Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ height: 8, backgroundColor: '#eee', borderRadius: 4 }}>
              <Box sx={{ width: `${completionPercent}%`, height: '100%', background: 'linear-gradient(90deg,#FF6B35,#F7931E)', borderRadius: 4 }} />
            </Box>
            <Typography variant="caption" color="text.secondary">{completionPercent}% completed</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Assessment CTA */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Assessment Test
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Take a quick assessment test to understand your strengths and preferences to yourself, we are not storing any data about this test.
              </Typography>
            </Box>
            <Button variant="contained" onClick={() => setAssessmentOpen(true)}>Take Assessment Test</Button>
          </Box>
        </CardContent>
      </Card>

      <AssessmentTestModal open={assessmentOpen} onClose={() => setAssessmentOpen(false)} />

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
        {stats.map((stat, index) => (
          <Box key={index}>
            <StatCard {...stat} />
          </Box>
        ))}
      </Box>

      {profileOpen && (
        <StudentProfileModal
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          profile={profile}
          student={studentInfo}
          onSaved={(p:any) => { setProfile(p?.profile || p || {}); setProfileOpen(false); }}
          apiUrl={apiUrl}
        />
      )}

      {/* Quick Actions */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore colleges, view loans, or book a counselling session.
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button href="/colleges" variant="outlined">Colleges</Button>
              <Button href="/admin-education-loans" variant="outlined">Loans</Button>
              <Button href="/book-counselling" variant="outlined">Book Counselling</Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Upcoming Sessions
          </Typography>
          {appointmentsLoading ? (
            <Typography variant="body2" color="text.secondary">Loading...</Typography>
          ) : appointmentsError ? (
            <Typography variant="body2" color="error">{appointmentsError}</Typography>
          ) : appointments.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No upcoming sessions.</Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 1 }}>
              {appointments
                .map((a) => {
                  const apptDateStr = (a as any).appointment_date as string | undefined;
                  const startTimeStr = (a as any).start_time as string | undefined;
                  const endTimeStr = (a as any).end_time as string | undefined;

                  // Derive dateOnly (YYYY-MM-DD) similar to Calendar module
                  let dateOnly: string | undefined;
                  if (apptDateStr) {
                    if (apptDateStr.includes('T')) {
                      const d = new Date(apptDateStr);
                      if (!isNaN(d.getTime())) {
                        const y = d.getFullYear();
                        const m = String(d.getMonth() + 1).padStart(2, '0');
                        const da = String(d.getDate()).padStart(2, '0');
                        dateOnly = `${y}-${m}-${da}`;
                      }
                    } else {
                      dateOnly = apptDateStr;
                    }
                  }

                  const startIso = dateOnly && startTimeStr ? `${dateOnly}T${startTimeStr}` : undefined;
                  const endIso = dateOnly && endTimeStr ? `${dateOnly}T${endTimeStr}` : undefined;

                  const alt = (a as any).scheduledAt || (a as any).scheduledDate || (a as any).startTime;
                  const startDate = startIso ? new Date(startIso) : (alt ? new Date(alt) : null);

                  return { ...a, _date: startDate, _startIso: startIso, _endIso: endIso } as any;
                })
                .filter((a) => !a._date || a._date.getTime() >= Date.now())
                .sort((a, b) => {
                  const ad = a._date ? a._date.getTime() : 0;
                  const bd = b._date ? b._date.getTime() : 0;
                  return ad - bd;
                })
                .slice(0, 5)
                .map((a, idx) => {
                  const statusText = a.status
                    ? (typeof a.status === 'object'
                        ? String(((a as any).status?.status_name) ?? ((a as any).status?.name) ?? ((a as any).status?.code) ?? '')
                        : String(a.status))
                    : '';
                  const cTextRaw = (a as any).counsellor
                    ? `${((a as any).counsellor?.first_name) ?? ''} ${((a as any).counsellor?.last_name) ?? ''}`.trim()
                    : (typeof (a as any).counsellorName === 'object'
                        ? String(((a as any).counsellorName?.name) ?? ((a as any).counsellorName?.fullName) ?? '')
                        : ((a as any).counsellorName ? String((a as any).counsellorName) : ''));
                  const dateObj: Date | null = (a as any)._date || null;
                  const startObj: Date | null = (a as any)._startIso ? new Date((a as any)._startIso) : dateObj;
                  const endObj: Date | null = (a as any)._endIso ? new Date((a as any)._endIso) : null;
                  const dateLabel = startObj ? startObj.toLocaleDateString() : 'Scheduled';
                  const timeLabel = startObj ? startObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                  const timeRange = endObj ? `${timeLabel} - ${endObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : timeLabel;
                  return (
                    <Box key={a.appointmentId || `appt-${idx}`} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {dateLabel}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {timeRange}
                        </Typography>
                        {cTextRaw && (
                          <Typography variant="caption" color="text.secondary">
                            Counsellor: {cTextRaw}
                          </Typography>
                        )}
                      </Box>
                      {statusText && (
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                          {statusText}
                        </Typography>
                      )}
                    </Box>
                  );
                })}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentDashboard;