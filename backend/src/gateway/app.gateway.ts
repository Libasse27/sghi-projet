import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/app',
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');
  private connectedClients: Map<string, Socket> = new Map();
  private userSockets: Map<string, Set<string>> = new Map(); // userId -> Set of socketIds

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.connectedClients.set(client.id, client);

    // Extract user ID from handshake query or auth token
    const userId = this.extractUserId(client);
    if (userId) {
      this.registerUserSocket(userId, client.id);
      client.emit('connected', { socketId: client.id, userId });
    }

    // Send current stats
    this.emitConnectionStats();
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);

    // Remove from user sockets
    const userId = this.extractUserId(client);
    if (userId) {
      this.unregisterUserSocket(userId, client.id);
    }

    this.emitConnectionStats();
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ): void {
    client.join(data.room);
    this.logger.log(`Client ${client.id} joined room: ${data.room}`);
    client.emit('room-joined', { room: data.room });

    // Notify others in the room
    client.to(data.room).emit('user-joined-room', {
      socketId: client.id,
      room: data.room,
    });
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ): void {
    client.leave(data.room);
    this.logger.log(`Client ${client.id} left room: ${data.room}`);
    client.emit('room-left', { room: data.room });

    // Notify others in the room
    client.to(data.room).emit('user-left-room', {
      socketId: client.id,
      room: data.room,
    });
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket): void {
    client.emit('pong', { timestamp: Date.now() });
  }

  // Public methods for emitting events from services

  /**
   * Emit event to a specific user (all their connected sockets)
   */
  emitToUser(userId: string, event: string, data: any): void {
    const socketIds = this.userSockets.get(userId);
    if (socketIds) {
      socketIds.forEach((socketId) => {
        const socket = this.connectedClients.get(socketId);
        if (socket) {
          socket.emit(event, data);
        }
      });
    }
  }

  /**
   * Emit event to a specific room
   */
  emitToRoom(room: string, event: string, data: any): void {
    this.server.to(room).emit(event, data);
  }

  /**
   * Emit event to all connected clients
   */
  emitToAll(event: string, data: any): void {
    this.server.emit(event, data);
  }

  /**
   * Emit event to specific socket
   */
  emitToSocket(socketId: string, event: string, data: any): void {
    const socket = this.connectedClients.get(socketId);
    if (socket) {
      socket.emit(event, data);
    }
  }

  /**
   * Get all connected user IDs
   */
  getConnectedUsers(): string[] {
    return Array.from(this.userSockets.keys());
  }

  /**
   * Get number of connected clients
   */
  getConnectionCount(): number {
    return this.connectedClients.size;
  }

  /**
   * Check if user is online
   */
  isUserOnline(userId: string): boolean {
    const sockets = this.userSockets.get(userId);
    return sockets ? sockets.size > 0 : false;
  }

  /**
   * Get rooms for a socket
   */
  getSocketRooms(socketId: string): string[] {
    const socket = this.connectedClients.get(socketId);
    if (socket) {
      return Array.from(socket.rooms).filter((room) => room !== socketId);
    }
    return [];
  }

  private extractUserId(client: Socket): string | null {
    // Try to extract from handshake query
    const userId = client.handshake.query.userId as string;
    if (userId) {
      return userId;
    }

    // Try to extract from auth token (if implemented)
    // const token = client.handshake.auth.token;
    // if (token) {
    //   return this.jwtService.decode(token)?.userId;
    // }

    return null;
  }

  private registerUserSocket(userId: string, socketId: string): void {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(socketId);

    this.logger.log(`User ${userId} registered socket ${socketId}`);
  }

  private unregisterUserSocket(userId: string, socketId: string): void {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }

    this.logger.log(`User ${userId} unregistered socket ${socketId}`);
  }

  private emitConnectionStats(): void {
    const stats = {
      totalConnections: this.connectedClients.size,
      uniqueUsers: this.userSockets.size,
      timestamp: new Date().toISOString(),
    };

    this.server.emit('connection-stats', stats);
  }
}
