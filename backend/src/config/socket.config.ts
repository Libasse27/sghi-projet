import { registerAs } from '@nestjs/config';

export default registerAs('socket', () => ({
  // Configuration Socket.IO
  port: parseInt(process.env.SOCKET_PORT, 10) || parseInt(process.env.PORT, 10) || 3001,

  // CORS configuration for Socket.IO
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN?.split(',') || [
      'http://localhost:8080',  // Desktop app
      'http://localhost:3000',  // Mobile dev
      'http://localhost:5173',  // Vite dev server
    ],
    credentials: process.env.SOCKET_CORS_CREDENTIALS === 'true' || true,
    methods: ['GET', 'POST'],
  },

  // Namespace configuration
  namespaces: {
    emergency: '/emergency',      // Namespace pour les urgences
    laboratory: '/laboratory',    // Namespace pour le labo
    notifications: '/notifications', // Namespace pour les notifications
  },

  // Connection settings
  pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT, 10) || 60000,
  pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL, 10) || 25000,

  // Reconnection settings
  maxHttpBufferSize: parseInt(process.env.SOCKET_MAX_BUFFER_SIZE, 10) || 1e8, // 100MB

  // Transport methods
  transports: ['websocket', 'polling'],

  // Adapter configuration (for multi-server setup with Redis)
  adapter: {
    enabled: process.env.SOCKET_ADAPTER_ENABLED === 'true' || false,
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
    },
  },

  // Room configuration
  rooms: {
    emergency: 'emergency-updates',
    laboratory: 'laboratory-updates',
    notifications: 'user-notifications',
  },

  // Event names
  events: {
    // Emergency events
    emergencyCreated: 'emergency:created',
    emergencyUpdated: 'emergency:updated',
    emergencyTaken: 'emergency:taken',
    emergencyCompleted: 'emergency:completed',
    queueUpdated: 'emergency:queue-updated',

    // Laboratory events
    analysisRequested: 'laboratory:analysis-requested',
    analysisCompleted: 'laboratory:analysis-completed',
    resultsValidated: 'laboratory:results-validated',

    // Notification events
    notification: 'notification',
    notificationRead: 'notification:read',

    // Connection events
    connect: 'connection',
    disconnect: 'disconnect',
    error: 'error',
  },

  // Logging
  debug: process.env.NODE_ENV === 'development',
}));
