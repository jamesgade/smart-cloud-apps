import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const twilio = require('twilio');
const axios = require('axios');

@Injectable()
export class TwilioService {
  private twilioClient: any;
  private accountSid: string;
  private apiKeySid: string;
  private apiKeySecret: string;

  constructor(private configService: ConfigService) {
    this.accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID') || '';
    this.apiKeySid = this.configService.get<string>('TWILIO_API_KEY_SID') || '';
    this.apiKeySecret = this.configService.get<string>('TWILIO_API_KEY_SECRET') || '';
    
    // Validate required Twilio credentials
    if (!this.accountSid || !this.apiKeySid || !this.apiKeySecret) {
      console.error('Missing Twilio credentials:', {
        accountSid: !!this.accountSid,
        apiKeySid: !!this.apiKeySid,
        apiKeySecret: !!this.apiKeySecret,
        authToken: !!this.configService.get<string>('TWILIO_AUTH_TOKEN')
      });
      throw new Error('Missing required Twilio credentials. Please check environment variables.');
    }
    
    this.twilioClient = twilio(this.accountSid, this.configService.get<string>('TWILIO_AUTH_TOKEN'));
  }

  /**
   * Generate Twilio Video access token for a participant
   * @param identity - Unique identifier for the participant
   * @param roomName - Name of the video room
   * @param participantType - 'counsellor' or 'student'
   * @returns Twilio access token
   */
  generateAccessToken(identity: string, roomName: string, participantType: string): string {
    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    // Create an access token
    const token = new AccessToken(
      this.accountSid,
      this.apiKeySid,
      this.apiKeySecret,
      {
        identity: `${participantType}_${identity}`,
        ttl: 14400, // Token valid for 4 hours
      }
    );

    // Create a video grant for this token
    const videoGrant = new VideoGrant({
      room: roomName,
    });

    // Add the grant to the token
    token.addGrant(videoGrant);

    // Serialize the token to a JWT string
    return token.toJwt();
  }

  /**
   * Create or get existing Twilio room with recording enabled
   * Note: Twilio automatically creates rooms when participants join
   * This method is optional but can be used for explicit room creation
   */
  async createRoom(roomName: string): Promise<any> {
    try {
      // Check if room exists
      const rooms = await this.twilioClient.video.v1.rooms.list({ 
        uniqueName: roomName,
        limit: 1 
      });

      if (rooms.length > 0) {
        console.log(`📱 Room ${roomName} already exists`);
        return rooms[0];
      }

      // Try the simplest room creation first (current Twilio API)
      try {
        const room = await this.twilioClient.video.v1.rooms.create({
          uniqueName: roomName,
          maxParticipants: 2,
        });
        
        console.log(`✅ Created minimal room ${roomName} successfully`);
        return room;
      } catch (minimalError) {
        console.error('Minimal room creation failed:', minimalError);
        
        // If even minimal room creation fails, let Twilio auto-create on join
        throw new Error(`Room creation failed: ${minimalError.message}`);
      }
    } catch (error) {
      console.error('Error with Twilio room operations:', error);
      throw error;
    }
  }

  /**
   * Alternative: Let Twilio auto-create rooms (no explicit creation needed)
   * This is often the most reliable approach with current Twilio API
   */
  async ensureRoom(roomName: string): Promise<boolean> {
    try {
      // Just check if room exists, don't try to create
      const rooms = await this.twilioClient.video.v1.rooms.list({ 
        uniqueName: roomName,
        limit: 1 
      });

      if (rooms.length > 0) {
        console.log(`📱 Room ${roomName} exists`);
        return true;
      }

      console.log(`🚀 Room ${roomName} will be auto-created when participants join`);
      return false; // Room doesn't exist but that's OK
    } catch (error) {
      console.error('Error checking room status:', error);
      return false; // Assume room will be auto-created
    }
  }

