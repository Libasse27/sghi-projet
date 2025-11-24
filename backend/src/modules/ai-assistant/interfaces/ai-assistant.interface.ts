export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatCompletionRequest {
  conversationId?: string;
  message: string;
  context?: {
    patientId?: string;
    consultationId?: string;
    module?: string;
  };
}

export interface ChatCompletionResponse {
  conversationId: string;
  message: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    tokensUsed?: number;
  };
}

export interface ConversationSummary {
  id: string;
  title: string;
  lastMessage: string;
  lastActivityAt: Date;
  messageCount: number;
}

export interface AIConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
  temperature?: number;
  enabled: boolean;
}
