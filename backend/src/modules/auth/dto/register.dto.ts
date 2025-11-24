import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '@shared/constants/roles.constants';

export class RegisterDto {
  @ApiProperty({
    example: 'Diop',
    description: 'Nom de famille',
  })
  @IsNotEmpty({ message: 'Le nom est requis' })
  @IsString()
  nom: string;

  @ApiProperty({
    example: 'Amadou',
    description: 'Prénom',
  })
  @IsNotEmpty({ message: 'Le prénom est requis' })
  @IsString()
  prenom: string;

  @ApiProperty({
    example: 'amadou.diop@sghi.com',
    description: 'Adresse email',
  })
  @IsNotEmpty({ message: "L'email est requis" })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({
    example: '+221771234567',
    description: 'Numéro de téléphone',
    required: false,
  })
  @IsOptional()
  @IsString()
  telephone?: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'Mot de passe (min 8 caractères, majuscule, minuscule, chiffre, caractère spécial)',
  })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message:
        'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
    },
  )
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.DOCTOR,
    description: 'Rôle de l\'utilisateur',
  })
  @IsNotEmpty({ message: 'Le rôle est requis' })
  @IsEnum(UserRole, { message: 'Rôle invalide' })
  role: UserRole;

  @ApiProperty({
    example: 'Cardiologie',
    description: 'Spécialité médicale (pour les médecins)',
    required: false,
  })
  @IsOptional()
  @IsString()
  specialite?: string;

  @ApiProperty({
    example: 'EMP-2024-001',
    description: 'Numéro d\'employé',
    required: false,
  })
  @IsOptional()
  @IsString()
  numeroEmploye?: string;

  @ApiProperty({
    example: 'Cardiologie',
    description: 'Service d\'affectation',
    required: false,
  })
  @IsOptional()
  @IsString()
  service?: string;
}
