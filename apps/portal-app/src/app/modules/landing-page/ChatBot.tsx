import React, { useEffect, useRef, useState } from 'react';
import { Box, Paper, Typography, TextField, IconButton, Divider, Chip, CircularProgress, Fab } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import axios from 'axios';
import { API_BASE_URL } from '../../libs/constants';

type Question = {
  questionId: string;
  code: string;
  text: string;
  questionType: 'text' | 'select' | string;
  optionsJson?: Array<{ value: string; label: string }> | any;
};

type Message = {
  id: string;
  role: 'bot' | 'user';
  text: string;
  timestamp?: Date;
};

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  // Campus Yatra specific welcome messages
  const welcomeMessages = [
    "🎓 Welcome to Campus Yatra! I'm your admission assistant.",
    "I'll help you find the perfect college and guide you through the admission process.",
    "Let's start with your mobile number to begin your personalized journey!"
  ];

  const quickActions = [
    { label: "🎯 Career Assessment", action: "assessment" },
    { label: "🏫 Find Colleges", action: "colleges" },
    { label: "💰 Scholarships", action: "scholarships" },
    { label: "📋 Application Help", action: "application" }
  ];

  // Initialize chat when opened
  useEffect(() => {
    if (!open) return;
    
    // Reset state when opening
    setMessages([
      { id: 'm1', role: 'bot' as const, text: welcomeMessages[0], timestamp: new Date() },
      { id: 'm2', role: 'bot' as const, text: welcomeMessages[1], timestamp: new Date() },
      { id: 'm3', role: 'bot' as const, text: welcomeMessages[2], timestamp: new Date() }
    ]);
    
    // Fetch welcome question from API
    const initWelcomeQuestion = async () => {
      const question = await fetchQuestion('welcome');
      if (question) {
        setCurrentQuestion(question);
      } else {
        // Fallback if not in database
        setCurrentQuestion({
          questionId: 'welcome',
          code: 'welcome',
          text: 'Please enter your mobile number to continue',
          questionType: 'text'
        });
      }
    };
    
    initWelcomeQuestion();
    setSessionId(null);
    setInput('');
  }, [open]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Create or get chat session
  const ensureSession = async (mobile: string): Promise<string> => {
    if (sessionId) return sessionId;
    
    try {
      const response = await axios.post(`${API_BASE_URL}/chat/session`, { mobile });
      const newSessionId = response.data.sessionId;
      setSessionId(newSessionId);
      return newSessionId;
    } catch (error: any) {
      console.error('Error creating session:', error);
      // Fallback to demo session if API fails
      const demoSessionId = `demo_${Date.now()}`;
      setSessionId(demoSessionId);
      return demoSessionId;
    }
  };

  // Fetch question from API
  const fetchQuestion = async (code: string): Promise<Question | null> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/question?code=${code}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching question ${code}:`, error);
      // Return fallback question
      return getFallbackQuestion(code);
    }
  };

  // Get fallback question if not in database
  const getFallbackQuestion = (code: string): Question | null => {
    const fallbackQuestions: { [key: string]: Question } = {
      'welcome': {
        questionId: 'welcome',
        code: 'welcome',
        text: 'Please enter your mobile number to continue',
        questionType: 'text'
      },
      'course_category': {
        questionId: 'course_category',
        code: 'course_category',
        text: 'Which course category interests you most?',
        questionType: 'text'
      },
      'career_interests': {
        questionId: 'career_interests',
        code: 'career_interests',
        text: 'What are your main interests?',
        questionType: 'text'
      },
      'course_interest': {
        questionId: 'course_interest',
        code: 'course_interest',
        text: 'What course are you interested in?',
        questionType: 'text'
      },
      'income_range': {
        questionId: 'income_range',
        code: 'income_range',
        text: 'What is your annual family income range?',
        questionType: 'text'
      },
      'college_name': {
        questionId: 'college_name',
        code: 'college_name',
        text: 'Which college are you applying to?',
        questionType: 'text'
      }
    };
    return fallbackQuestions[code] || null;
  };

  // Save response to database
  const saveResponse = async (
    sessionId: string,
    questionCode: string,
    answerText?: string,
    answerValue?: string
  ): Promise<boolean> => {
    try {
      await axios.post(`${API_BASE_URL}/chat/response`, {
        sessionId,
        questionCode,
        answerText,
        answerValue
      });
      return true;
    } catch (error: any) {
      console.error('Error saving response:', error);
      return false;
    }
  };

  const handleQuickAction = async (action: string) => {
    const actionMessages: { [key: string]: string } = {
      assessment: "Great choice! Let's start with a quick career assessment. What are your main interests? (e.g., Technology, Medicine, Arts, Business)",
      colleges: "I'll help you find the best colleges. What course are you interested in? (Engineering, Medical, Arts, Commerce, etc.)",
      scholarships: "I can guide you to various scholarship opportunities. What's your annual family income range?",
      application: "I'll help you with your college application process. Which college are you applying to?"
    };

    setMessages(prev => [
      ...prev,
      { id: generateId(), role: 'user' as const, text: `Quick Action: ${action}`, timestamp: new Date() },
      { id: generateId(), role: 'bot' as const, text: actionMessages[action] || "How can I help you?", timestamp: new Date() }
    ]);

    // Update current question based on action
    if (action === 'assessment') {
      setCurrentQuestion({
        questionId: 'career_interests',
        code: 'career_interests',
        text: 'What are your main interests?',
        questionType: 'text'
      });
    } else if (action === 'colleges') {
      setCurrentQuestion({
        questionId: 'course_interest',
        code: 'course_interest',
        text: 'What course are you interested in?',
        questionType: 'text'
      });
    } else if (action === 'scholarships') {
      setCurrentQuestion({
        questionId: 'income_range',
        code: 'income_range',
        text: 'What is your annual family income range?',
        questionType: 'text'
      });
    } else if (action === 'application') {
      setCurrentQuestion({
        questionId: 'college_name',
        code: 'college_name',
        text: 'Which college are you applying to?',
        questionType: 'text'
      });
    }
  };

  const submit = async () => {
    if (!currentQuestion) return;
    
    const text = input.trim();
    if (!text) return;

    // Add user message
    const userMessage = { id: generateId(), role: 'user' as const, text, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      setLoading(true);
      
      // Handle session creation for mobile number
      let mobile = '';
      let actualSessionId = sessionId;
      if (!sessionId && currentQuestion.code === 'welcome') {
        mobile = text;
        // Validate mobile number
        if (!/^[0-9]{10,15}$/.test(mobile)) {
          setMessages(prev => [
            ...prev,
            { id: generateId(), role: 'bot' as const, text: 'Please enter a valid mobile number (10-15 digits).', timestamp: new Date() }
          ]);
          setLoading(false);
          return;
        }
        actualSessionId = await ensureSession(mobile);
      }

      // Save response for mobile number if session was just created
      if (actualSessionId && currentQuestion.code === 'welcome') {
        await saveResponse(actualSessionId, 'welcome', mobile, undefined);
      }
      
      // Save the current response to database before moving to next question (except welcome)
      if (actualSessionId && currentQuestion.code !== 'welcome') {
        await saveResponse(actualSessionId, currentQuestion.code, text, undefined);
      }

      // Determine next question code and bot response
      let nextQuestionCode: string | null = null;
      let botResponse: string = '';

      if (currentQuestion.code === 'welcome') {
        nextQuestionCode = 'course_category';
        botResponse = 'Perfect! Now, which course category interests you most?';
      } else if (currentQuestion.code === 'course_category') {
        nextQuestionCode = 'student_name';
        botResponse = 'Excellent choice! What is your full name for our records?';
      } else if (currentQuestion.code === 'student_name') {
        nextQuestionCode = 'preferred_location';
        botResponse = 'Great! What is your preferred study location? (City/State)';
      } else if (currentQuestion.code === 'preferred_location') {
        nextQuestionCode = 'budget';
        botResponse = 'What is your approximate annual tuition budget? (e.g., ₹2-5 Lakhs, ₹5-10 Lakhs)';
      } else if (currentQuestion.code === 'budget') {
        nextQuestionCode = 'exam_rank';
        botResponse = 'Have you appeared for any entrance exams? Please mention exam name and score/rank if available.';
      } else if (currentQuestion.code === 'exam_rank') {
        nextQuestionCode = 'need_hostel';
        botResponse = 'Do you need hostel accommodation? (Yes/No)';
      } else if (currentQuestion.code === 'need_hostel') {
        nextQuestionCode = 'need_scholarship';
        botResponse = 'Would you like guidance on scholarships and financial aid? (Yes/No)';
      } else if (currentQuestion.code === 'need_scholarship') {
        nextQuestionCode = null; // End of main flow
        botResponse = '🎉 Thank you! Our expert counselor will contact you within 24 hours with personalized college recommendations and admission guidance. You can also login to explore more options on Campus Yatra!';
      } else if (currentQuestion.code === 'career_interests') {
        nextQuestionCode = 'education_background';
        botResponse = 'Excellent! Based on your interests, I recommend exploring these career paths. What is your educational background? (10th, 12th, Graduation, etc.)';
      } else if (currentQuestion.code === 'course_interest') {
        nextQuestionCode = 'preferred_location';
        botResponse = 'Great choice! I can help you find colleges offering this course. What is your preferred location for studies?';
      } else if (currentQuestion.code === 'income_range') {
        nextQuestionCode = null; // End of scholarship flow
        botResponse = 'Perfect! Based on your income range, I can suggest suitable scholarship opportunities. Our counselor will contact you with personalized scholarship recommendations. You can also login to explore more options on Campus Yatra!';
      } else if (currentQuestion.code === 'college_name') {
        nextQuestionCode = 'application_help';
        botResponse = 'I can help you with the application process for that college. What specific help do you need? (Application form, Documents, Deadlines, etc.)';
      } else {
        nextQuestionCode = null;
        botResponse = 'Thank you for using Campus Yatra! Our counselor will reach out shortly. Feel free to explore more features on our platform.';
      }

      // Add bot response
      setMessages(prev => [
        ...prev,
        { id: generateId(), role: 'bot' as const, text: botResponse, timestamp: new Date() }
      ]);

      // Fetch and set next question from API
      if (nextQuestionCode && actualSessionId) {
        const nextQuestion = await fetchQuestion(nextQuestionCode);
        if (nextQuestion) {
          setCurrentQuestion(nextQuestion);
        } else {
          // Use fallback if question not found in database
          const fallback = getFallbackQuestion(nextQuestionCode);
          if (fallback) {
            setCurrentQuestion(fallback);
          }
        }
      } else if (!nextQuestionCode) {
        // End of conversation
        setCurrentQuestion({
          questionId: 'final_thanks',
          code: 'final_thanks',
          text: 'Thank you for using Campus Yatra!',
          questionType: 'text'
        });
      }
    } catch (error) {
      console.error('Error in chat submission:', error);
      setMessages(prev => [
        ...prev,
        { id: generateId(), role: 'bot' as const, text: 'Sorry, there was an error. Please try again or contact our support team.', timestamp: new Date() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      {!open && (
        <Fab 
          onClick={() => setOpen(true)} 
          aria-label="chat"
          sx={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 100%)',
              transform: 'scale(1.1)',
            }
          }}
        >
          <ChatIcon />
        </Fab>
      )}
      {open && (
        <Paper 
          elevation={6} 
          sx={{ 
            width: { xs: 320, sm: 380 }, 
            maxHeight: 600, 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            borderRadius: '20px'
          }}
        >
          {/* Header */}
          <Box sx={{ 
            p: 3, 
            background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)', 
            color: 'white', 
            position: 'relative',
            borderRadius: '20px 20px 0 0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <SchoolIcon sx={{ mr: 1 }} />
              <Typography variant="h6" fontWeight="bold">
                Campus Yatra Assistant
              </Typography>
            </Box>
            <Typography variant="caption">
              Get instant help with college admissions
            </Typography>
            <IconButton 
              aria-label="close" 
              size="small" 
              onClick={() => setOpen(false)} 
              sx={{ 
                position: 'absolute', 
                right: 12, 
                top: 12, 
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.3)'
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Divider />
          
          {/* Messages */}
          <Box sx={{ 
            p: 2, 
            flex: 1, 
            overflowY: 'auto', 
            backgroundColor: '#f8f9fa',
            minHeight: 300,
            maxHeight: 400
          }}>
            {messages.map((m) => (
              <Box key={m.id} sx={{ mb: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: m.role === 'bot' ? 'flex-start' : 'flex-end',
                  mb: 0.5
                }}>
                  <Box sx={{ 
                    px: 2, 
                    py: 1.5, 
                    borderRadius: '16px', 
                    maxWidth: '85%',
                    backgroundColor: m.role === 'bot' ? 'white' : '#FF6B35',
                    color: m.role === 'bot' ? '#333' : 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    border: m.role === 'bot' ? '1px solid #e0e0e0' : 'none'
                  }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                      {m.text}
                    </Typography>
                  </Box>
                </Box>
                {m.timestamp && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#999', 
                      fontSize: '0.7rem',
                      display: 'block',
                      textAlign: m.role === 'bot' ? 'left' : 'right',
                      px: 1
                    }}
                  >
                    {formatTime(m.timestamp)}
                  </Typography>
                )}
              </Box>
            ))}

            {/* Quick Actions - Show after mobile number is entered */}
            {messages.length > 3 && currentQuestion?.code === 'course_category' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="#666" sx={{ mb: 1, display: 'block' }}>
                  Quick Actions:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {quickActions.map((action, index) => (
                    <Chip
                      key={index}
                      label={action.label}
                      size="small"
                      clickable
                      onClick={() => handleQuickAction(action.action)}
                      sx={{
                        fontSize: '0.7rem',
                        backgroundColor: 'white',
                        border: '1px solid #FF6B35',
                        color: '#FF6B35',
                        '&:hover': {
                          backgroundColor: '#FF6B35',
                          color: 'white'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Loading Indicator */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                <Box sx={{ 
                  px: 2, 
                  py: 1.5, 
                  borderRadius: '16px', 
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="#666">
                    Typing...
                  </Typography>
                </Box>
              </Box>
            )}
            
            <div ref={scrollRef} />
          </Box>
          
          <Divider />
          
          {/* Input */}
          <Box sx={{ p: 2, backgroundColor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                size="small"
                fullWidth
                multiline
                maxRows={3}
                placeholder={currentQuestion?.code === 'welcome' ? 'Enter your mobile number' : 'Type your message...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    backgroundColor: '#f8f9fa'
                  }
                }}
              />
              <IconButton
                onClick={submit}
                disabled={loading || !input.trim()}
                sx={{
                  color: '#FF6B35',
                  backgroundColor: '#f8f9fa',
                  '&:hover': { 
                    backgroundColor: '#FF6B35',
                    color: 'white'
                  },
                  '&.Mui-disabled': { 
                    color: 'rgba(0,0,0,0.26)',
                    backgroundColor: '#f8f9fa'
                  },
                  borderRadius: '50%',
                  width: 40,
                  height: 40
                }}
              >
                <SendIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ChatBot;