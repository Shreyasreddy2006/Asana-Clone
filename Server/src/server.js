const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/database');
const { errorHandler } = require('./utils/errorHandler');
const { initSocket } = require('./utils/socket');
const { httpLogger, log } = require('./utils/logger');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware - Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// HTTP request logging
app.use(httpLogger);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const allowedOrigins = ['http://localhost:8080', 'http://localhost:8081'];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/workspaces', require('./routes/workspaces'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/teams', require('./routes/teams'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Asana Clone API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handler - must be last
app.use(errorHandler);

const PORT = process.env.PORT || 8765;

const server = app.listen(PORT, () => {
  log.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);

  // Initialize Socket.io after server is listening
  initSocket(server);
  log.info('Socket.io initialized');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  log.error('Unhandled Promise Rejection', { error: err.message, stack: err.stack });
  server.close(() => process.exit(1));
});

module.exports = app;
