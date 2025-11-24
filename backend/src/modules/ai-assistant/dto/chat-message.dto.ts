import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({
    description: 'Le message de l\'utilisateur',
    example: 'Comment puis-je prendre un rendez-vous?',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({
    description: 'ID de la conversation (optionnel pour continuer une conversation existante)',
    example: '507f1f77bcf86cd799439011',
  })
  @IsString()
  @IsOptional()
  conversationId?: string;

  @ApiPropertyOptional({
    description: 'Contexte additionnel pour l\'assistant',
    example: {
      patientId: '123',
      module: 'appointments',
    },
  })
  @IsObject()
  @IsOptional()
  context?: {
    patientId?: string;
    consultationId?: string;
    module?: string;
  };
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'ID de la conversation',
    example: '507f1f77bcf86cd799439011',
  })
  conversationId: string;

  @ApiProperty({
    description: 'Réponse de l\'assistant',
    example: 'Pour prendre un rendez-vous, vous pouvez utiliser le module de consultation...',
  })
  message: string;

  @ApiProperty({
    description: 'Horodatage de la réponse',
    example: '2024-01-15T10:30:00Z',
  })
  timestamp: Date;

  @ApiPropertyOptional({
    description: 'Métadonnées additionnelles',
  })
  metadata?: {
    model?: string;
    tokensUsed?: number;
  };
}
