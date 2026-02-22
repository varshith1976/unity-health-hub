// WebRTC Signaling Server Configuration
// This handles the signaling for peer-to-peer video calls

const { Server } = require('socket.io');
const http = require('http');

let io;
let server;

const initializeWebRTC = (app, server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // Store active rooms
  const rooms = new Map();

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a consultation room
    socket.on('join-room', ({ roomId, userId, userType }) => {
      socket.join(roomId);
      
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }
      rooms.get(roomId).add(socket.id);
      
      console.log(`User ${userId} (${userType}) joined room ${roomId}`);
      
      // Notify others in the room
      socket.to(roomId).emit('user-joined', { 
        socketId: socket.id, 
        userId, 
        userType 
      });
    });

    // Handle WebRTC signaling - offer
    socket.on('offer', ({ roomId, offer, targetSocketId }) => {
      console.log('Sending offer to:', targetSocketId);
      io.to(targetSocketId).emit('offer', {
        offer,
        senderSocketId: socket.id
      });
    });

    // Handle WebRTC signaling - answer
    socket.on('answer', ({ roomId, answer, targetSocketId }) => {
      console.log('Sending answer to:', targetSocketId);
      io.to(targetSocketId).emit('answer', {
        answer,
        senderSocketId: socket.id
      });
    });

    // Handle ICE candidates
    socket.on('ice-candidate', ({ roomId, candidate, targetSocketId }) => {
      io.to(targetSocketId).emit('ice-candidate', {
        candidate,
        senderSocketId: socket.id
      });
    });

    // Handle media state changes
    socket.on('media-state', ({ roomId, type, enabled }) => {
      socket.to(roomId).emit('media-state', {
        socketId: socket.id,
        type,
        enabled
      });
    });

    // Handle chat messages
    socket.on('chat-message', ({ roomId, message, senderId }) => {
      io.to(roomId).emit('chat-message', {
        message,
        senderId,
        timestamp: new Date().toISOString()
      });
    });

    // Handle screen sharing
    socket.on('screen-share-start', ({ roomId }) => {
      socket.to(roomId).emit('screen-share-start', {
        socketId: socket.id
      });
    });

    socket.on('screen-share-stop', ({ roomId }) => {
      socket.to(roomId).emit('screen-share-stop', {
        socketId: socket.id
      });
    });

    // Leave room
    socket.on('leave-room', ({ roomId }) => {
      handleLeaveRoom(socket, roomId);
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Remove from all rooms
      rooms.forEach((clients, roomId) => {
        if (clients.has(socket.id)) {
          handleLeaveRoom(socket, roomId);
        }
      });
    });
  });

  function handleLeaveRoom(socket, roomId) {
    socket.leave(roomId);
    
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(socket.id);
      
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
      }
    }
    
    socket.to(roomId).emit('user-left', {
      socketId: socket.id
    });
    
    console.log(`Socket ${socket.id} left room ${roomId}`);
  }

  console.log('WebRTC Signaling Server initialized');
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

module.exports = {
  initializeWebRTC,
  getIO
};
