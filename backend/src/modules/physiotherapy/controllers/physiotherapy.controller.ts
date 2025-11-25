import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PhysiotherapyService } from '../services/physiotherapy.service';
import { SessionPlanningService } from '../services/session-planning.service';
import { RehabilitationService } from '../services/rehabilitation.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from '@shared/constants/roles.constants';
import { Roles } from '../../auth/decorators/roles.decorator';
import { SessionStatus } from '../entities/physio-session.entity';

@Controller('physiotherapy')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PhysiotherapyController {
  constructor(
    private readonly physioService: PhysiotherapyService,
    private readonly planningService: SessionPlanningService,
    private readonly rehabService: RehabilitationService,
  ) {}

  @Post('sessions')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async createSession(@Body() createDto: any) {
    return await this.physioService.createSession(createDto);
  }

  @Get('sessions')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async findAllSessions(@Query() filters: any) {
    return await this.physioService.findAllSessions(filters);
  }

  @Get('sessions/:id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async findOneSession(@Param('id') id: string) {
    return await this.physioService.findOneSession(id);
  }

  @Patch('sessions/:id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async updateSession(@Param('id') id: string, @Body() updateDto: any) {
    return await this.physioService.updateSession(id, updateDto);
  }

  @Patch('sessions/:id/status')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async updateSessionStatus(@Param('id') id: string, @Body() body: { status: SessionStatus }) {
    return await this.physioService.updateStatus(id, body.status);
  }

  @Post('plans')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async createPlan(@Body() createDto: any) {
    return await this.physioService.createPlan(createDto);
  }

  @Get('plans')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async findAllPlans(@Query() filters: any) {
    return await this.physioService.findAllPlans(filters);
  }

  @Get('plans/:id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async findOnePlan(@Param('id') id: string) {
    return await this.physioService.findOnePlan(id);
  }

  @Post('plans/generate-schedule')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async generateSchedule(@Body() data: { startDate: string; totalSessions: number; frequency: number }) {
    const sessions = this.planningService.generateSessionSchedule(
      new Date(data.startDate),
      data.totalSessions,
      data.frequency,
    );
    return { sessions };
  }

  @Post('exercises/generate')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  async generateExercises(@Body() data: { condition: string }) {
    const exercises = this.rehabService.generateExercisePlan(data.condition);
    return { exercises };
  }
}
