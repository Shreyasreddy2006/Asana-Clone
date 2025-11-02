const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

let io;

// Initialize Socket.io
const initSocket = (server) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:8080';
  const allowedOrigins = [clientUrl, 'http://localhost:8080', 'http://localhost:8081'];

  io = socketIO(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true
    }
  });

  // Authentication middleware for socket connections
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join workspace rooms
    socket.on('join-workspace', (workspaceId) => {
      socket.join(`workspace:${workspaceId}`);
      console.log(`User ${socket.userId} joined workspace:${workspaceId}`);
    });

    // Leave workspace rooms
    socket.on('leave-workspace', (workspaceId) => {
      socket.leave(`workspace:${workspaceId}`);
      console.log(`User ${socket.userId} left workspace:${workspaceId}`);
    });

    // Join project rooms
    socket.on('join-project', (projectId) => {
      socket.join(`project:${projectId}`);
      console.log(`User ${socket.userId} joined project:${projectId}`);
    });

    // Leave project rooms
    socket.on('leave-project', (projectId) => {
      socket.leave(`project:${projectId}`);
      console.log(`User ${socket.userId} left project:${projectId}`);
    });

    // Join task rooms
    socket.on('join-task', (taskId) => {
      socket.join(`task:${taskId}`);
      console.log(`User ${socket.userId} joined task:${taskId}`);
    });

    // Leave task rooms
    socket.on('leave-task', (taskId) => {
      socket.leave(`task:${taskId}`);
      console.log(`User ${socket.userId} left task:${taskId}`);
    });

    // Typing indicators
    socket.on('typing-start', ({ taskId, userName }) => {
      socket.to(`task:${taskId}`).emit('user-typing', { userId: socket.userId, userName });
    });

    socket.on('typing-stop', ({ taskId }) => {
      socket.to(`task:${taskId}`).emit('user-stopped-typing', { userId: socket.userId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });

  return io;
};

// Get Socket.io instance
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Emit events for real-time updates
const emitTaskUpdate = (taskId, projectId, data) => {
  if (io) {
    io.to(`task:${taskId}`).emit('task-updated', data);
    io.to(`project:${projectId}`).emit('project-task-updated', data);
  }
};

const emitTaskCreate = (projectId, data) => {
  if (io) {
    io.to(`project:${projectId}`).emit('task-created', data);
  }
};

const emitTaskDelete = (taskId, projectId, data) => {
  if (io) {
    io.to(`task:${taskId}`).emit('task-deleted', data);
    io.to(`project:${projectId}`).emit('project-task-deleted', data);
  }
};

const emitCommentAdded = (taskId, data) => {
  if (io) {
    io.to(`task:${taskId}`).emit('comment-added', data);
  }
};

const emitCommentUpdated = (taskId, data) => {
  if (io) {
    io.to(`task:${taskId}`).emit('comment-updated', data);
  }
};

const emitCommentDeleted = (taskId, data) => {
  if (io) {
    io.to(`task:${taskId}`).emit('comment-deleted', data);
  }
};

const emitProjectUpdate = (projectId, workspaceId, data) => {
  if (io) {
    io.to(`project:${projectId}`).emit('project-updated', data);
    io.to(`workspace:${workspaceId}`).emit('workspace-project-updated', data);
  }
};

const emitProjectCreate = (workspaceId, data) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit('project-created', data);
  }
};

const emitProjectDelete = (projectId, workspaceId, data) => {
  if (io) {
    io.to(`project:${projectId}`).emit('project-deleted', data);
    io.to(`workspace:${workspaceId}`).emit('workspace-project-deleted', data);
  }
};

const emitWorkspaceUpdate = (workspaceId, data) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit('workspace-updated', data);
  }
};

const emitMemberAdded = (workspaceId, data) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit('member-added', data);
  }
};

const emitMemberRemoved = (workspaceId, data) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit('member-removed', data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitTaskUpdate,
  emitTaskCreate,
  emitTaskDelete,
  emitCommentAdded,
  emitCommentUpdated,
  emitCommentDeleted,
  emitProjectUpdate,
  emitProjectCreate,
  emitProjectDelete,
  emitWorkspaceUpdate,
  emitMemberAdded,
  emitMemberRemoved
};
