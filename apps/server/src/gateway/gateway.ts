import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    Logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    Logger.debug(`Client disconnected: ${client.id}`);
  }

  sendUpdate(data: any) {
    try {
      this.server.emit('update-user-statistic', data);
    } catch (error) {
      Logger.error('Error sending user statistics:', error);
    }
  }

  sendNotification(data: any) {
    try {
      this.server.emit('send-notification', data);
    } catch (error) {
      Logger.error('Error sending notification:', error);
    }
  }

  sendAdminStatistics(data: any) {
    try {
      this.server.emit('update-admin-statistics', data);
    } catch (error) {
      Logger.error('Error sending admin statistics:', error);
    }
  }
}
