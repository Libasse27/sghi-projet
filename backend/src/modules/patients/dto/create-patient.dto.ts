import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional, IsDateString, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BloodGroup } from '../entities/patient.entity';

export class CreatePatientDto {
  @ApiProperty({ description: 'Nom du patient', example: 'Diop' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nom: string;

  @ApiProperty({ description: 'Prénom du patient', example: 'Amadou' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  prenom: string;

  @ApiProperty({ description: 'Date de naissance', example: '1990-05-15' })
  @IsDateString()
  @IsNotEmpty()
  dateNaissance: string;

  @ApiProperty({ description: 'Sexe (M ou F)', example: 'M', enum: ['M', 'F'] })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[MF]$/, { message: 'Le sexe doit être M ou F' })
  sexe: string;

  @ApiPropertyOptional({ description: 'Groupe sanguin', enum: BloodGroup, example: 'O+' })
  @IsEnum(BloodGroup)
  @IsOptional()
  groupeSanguin?: BloodGroup;

  @ApiProperty({ description: 'Numéro de téléphone', example: '+221771234567' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  telephone: string;

  @ApiPropertyOptional({ description: 'Email', example: 'amadou.diop@email.com' })
  @IsEmail()
  @IsOptional()
  @Length(1, 100)
  email?: string;

  @ApiProperty({ description: 'Adresse complète', example: 'Dakar, Plateau, Rue 10' })
  @IsString()
  @IsNotEmpty()
  adresse: string;

  @ApiPropertyOptional({ description: 'Profession', example: 'Enseignant' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  profession?: string;

  @ApiPropertyOptional({ description: 'Allergies connues' })
  @IsString()
  @IsOptional()
  allergies?: string;

  @ApiPropertyOptional({ description: 'Maladies chroniques' })
  @IsString()
  @IsOptional()
  maladiesChroniques?: string;

  @ApiPropertyOptional({ description: 'Antécédents familiaux' })
  @IsString()
  @IsOptional()
  antecedentsFamiliaux?: string;

  @ApiPropertyOptional({ description: 'Antécédents chirurgicaux' })
  @IsString()
  @IsOptional()
  antecedentsChirurgicaux?: string;

  @ApiPropertyOptional({ description: 'Nom du contact d\'urgence' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  contactUrgenceNom?: string;

  @ApiPropertyOptional({ description: 'Téléphone du contact d\'urgence' })
  @IsString()
  @IsOptional()
  @Length(1, 20)
  contactUrgenceTelephone?: string;

  @ApiPropertyOptional({ description: 'Lien avec le contact d\'urgence', example: 'Épouse' })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  contactUrgenceLien?: string;

  @ApiPropertyOptional({ description: 'Nom de l\'assurance' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  assuranceNom?: string;

  @ApiPropertyOptional({ description: 'Numéro d\'assurance' })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  assuranceNumero?: string;

  @ApiPropertyOptional({ description: 'Date d\'expiration de l\'assurance', example: '2025-12-31' })
  @IsDateString()
  @IsOptional()
  assuranceExpiration?: string;

  @ApiPropertyOptional({ description: 'Notes supplémentaires' })
  @IsString()
  @IsOptional()
  notes?: string;
}