  /**
   * Create a composition for the room (composite video recording)
   * This combines all participants into a single video file
   */
  async createComposition(roomSid: string): Promise<any> {
    try {
      console.log(`Creating composition for room: ${roomSid}`);
      
      // First check what recordings are available for this room
      const recordings = await this.twilioClient.video.v1.recordings.list({
        groupingSid: [roomSid],
        limit: 50
      });

      console.log(`Found ${recordings.length} recordings for composition:`);
      recordings.forEach((recording: any) => {
        console.log(`  - ${recording.sid}: type=${recording.type}, status=${recording.status}, trackName=${recording.trackName}`);
      });

      // Check for audio recordings specifically
      const audioRecordings = recordings.filter((recording: any) => recording.type === 'audio');
      const videoRecordings = recordings.filter((recording: any) => recording.type === 'video');
      
      console.log(`Audio recordings: ${audioRecordings.length}, Video recordings: ${videoRecordings.length}`);
      
      // Create composition optimized for 1-on-1 counseling sessions
      // This creates ONE video file with BOTH participants side-by-side and MIXED audio
      const composition = await this.twilioClient.video.v1.compositions.create({
        roomSid: roomSid,
        audioSources: '*', // Mix ALL audio tracks into one clear audio stream
        videoLayout: {
          grid: {
            video_sources: ['*'], // Include both participants
            video_sources_excluded: [],
            reuse: 'show_oldest', // Handle any duplicate tracks
            x_pos: 0,
            y_pos: 0,
            z_pos: 0,
            max_columns: 2, // Side-by-side layout for 1-on-1
            max_rows: 1,    // Single row
            cells_excluded: []
          }
        },
        resolution: '1280x720', // HD quality for professional sessions
        format: 'mp4', // Best compatibility with audio
        statusCallback: `${process.env['API_BASE_URL'] || 'http://localhost:7070'}/api/sessions/composition-webhook`,
        statusCallbackMethod: 'POST',
        trim: false // Keep full session duration
      });

      console.log(`Composition created with SID: ${composition.sid}, status: ${composition.status}`);
      console.log(`Audio sources: ${JSON.stringify(audioRecordings.map((r: any) => r.trackName || r.sid))}`);
      console.log(`Video sources: ${JSON.stringify(videoRecordings.map((r: any) => r.trackName || r.sid))}`);
      
      return composition;
    } catch (error) {
      console.error('Error creating composition:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }
  }

  /**
   * Create composition with presenter layout
   * One participant large (counsellor), one small (student) - like WhatsApp style
   */
  async createPresenterComposition(roomSid: string): Promise<any> {
    try {
      console.log(`Creating presenter-style composition for room: ${roomSid}`);
      
      const composition = await this.twilioClient.video.v1.compositions.create({
        roomSid: roomSid,
        audioSources: '*', // Mix all audio into one stream
        videoLayout: {
          presenter: {
            video_sources: ['*'], // Include all participants
            video_sources_excluded: [],
            reuse: 'show_oldest',
            // Presenter layout: main speaker large, others small
            presenter_video_source: 'speaker' // Auto-detect main speaker
          }
        },
        resolution: '1280x720',
        format: 'mp4',
        statusCallback: `${process.env['API_BASE_URL'] || 'http://localhost:7070'}/api/sessions/composition-webhook`,
        statusCallbackMethod: 'POST',
        trim: false
      });

      console.log(`Presenter Composition created with SID: ${composition.sid}`);
      return composition;
    } catch (error) {
      console.error('Error creating presenter composition:', error);
      // Fallback to grid layout if presenter layout fails
      console.log('Falling back to grid layout...');
      return this.createComposition(roomSid);
    }
  }

  /**
   * End/Complete a Twilio room
   */
  async endRoom(roomName: string): Promise<any> {
    try {
      const rooms = await this.twilioClient.video.v1.rooms.list({ 
        uniqueName: roomName,
        status: 'in-progress',
        limit: 1 
      });

      if (rooms.length > 0) {
        await this.twilioClient.video.v1.rooms(rooms[0].sid).update({
          status: 'completed'
        });
        return { message: 'Room ended successfully' };
      }

      return { message: 'No active room found' };
    } catch (error) {
      console.error('Error ending Twilio room:', error);
      throw error;
    }
  }

  /**
   * Get room details and participants
   */
  async getRoomDetails(roomName: string): Promise<any> {
    try {
      // Look for rooms with any status (in-progress or completed)
      const rooms = await this.twilioClient.video.v1.rooms.list({ 
        uniqueName: roomName,
        limit: 1 
      });

      if (rooms.length === 0) {
        console.log(`No room found with name: ${roomName}`);
        return null;
      }

      const room = rooms[0];
      console.log(`Found room: ${room.sid}, status: ${room.status}, uniqueName: ${room.uniqueName}`);
      
      try {
        const participants = await this.twilioClient.video.v1.rooms(room.sid).participants.list();
        console.log(`Room has ${participants.length} participants`);
        
        return {
          room,
          participants,
        };
      } catch (participantError) {
        console.error('Error getting participants, but returning room details:', participantError);
        return {
          room,
          participants: [],
        };
      }
    } catch (error) {
      console.error('Error getting room details:', error);
      throw error;
    }
  }

  /**
   * Get recordings for a specific room
   */
  async getRecordingsByRoomName(roomName: string): Promise<any> {
    try {
      // Validate Twilio client is initialized
      if (!this.twilioClient) {
        throw new Error('Twilio client not initialized. Please check credentials.');
      }

      console.log(`Getting recordings for room: ${roomName}`);
      
      // First get the room to find its SID
      const rooms = await this.twilioClient.video.v1.rooms.list({ 
        status: "completed",
        uniqueName: roomName,
        limit: 1 
      });

      console.log(`Found ${rooms.length} completed rooms for ${roomName}`);

      if (rooms.length === 0) {
        return { recordings: [], message: 'No room found with this name' };
      }

      const room = rooms[0];
      console.log(`Room details:`, { sid: room.sid, uniqueName: room.uniqueName, status: room.status });
      
      // Get recordings for this room
      const recordings = await this.twilioClient.video.v1.recordings.list({
        groupingSid: [room.sid], // Room SID
        limit: 50 // Adjust as needed
      });

      console.log(`Found ${recordings.length} recordings for room ${room.sid}`);

      // Also get compositions (which are often used for recordings)
      const compositions = await this.twilioClient.video.v1.compositions.list({
        roomSid: room.sid,
        limit: 50
      });

      console.log(`Found ${compositions.length} compositions for room ${room.sid}`);

      return {
        room: {
          sid: room.sid,
          uniqueName: room.uniqueName,
          status: room.status,
          duration: room.duration
        },
        recordings: recordings.map((recording: any) => ({
          sid: recording.sid,
          status: recording.status,
          type: recording.type,
          format: recording.format,
          duration: recording.duration,
          size: recording.size,
          createdAt: recording.dateCreated,
          groupingSid: recording.groupingSid,
          links: recording.links
        })),
        compositions: compositions.map((composition: any) => ({
          sid: composition.sid,
          status: composition.status,
          format: composition.format,
          duration: composition.duration,
          size: composition.size,
          createdAt: composition.dateCreated,
          roomSid: composition.roomSid,
          links: composition.links
        }))
      };
    } catch (error) {
      console.error('Error getting recordings:', error);
      
      // Check for credential-related errors
      const errorMessage = (error as any)?.message || '';
      const errorStatus = (error as any)?.status;
      if (errorMessage.includes('authenticate') || errorMessage.includes('credentials') || errorStatus === 401) {
        throw new Error('Twilio authentication failed. Please verify your Twilio credentials are correct.');
      }
      
      throw error;
    }
  }

  /**
   * Get recording details by SID
   */
  async getRecordingBySid(recordingSid: string): Promise<any> {
    try {
      // Try to get as a recording first
      try {
        const recording = await this.twilioClient.video.v1.recordings(recordingSid).fetch();
        return {
          type: 'recording',
          recording: {
            sid: recording.sid,
            status: recording.status,
            type: recording.type,
            format: recording.format,
            duration: recording.duration,
            size: recording.size,
            createdAt: recording.dateCreated,
            groupingSid: recording.groupingSid,
            links: recording.links
          }
        };
      } catch (recordingError) {
        // If not found as recording, try as composition
        const composition = await this.twilioClient.video.v1.compositions(recordingSid).fetch();
        return {
          type: 'composition',
          recording: {
            sid: composition.sid,
            status: composition.status,
            format: composition.format,
            duration: composition.duration,
            size: composition.size,
            createdAt: composition.dateCreated,
            roomSid: composition.roomSid,
            links: composition.links,
            downloadUrl: composition.links?.mp4 || composition.links?.webm
          }
        };
      }
    } catch (error) {
      console.error('Error getting recording by SID:', error);
      throw error;
    }
  }

  /**
   * Get authenticated media URL for streaming
   */
  async getAuthenticatedMediaUrl(recordingSid: string): Promise<string> {
    try {
      const recordingDetails = await this.getRecordingBySid(recordingSid);
      
      if (recordingDetails.type === 'composition' && recordingDetails.recording.downloadUrl) {
        // downloadUrl already contains the full URL
        return recordingDetails.recording.downloadUrl;
      }
      
      // For regular recordings, construct the full media URL
      if (recordingDetails.recording.links?.media) {
        const mediaPath = recordingDetails.recording.links.media;
        // Check if the media path already includes the domain
        if (mediaPath.startsWith('https://')) {
          return mediaPath;
        } else {
          const fullUrl = `https://video.twilio.com${mediaPath}`;
          return fullUrl;
        }
      }
      
      throw new Error('No media URL available for this recording');
    } catch (error) {
      console.error('Error getting authenticated media URL:', error);
      throw error;
    }
  }

  /**
   * Download recording by SID - WebM format
   * Returns an authenticated download URL that includes credentials
   */
  async downloadRecording(recordingSid: string): Promise<any> {
    try {
      // Validate Twilio client is initialized
      if (!this.twilioClient) {
        throw new Error('Twilio client not initialized. Please check credentials.');
      }

      console.log(`Getting download info for recording: ${recordingSid}`);
      
      const recordingDetails = await this.getRecordingBySid(recordingSid);
      
      console.log(`Recording details:`, recordingDetails);
      
      // For both compositions and recordings, we need to create authenticated URLs
      let mediaUrl: string;
      
      if (recordingDetails.type === 'composition' && recordingDetails.recording.links?.mp4) {
        mediaUrl = recordingDetails.recording.links.mp4;
      } else if (recordingDetails.recording.links?.media) {
        mediaUrl = recordingDetails.recording.links.media;
      } else {
        throw new Error('No media URL available for this recording');
      }
      
      // Ensure the URL is absolute
      if (!mediaUrl.startsWith('https://')) {
        mediaUrl = `https://video.twilio.com${mediaUrl}`;
      }
      
      // Create authenticated URL with basic auth credentials
      const url = new URL(mediaUrl);
      url.username = this.accountSid;
      url.password = this.twilioClient.password || this.configService.get<string>('TWILIO_AUTH_TOKEN');
      
      const authenticatedUrl = url.toString();
      
      console.log(`Generated authenticated download URL for recording ${recordingSid}`);
      
      return {
        downloadUrl: authenticatedUrl,
        filename: `session_recording_${recordingSid}.${recordingDetails.type === 'composition' ? 'mp4' : 'webm'}`,
        contentType: recordingDetails.type === 'composition' ? 'video/mp4' : 'video/webm'
      };
      
    } catch (error) {
      console.error('Error downloading recording:', error);
      
      // Check for credential-related errors
      const errorMessage = (error as any)?.message || '';
      const errorStatus = (error as any)?.status;
      if (errorMessage.includes('authenticate') || errorMessage.includes('credentials') || errorStatus === 401) {
        throw new Error('Twilio authentication failed. Please verify your Twilio credentials are correct.');
      }
      
      throw error;
    }
  }

  /**
   * Stream recording through the server as a proxy
   * This avoids exposing Twilio credentials to the frontend
   */
  async streamRecording(recordingSid: string, res: any, recordingType: 'composition' | 'recording' = 'recording'): Promise<void> {
    try {
      // Validate Twilio client is initialized
      if (!this.twilioClient) {
        throw new Error('Twilio client not initialized. Please check credentials.');
      }

      console.log(`Streaming ${recordingType}: ${recordingSid}`);
      
      let mediaUrl: string;
      let contentType: string;
      let filename: string;
      
      if (recordingType === 'composition') {
        // Handle composition streaming
        const composition = await this.twilioClient.video.v1.compositions(recordingSid).fetch();
        
        console.log('Composition links:', JSON.stringify(composition.links, null, 2));
        
        if (composition.links?.media) {
          mediaUrl = composition.links.media;
          // Compositions are typically MP4 format
          contentType = 'video/mp4';
          filename = `session_recording_${recordingSid}.mp4`;
        } else if (composition.links?.mp4) {
          mediaUrl = composition.links.mp4;
          contentType = 'video/mp4';
          filename = `session_recording_${recordingSid}.mp4`;
        } else if (composition.links?.webm) {
          mediaUrl = composition.links.webm;
          contentType = 'video/webm';
          filename = `session_recording_${recordingSid}.webm`;
        } else {
          console.error('Available composition links:', composition.links);
          throw new Error('No media URL available for this composition');
        }
      } else {
        // Handle regular recording streaming
        const recordingDetails = await this.getRecordingBySid(recordingSid);
        
        if (recordingDetails.recording.links?.media) {
          mediaUrl = recordingDetails.recording.links.media;
          contentType = 'video/webm';
          filename = `session_recording_${recordingSid}.webm`;
        } else {
          throw new Error('No media URL available for this recording');
        }
      }
      
      // Ensure the URL is absolute
      if (!mediaUrl.startsWith('https://')) {
        mediaUrl = `https://video.twilio.com${mediaUrl}`;
      }
      
      // axios is already imported at the top
      
      // Set up authentication for Twilio API
      const authHeader = Buffer.from(`${this.accountSid}:${this.configService.get<string>('TWILIO_AUTH_TOKEN')}`).toString('base64');
      
      // Stream the video from Twilio to the client
      const response = await axios({
        method: 'GET',
        url: mediaUrl,
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Accept': '*/*'
        },
        responseType: 'stream'
      });
      
      // Set appropriate headers for video with audio
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Accept-Ranges', 'bytes'); // Support range requests for video
      
      if (response.headers['content-length']) {
        res.setHeader('Content-Length', response.headers['content-length']);
      }
      
      // Copy other relevant headers that might affect audio/video playback
      if (response.headers['content-range']) {
        res.setHeader('Content-Range', response.headers['content-range']);
      }
      
      // Ensure proper caching headers for media files
      res.setHeader('Cache-Control', 'no-cache');
      
      // Pipe the video stream to the response
      response.data.pipe(res);
      
      console.log(`Successfully streaming ${recordingType} ${recordingSid}`);
      
    } catch (error) {
      console.error('Error streaming recording:', error);
      
      // Check for credential-related errors
      const errorMessage = (error as any)?.message || '';
      const errorStatus = (error as any)?.status;
      if (errorMessage.includes('authenticate') || errorMessage.includes('credentials') || errorStatus === 401) {
        throw new Error('Twilio authentication failed. Please verify your Twilio credentials are correct.');
      }
      
      throw error;
    }
  }

  /**
   * Debug method to list all tracks and recordings for a room
   */
  async debugRoomRecordings(roomSid: string): Promise<any> {
    try {
      console.log(`🔍 Debugging recordings for room: ${roomSid}`);
      
      // Get all recordings
      const recordings = await this.twilioClient.video.v1.recordings.list({
        groupingSid: [roomSid],
        limit: 50
      });

      console.log(`📁 Found ${recordings.length} total recordings`);
      
      const audioTracks: any[] = [];
      const videoTracks: any[] = [];
      
      recordings.forEach((recording: any, index: number) => {
        console.log(`📼 Recording ${index + 1}:`);
        console.log(`   SID: ${recording.sid}`);
        console.log(`   Type: ${recording.type}`);
        console.log(`   Status: ${recording.status}`);
        console.log(`   Track Name: ${recording.trackName || 'N/A'}`);
        console.log(`   Duration: ${recording.duration || 'N/A'} seconds`);
        console.log(`   Size: ${recording.size || 'N/A'} bytes`);
        console.log(`   Format: ${recording.format || 'N/A'}`);
        console.log(`   Created: ${recording.dateCreated}`);
        console.log(`   ---`);
        
        if (recording.type === 'audio') {
          audioTracks.push(recording);
        } else if (recording.type === 'video') {
          videoTracks.push(recording);
        }
      });
      
      console.log(`🔊 Audio tracks: ${audioTracks.length}`);
      console.log(`📹 Video tracks: ${videoTracks.length}`);
      
      // Check for compositions
      const compositions = await this.twilioClient.video.v1.compositions.list({
        roomSid: roomSid,
        limit: 10
      });
      
      console.log(`🎬 Compositions: ${compositions.length}`);
      compositions.forEach((comp: any, index: number) => {
        console.log(`   Composition ${index + 1}: ${comp.sid} - Status: ${comp.status}`);
      });
      
      return {
        totalRecordings: recordings.length,
        audioTracks: audioTracks.length,
        videoTracks: videoTracks.length,
        compositionCount: compositions.length,
        recordings: recordings,
        compositions: compositions
      };
      
    } catch (error) {
      console.error('Error debugging room recordings:', error);
      throw error;
    }
  }
}

