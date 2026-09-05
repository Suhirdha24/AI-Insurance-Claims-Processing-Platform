import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

class SocketService {
  private io: SocketIOServer | null = null;

  init(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket) => {
      console.log(`[Socket.IO] Client connected: ${socket.id}`);

      socket.on('join_user', (userId: string) => {
        socket.join(`user:${userId}`);
      });

      socket.on('join_claim', (claimId: string) => {
        socket.join(`claim:${claimId}`);
      });

      socket.on('disconnect', () => {
        console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
      });
    });
  }

  emitClaimUpdate(claimId: string, event: string, data: any) {
    if (this.io) {
      this.io.to(`claim:${claimId}`).emit(event, data);
      this.io.emit('claim_updated', { claimId, event, data });
    }
  }

  emitUserNotification(userId: string, notification: any) {
    if (this.io) {
      this.io.to(`user:${userId}`).emit('notification', notification);
    }
  }
}

export const socketService = new SocketService();
