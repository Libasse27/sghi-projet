import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  Max,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EmergencyPriority, ConsciousnessState } from '../entities/emergency.entity';

export class CreateEmergencyDto {
  @IsNotEmpty({ message: 'La priorité est obligatoire' })
  @IsEnum(EmergencyPriority, { message: 'Priorité invalide' })
  priority: EmergencyPriority;

  // Patient Information
  @IsNotEmpty({ message: 'L\'ID du patient est obligatoire' })
  @IsString()
  patientId: string;

  @IsNotEmpty({ message: 'Le nom du patient est obligatoire' })
  @IsString()
  @Length(2, 100, { message: 'Le nom doit contenir entre 2 et 100 caractères' })
  patientNom: string;

  @IsNotEmpty({ message: 'Le prénom du patient est obligatoire' })
  @IsString()
  @Length(2, 100, { message: 'Le prénom doit contenir entre 2 et 100 caractères' })
  patientPrenom: string;

  @IsNotEmpty({ message: 'L\'âge du patient est obligatoire' })
  @IsNumber({}, { message: 'L\'âge doit être un nombre' })
  @Type(() => Number)
  @Min(0, { message: 'L\'âge doit être positif' })
  @Max(150, { message: 'L\'âge ne peut pas dépasser 150 ans' })
  patientAge: number;

  @IsNotEmpty({ message: 'Le sexe du patient est obligatoire' })
  @IsString()
  @Matches(/^[MF]$/, { message: 'Le sexe doit être M ou F' })
  patientSexe: string;

  // Triage Information
  @IsNotEmpty({ message: 'Le motif de consultation est obligatoire' })
  @IsString()
  @Length(10, 1000, { message: 'Le motif doit contenir entre 10 et 1000 caractères' })
  reason: string;

  @IsOptional()
  @IsString()
  @Length(0, 2000, { message: 'Les observations ne peuvent pas dépasser 2000 caractères' })
  observations?: string;

  // Vital Signs
  @IsNotEmpty({ message: 'La tension artérielle est obligatoire' })
  @IsString()
  @Matches(/^\d{2,3}\/\d{2,3}$/, { message: 'Format de tension invalide (ex: 120/80)' })
  bloodPressure: string;

  @IsNotEmpty({ message: 'La fréquence cardiaque est obligatoire' })
  @IsNumber({}, { message: 'La fréquence cardiaque doit être un nombre' })
  @Type(() => Number)
  @Min(20, { message: 'Fréquence cardiaque trop basse' })
  @Max(250, { message: 'Fréquence cardiaque trop élevée' })
  heartRate: number;

  @IsNotEmpty({ message: 'La température est obligatoire' })
  @IsNumber({}, { message: 'La température doit être un nombre' })
  @Type(() => Number)
  @Min(30, { message: 'Température trop basse' })
  @Max(45, { message: 'Température trop élevée' })
  temperature: number;

  @IsOptional()
  @IsNumber({}, { message: 'La fréquence respiratoire doit être un nombre' })
  @Type(() => Number)
  @Min(5, { message: 'Fréquence respiratoire trop basse' })
  @Max(60, { message: 'Fréquence respiratoire trop élevée' })
  respiratoryRate?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La saturation en oxygène doit être un nombre' })
  @Type(() => Number)
  @Min(50, { message: 'Saturation trop basse' })
  @Max(100, { message: 'Saturation ne peut pas dépasser 100%' })
  oxygenSaturation?: number;

  @IsOptional()
  @IsNumber({}, { message: 'La glycémie doit être un nombre' })
  @Type(() => Number)
  @Min(0.1, { message: 'Glycémie trop basse' })
  @Max(10, { message: 'Glycémie trop élevée' })
  bloodSugar?: number;

  @IsNotEmpty({ message: 'L\'échelle de douleur est obligatoire' })
  @IsNumber({}, { message: 'L\'échelle de douleur doit être un nombre' })
  @Type(() => Number)
  @Min(0, { message: 'L\'échelle de douleur commence à 0' })
  @Max(10, { message: 'L\'échelle de douleur ne dépasse pas 10' })
  painScale: number;

  @IsNotEmpty({ message: 'L\'état de conscience est obligatoire' })
  @IsEnum(ConsciousnessState, { message: 'État de conscience invalide' })
  consciousness: ConsciousnessState;
}
