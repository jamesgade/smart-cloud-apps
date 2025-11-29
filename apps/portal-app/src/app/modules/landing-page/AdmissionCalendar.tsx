import React from 'react';
import { Box, Container, Typography, Button, Card, CardContent, Chip, Grid, Avatar } from '@mui/material';
import { useNavigate } from 'react-router';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuthModal } from '../../contexts/AuthModalContext';
import { API_BASE_URL } from '../../libs/constants';

const AdmissionCalendar = () => {
  const navigate = useNavigate();
  const { openLogin } = useAuthModal();
  const admissionTimeline = [
    {
      month: "January 2026",
      events: [
        {
          title: "JEE Main 2026 Registration Opens",
          date: "Jan 15, 2026",
          type: "registration",
          description: "Application window for JEE Main 2026 Session 1",
          status: "upcoming",
          color: "#FF6B35"
        },
        {
          title: "NEET 2026 Application Process",
          date: "Jan 20, 2026",
          type: "application",
          description: "NEET UG 2026 application submission begins",
          status: "upcoming",
          color: "#FF8C42"
        }
      ]
    },
    {
      month: "February 2026",
      events: [
        {
          title: "JEE Main 2026 Session 1",
          date: "Feb 1-15, 2026",
          type: "exam",
          description: "JEE Main Session 1 examination dates",
          status: "current",
          color: "#F7931E"
        },
        {
          title: "CUET UG 2026 Registration",
          date: "Feb 10, 2026",
          type: "registration",
          description: "Common University Entrance Test registration",
          status: "upcoming",
          color: "#FF6B35"
        }
      ]
    },
    {
      month: "March 2026",
      events: [
        {
          title: "JEE Advanced Registration",
          date: "Mar 1-10, 2026",
          type: "registration",
          description: "Registration for JEE Advanced 2026",
          status: "upcoming",
          color: "#FF9800"
        },
        {
          title: "State Board Exams",
          date: "Mar 1-31, 2026",
          type: "exam",
          description: "12th Board examinations across states",
          status: "current",
          color: "#FF9800"
        }
      ]
    },
    {
      month: "April 2026",
      events: [
        {
          title: "NEET 2026 Exam",
          date: "Apr 5, 2026",
          type: "exam",
          description: "NEET UG 2026 examination",
          status: "upcoming",
          color: "#FF8C42"
        },
        {
          title: "CUET UG 2026 Exam",
          date: "Apr 15-30, 2026",
          type: "exam",
          description: "CUET UG 2026 examination window",
          status: "upcoming",
          color: "#FF6B35"
        }
      ]
    },
    {
      month: "May 2026",
      events: [
        {
          title: "JEE Advanced 2026",
          date: "May 26, 2026",
          type: "exam",
          description: "JEE Advanced 2026 examination",
          status: "upcoming",
          color: "#FF9800"
        },
        {
          title: "Board Results Declaration",
          date: "May 15-31, 2026",
          type: "result",
          description: "12th Board results across states",
          status: "upcoming",
          color: "#FF9800"
        }
      ]
    },
    {
      month: "June 2026",
      events: [
        {
          title: "JEE Main Results",
          date: "Jun 10, 2026",
          type: "result",
          description: "JEE Main 2026 results declaration",
          status: "upcoming",
          color: "#F7931E"
        },
        {
          title: "NEET Results",
          date: "Jun 15, 2026",
          type: "result",
          description: "NEET UG 2026 results",
          status: "upcoming",
          color: "#FF8C42"
        }
      ]
    }
  ];

  const [examCategories, setExamCategories] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Fetch public exams and group by category
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/public/exams`);
        const data = await res.json();
        const grouped: Record<string, any[]> = {};
        (data || []).forEach((e: any) => {
          const key = e.category || 'Other';
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(e);
        });
        const colorMap: Record<string, string> = {
          Engineering: '#FF6B35',
          Medical: '#FF8C42',
          Management: '#F7931E',
          Law: '#FF9800',
        };
        const iconMap: Record<string, string> = {
          Engineering: '⚙️',
          Medical: '🏥',
          Management: '💼',
          Law: '⚖️',
        };
        const toStatus = (s?: string) => (s ? s.toLowerCase() : 'upcoming');
        const toDate = (e: any) => e.examDate || e.startDate || '';
        const cats = Object.keys(grouped).sort().map((cat) => ({
          title: `${cat} Entrance`,
          icon: iconMap[cat] || '📝',
          color: colorMap[cat] || '#FF6B35',
          exams: grouped[cat]
            .sort((a, b) => (new Date(toDate(a)).getTime() || 0) - (new Date(toDate(b)).getTime() || 0))
            .slice(0, 4)
            .map((e) => ({ name: e.name, date: toDate(e), status: toStatus(e.status) })),
        }));
        setExamCategories(cats);
      } catch {}
    })();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return '#FF8C42';
      case 'upcoming': return '#FF6B35';
      case 'completed': return '#9E9E9E';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'current': return <TrendingUpIcon />;
      case 'upcoming': return <WarningIcon />;
      case 'completed': return <CheckCircleIcon />;
      default: return <EventIcon />;
    }
  };

  return (
    <Box id="admission-calendar" sx={{ py: 8, backgroundColor: 'white' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" fontWeight="bold" color="black" sx={{ mb: 2 }}>
            Admission Calendar 2026
          </Typography>
          <Typography variant="h6" color="#666" sx={{ maxWidth: '800px', mx: 'auto', lineHeight: 1.6 }}>
            Stay updated with all important admission dates, exam schedules, and deadlines. 
            Never miss a crucial date in your college admission journey.
          </Typography>
        </Box>

        {/* Exam Categories */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 4, textAlign: 'center' }}>
            Entrance Exams by Category
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 3
          }}>
            {examCategories.map((category, index) => (
              <Card key={index} sx={{
                borderRadius: '20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: `2px solid ${category.color}20`,
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 40px ${category.color}30`,
                }
              }}>
                  <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                      <Box sx={{ fontSize: '3rem', mb: 2 }}>{category.icon}</Box>
                      <Typography variant="h6" fontWeight="bold" color="black">
                        {category.title}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3, flex: 1 }}>
                      {category.exams.map((exam: any, examIndex: number) => (
                        <Box key={examIndex} sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                          p: 1.5,
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 107, 53, 0.05)',
                          border: `1px solid ${getStatusColor(exam.status)}20`
                        }}>
                          <Box>
                            <Typography variant="body2" fontWeight="bold" color="black">
                              {exam.name}
                            </Typography>
                            <Typography variant="caption" color="#666">
                              {exam.date}
                            </Typography>
                          </Box>
                          <Chip
                            label={exam.status}
                            size="small"
                            sx={{
                              backgroundColor: getStatusColor(exam.status),
                              color: 'white',
                              textTransform: 'capitalize',
                              fontSize: '0.7rem'
                            }}
                          />
                        </Box>
                      ))}
                    </Box>

                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={openLogin}
                      sx={{
                        borderColor: category.color,
                        color: category.color,
                        fontWeight: 'bold',
                        '&:hover': {
                          borderColor: category.color,
                          backgroundColor: `${category.color}10`
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
            ))}
          </Box>
        </Box>

        {/* Admission Timeline */}
        {/* <Box sx={{ mb: 8 }}>
          <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 4, textAlign: 'center' }}>
            Complete Admission Timeline
          </Typography>
          
          <Box sx={{ position: 'relative' }}>
            <Box sx={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              backgroundColor: '#FF6B35',
              transform: 'translateX(-50%)',
              zIndex: 1
            }} />
            
            {admissionTimeline.map((month, monthIndex) => (
              <Box key={monthIndex} sx={{
                position: 'relative',
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: monthIndex % 2 === 0 ? 'flex-start' : 'flex-end'
              }}>
                
                <Box sx={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 2,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                        backgroundColor: 'rgba(255, 107, 53, 0.05)',
                  border: '4px solid #FF6B35',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  <CalendarTodayIcon sx={{ color: '#FF6B35' }} />
                </Box>
                
                
                <Box sx={{
                  width: { xs: '100%', md: '45%' },
                  ml: monthIndex % 2 === 0 ? { xs: 0, md: 0 } : { xs: 0, md: 0 },
                  mr: monthIndex % 2 === 0 ? { xs: 0, md: 0 } : { xs: 0, md: 0 },
                  mt: { xs: 4, md: 0 }
                }}>
                  <Card sx={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" fontWeight="bold" color="black" sx={{ mb: 2 }}>
                        {month.month}
                      </Typography>
                      
                      {month.events.map((event, eventIndex) => (
                        <Box key={eventIndex} sx={{
                          mb: eventIndex < month.events.length - 1 ? 2 : 0,
                          p: 2,
                          borderRadius: '12px',
                          backgroundColor: `${event.color}10`,
                          border: `1px solid ${event.color}30`
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar sx={{
                              width: 32,
                              height: 32,
                              mr: 2,
                              backgroundColor: event.color
                            }}>
                              {getStatusIcon(event.status)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" fontWeight="bold" color="black">
                                {event.title}
                              </Typography>
                              <Typography variant="body2" color="#666">
                                {event.date}
                              </Typography>
                            </Box>
                            <Chip
                              label={event.status}
                              size="small"
                              sx={{
                                backgroundColor: getStatusColor(event.status),
                                color: 'white',
                                textTransform: 'capitalize'
                              }}
                            />
                          </Box>
                          <Typography variant="body2" color="#666">
                            {event.description}
                          </Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            ))}
          </Box>
        </Box> */}

        {/* Important Reminders */}
        <Box sx={{
          backgroundColor: '#fff3e0',
          borderRadius: '20px',
          p: 4,
          mb: 6,
          border: '2px solid #FF6B35'
        }}>
          <Typography variant="h5" fontWeight="bold" color="black" sx={{ mb: 3, textAlign: 'center' }}>
            📅 Important Reminders
          </Typography>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <WarningIcon sx={{ color: '#FF6B35', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="black">
                    Application Deadlines
                  </Typography>
                  <Typography variant="body2" color="#666">
                    Most entrance exam applications close 1-2 months before the exam date. 
                    Start your applications early to avoid last-minute rush.
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <ScheduleIcon sx={{ color: '#FF6B35', mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" color="black">
                    Exam Preparation
                  </Typography>
                  <Typography variant="body2" color="#666">
                    Allocate 6-12 months for comprehensive preparation. 
                    Create a study schedule and stick to it consistently.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" color="black" sx={{ mb: 2 }}>
            Stay Updated with Admission Dates
          </Typography>
          <Typography variant="h6" color="#666" sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
            Get personalized reminders for important dates and deadlines. 
            Never miss a crucial admission milestone!
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={openLogin}
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                color: 'white',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '25px',
                '&:hover': {
                  background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255, 107, 53, 0.4)',
                }
              }}
            >
              Set Reminders
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={openLogin}
              sx={{
                borderColor: '#FF6B35',
                color: '#FF6B35',
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: '25px',
                '&:hover': {
                  borderColor: '#FF6B35',
                  backgroundColor: 'rgba(255, 107, 53, 0.1)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Download Calendar
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AdmissionCalendar;
