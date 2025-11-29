import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Send as SendIcon,
  Add as AddIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import axiosInstance from '../../libs/axiosInstance';
import { API_BASE_URL } from '../../libs/constants';

interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderType: 'STUDENT' | 'COUNSELLOR' | 'ADMIN';
  messageText: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  senderName?: string;
}

interface Conversation {
  conversationId: string;
  studentId: string;
  counsellorId?: string;
  subject: string;
  status: 'OPEN' | 'ASSIGNED' | 'CLOSED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  createdAt: string;
  updatedAt: string;
  counsellorName?: string;
  studentName?: string;
  unreadCount?: number;
}

const StudentMessaging: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newConversationSubject, setNewConversationSubject] = useState('');
  const [newConversationText, setNewConversationText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.conversationId);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`${API_BASE_URL}/messaging/conversations`);
      setConversations(response.data || []);
    } catch (err) {
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await axiosInstance.get(`${API_BASE_URL}/messaging/conversations/${conversationId}/messages`);
      setMessages(response.data || []);
    } catch (err) {
      setError('Failed to load messages. Please try again.');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const response = await axiosInstance.post(`${API_BASE_URL}/messaging/messages`, {
        conversationId: selectedConversation.conversationId,
        messageText: newMessage.trim(),
        messageType: 'TEXT'
      });

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
      
      // Update conversation timestamp
      setConversations(prev => 
        prev.map(conv => 
          conv.conversationId === selectedConversation.conversationId
            ? { ...conv, updatedAt: new Date().toISOString() }
            : conv
        )
      );
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const createConversation = async () => {
    if (!newConversationSubject.trim() || !newConversationText.trim()) return;

    try {
      setSending(true);
      const response = await axiosInstance.post(`${API_BASE_URL}/messaging/conversations`, {
        subject: newConversationSubject.trim(),
        messageText: newConversationText.trim()
      });

      setConversations(prev => [response.data, ...prev]);
      setCreateDialogOpen(false);
      setNewConversationSubject('');
      setNewConversationText('');
      setSelectedConversation(response.data);
    } catch (err) {
      setError('Failed to create conversation. Please try again.');
    } finally {
      setSending(false);
    }
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 120px)' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#333' }}>
          Messages
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton
            onClick={loadConversations}
            sx={{
              backgroundColor: '#f5f5f5',
              '&:hover': { backgroundColor: '#e0e0e0' }
            }}
            title="Refresh conversations"
          >
            <RefreshIcon />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #e55a2b 0%, #e8851a 100%)',
              },
            }}
          >
            New Message
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', height: '100%', gap: 2 }}>
        {/* Conversations List */}
        <Card sx={{ width: 350, height: '100%' }}>
          <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Conversations
              </Typography>
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {conversations.length > 0 ? (
                <List>
                  {conversations.map((conversation) => (
                    <React.Fragment key={conversation.conversationId}>
                      <ListItem
                        button
                        onClick={() => setSelectedConversation(conversation)}
                        sx={{
                          backgroundColor: selectedConversation?.conversationId === conversation.conversationId ? '#f5f5f5' : 'transparent',
                          '&:hover': { backgroundColor: '#f9f9f9' }
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ backgroundColor: '#FF6B35' }}>
                            <MessageIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography 
                              variant="subtitle2" 
                              sx={{ 
                                fontWeight: (conversation.unreadCount ?? 0) > 0 ? 700 : 600,
                                color: (conversation.unreadCount ?? 0) > 0 ? '#FF6B35' : 'inherit'
                              }}
                            >
                              {conversation.subject}
                              {(conversation.unreadCount ?? 0) > 0 && (
                                <Typography component="span" variant="caption" sx={{ ml: 1, color: '#FF6B35', fontWeight: 700 }}>
                                  (New)
                                </Typography>
                              )}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(conversation.updatedAt)}
                            </Typography>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <MessageIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No conversations yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start a new conversation to get help
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Messages Area */}
        <Card sx={{ flex: 1, height: '100%' }}>
          <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {selectedConversation.subject}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Messages */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <Box
                        key={message.messageId}
                        sx={{
                          display: 'flex',
                          justifyContent: message.senderType === 'STUDENT' ? 'flex-end' : 'flex-start',
                          mb: 2
                        }}
                      >
                        <Paper
                          sx={{
                            p: 2,
                            maxWidth: '70%',
                            backgroundColor: message.senderType === 'STUDENT' ? '#FF6B35' : '#f5f5f5',
                            color: message.senderType === 'STUDENT' ? 'white' : 'inherit',
                            border: !message.isRead && message.senderType !== 'STUDENT' ? '2px solid #FF6B35' : 'none'
                          }}
                        >
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              mb: 0.5,
                              fontWeight: !message.isRead && message.senderType !== 'STUDENT' ? 700 : 400
                            }}
                          >
                            {message.messageText}
                          </Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>
                            {formatDate(message.createdAt)}
                            {message.senderType !== 'STUDENT' && message.senderName && ` • ${message.senderName}`}
                            {!message.isRead && message.senderType !== 'STUDENT' && (
                              <Typography component="span" variant="caption" sx={{ ml: 1, fontWeight: 700 }}>
                                • New
                              </Typography>
                            )}
                          </Typography>
                        </Paper>
                      </Box>
                    ))
                  ) : (
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                      <MessageIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        No messages yet
                      </Typography>
                    </Box>
                  )}
                  <div ref={messagesEndRef} />
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      disabled={sending || selectedConversation.status === 'CLOSED'}
                    />
                    <Button
                      variant="contained"
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending || selectedConversation.status === 'CLOSED'}
                      sx={{
                        backgroundColor: '#FF6B35',
                        '&:hover': { backgroundColor: '#e55a2b' },
                        minWidth: 'auto',
                        px: 2
                      }}
                    >
                      {sending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <MessageIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    Select a conversation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Choose a conversation from the list to view messages
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Create Conversation Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Start New Conversation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Subject"
            value={newConversationSubject}
            onChange={(e) => setNewConversationSubject(e.target.value)}
            sx={{ mb: 2, mt: 1 }}
            placeholder="What do you need help with?"
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={newConversationText}
            onChange={(e) => setNewConversationText(e.target.value)}
            placeholder="Describe your question or concern..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={createConversation}
            variant="contained"
            disabled={!newConversationSubject.trim() || !newConversationText.trim() || sending}
            sx={{
              backgroundColor: '#FF6B35',
              '&:hover': { backgroundColor: '#e55a2b' }
            }}
          >
            {sending ? <CircularProgress size={20} color="inherit" /> : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentMessaging;
