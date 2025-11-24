import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'OldPassword@123',
    description: 'Ancien mot de passe',
  })
  @IsNotEmpty({ message: "L'ancien mot de passe est requis" })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    example: 'NewPassword@123',
    description: 'Nouveau mot de passe',
  })
  @IsNotEmpty({ message: 'Le nouveau mot de passe est requis' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message:
        'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
    },
  )
  newPassword: string;
}
