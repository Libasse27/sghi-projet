import { IsString, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { BloodGroup } from '../entities/patient.entity';

export class SearchPatientDto {
  @ApiPropertyOptional({ description: 'Recherche par nom ou prénom' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Numéro du patient', example: 'P-2024-001' })
  @IsString()
  @IsOptional()
  numeroPatient?: string;

  @ApiPropertyOptional({ description: 'Sexe (M ou F)', enum: ['M', 'F'] })
  @IsString()
  @IsOptional()
  sexe?: string;

  @ApiPropertyOptional({ description: 'Groupe sanguin', enum: BloodGroup })
  @IsEnum(BloodGroup)
  @IsOptional()
  groupeSanguin?: BloodGroup;

  @ApiPropertyOptional({ description: 'Téléphone' })
  @IsString()
  @IsOptional()
  telephone?: string;

  @ApiPropertyOptional({ description: 'Email' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Patients actifs uniquement', default: true })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  actif?: boolean;

  @ApiPropertyOptional({ description: 'Page', default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Nombre de résultats par page', default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Champ de tri', default: 'dateCreation' })
  @IsString()
  @IsOptional()
  sortBy?: string = 'dateCreation';

  @ApiPropertyOptional({ description: 'Ordre de tri (ASC ou DESC)', default: 'DESC' })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
