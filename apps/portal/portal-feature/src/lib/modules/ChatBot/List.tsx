import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  InputAdornment,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface ChatSession {
  sessionId: string;
  mobile: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatResponse {
  responseId: string;
  sessionId: string;
  questionId: string;
  answerText: string | null;
  answerValue: string | null;
  createdAt: string;
  question?: {
    questionId: string;
    code: string;
    text: string;
    questionType: string;
  };
}

interface SessionWithResponses {
  session: ChatSession;
  responses: ChatResponse[];
}

const ChatBotList: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<SessionWithResponses | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ACCESS_TOKEN_KEY');
      const response = await axios.get(`${API_BASE_URL}/chat/sessions`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSessions(response.data);
    } catch (err: any) {
      setError('Failed to fetch chat sessions');
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };


  const toggleSessionExpansion = async (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    
    if (expandedSessions.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      // Fetch responses if not already loaded
      if (!selectedSession || selectedSession.session.sessionId !== sessionId) {
        try {
          const token = localStorage.getItem('ACCESS_TOKEN_KEY');
          const response = await axios.get(`${API_BASE_URL}/chat/sessions/${sessionId}/responses`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setSelectedSession(response.data);
        } catch (err: any) {
          setError('Failed to fetch session responses');
          console.error('Error fetching responses:', err);
          return;
        }
      }
      newExpanded.add(sessionId);
    }
    
    setExpandedSessions(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'abandoned':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredSessions = sessions.filter(session =>
    session.mobile.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Chatbot Responses
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        View and manage all chatbot conversations and responses
      </Typography>

      <Paper sx={{ mt: 3, p: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by mobile number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mobile Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Last Updated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSessions.map((session) => (
                <React.Fragment key={session.sessionId}>
                  <TableRow hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <IconButton
                          onClick={() => toggleSessionExpansion(session.sessionId)}
                          color="primary"
                          size="small"
                        >
                          <ExpandMoreIcon 
                            sx={{ 
                              transform: expandedSessions.has(session.sessionId) ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s'
                            }} 
                          />
                        </IconButton>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PhoneIcon fontSize="small" color="action" />
                          {session.mobile}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={session.status}
                        color={getStatusColor(session.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <TimeIcon fontSize="small" color="action" />
                        {formatDate(session.createdAt)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {formatDate(session.updatedAt)}
                    </TableCell>
                  </TableRow>
                  
                  {/* Expanded Content */}
                  <TableRow>
                    <TableCell colSpan={4} sx={{ padding: 0, border: 'none' }}>
                      <Collapse in={expandedSessions.has(session.sessionId)} timeout="auto" unmountOnExit>
                        <Box sx={{ padding: 2, backgroundColor: '#f8f9fa' }}>
                          {selectedSession && selectedSession.session.sessionId === session.sessionId ? (
                            <Box>
                              <Typography variant="h6" gutterBottom>
                                Conversation Details
                              </Typography>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Mobile: {selectedSession.session.mobile} | 
                                Status: {selectedSession.session.status} | 
                                Created: {formatDate(selectedSession.session.createdAt)}
                              </Typography>
                              
                              <Divider sx={{ my: 2 }} />
                              
                              {selectedSession.responses.map((response, index) => (
                                <Card key={response.responseId} sx={{ mb: 2 }}>
                                  <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                      <Typography variant="subtitle2" color="primary">
                                        Q{index + 1}: {response.question?.text || 'Question not found'}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {formatDate(response.createdAt)}
                                      </Typography>
                                    </Box>
                                    <Typography variant="body1" sx={{ mt: 1 }}>
                                      <strong>Answer:</strong> {response.answerText || response.answerValue || 'No answer provided'}
                                    </Typography>
                                    {response.question && (
                                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                        Question Code: {response.question.code}
                                      </Typography>
                                    )}
                                  </CardContent>
                                </Card>
                              ))}

                              {selectedSession.responses.length === 0 && (
                                <Box textAlign="center" py={4}>
                                  <Typography variant="body1" color="text.secondary">
                                    No responses found for this session
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          ) : (
                            <Box textAlign="center" py={2}>
                              <CircularProgress size={24} />
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Loading conversation...
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredSessions.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              No chat sessions found
            </Typography>
          </Box>
        )}
      </Paper>

    </Box>
  );
};

export default ChatBotList;
