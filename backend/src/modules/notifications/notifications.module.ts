import { Module } from '@nestjs/common';
import { NotificationService } from './services/notification.service';
import { EmailService } from './services/email.service';
import { SmsService } from './services/sms.service';
import { PushService } from './services/push.service';

@Module({
  providers: [NotificationService, EmailService, SmsService, PushService],
  exports: [NotificationService, EmailService, SmsService, PushService],
})
export class NotificationsModule {}
