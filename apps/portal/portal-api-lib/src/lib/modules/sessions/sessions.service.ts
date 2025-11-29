import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session, SessionStatus, Appointment, AppointmentStatus } from '@smart-cloud-apps/common-api-lib';
import { TwilioService } from './twilio.service';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    @InjectRepository(SessionStatus)
    private readonly sessionStatusRepository: Repository<SessionStatus>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(AppointmentStatus)
    private readonly appointmentStatusRepository: Repository<AppointmentStatus>,
    private readonly twilioService: TwilioService,
  ) {}

  async launchSession(appointmentId: string, counsellorId: string) {
    try {
      // Get appointment
      const appointment = await this.appointmentRepository.findOne({
        where: { appointmentId },
        relations: ['status', 'student', 'counsellor'],
      });

      if (!appointment) {
        throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
      }

      // Verify counsellor
      if (appointment.counsellorId !== counsellorId) {
        throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
      }

      // Check if appointment is confirmed
      if (appointment.status.statusCode !== 'CONFIRMED') {
        throw new HttpException(
          'Appointment must be confirmed before launching session',
          HttpStatus.BAD_REQUEST
        );
      }

      // Check if session already exists
      const existingSession = await this.sessionRepository.findOne({
        where: { appointmentId },
      });

      if (existingSession) {
        throw new HttpException('Session already exists for this appointment', HttpStatus.CONFLICT);
      }

      // Get CREATED status
      const createdStatus = await this.sessionStatusRepository.findOne({
        where: { statusCode: 'CREATED' },
      });

      // Create session
      const session = this.sessionRepository.create({
        appointmentId,
        statusId: createdStatus.statusId,
        launchedAt: new Date(),
        createdBy: counsellorId,
        updatedBy: counsellorId,
      });

      const savedSession = await this.sessionRepository.save(session);

      // Create Twilio room with recording enabled and generate access token for counsellor
      const roomName = `session_${savedSession.sessionId}`;
      
      // Ensure room exists or let Twilio auto-create it
      try {
        const roomExists = await this.twilioService.ensureRoom(roomName);
        if (roomExists) {
          console.log(`✅ Using existing room ${roomName}`);
        } else {
          console.log(`🚀 Room ${roomName} will be auto-created when participants join`);
        }
      } catch (roomError) {
        console.error('Room check failed, but continuing with session launch:', roomError);
        console.log('📝 Note: Twilio will auto-create room when participants join');
      }
      
      const counsellorToken = this.twilioService.generateAccessToken(
        counsellorId,
        roomName,
        'counsellor'
      );

      return {
        session_id: savedSession.sessionId,
        counsellor_token: counsellorToken,
        room_name: roomName,
        appointment: appointment,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to launch session',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getJoinToken(sessionId: string, userId: string) {
    try {
      const session = await this.sessionRepository.findOne({
        where: { sessionId },
        relations: ['appointment', 'appointment.student', 'appointment.counsellor'],
      });

      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      // Verify user is participant
      const isStudent = session.appointment.studentId === userId;
      const isCounsellor = session.appointment.counsellorId === userId;

      if (!isStudent && !isCounsellor) {
        throw new HttpException('Unauthorized', HttpStatus.FORBIDDEN);
      }

      // Generate Twilio access token
      const roomName = `session_${sessionId}`;
      const identity = isStudent ? `student_${userId}` : `counsellor_${userId}`;
      const twilioToken = this.twilioService.generateAccessToken(userId, roomName, identity);

      // Update joined status
      if (isCounsellor && !session.counsellorJoined) {
        session.counsellorJoined = true;
        session.counsellorJoinedAt = new Date();
      }

      if (isStudent && !session.studentJoined) {
        session.studentJoined = true;
        session.studentJoinedAt = new Date();
      }

      // Update session to ACTIVE if both joined
      if (session.counsellorJoined && session.studentJoined) {
        const activeStatus = await this.sessionStatusRepository.findOne({
          where: { statusCode: 'ACTIVE' },
        });
        session.statusId = activeStatus.statusId;
        
        if (!session.startedAt) {
          session.startedAt = new Date();
        }
      }

      await this.sessionRepository.save(session);

      return {
        twilio_token: twilioToken,
        room_name: roomName,
        session: session,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to get join token',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async endSession(sessionId: string, userId: string) {
    try {
      const session = await this.sessionRepository.findOne({
        where: { sessionId },
        relations: ['appointment'],
      });

      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      const completedStatus = await this.sessionStatusRepository.findOne({
        where: { statusCode: 'COMPLETED' },
      });

      const appointmentCompletedStatus = await this.appointmentStatusRepository.findOne({
        where: { statusCode: 'COMPLETED' },
      });

      // Calculate duration
      if (session.startedAt) {
        const endTime = new Date();
        const durationMs = endTime.getTime() - session.startedAt.getTime();
        session.durationMinutes = Math.round(durationMs / 60000);
      }

      session.statusId = completedStatus.statusId;
      session.endedAt = new Date();
      session.updatedBy = userId;

      await this.sessionRepository.save(session);

      // Update appointment status to COMPLETED
      const appointment = session.appointment;
      appointment.statusId = appointmentCompletedStatus.statusId;
      await this.appointmentRepository.save(appointment);

      // End the Twilio room and create composition for recording
      try {
        const roomName = `session_${sessionId}`;
        
        // First get the room details before ending
        const roomDetails = await this.twilioService.getRoomDetails(roomName);
        console.log('Room details before ending:', roomDetails);
        
        if (roomDetails && roomDetails.room) {
          const roomSid = roomDetails.room.sid;
          console.log(`Ending room ${roomName} with SID: ${roomSid}`);
          
          // End the room
          await this.twilioService.endRoom(roomName);
          
          // Create composition immediately after ending room
          setTimeout(async () => {
            try {
              console.log(`Creating composition for room SID: ${roomSid}`);
              
              // Try presenter layout first (WhatsApp style), fallback to grid
              try {
                await this.twilioService.createPresenterComposition(roomSid);
                console.log(`Presenter-style composition creation initiated for session ${sessionId}`);
              } catch (presenterError) {
                console.log('Presenter layout failed, trying grid layout...');
                await this.twilioService.createComposition(roomSid);
                console.log(`Grid-style composition creation initiated for session ${sessionId}`);
              }
            } catch (compositionError) {
              console.error('Error creating composition:', compositionError);
            }
          }, 10000); // Wait 10 seconds for room to end completely and recordings to be available
        } else {
          console.log(`No active room found for ${roomName}`);
        }
        
      } catch (roomError) {
        console.error('Error ending room:', roomError);
        // Don't fail the session end if room operations fail
      }

      return { message: 'Session ended successfully' };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to end session',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSession(sessionId: string) {
    try {
      const session = await this.sessionRepository.findOne({
        where: { sessionId },
        relations: ['appointment', 'appointment.student', 'appointment.counsellor', 'status'],
      });

      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      return session;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch session',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getSessionByAppointment(appointmentId: string) {
    try {
      const session = await this.sessionRepository.findOne({
        where: { appointmentId },
        relations: ['status'],
      });

      // Return null if no session exists (not an error)
      return session || null;
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch session',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async downloadAppointmentRecording(appointmentId: string) {
    try {
      // Get session for this appointment
      const session = await this.sessionRepository.findOne({
        where: { appointmentId },
        relations: ['status'],
      });

      if (!session) {
        throw new HttpException('No session found for this appointment', HttpStatus.NOT_FOUND);
      }

      if (session.status.statusCode !== 'COMPLETED') {
        throw new HttpException('Session must be completed to access recordings', HttpStatus.BAD_REQUEST);
      }

      // Return a streaming URL instead of direct Twilio URL
      const API_BASE_URL = process.env['API_BASE_URL'] || 'http://localhost:7070/api';
      const streamUrl = `${API_BASE_URL}/sessions/appointment/${appointmentId}/recording/stream`;
      
      return {
        success: true,
        downloadUrl: streamUrl,
        filename: `session_recording_${appointmentId}.webm`,
        contentType: 'video/webm',
        recordingDetails: {
          appointmentId: appointmentId,
          sessionId: session.sessionId
        }
      };

    } catch (error: any) {
      console.error('Download appointment recording error:', error);
      throw new HttpException(
        error.message || 'Failed to get recording download URL',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async streamAppointmentRecording(appointmentId: string, res: any, userId?: string) {
    try {
      // Get session for this appointment with appointment details
      const session = await this.sessionRepository.findOne({
        where: { appointmentId },
        relations: ['status', 'appointment', 'appointment.student', 'appointment.counsellor'],
      });

      if (!session) {
        throw new HttpException('No session found for this appointment', HttpStatus.NOT_FOUND);
      }

      if (session.status.statusCode !== 'COMPLETED') {
        throw new HttpException('Session must be completed to access recordings', HttpStatus.BAD_REQUEST);
      }

      // Check if user has permission to access this recording
      if (userId) {
        const isStudent = session.appointment.studentId === userId;
        const isCounsellor = session.appointment.counsellorId === userId;
        
        console.log('Authorization check:', { 
          userId, 
          studentId: session.appointment.studentId, 
          counsellorId: session.appointment.counsellorId,
          isStudent, 
          isCounsellor 
        });
        
        if (!isStudent && !isCounsellor) {
          throw new HttpException('Unauthorized to access this recording', HttpStatus.FORBIDDEN);
        }
      }

      // Generate room name from session ID
      const roomName = `session_${session.sessionId}`;
      // Get recordings for this room from Twilio
      const recordings = await this.twilioService.getRecordingsByRoomName(roomName);
      
      console.log('Debug - Full recordings response:', JSON.stringify(recordings, null, 2));
      
      // Prioritize compositions (composite videos) over individual recordings
      let targetRecording = null;
      
      if (recordings.compositions && recordings.compositions.length > 0) {
        console.log(`Found ${recordings.compositions.length} compositions`);
        
        // Use the most recent completed composition
        const completedCompositions = recordings.compositions.filter((comp: any) => 
          comp.status === 'completed'
        );
        
        console.log(`Found ${completedCompositions.length} completed compositions`);
        
        if (completedCompositions.length > 0) {
          targetRecording = completedCompositions.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          targetRecording.type = 'composition'; // Mark as composition for streaming
          console.log('Using composition:', targetRecording.sid);
        } else {
          console.log('No completed compositions found, checking pending ones:', recordings.compositions.map(c => ({ sid: c.sid, status: c.status })));
        }
      } else {
        console.log('No compositions found in recordings response');
      }
      
      // Fallback to individual video recordings if no composition available
      if (!targetRecording) {
        console.log('Falling back to individual recordings');
        
        const videoRecordings = recordings.recordings.filter((recording: any) => 
          recording.type === 'video' && recording.status === 'completed'
        );
        
        console.log(`Found ${videoRecordings.length} individual video recordings`);
        
        if (videoRecordings.length === 0) {
          throw new HttpException('No video recordings found for this session', HttpStatus.NOT_FOUND);
        }
        
        // Get the recording with the longest duration (main session)
        targetRecording = videoRecordings.reduce((longest: any, current: any) => 
          current.duration > longest.duration ? current : longest
        );
        targetRecording.type = 'recording'; // Mark as individual recording
        console.log('Using individual recording:', targetRecording.sid);
      }
      
      // Stream the recording through our server using Twilio's authenticated download
      await this.twilioService.streamRecording(targetRecording.sid, res, targetRecording.type as 'composition' | 'recording');
      
    } catch (error: any) {
      console.error('Stream appointment recording error:', error);
      throw new HttpException(
        error.message || 'Failed to stream recording',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async createCompositionForSession(sessionId: string, userId: string) {
    try {
      const session = await this.sessionRepository.findOne({
        where: { sessionId },
        relations: ['status', 'appointment'],
      });

      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      if (session.status.statusCode !== 'COMPLETED') {
        throw new HttpException('Session must be completed to create compositions', HttpStatus.BAD_REQUEST);
      }

      const roomName = `session_${sessionId}`;
      
      // Get room details
      const roomDetails = await this.twilioService.getRoomDetails(roomName);
      
      if (!roomDetails || !roomDetails.room) {
        throw new HttpException('No room found for this session', HttpStatus.NOT_FOUND);
      }

      console.log(`Manually creating composition for session ${sessionId}, room SID: ${roomDetails.room.sid}`);
      
      // Create composition - try presenter layout first, fallback to grid
      let composition;
      try {
        composition = await this.twilioService.createPresenterComposition(roomDetails.room.sid);
        console.log('Created presenter-style composition');
      } catch (presenterError) {
        console.log('Presenter layout failed, using grid layout');
        composition = await this.twilioService.createComposition(roomDetails.room.sid);
        console.log('Created grid-style composition');
      }
      
      return {
        success: true,
        message: 'Composition creation initiated',
        compositionSid: composition.sid,
        roomSid: roomDetails.room.sid,
        sessionId: sessionId
      };
      
    } catch (error: any) {
      console.error('Create composition for session error:', error);
      throw new HttpException(
        error.message || 'Failed to create composition',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async debugSessionRecordings(sessionId: string, userId: string) {
    try {
      const session = await this.sessionRepository.findOne({
        where: { sessionId },
        relations: ['status'],
      });

      if (!session) {
        throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
      }

      const roomName = `session_${sessionId}`;
      
      // Get room details
      const roomDetails = await this.twilioService.getRoomDetails(roomName);
      
      if (!roomDetails || !roomDetails.room) {
        throw new HttpException('No room found for this session', HttpStatus.NOT_FOUND);
      }

      console.log(`🔍 Debugging recordings for session ${sessionId}, room SID: ${roomDetails.room.sid}`);
      
      // Debug all recordings and tracks
      const debugInfo = await this.twilioService.debugRoomRecordings(roomDetails.room.sid);
      
      return {
        success: true,
        sessionId: sessionId,
        roomSid: roomDetails.room.sid,
        roomName: roomName,
        sessionStatus: session.status.statusCode,
        debugInfo: debugInfo
      };
      
    } catch (error: any) {
      console.error('Debug session recordings error:', error);
      throw new HttpException(
        error.message || 'Failed to debug recordings',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}

