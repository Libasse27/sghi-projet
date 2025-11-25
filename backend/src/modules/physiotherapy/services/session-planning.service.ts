import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionPlanningService {
  generateSessionSchedule(planStartDate: Date, totalSessions: number, frequency: number): Date[] {
    const sessions: Date[] = [];
    const currentDate = new Date(planStartDate);

    for (let i = 0; i < totalSessions; i++) {
      sessions.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + frequency);
    }

    return sessions;
  }

  calculateProgress(completedSessions: number, totalSessions: number): number {
    return Math.round((completedSessions / totalSessions) * 100);
  }
}
