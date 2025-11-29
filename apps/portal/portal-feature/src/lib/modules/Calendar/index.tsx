import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Alert,
  Chip,
  Button,
} from '@mui/material';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import axios from 'axios';
import { useGetIdentity } from '@refinedev/core';
import CreateAppointmentModal from './CreateAppointmentModal';
import AppointmentDetailsModal from './AppointmentDetailsModal';
import { Appointment, CalendarEvent } from './types';

const Calendar: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: user } = useGetIdentity();
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: Date; start: string; end: string } | null>(null);
  const [calendarKey, setCalendarKey] = useState(0); // Force calendar refresh

  const isStudent = user?.userTypeName === 'Student';
  const isCounsellor = user?.roleName === 'Counsellor' || user?.roleName === 'Senior Counsellor';
  const canCreateAppointments = isStudent || isCounsellor;
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api';

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, user?.studentId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      
      const response = await axios.get(`${API_BASE_URL}/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const appointments: Appointment[] = response.data;
      
      if (!appointments || appointments.length === 0) {
        setEvents([]);
      } else {
        convertToCalendarEvents(appointments);
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const convertToCalendarEvents = (appointments: Appointment[]) => {
    if (!appointments || !Array.isArray(appointments)) {
      setEvents([]);
      return;
    }

    const calendarEvents: CalendarEvent[] = appointments.map(apt => {
      // Handle date properly to avoid timezone issues
      let dateOnly: string;
      
      if (apt.appointment_date.includes('T')) {
        // If it's a full datetime string, parse it and get local date
        const appointmentDate = new Date(apt.appointment_date);
        const year = appointmentDate.getFullYear();
        const month = String(appointmentDate.getMonth() + 1).padStart(2, '0');
        const day = String(appointmentDate.getDate()).padStart(2, '0');
        dateOnly = `${year}-${month}-${day}`;
      } else {
        // If it's already just a date string, use it directly
        dateOnly = apt.appointment_date;
      }
      
      // Combine date and time for FullCalendar
      const startDateTime = `${dateOnly}T${apt.start_time}`;
      const endDateTime = `${dateOnly}T${apt.end_time}`;
      // Color coding based on status
      const statusColors: Record<string, { bg: string; border: string }> = {
        PENDING: { bg: '#FFA726', border: '#FF9800' },
        CONFIRMED: { bg: '#66BB6A', border: '#4CAF50' },
        REJECTED: { bg: '#EF5350', border: '#F44336' },
        CANCELLED: { bg: '#9E9E9E', border: '#757575' },
        COMPLETED: { bg: '#42A5F5', border: '#2196F3' },
        NO_SHOW: { bg: '#BDBDBD', border: '#9E9E9E' },
      };

      const colors = statusColors[apt.status.status_code] || { bg: '#9E9E9E', border: '#757575' };

      return {
        id: apt.appointment_id,
        title: isStudent 
          ? `${apt.counsellor.first_name} ${apt.counsellor.last_name} - ${apt.title}`
          : `${apt.student.first_name} ${apt.student.last_name} - ${apt.title}`,
        start: startDateTime,
        end: endDateTime,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        extendedProps: {
          appointment: apt,
        },
      };
    });
    setEvents(calendarEvents);
  };

  const isWithinBusinessHours = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const businessStart = 9 * 60; // 9:00 AM in minutes
    const businessEnd = 19 * 60;  // 7:00 PM in minutes
    
    return timeInMinutes >= businessStart && timeInMinutes <= businessEnd;
  };

  const checkTimeSlotConflict = (date: Date, startTime: string, endTime: string) => {
    const selectedDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    return events.some(event => {
      // Skip events without end time
      if (!event.end) return false;
      
      // Extract date from event start
      const eventDate = event.start.split('T')[0];
      if (eventDate !== selectedDateStr) return false;
      
      // Check for time overlap
      const selectedStart = `${selectedDateStr}T${startTime}`;
      const selectedEnd = `${selectedDateStr}T${endTime}`;
      
      return (
        (selectedStart < event.end && selectedEnd > event.start) ||
        (event.start < selectedEnd && event.end > selectedStart)
      );
    });
  };

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    // Students and counsellors can create appointments by selecting date/time
    if (canCreateAppointments) {
      // Handle FullCalendar date strings properly to avoid timezone issues
      const startDate = new Date(selectInfo.startStr);
      let endDate = new Date(selectInfo.endStr);
      let startTime: string;
      let endTime: string;
      let selectedDate: Date;
      
      // If it's a day selection (no time), set default time
      if (selectInfo.allDay) {
        // For all-day selections, use the local date without time conversion
        selectedDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        startTime = '09:00';
        endTime = '09:30';
      } else {
        // Ensure minimum 30 minutes duration for time selections
        const durationMs = endDate.getTime() - startDate.getTime();
        if (durationMs < 30 * 60 * 1000) {
          endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
        }
        
        selectedDate = startDate;
        startTime = startDate.toTimeString().slice(0, 5); // HH:MM format
        endTime = endDate.toTimeString().slice(0, 5);
      }
      
      // Check if time is within business hours (9 AM - 7 PM)
      if (!isWithinBusinessHours(startTime) || !isWithinBusinessHours(endTime)) {
        alert('Appointments can only be scheduled between 9:00 AM and 7:00 PM. Please select a different time.');
        selectInfo.view.calendar.unselect();
        return;
      }
      
      // Check for time slot conflicts
      if (checkTimeSlotConflict(selectedDate, startTime, endTime)) {
        alert('This time slot conflicts with an existing appointment. Please select a different time.');
        selectInfo.view.calendar.unselect();
        return;
      }
      
      setSelectedSlot({
        date: selectedDate,
        start: startTime,
        end: endTime,
      });
      setCreateModalOpen(true);
    }
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const appointment = clickInfo.event.extendedProps?.appointment;
    if (appointment) {
      setSelectedAppointment(appointment);
      setDetailsModalOpen(true);
    }
  };

  const handleCreateSuccess = () => {
    setCreateModalOpen(false);
    fetchAppointments();
  };

  const handleUpdateSuccess = () => {
    setDetailsModalOpen(false);
    setSelectedAppointment(null); // Clear selected appointment
    setCalendarKey(prev => prev + 1); // Force calendar to remount
    fetchAppointments(); // Refresh calendar data
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" sx={{ color: '#333', fontWeight: 600 }}>
          {isStudent ? 'My Appointments' : 'Counselling Calendar'}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Add Event Button (for students and counsellors) */}
          {canCreateAppointments && (
            <Button
              variant="contained"
              size="medium"
              onClick={() => {
                setSelectedSlot({
                  date: new Date(),
                  start: '09:00',
                  end: '09:30',
                });
                setCreateModalOpen(true);
              }}
              sx={{ 
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
                }
              }}
            >
              {isStudent ? 'Book Appointment' : 'Schedule Appointment'}
            </Button>
          )}
          
          {/* Status Legend */}
          <Chip label="Pending" size="small" sx={{ backgroundColor: '#FFA726', color: 'white' }} />
          <Chip label="Confirmed" size="small" sx={{ backgroundColor: '#66BB6A', color: 'white' }} />
          <Chip label="Completed" size="small" sx={{ backgroundColor: '#42A5F5', color: 'white' }} />
          <Chip label="Cancelled" size="small" sx={{ backgroundColor: '#9E9E9E', color: 'white' }} />
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Box
            sx={{
              '& .fc': {
                fontSize: '0.875rem',
              },
              '& .fc-toolbar': {
                flexWrap: 'wrap',
                gap: 1,
                '& .fc-toolbar-chunk': {
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1,
                },
              },
              '& .fc-button': {
                backgroundColor: '#ff6b35',
                borderColor: '#ff6b35',
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: '#e55a2b',
                  borderColor: '#e55a2b',
                },
                '&:focus': {
                  boxShadow: '0 0 0 0.2rem rgba(255, 107, 53, 0.25)',
                },
                '&.fc-button-active': {
                  backgroundColor: '#e55a2b',
                  borderColor: '#e55a2b',
                },
              },
              '& .fc-today-button': {
                backgroundColor: '#2196f3',
                borderColor: '#2196f3',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  borderColor: '#1976d2',
                },
              },
              '& .fc-day-today': {
                backgroundColor: 'rgba(255, 107, 53, 0.1) !important',
              },
              '& .fc-event': {
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.8,
                },
              },
              '& .fc-header-toolbar': {
                marginBottom: '1.5rem',
              },
              '& .fc-daygrid-day-number': {
                color: '#333',
                textDecoration: 'none',
              },
              '& .fc-col-header-cell': {
                backgroundColor: '#f8f9fa',
                fontWeight: 600,
              },
            }}
          >
            <FullCalendar
              key={calendarKey}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              headerToolbar={{
                left: isMobile ? 'prev,next' : 'prev,next today',
                center: 'title',
                right: isMobile ? 'timeGridDay' : 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              initialView={isMobile ? 'timeGridDay' : 'dayGridMonth'}
              editable={false}
              selectable={canCreateAppointments}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={events}
              select={handleDateSelect}
              eventClick={handleEventClick}
              height="auto"
              aspectRatio={isMobile ? 1.0 : 1.35}
              eventDisplay="block"
              displayEventTime={true}
              allDaySlot={false}
              slotMinTime="09:00:00"
              slotMaxTime="19:00:00"
              slotDuration="00:30:00"
              expandRows={true}
              nowIndicator={true}
              eventOrder="start,-duration,allDay,title"
              businessHours={{
                daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
                startTime: '09:00',
                endTime: '19:00',
              }}
              selectConstraint="businessHours"
              eventTimeFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }}
              slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              }}
            />
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {isStudent ? (
            <>• Click and drag on a time slot or use "Book Appointment" to schedule with a counsellor</>
          ) : isCounsellor ? (
            <>• Click and drag on a time slot or use "Schedule Appointment" to create appointments for students</>
          ) : (
            <>• Click on an appointment to view details and launch video session</>
          )}
        </Typography>
      </Box>

      {/* Modals */}
      {canCreateAppointments && selectedSlot && (
        <CreateAppointmentModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          selectedDate={selectedSlot.date}
          selectedTime={{ start: selectedSlot.start, end: selectedSlot.end }}
          onSuccess={handleCreateSuccess}
          studentId={user?.studentId || user?.userId || ''}
          userType={user?.userTypeName || ''}
          userId={user?.userId || ''}
          roleName={user?.roleName || ''}
          existingEvents={events.map(event => ({
            start: event.start,
            end: event.end || '',
            appointment_id: event.id
          }))}
        />
      )}

      {selectedAppointment && (
        <AppointmentDetailsModal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          appointment={selectedAppointment}
          userType={user?.userTypeName || ''}
          userId={user?.userId || ''}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </Box>
  );
};

export default Calendar;