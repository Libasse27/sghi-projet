import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConversationDto {
  @ApiProperty({
    description: 'Titre de la conversation',
    example: 'Questions sur les rendez-vous',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Message initial optionnel',
    example: 'Bonjour, j\'ai besoin d\'aide',
  })
  @IsString()
  @IsOptional()
  initialMessage?: string;
}

export class UpdateConversationDto {
  @ApiPropertyOptional({
    description: 'Nouveau titre de la conversation',
    example: 'Questions résolues sur les rendez-vous',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Statut de la conversation',
    example: 'archived',
    enum: ['active', 'archived', 'deleted'],
  })
  @IsEnum(['active', 'archived', 'deleted'])
  @IsOptional()
  status?: string;
}

export class ConversationListDto {
  @ApiProperty({
    description: 'ID de la conversation',
  })
  id: string;

  @ApiProperty({
    description: 'Titre de la conversation',
  })
  title: string;

  @ApiProperty({
    description: 'Dernier message',
  })
  lastMessage: string;

  @ApiProperty({
    description: 'Date de dernière activité',
  })
  lastActivityAt: Date;

  @ApiProperty({
    description: 'Nombre de messages',
  })
  messageCount: number;

  @ApiProperty({
    description: 'Statut de la conversation',
  })
  status: string;
}
