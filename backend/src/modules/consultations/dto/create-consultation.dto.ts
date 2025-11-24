import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ConsultationType } from '../entities/consultation.entity';

export class CreateConsultationDto {
  @ApiProperty({ description: 'ID du patient' })
  @IsString()
  @IsNotEmpty()
  patientId: string;

  @ApiProperty({ description: 'Nom complet du patient' })
  @IsString()
  @IsNotEmpty()
  patientNom: string;

  @ApiProperty({ description: 'ID du médecin' })
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ description: 'Nom du médecin' })
  @IsString()
  @IsNotEmpty()
  doctorName: string;

  @ApiProperty({ description: 'Type de consultation', enum: ConsultationType })
  @IsEnum(ConsultationType)
  @IsNotEmpty()
  type: ConsultationType;

  @ApiProperty({ description: 'Date et heure de la consultation' })
  @IsDateString()
  @IsNotEmpty()
  dateConsultation: string;

  @ApiProperty({ description: 'Motif de la consultation' })
  @IsString()
  @IsNotEmpty()
  motif: string;

  @ApiPropertyOptional({ description: 'Température (°C)' })
  @IsNumber()
  @IsOptional()
  temperature?: number;

  @ApiPropertyOptional({ description: 'Fréquence cardiaque (bpm)' })
  @IsNumber()
  @IsOptional()
  heartRate?: number;

  @ApiPropertyOptional({ description: 'Tension artérielle systolique (mmHg)' })
  @IsNumber()
  @IsOptional()
  bloodPressureSystolic?: number;

  @ApiPropertyOptional({ description: 'Tension artérielle diastolique (mmHg)' })
  @IsNumber()
  @IsOptional()
  bloodPressureDiastolic?: number;

  @ApiPropertyOptional({ description: 'Fréquence respiratoire (par minute)' })
  @IsNumber()
  @IsOptional()
  respiratoryRate?: number;

  @ApiPropertyOptional({ description: 'Saturation en oxygène (%)' })
  @IsNumber()
  @IsOptional()
  oxygenSaturation?: number;

  @ApiPropertyOptional({ description: 'Poids (kg)' })
  @IsNumber()
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ description: 'Taille (cm)' })
  @IsNumber()
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ description: 'Examen clinique' })
  @IsString()
  @IsOptional()
  examenClinique?: string;

  @ApiPropertyOptional({ description: 'Diagnostic' })
  @IsString()
  @IsOptional()
  diagnostic?: string;

  @ApiPropertyOptional({ description: 'Traitement prescrit' })
  @IsString()
  @IsOptional()
  traitement?: string;

  @ApiPropertyOptional({ description: 'Examens complémentaires demandés' })
  @IsString()
  @IsOptional()
  examensComplementaires?: string;

  @ApiPropertyOptional({ description: 'Notes du médecin' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Date du prochain rendez-vous' })
  @IsDateString()
  @IsOptional()
  prochainRendezVous?: string;

  @ApiPropertyOptional({ description: 'Montant de la consultation' })
  @IsNumber()
  @IsOptional()
  montant?: number;

  @ApiPropertyOptional({ description: 'Consultation payée' })
  @IsBoolean()
  @IsOptional()
  paye?: boolean;

  @ApiPropertyOptional({ description: 'Salle de consultation' })
  @IsString()
  @IsOptional()
  salle?: string;
}
