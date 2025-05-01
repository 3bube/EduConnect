import { Server } from 'socket.io';
import http from 'http';

interface ClassParticipant {
  userId: string;
  name: string;
  avatar: string;
  role: 'instructor' | 'student';
  socketId: string;
}

class SocketService {
  private io: Server | null = null;
  private liveClassParticipants: Map<string, ClassParticipant[]> = new Map();

  initialize(server: http.Server): void {
    this.io = new Server(server, {
      cors: {
        origin: '*', // In production, set this to your frontend URL
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Join a live class
      socket.on('join-live-class', (data: { classId: string, user: any }) => {
        const { classId, user } = data;
        
        // Add user to participants list for this class
        if (!this.liveClassParticipants.has(classId)) {
          this.liveClassParticipants.set(classId, []);
        }

        const participant: ClassParticipant = {
          userId: user._id || user.id,
          name: user.name,
          avatar: user.avatar || '', 
          role: user.role || 'student',
          socketId: socket.id
        };

        // Add to class room
        socket.join(classId);
        
        const participants = this.liveClassParticipants.get(classId) || [];
        participants.push(participant);
        this.liveClassParticipants.set(classId, participants);

        // Broadcast updated participants list to everyone in the class
        this.io?.to(classId).emit('participants-updated', {
          participants: this.liveClassParticipants.get(classId)
        });

        console.log(`User ${participant.name} joined class ${classId}`);
      });

      // User leaves a live class
      socket.on('leave-live-class', (data: { classId: string, userId: string }) => {
        const { classId, userId } = data;
        this.removeParticipant(classId, userId, socket.id);
        socket.leave(classId);
      });

      // Handle chat messages
      socket.on('send-message', (data: { classId: string, message: any }) => {
        const { classId, message } = data;
        this.io?.to(classId).emit('new-message', message);
      });

      // Handle raise hand
      socket.on('raise-hand', (data: { classId: string, userId: string, raised: boolean }) => {
        const { classId, userId, raised } = data;
        this.io?.to(classId).emit('student-raised-hand', { userId, raised });
      });

      // Disconnect
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        // Remove user from all live classes
        this.liveClassParticipants.forEach((participants, classId) => {
          this.removeParticipant(classId, '', socket.id);
        });
      });
    });
  }

  // Remove a participant from a class
  private removeParticipant(classId: string, userId: string, socketId: string): void {
    if (this.liveClassParticipants.has(classId)) {
      let participants = this.liveClassParticipants.get(classId) || [];
      
      // Filter by userId if provided, otherwise by socketId
      if (userId) {
        participants = participants.filter(p => p.userId !== userId);
      } else {
        participants = participants.filter(p => p.socketId !== socketId);
      }
      
      this.liveClassParticipants.set(classId, participants);
      
      // Broadcast updated participants list
      this.io?.to(classId).emit('participants-updated', {
        participants: this.liveClassParticipants.get(classId)
      });
    }
  }

  // Get instance (Singleton)
  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }
  
  private static instance: SocketService;
}

export default SocketService.getInstance();
