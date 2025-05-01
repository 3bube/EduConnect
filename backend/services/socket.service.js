"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
class SocketService {
    constructor() {
        this.io = null;
        this.liveClassParticipants = new Map();
    }
    initialize(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: '*', // In production, set this to your frontend URL
                methods: ['GET', 'POST'],
                credentials: true
            }
        });
        this.io.on('connection', (socket) => {
            console.log('New client connected:', socket.id);
            // Join a live class
            socket.on('join-live-class', (data) => {
                var _a;
                const { classId, user } = data;
                // Add user to participants list for this class
                if (!this.liveClassParticipants.has(classId)) {
                    this.liveClassParticipants.set(classId, []);
                }
                const participant = {
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
                (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(classId).emit('participants-updated', {
                    participants: this.liveClassParticipants.get(classId)
                });
                console.log(`User ${participant.name} joined class ${classId}`);
            });
            // User leaves a live class
            socket.on('leave-live-class', (data) => {
                const { classId, userId } = data;
                this.removeParticipant(classId, userId, socket.id);
                socket.leave(classId);
            });
            // Handle chat messages
            socket.on('send-message', (data) => {
                var _a;
                const { classId, message } = data;
                (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(classId).emit('new-message', message);
            });
            // Handle raise hand
            socket.on('raise-hand', (data) => {
                var _a;
                const { classId, userId, raised } = data;
                (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(classId).emit('student-raised-hand', { userId, raised });
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
    removeParticipant(classId, userId, socketId) {
        var _a;
        if (this.liveClassParticipants.has(classId)) {
            let participants = this.liveClassParticipants.get(classId) || [];
            // Filter by userId if provided, otherwise by socketId
            if (userId) {
                participants = participants.filter(p => p.userId !== userId);
            }
            else {
                participants = participants.filter(p => p.socketId !== socketId);
            }
            this.liveClassParticipants.set(classId, participants);
            // Broadcast updated participants list
            (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(classId).emit('participants-updated', {
                participants: this.liveClassParticipants.get(classId)
            });
        }
    }
    // Get instance (Singleton)
    static getInstance() {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }
}
exports.default = SocketService.getInstance();
