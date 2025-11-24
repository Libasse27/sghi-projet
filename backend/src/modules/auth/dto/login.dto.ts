import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'amadou.diop@sghi.com',
    description: 'Adresse email',
  })
  @IsNotEmpty({ message: "L'email est requis" })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @ApiProperty({
    example: 'Password@123',
    description: 'Mot de passe',
  })
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @IsString()
  password: string;
}
