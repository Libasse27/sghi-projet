import { IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty({ description: 'ID du patient' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ description: 'Nom complet du patient' })
  @IsString()
  @IsNotEmpty()
  patientNom: string;

  @ApiPropertyOptional({ description: 'Téléphone du patient' })
  @IsString()
  @IsOptional()
  patientTelephone?: string;

  @ApiProperty({ description: 'ID du médecin' })
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ description: 'Nom du médecin' })
  @IsString()
  @IsNotEmpty()
  doctorName: string;

  @ApiPropertyOptional({ description: 'Spécialité du médecin' })
  @IsString()
  @IsOptional()
  specialite?: string;

  @ApiProperty({ description: 'Date et heure du rendez-vous' })
  @IsDateString()
  @IsNotEmpty()
  dateRendezVous: string;

  @ApiProperty({ description: 'Durée estimée en minutes', default: 30 })
  @IsNumber()
  @IsNotEmpty()
  dureeEstimee: number;

  @ApiProperty({ description: 'Motif du rendez-vous' })
  @IsString()
  @IsNotEmpty()
  motif: string;

  @ApiPropertyOptional({ description: 'Salle de consultation' })
  @IsString()
  @IsOptional()
  salle?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;
}
