import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'amadou.diop@sghi.com',
    description: 'Adresse email',
  })
  @IsNotEmpty({ message: "L'email est requis" })
  @IsEmail({}, { message: 'Email invalide' })
  email: string;
}
