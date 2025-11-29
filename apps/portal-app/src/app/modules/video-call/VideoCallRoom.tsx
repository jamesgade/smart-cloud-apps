import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  CallEnd as CallEndIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import axios from 'axios';
import Video, { LocalVideoTrack, LocalAudioTrack, RemoteParticipant, LocalParticipant } from 'twilio-video';

const VideoCallRoom: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState<any>(null);
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7070/api';

  useEffect(() => {
    joinRoom();

    return () => {
      if (room) {
        room.disconnect();
      }
    };
  }, [sessionId]);

  const joinRoom = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      const token = searchParams.get('token');
      if (!token) {
        throw new Error('No access token provided');
      }

      // Get session info and Twilio token from backend
      const response = await axios.get(
        `${API_BASE_URL}/sessions/${sessionId}/join`,
        {
          params: { token },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN_KEY')}`,
          },
        }
      );

      const { twilio_token, room_name, session } = response.data;
      setSessionInfo(session);

      // Connect to Twilio room with proper audio configuration
      const twilioRoom = await Video.connect(twilio_token, {
        name: room_name,
        audio: true, // Enable audio recording
        video: { 
          width: 640,
          height: 480,
          frameRate: 24
        },
        bandwidthProfile: {
          video: {
            mode: 'collaboration',
            maxTracks: 2,
            dominantSpeakerPriority: 'high'
          }
        },
        preferredAudioCodecs: ['opus'], // Use Opus for better audio quality
        preferredVideoCodecs: ['VP8', 'H264'],
        logLevel: 'info',
        insights: false,
      });

      setRoom(twilioRoom);

      // Attach local participant's tracks
      twilioRoom.localParticipant.tracks.forEach((publication) => {
        if (publication.track) {
          if (publication.track.kind === 'video' && localVideoRef.current) {
            const videoElement = publication.track.attach();
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            localVideoRef.current.appendChild(videoElement);
            console.log('✅ Local video track attached');
          } else if (publication.track.kind === 'audio') {
            console.log('✅ Local audio track enabled');
          }
        }
      });

      // Handle participant connections
      twilioRoom.participants.forEach(participantConnected);
      twilioRoom.on('participantConnected', participantConnected);
      twilioRoom.on('participantDisconnected', participantDisconnected);

      setIsConnecting(false);
    } catch (err: any) {
      console.error('Error joining room:', err);
      setError(err.response?.data?.message || err.message || 'Failed to join video call');
      setIsConnecting(false);
    }
  };

  const participantConnected = (participant: RemoteParticipant) => {
    console.log(`🔗 Participant connected: ${participant.identity}`);
    
    setParticipants((prevParticipants) => {
      // Ensure we never have more than 1 remote participant in a 1-on-1 session
      if (prevParticipants.length >= 1) {
        console.warn('⚠️ Already have a participant in this 1-on-1 session');
        return prevParticipants;
      }
      return [...prevParticipants, participant];
    });

    participant.tracks.forEach((publication) => {
      if (publication.isSubscribed && publication.track) {
        attachTrack(publication.track);
        console.log(`✅ Subscribed to ${publication.track.kind} track from ${participant.identity}`);
      }
    });

    participant.on('trackSubscribed', (track) => {
      attachTrack(track);
      console.log(`✅ New ${track.kind} track subscribed from ${participant.identity}`);
    });

    participant.on('trackUnsubscribed', (track) => {
      detachTrack(track);
      console.log(`🔌 ${track.kind} track unsubscribed from ${participant.identity}`);
    });

    participant.on('trackUnpublished', (publication) => {
      if (publication.track) {
        detachTrack(publication.track);
        console.log(`📡 ${publication.track.kind} track unpublished by ${participant.identity}`);
      }
    });
  };

  const participantDisconnected = (participant: RemoteParticipant) => {
    setParticipants((prevParticipants) =>
      prevParticipants.filter((p) => p !== participant)
    );
  };

  const attachTrack = (track: any) => {
    const trackElement = track.attach();
    
    if (track.kind === 'video' && remoteVideoRef.current) {
      // Clear any existing video elements first
      remoteVideoRef.current.innerHTML = '';
      
      // Apply comprehensive styling to ensure full container coverage
      Object.assign(trackElement.style, {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        minWidth: '100%',
        minHeight: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        zIndex: '1',
        display: 'block'
      });
      
      // Ensure the container is properly positioned
      if (remoteVideoRef.current.style) {
        remoteVideoRef.current.style.position = 'absolute';
        remoteVideoRef.current.style.inset = '0';
      }
      
      remoteVideoRef.current.appendChild(trackElement);
      console.log('✅ Remote video track attached with enhanced full screen styling');
    } else if (track.kind === 'audio') {
      // Audio tracks don't need a container, they play automatically
      // But we can append them to the document to ensure they're active
      document.body.appendChild(trackElement);
      console.log('✅ Remote audio track attached');
    }
  };

  const detachTrack = (track: any) => {
    track.detach().forEach((element: any) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    
    if (track.kind === 'video' && remoteVideoRef.current) {
      // Clear the remote video container when video track is removed
      remoteVideoRef.current.innerHTML = '';
      console.log('🔌 Remote video track detached');
    } else if (track.kind === 'audio') {
      console.log('🔌 Remote audio track detached');
    }
  };

  const toggleVideo = async () => {
    if (!room) return;

    try {
      if (isVideoEnabled) {
        // Turn off video: Unpublish all video tracks
        const videoPublications = Array.from(room.localParticipant.videoTracks.values());
        for (const publication of videoPublications) {
          if (publication.track) {
            room.localParticipant.unpublishTrack(publication.track);
            (publication.track as LocalVideoTrack).stop(); // Stop the camera
            console.log('📹 Video track unpublished and stopped (camera off)');
          }
        }
        
        // Clear local video display
        if (localVideoRef.current) {
          localVideoRef.current.innerHTML = '';
        }
      } else {
        // Turn on video: Create and publish a new video track
        try {
          const videoTrack = await Video.createLocalVideoTrack({
            width: 640,
            height: 480,
            frameRate: 24
          });
          
          await room.localParticipant.publishTrack(videoTrack);
          
          // Attach the new video track to local video element
          if (localVideoRef.current) {
            localVideoRef.current.innerHTML = ''; // Clear existing content
            const videoElement = videoTrack.attach();
            videoElement.style.width = '100%';
            videoElement.style.height = '100%';
            videoElement.style.objectFit = 'cover';
            videoElement.style.transform = 'scaleX(-1)'; // Mirror for natural feel
            localVideoRef.current.appendChild(videoElement);
          }
          
          console.log('📹 New video track published (camera on)');
        } catch (videoError) {
          console.error('Error creating video track:', videoError);
          alert('Unable to access camera. Please check your permissions.');
          return; // Don't update state if we failed to create video
        }
      }
      
      setIsVideoEnabled(!isVideoEnabled);
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  const toggleAudio = async () => {
    if (!room) return;

    try {
      if (isAudioEnabled) {
        // Mute: Unpublish all audio tracks to stop transmission
        const audioPublications = Array.from(room.localParticipant.audioTracks.values());
        for (const publication of audioPublications) {
          if (publication.track) {
            room.localParticipant.unpublishTrack(publication.track);
            (publication.track as LocalAudioTrack).stop(); // Stop the microphone
            console.log('🔇 Audio track unpublished and stopped (muted)');
          }
        }
      } else {
        // Unmute: Create and publish a new audio track
        try {
          const audioTrack = await Video.createLocalAudioTrack({
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          });
          
          await room.localParticipant.publishTrack(audioTrack);
          console.log('🔊 New audio track published (unmuted)');
        } catch (audioError) {
          console.error('Error creating audio track:', audioError);
          alert('Unable to access microphone. Please check your permissions.');
          return; // Don't update state if we failed to create audio
        }
      }
      
      setIsAudioEnabled(!isAudioEnabled);
    } catch (error) {
      console.error('Error toggling audio:', error);
    }
  };

  const endCall = async () => {
    try {
      if (room) {
        room.disconnect();
      }

      // Notify backend that call ended
      await axios.post(
        `${API_BASE_URL}/sessions/${sessionId}/end`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ACCESS_TOKEN_KEY')}`,
          },
        }
      );

      navigate('/calendar');
    } catch (err: any) {
      console.error('Error ending call:', err);
      navigate('/calendar');
    }
  };

  if (isConnecting) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        backgroundColor: '#1a1a1a',
      }}>
        <CircularProgress sx={{ color: '#ff6b35' }} />
        <Typography sx={{ mt: 2, color: 'white' }}>
          Connecting to video call...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        p: 3,
      }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={() => navigate('/calendar')}>
          Back to Calendar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', backgroundColor: '#1a1a1a', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, backgroundColor: '#2a2a2a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Counselling Session
          {sessionInfo && (
            <Chip 
              label={sessionInfo.appointment?.title} 
              size="small" 
              sx={{ ml: 2, backgroundColor: '#ff6b35', color: 'white' }}
            />
          )}
        </Typography>
        <Chip 
          label={`${Math.min(participants.length + 1, 2)} of 2 Participants`}
          icon={<PersonIcon />}
          size="small"
          sx={{ backgroundColor: '#4caf50', color: 'white' }}
        />
      </Box>

      {/* 1-on-1 Video Session Layout */}
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Full Screen: Other Participant (Counsellor/Student) */}
        <Box 
          ref={remoteVideoRef}
          sx={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            minWidth: '100%',
            minHeight: '100%',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            '& video': {
              width: '100% !important',
              height: '100% !important',
              minWidth: '100% !important',
              minHeight: '100% !important',
              maxWidth: '100% !important',
              maxHeight: '100% !important',
              objectFit: 'cover !important',
              position: 'absolute !important',
              top: '0 !important',
              left: '0 !important',
              right: '0 !important',
              bottom: '0 !important',
              zIndex: 1,
              display: 'block !important'
            },
          }}
        >
          {/* Waiting State */}
          {participants.length === 0 && (
            <Box sx={{ textAlign: 'center' }}>
              <PersonIcon sx={{ fontSize: 80, color: '#555', mb: 2 }} />
              <Typography sx={{ color: '#ccc', fontSize: '1.2rem', fontWeight: 500 }}>
                Waiting for the other participant to join...
              </Typography>
              <Typography sx={{ color: '#888', fontSize: '0.9rem', mt: 1 }}>
                Share the session link to start the counseling session
              </Typography>
            </Box>
          )}
          
          {/* Remote Participant Label */}
          {participants.length > 0 && (
            <Chip
              label={participants[0]?.identity?.replace(/^(counsellor_|student_)/, '').replace(/_/g, ' ') || 'Other Participant'}
              size="small"
              sx={{ 
                position: 'absolute', 
                top: 20, 
                left: 20, 
                backgroundColor: 'rgba(76, 175, 80, 0.9)',
                color: 'white',
                zIndex: 10,
                fontWeight: 600,
              }}
            />
          )}
          
          {/* Connection Quality Indicator */}
          <Box sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: '4px 8px',
            borderRadius: 1,
            zIndex: 10,
          }}>
            <Box sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: participants.length > 0 ? '#4caf50' : '#ff9800',
            }} />
            <Typography sx={{ color: 'white', fontSize: '0.75rem', fontWeight: 500 }}>
              {participants.length > 0 ? 'Connected' : 'Waiting'}
            </Typography>
          </Box>
        </Box>

        {/* Small Self Video - Bottom Right Corner */}
        <Box 
          ref={localVideoRef}
          sx={{ 
            position: 'absolute',
            bottom: 24,
            right: 24,
            width: 180,
            height: 135,
            backgroundColor: '#000', 
            borderRadius: 2,
            overflow: 'hidden',
            border: '3px solid #ff6b35',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            zIndex: 30,
            '& video': {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)', // Mirror self video for natural feel
            },
            // Responsive sizing
            '@media (max-width: 768px)': {
              width: 140,
              height: 105,
              bottom: 20,
              right: 20,
            },
            '@media (max-width: 480px)': {
              width: 110,
              height: 82,
              bottom: 16,
              right: 16,
            },
          }}
        >
          {/* Self Video Label */}
          <Chip
            label="You"
            size="small"
            sx={{ 
              position: 'absolute', 
              bottom: 6, 
              left: 6, 
              backgroundColor: 'rgba(255, 107, 53, 0.95)',
              color: 'white',
              zIndex: 35,
              fontSize: '0.65rem',
              height: 18,
              fontWeight: 600,
            }}
          />
          
          {/* Video Muted Overlay */}
          {!isVideoEnabled && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.85)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 32,
            }}>
              <VideocamOffIcon sx={{ color: 'white', fontSize: 28, mb: 0.5 }} />
              <Typography sx={{ color: 'white', fontSize: '0.6rem', textAlign: 'center' }}>
                Camera Off
              </Typography>
            </Box>
          )}
          
          {/* Audio Muted Indicator */}
          {!isAudioEnabled && (
            <Box sx={{
              position: 'absolute',
              top: 6,
              right: 6,
              backgroundColor: 'rgba(244, 67, 54, 0.9)',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 35,
            }}>
              <MicOffIcon sx={{ color: 'white', fontSize: 14 }} />
            </Box>
          )}
        </Box>
      </Box>

      {/* Controls */}
      <Box sx={{ 
        p: 3, 
        backgroundColor: '#2a2a2a', 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2,
      }}>
        <IconButton
          onClick={toggleAudio}
          sx={{
            backgroundColor: isAudioEnabled ? '#4caf50' : '#f44336',
            color: 'white',
            '&:hover': {
              backgroundColor: isAudioEnabled ? '#45a049' : '#d32f2f',
            },
          }}
        >
          {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
        </IconButton>

        <IconButton
          onClick={toggleVideo}
          sx={{
            backgroundColor: isVideoEnabled ? '#4caf50' : '#f44336',
            color: 'white',
            '&:hover': {
              backgroundColor: isVideoEnabled ? '#45a049' : '#d32f2f',
            },
          }}
        >
          {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
        </IconButton>

        <IconButton
          onClick={endCall}
          sx={{
            backgroundColor: '#f44336',
            color: 'white',
            '&:hover': {
              backgroundColor: '#d32f2f',
            },
            px: 3,
          }}
        >
          <CallEndIcon />
          <Typography sx={{ ml: 1, fontWeight: 600 }}>End Call</Typography>
        </IconButton>
      </Box>
    </Box>
  );
};

export default VideoCallRoom;

