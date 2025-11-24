import { IsOptional, IsEnum, IsString, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { EmergencyPriority, EmergencyStatus } from '../entities/emergency.entity';

export class QueryEmergencyDto {
  @IsOptional()
  @IsEnum(EmergencyPriority)
  priority?: EmergencyPriority;

  @IsOptional()
  @IsEnum(EmergencyStatus)
  status?: EmergencyStatus;

  @IsOptional()
  @IsString()
  patientId?: string;

  @IsOptional()
  @IsString()
  assignedToId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  limit?: number = 20;
}
