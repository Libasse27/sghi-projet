import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Ip,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { Request } from 'express';

import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';
import { Public } from '../../../common/decorators/public.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Inscription d\'un nouvel utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
  })
  @ApiResponse({
    status: 409,
    description: 'Email déjà utilisé',
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);

    return {
      message: 'Inscription réussie. Veuillez vérifier votre email.',
      data: {
        id: user.id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role,
      },
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Connexion d\'un utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Connexion réussie',
  })
  @ApiResponse({
    status: 401,
    description: 'Email ou mot de passe incorrect',
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto, @Ip() ip: string) {
    const result = await this.authService.login(loginDto, ip);

    return {
      message: 'Connexion réussie',
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
          nom: result.user.nom,
          prenom: result.user.prenom,
          role: result.user.role,
          photo: result.user.photo,
          specialite: result.user.specialite,
          service: result.user.service,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshAuthGuard)
  @ApiOperation({ summary: 'Rafraîchir les tokens d\'accès' })
  @ApiResponse({
    status: 200,
    description: 'Tokens rafraîchis avec succès',
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token invalide ou expiré',
  })
  @ApiBody({ type: RefreshTokenDto })
  async refresh(@CurrentUser() user: any, @Body() refreshTokenDto: RefreshTokenDto) {
    const tokens = await this.authService.refreshTokens(
      user.id,
      refreshTokenDto.refreshToken,
    );

    return {
      message: 'Tokens rafraîchis avec succès',
      data: tokens,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Déconnexion d\'un utilisateur' })
  @ApiResponse({
    status: 200,
    description: 'Déconnexion réussie',
  })
  async logout(@CurrentUser('id') userId: string) {
    await this.authService.logout(userId);

    return {
      message: 'Déconnexion réussie',
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur connecté' })
  @ApiResponse({
    status: 200,
    description: 'Profil récupéré avec succès',
  })
  async getProfile(@CurrentUser() user: any) {
    const userDetails = await this.authService.findById(user.id);

    return {
      message: 'Profil récupéré avec succès',
      data: {
        id: userDetails.id,
        email: userDetails.email,
        nom: userDetails.nom,
        prenom: userDetails.prenom,
        telephone: userDetails.telephone,
        role: userDetails.role,
        photo: userDetails.photo,
        specialite: userDetails.specialite,
        numeroEmploye: userDetails.numeroEmploye,
        service: userDetails.service,
        isEmailVerified: userDetails.isEmailVerified,
        lastLoginAt: userDetails.lastLoginAt,
        createdAt: userDetails.createdAt,
      },
    };
  }

  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Changer le mot de passe' })
  @ApiResponse({
    status: 200,
    description: 'Mot de passe changé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Ancien mot de passe incorrect',
  })
  @ApiBody({ type: ChangePasswordDto })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.authService.changePassword(userId, changePasswordDto);

    return {
      message: 'Mot de passe changé avec succès. Veuillez vous reconnecter.',
    };
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Demander une réinitialisation de mot de passe' })
  @ApiResponse({
    status: 200,
    description: 'Email de réinitialisation envoyé si l\'email existe',
  })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.authService.forgotPassword(forgotPasswordDto.email);

    return {
      message:
        'Si votre email existe dans notre système, vous recevrez un lien de réinitialisation.',
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Réinitialiser le mot de passe' })
  @ApiResponse({
    status: 200,
    description: 'Mot de passe réinitialisé avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Token invalide ou expiré',
  })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.authService.resetPassword(resetPasswordDto);

    return {
      message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
    };
  }

  @Public()
  @Get('verify-email/:token')
  @ApiOperation({ summary: 'Vérifier l\'email avec le token' })
  @ApiResponse({
    status: 200,
    description: 'Email vérifié avec succès',
  })
  @ApiResponse({
    status: 400,
    description: 'Token de vérification invalide',
  })
  async verifyEmail(@Req() req: Request) {
    const token = req.params.token;
    await this.authService.verifyEmail(token);

    return {
      message: 'Email vérifié avec succès. Vous pouvez maintenant vous connecter.',
    };
  }
}
