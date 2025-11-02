const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    // Join workspace rooms
    socket.on('join-workspace', (workspaceId) => {
      socket.join(`workspace:${workspaceId}`);
      console.log(`User ${socket.userId} joined workspace ${workspaceId}`);
    });

    // Join project rooms
    socket.on('join-project', (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`User ${socket.userId} joined project ${projectId}`);
    });

    // Leave workspace rooms
    socket.on('leave-workspace', (workspaceId) => {
      socket.leave(`workspace:${workspaceId}`);
      console.log(`User ${socket.userId} left workspace ${workspaceId}`);
    });

    // Leave project rooms
    socket.on('leave-project', (projectId) => {
      socket.leave(`project:${projectId}`);
      console.log(`User ${socket.userId} left project ${projectId}`);
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

// Emit events to specific rooms
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

const emitToWorkspace = (workspaceId, event, data) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit(event, data);
  }
};

const emitToProject = (projectId, event, data) => {
  if (io) {
    io.to(`project:${projectId}`).emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  emitToUser,
  emitToWorkspace,
  emitToProject,
};
