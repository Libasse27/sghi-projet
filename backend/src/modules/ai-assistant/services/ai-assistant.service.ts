import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, Types } from 'mongoose';
import axios from 'axios';
import { Conversation, ConversationDocument } from '../schemas/conversation.schema';
import {
  ChatMessage,
  ChatCompletionRequest,
  ChatCompletionResponse,
  ConversationSummary,
} from '../interfaces/ai-assistant.interface';

@Injectable()
export class AiAssistantService {
  private readonly logger = new Logger(AiAssistantService.name);
  private readonly openaiApiKey: string;
  private readonly openaiModel: string;
  private readonly maxTokens: number;
  private readonly enabled: boolean;

  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    private configService: ConfigService,
  ) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    this.openaiModel = this.configService.get<string>('OPENAI_MODEL') || 'gpt-4';
    this.maxTokens = this.configService.get<number>('OPENAI_MAX_TOKENS') || 2000;
    this.enabled = this.configService.get<boolean>('AI_ASSISTANT_ENABLED') !== false;
  }

  /**
   * Envoie un message à l'assistant IA
   */
  async sendMessage(
    userId: string,
    request: ChatCompletionRequest,
  ): Promise<ChatCompletionResponse> {
    if (!this.enabled) {
      throw new BadRequestException('AI Assistant is not enabled');
    }

    if (!this.openaiApiKey) {
      throw new BadRequestException('OpenAI API key not configured');
    }

    let conversation: ConversationDocument;

    // Récupérer ou créer la conversation
    if (request.conversationId) {
      conversation = await this.conversationModel.findOne({
        _id: request.conversationId,
        userId: new Types.ObjectId(userId),
      });

      if (!conversation) {
        throw new NotFoundException('Conversation not found');
      }
    } else {
      // Créer une nouvelle conversation
      conversation = await this.conversationModel.create({
        userId: new Types.ObjectId(userId),
        title: this.generateTitle(request.message),
        messages: [],
        status: 'active',
        lastActivityAt: new Date(),
      });
    }

    // Ajouter le message de l'utilisateur
    const userMessage: ChatMessage = {
      role: 'user',
      content: request.message,
      timestamp: new Date(),
    };
    conversation.messages.push(userMessage);

    // Préparer le contexte système
    const systemMessage = this.buildSystemMessage(request.context);

    // Construire l'historique des messages pour OpenAI
    const messages = [
      { role: 'system', content: systemMessage },
      ...conversation.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    try {
      // Appeler l'API OpenAI
      const response = await this.callOpenAI(messages);

      // Ajouter la réponse de l'assistant
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };
      conversation.messages.push(assistantMessage);
      conversation.lastActivityAt = new Date();

      await conversation.save();

      return {
        conversationId: conversation._id.toString(),
        message: response.message,
        timestamp: assistantMessage.timestamp,
        metadata: {
          model: this.openaiModel,
          tokensUsed: response.tokensUsed,
        },
      };
    } catch (error) {
      this.logger.error('Error calling OpenAI API', error.stack);
      throw new BadRequestException('Failed to get response from AI assistant');
    }
  }

  /**
   * Appelle l'API OpenAI
   */
  private async callOpenAI(messages: any[]): Promise<{ message: string; tokensUsed: number }> {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.openaiModel,
          messages,
          max_tokens: this.maxTokens,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.openaiApiKey}`,
          },
        },
      );

      return {
        message: response.data.choices[0].message.content,
        tokensUsed: response.data.usage?.total_tokens || 0,
      };
    } catch (error) {
      if (error.response) {
        this.logger.error('OpenAI API error', error.response.data);
        throw new BadRequestException(
          `OpenAI API error: ${error.response.data.error?.message || 'Unknown error'}`,
        );
      }
      throw error;
    }
  }

  /**
   * Construit le message système avec le contexte
   */
  private buildSystemMessage(context?: any): string {
    let systemMessage = `Tu es un assistant IA pour SGHI (Système de Gestion Hospitalière Intégré), un système de gestion hospitalière complet.

Ton rôle est d'aider les utilisateurs (personnel médical et patients) avec:
- Information sur les patients et dossiers médicaux
- Prise de rendez-vous et consultations
- Gestion des urgences et triage
- Informations sur les services (laboratoire, imagerie, pharmacie, etc.)
- Procédures administratives et facturation
- Questions générales sur le système hospitalier

Réponds de manière professionnelle, claire et concise en français. Si tu n'es pas sûr d'une information, dis-le clairement.`;

    if (context) {
      systemMessage += '\n\nContexte actuel:';
      if (context.patientId) {
        systemMessage += `\n- Patient ID: ${context.patientId}`;
      }
      if (context.consultationId) {
        systemMessage += `\n- Consultation ID: ${context.consultationId}`;
      }
      if (context.module) {
        systemMessage += `\n- Module: ${context.module}`;
      }
    }

    return systemMessage;
  }

  /**
   * Génère un titre pour la conversation basé sur le premier message
   */
  private generateTitle(message: string): string {
    const maxLength = 50;
    if (message.length <= maxLength) {
      return message;
    }
    return message.substring(0, maxLength) + '...';
  }

  /**
   * Récupère toutes les conversations d'un utilisateur
   */
  async getUserConversations(userId: string): Promise<ConversationSummary[]> {
    const conversations = await this.conversationModel
      .find({
        userId: new Types.ObjectId(userId),
        status: { $ne: 'deleted' },
      })
      .sort({ lastActivityAt: -1 })
      .lean();

    return conversations.map((conv) => ({
      id: conv._id.toString(),
      title: conv.title,
      lastMessage: conv.messages[conv.messages.length - 1]?.content || '',
      lastActivityAt: conv.lastActivityAt,
      messageCount: conv.messages.length,
    }));
  }

  /**
   * Récupère une conversation spécifique
   */
  async getConversation(userId: string, conversationId: string): Promise<ConversationDocument> {
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
      userId: new Types.ObjectId(userId),
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  /**
   * Crée une nouvelle conversation
   */
  async createConversation(userId: string, title: string): Promise<ConversationDocument> {
    return this.conversationModel.create({
      userId: new Types.ObjectId(userId),
      title,
      messages: [],
      status: 'active',
      lastActivityAt: new Date(),
    });
  }

  /**
   * Met à jour une conversation
   */
  async updateConversation(
    userId: string,
    conversationId: string,
    updates: Partial<Conversation>,
  ): Promise<ConversationDocument> {
    const conversation = await this.conversationModel.findOneAndUpdate(
      {
        _id: conversationId,
        userId: new Types.ObjectId(userId),
      },
      { $set: updates },
      { new: true },
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return conversation;
  }

  /**
   * Supprime une conversation (soft delete)
   */
  async deleteConversation(userId: string, conversationId: string): Promise<void> {
    const result = await this.conversationModel.updateOne(
      {
        _id: conversationId,
        userId: new Types.ObjectId(userId),
      },
      { $set: { status: 'deleted' } },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundException('Conversation not found');
    }
  }

  /**
   * Archive une conversation
   */
  async archiveConversation(userId: string, conversationId: string): Promise<void> {
    await this.updateConversation(userId, conversationId, { status: 'archived' });
  }
}
