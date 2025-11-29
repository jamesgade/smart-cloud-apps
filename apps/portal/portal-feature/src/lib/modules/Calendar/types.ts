export interface Appointment {
  appointment_id: string;
  student_id: string;
  counsellor_id: string;
  title: string;
  description: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: {
    status_code: string;
    status_name: string;
  };
  student: {
    first_name: string;
    last_name: string;
    email: string;
  };
  counsellor: {
    first_name: string;
    last_name: string;
    email: string;
  };
  student_notes?: string;
  counsellor_notes?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: any;
}

