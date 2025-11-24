import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmergencyService } from './emergency.service';
import { CreateEmergencyDto, UpdateEmergencyDto, QueryEmergencyDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '@shared/constants/roles.constants';

@Controller('emergency')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  /**
   * Créer un nouveau triage
   * POST /api/emergency
   */
  @Post()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.NURSE_CHIEF,
  )
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createEmergencyDto: CreateEmergencyDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.emergencyService.create(createEmergencyDto, userId);
  }

  /**
   * Récupérer toutes les urgences avec filtres
   * GET /api/emergency
   */
  @Get()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.NURSE_CHIEF,
    UserRole.RECEPTIONIST,
  )
  findAll(@Query() query: QueryEmergencyDto) {
    return this.emergencyService.findAll(query);
  }

  /**
   * Récupérer la file d'attente
   * GET /api/emergency/queue
   */
  @Get('queue')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.NURSE_CHIEF,
    UserRole.RECEPTIONIST,
  )
  getQueue() {
    return this.emergencyService.getQueue();
  }

  /**
   * Récupérer les statistiques
   * GET /api/emergency/statistics
   */
  @Get('statistics')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.NURSE_CHIEF,
  )
  getStatistics() {
    return this.emergencyService.getStatistics();
  }

  /**
   * Récupérer une urgence par ID
   * GET /api/emergency/:id
   */
  @Get(':id')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.NURSE_CHIEF,
  )
  findOne(@Param('id') id: string) {
    return this.emergencyService.findOne(id);
  }

  /**
   * Mettre à jour une urgence
   * PATCH /api/emergency/:id
   */
  @Patch(':id')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.NURSE_CHIEF,
  )
  update(@Param('id') id: string, @Body() updateEmergencyDto: UpdateEmergencyDto) {
    return this.emergencyService.update(id, updateEmergencyDto);
  }

  /**
   * Prendre en charge une urgence
   * POST /api/emergency/:id/take-care
   */
  @Post(':id/take-care')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.NURSE_CHIEF,
  )
  @HttpCode(HttpStatus.OK)
  takeCare(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.emergencyService.takeCare(id, userId);
  }

  /**
   * Réassigner la priorité
   * PATCH /api/emergency/:id/priority
   */
  @Patch(':id/priority')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
  )
  reassignPriority(
    @Param('id') id: string,
    @Body('priority') priority: string,
  ) {
    return this.emergencyService.reassignPriority(id, priority);
  }

  /**
   * Transférer une urgence
   * POST /api/emergency/:id/transfer
   */
  @Post(':id/transfer')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.NURSE_CHIEF,
  )
  @HttpCode(HttpStatus.OK)
  transfer(
    @Param('id') id: string,
    @Body('transferredTo') transferredTo: string,
    @Body('transferReason') transferReason: string,
  ) {
    return this.emergencyService.transfer(id, transferredTo, transferReason);
  }

  /**
   * Annuler une urgence
   * POST /api/emergency/:id/cancel
   */
  @Post(':id/cancel')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE_CHIEF,
  )
  @HttpCode(HttpStatus.OK)
  cancel(
    @Param('id') id: string,
    @Body('cancellationReason') cancellationReason: string,
  ) {
    return this.emergencyService.cancel(id, cancellationReason);
  }

  /**
   * Compléter une urgence
   * POST /api/emergency/:id/complete
   */
  @Post(':id/complete')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.NURSE_CHIEF,
  )
  @HttpCode(HttpStatus.OK)
  complete(@Param('id') id: string) {
    return this.emergencyService.complete(id);
  }

  /**
   * Supprimer une urgence
   * DELETE /api/emergency/:id
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.emergencyService.remove(id);
  }
}
