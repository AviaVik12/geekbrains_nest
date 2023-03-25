import { Socket, Server } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { OnEvent } from '@nestjs/event-emitter';
import { WsJwtGuard } from '../../auth/ws_jwt.guard';
import { CommentsService } from './comments.service';
import { EventsComment } from './events_comment.enum';

export type Comment = { message: string; idNews: number };

@WebSocketGateway()
export class SocketCommentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('addComment')
  async handleMessage(client: Socket, comment: Comment) {
    const { idNews, message } = comment;
    const userId: number = client.data.user.id;
    const _comment = await this.commentsService.create(idNews, message, userId);

    this.server.to(idNews.toString()).emit('newComment', _comment);
  }

  @OnEvent(EventsComment.remove)
  handleRemoveCommentEvent(payload) {
    const { commentId, newsId } = payload;
    this.server.to(newsId.toString()).emit('removeComment', { id: commentId });
  }

  @OnEvent(EventsComment.edit)
  handleEditCommentEvent(payload) {
    const { commentId, newsId, comment } = payload;
    console.log(commentId, newsId, comment);

    this.server
      .to(newsId.toString())
      .emit('editComment', { id: commentId, comment });
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Klijent otklücen: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const { newsId } = client.handshake.query;
    client.join(newsId);
    this.logger.log(`Klijent podklücen: ${client.id}`);
  }
}
