import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(registerDto: RegisterDto): Promise<User> {
    // Vérifier si l'email existe déjà
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet email est déjà utilisé');
    }

    // Créer le nouvel utilisateur
    const user = this.userRepository.create({
      ...registerDto,
      emailVerificationToken: uuidv4(),
    });

    // Sauvegarder (le mot de passe sera hashé automatiquement par le hook @BeforeInsert)
    const savedUser = await this.userRepository.save(user);

    // TODO: Envoyer email de vérification
    // await this.emailService.sendVerificationEmail(savedUser);

    return savedUser;
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(loginDto: LoginDto, ip?: string): Promise<{
    user: User;
    accessToken: string;
    refreshToken: string;
  }> {
    // Trouver l'utilisateur
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      throw new UnauthorizedException('Ce compte a été désactivé');
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.validatePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    // Générer les tokens
    const tokens = await this.generateTokens(user);

    // Sauvegarder le refresh token et mettre à jour le dernier login
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
      lastLoginAt: new Date(),
      lastLoginIp: ip,
    });

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Rafraîchir les tokens
   */
  async refreshTokens(userId: string, refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Accès refusé');
    }

    // Vérifier le refresh token
    const isRefreshTokenValid = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Accès refusé');
    }

    // Générer de nouveaux tokens
    const tokens = await this.generateTokens(user);

    // Sauvegarder le nouveau refresh token
    const hashedRefreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepository.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return tokens;
  }

  /**
   * Déconnexion
   */
  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      refreshToken: null,
    });
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier l'ancien mot de passe
    const isOldPasswordValid = await user.validatePassword(
      changePasswordDto.oldPassword,
    );

    if (!isOldPasswordValid) {
      throw new BadRequestException('Ancien mot de passe incorrect');
    }

    // Mettre à jour avec le nouveau mot de passe
    user.password = changePasswordDto.newPassword;
    await this.userRepository.save(user);

    // Invalider tous les refresh tokens
    await this.userRepository.update(userId, {
      refreshToken: null,
    });
  }

  /**
   * Demander une réinitialisation de mot de passe
   */
  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      // Ne pas révéler si l'email existe ou non (sécurité)
      return;
    }

    // Générer un token de réinitialisation
    const resetToken = uuidv4();
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1); // Expire dans 1 heure

    await this.userRepository.update(user.id, {
      passwordResetToken: resetToken,
      passwordResetExpires: resetExpires,
    });

    // TODO: Envoyer email avec le lien de réinitialisation
    // await this.emailService.sendPasswordResetEmail(user, resetToken);
  }

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { passwordResetToken: resetPasswordDto.token },
    });

    if (!user) {
      throw new BadRequestException('Token de réinitialisation invalide');
    }

    // Vérifier si le token n'a pas expiré
    if (user.passwordResetExpires < new Date()) {
      throw new BadRequestException('Token de réinitialisation expiré');
    }

    // Mettre à jour le mot de passe
    user.password = resetPasswordDto.newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.refreshToken = null; // Invalider tous les tokens

    await this.userRepository.save(user);
  }

  /**
   * Vérifier l'email
   */
  async verifyEmail(token: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      throw new BadRequestException('Token de vérification invalide');
    }

    await this.userRepository.update(user.id, {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      emailVerificationToken: null,
    });
  }

  /**
   * Valider un utilisateur par email
   */
  async validateUser(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, isActive: true },
    });
  }

  /**
   * Trouver un utilisateur par ID
   */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  /**
   * Générer les tokens JWT
   */
  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      nom: user.nom,
      prenom: user.prenom,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.signOptions.expiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwtRefresh.secret'),
        expiresIn: this.configService.get<string>('jwtRefresh.expiresIn'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
