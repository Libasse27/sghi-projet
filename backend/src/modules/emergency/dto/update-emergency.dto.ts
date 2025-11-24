import { PartialType } from '@nestjs/mapped-types';
import { CreateEmergencyDto } from './create-emergency.dto';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { EmergencyPriority, EmergencyStatus } from '../entities/emergency.entity';

export class UpdateEmergencyDto extends PartialType(CreateEmergencyDto) {
  @IsOptional()
  @IsEnum(EmergencyStatus, { message: 'Statut invalide' })
  status?: EmergencyStatus;

  @IsOptional()
  @IsEnum(EmergencyPriority, { message: 'Priorité invalide' })
  priority?: EmergencyPriority;

  @IsOptional()
  @IsString()
  assignedToId?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  transferredTo?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  transferReason?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  cancellationReason?: string;
}
