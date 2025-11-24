import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { AiAssistantService } from '../services/ai-assistant.service';
import {
  SendMessageDto,
  ChatResponseDto,
} from '../dto/chat-message.dto';
import {
  CreateConversationDto,
  UpdateConversationDto,
  ConversationListDto,
} from '../dto/conversation.dto';

@ApiTags('AI Assistant')
@Controller('ai-assistant')
// @UseGuards(JwtAuthGuard) // Décommenter quand l'auth est prête
@ApiBearerAuth()
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @Post('chat')
  @ApiOperation({
    summary: 'Envoyer un message à l\'assistant IA',
    description: 'Envoie un message à l\'assistant et reçoit une réponse intelligente',
  })
  @ApiResponse({
    status: 200,
    description: 'Réponse de l\'assistant',
    type: ChatResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 404, description: 'Conversation non trouvée' })
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Request() req: any,
  ): Promise<ChatResponseDto> {
    // TODO: Récupérer l'ID utilisateur depuis req.user.id quand l'auth est prête
    const userId = req.user?.id || '507f1f77bcf86cd799439011'; // Mock user ID pour le développement

    const response = await this.aiAssistantService.sendMessage(userId, {
      conversationId: sendMessageDto.conversationId,
      message: sendMessageDto.message,
      context: sendMessageDto.context,
    });

    return response;
  }

  @Get('conversations')
  @ApiOperation({
    summary: 'Lister toutes les conversations',
    description: 'Récupère la liste de toutes les conversations de l\'utilisateur',
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des conversations',
    type: [ConversationListDto],
  })
  async getConversations(@Request() req: any): Promise<ConversationListDto[]> {
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    return this.aiAssistantService.getUserConversations(userId);
  }

  @Get('conversations/:id')
  @ApiOperation({
    summary: 'Récupérer une conversation',
    description: 'Récupère les détails d\'une conversation spécifique',
  })
  @ApiParam({ name: 'id', description: 'ID de la conversation' })
  @ApiResponse({ status: 200, description: 'Détails de la conversation' })
  @ApiResponse({ status: 404, description: 'Conversation non trouvée' })
  async getConversation(
    @Param('id') conversationId: string,
    @Request() req: any,
  ) {
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    return this.aiAssistantService.getConversation(userId, conversationId);
  }

  @Post('conversations')
  @ApiOperation({
    summary: 'Créer une nouvelle conversation',
    description: 'Crée une nouvelle conversation avec l\'assistant',
  })
  @ApiResponse({ status: 201, description: 'Conversation créée' })
  async createConversation(
    @Body() createConversationDto: CreateConversationDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id || '507f1f77bcf86cd799439011';

    const conversation = await this.aiAssistantService.createConversation(
      userId,
      createConversationDto.title,
    );

    // Si un message initial est fourni, l'envoyer
    if (createConversationDto.initialMessage) {
      await this.aiAssistantService.sendMessage(userId, {
        conversationId: conversation._id.toString(),
        message: createConversationDto.initialMessage,
      });
    }

    return conversation;
  }

  @Patch('conversations/:id')
  @ApiOperation({
    summary: 'Mettre à jour une conversation',
    description: 'Met à jour le titre ou le statut d\'une conversation',
  })
  @ApiParam({ name: 'id', description: 'ID de la conversation' })
  @ApiResponse({ status: 200, description: 'Conversation mise à jour' })
  @ApiResponse({ status: 404, description: 'Conversation non trouvée' })
  async updateConversation(
    @Param('id') conversationId: string,
    @Body() updateConversationDto: UpdateConversationDto,
    @Request() req: any,
  ) {
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    return this.aiAssistantService.updateConversation(
      userId,
      conversationId,
      updateConversationDto,
    );
  }

  @Delete('conversations/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Supprimer une conversation',
    description: 'Supprime (archive) une conversation',
  })
  @ApiParam({ name: 'id', description: 'ID de la conversation' })
  @ApiResponse({ status: 204, description: 'Conversation supprimée' })
  @ApiResponse({ status: 404, description: 'Conversation non trouvée' })
  async deleteConversation(
    @Param('id') conversationId: string,
    @Request() req: any,
  ) {
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    await this.aiAssistantService.deleteConversation(userId, conversationId);
  }

  @Post('conversations/:id/archive')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Archiver une conversation',
    description: 'Archive une conversation sans la supprimer',
  })
  @ApiParam({ name: 'id', description: 'ID de la conversation' })
  @ApiResponse({ status: 200, description: 'Conversation archivée' })
  @ApiResponse({ status: 404, description: 'Conversation non trouvée' })
  async archiveConversation(
    @Param('id') conversationId: string,
    @Request() req: any,
  ) {
    const userId = req.user?.id || '507f1f77bcf86cd799439011';
    await this.aiAssistantService.archiveConversation(userId, conversationId);
    return { message: 'Conversation archived successfully' };
  }
}
