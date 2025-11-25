import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

/**
 * Events Gateway for domain-specific real-time events
 * Handles events for patients, consultations, emergencies, etc.
 */
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/events',
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('EventsGateway');

  afterInit(server: Server) {
    this.logger.log('Events Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Events client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Events client disconnected: ${client.id}`);
  }

  // Subscribe to specific event types

  @SubscribeMessage('subscribe-patient-updates')
  handleSubscribePatientUpdates(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { patientId: string },
  ): void {
    const room = `patient:${data.patientId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} subscribed to patient updates: ${data.patientId}`);
    client.emit('subscribed', { type: 'patient', id: data.patientId });
  }

  @SubscribeMessage('subscribe-consultation-updates')
  handleSubscribeConsultationUpdates(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { consultationId: string },
  ): void {
    const room = `consultation:${data.consultationId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} subscribed to consultation updates: ${data.consultationId}`);
    client.emit('subscribed', { type: 'consultation', id: data.consultationId });
  }

  @SubscribeMessage('subscribe-emergency-updates')
  handleSubscribeEmergencyUpdates(@ConnectedSocket() client: Socket): void {
    client.join('emergency:all');
    this.logger.log(`Client ${client.id} subscribed to emergency updates`);
    client.emit('subscribed', { type: 'emergency', id: 'all' });
  }

  @SubscribeMessage('subscribe-department-updates')
  handleSubscribeDepartmentUpdates(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { department: string },
  ): void {
    const room = `department:${data.department}`;
    client.join(room);
    this.logger.log(`Client ${client.id} subscribed to department updates: ${data.department}`);
    client.emit('subscribed', { type: 'department', id: data.department });
  }

  @SubscribeMessage('subscribe-queue-updates')
  handleSubscribeQueueUpdates(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { queueType: string },
  ): void {
    const room = `queue:${data.queueType}`;
    client.join(room);
    this.logger.log(`Client ${client.id} subscribed to queue updates: ${data.queueType}`);
    client.emit('subscribed', { type: 'queue', id: data.queueType });
  }

  // Public methods for emitting domain events

  /**
   * Patient Events
   */
  emitPatientCreated(patient: any): void {
    this.server.emit('patient:created', patient);
    this.logger.log(`Patient created event emitted: ${patient.id}`);
  }

  emitPatientUpdated(patient: any): void {
    this.server.emit('patient:updated', patient);
    this.server.to(`patient:${patient.id}`).emit('patient:updated', patient);
    this.logger.log(`Patient updated event emitted: ${patient.id}`);
  }

  /**
   * Consultation Events
   */
  emitConsultationCreated(consultation: any): void {
    this.server.emit('consultation:created', consultation);
    if (consultation.patientId) {
      this.server.to(`patient:${consultation.patientId}`).emit('consultation:created', consultation);
    }
    this.logger.log(`Consultation created event emitted: ${consultation.id}`);
  }

  emitConsultationUpdated(consultation: any): void {
    this.server.emit('consultation:updated', consultation);
    this.server.to(`consultation:${consultation.id}`).emit('consultation:updated', consultation);
    if (consultation.patientId) {
      this.server.to(`patient:${consultation.patientId}`).emit('consultation:updated', consultation);
    }
    this.logger.log(`Consultation updated event emitted: ${consultation.id}`);
  }

  emitConsultationCompleted(consultation: any): void {
    this.server.emit('consultation:completed', consultation);
    this.server.to(`consultation:${consultation.id}`).emit('consultation:completed', consultation);
    this.logger.log(`Consultation completed event emitted: ${consultation.id}`);
  }

  /**
   * Emergency Events
   */
  emitEmergencyAlert(emergency: any): void {
    this.server.to('emergency:all').emit('emergency:alert', emergency);
    this.logger.log(`Emergency alert emitted: ${emergency.id} - Priority: ${emergency.priority}`);
  }

  emitEmergencyCaseCreated(emergency: any): void {
    this.server.to('emergency:all').emit('emergency:created', emergency);
    this.logger.log(`Emergency case created event emitted: ${emergency.id}`);
  }

  emitEmergencyCaseUpdated(emergency: any): void {
    this.server.to('emergency:all').emit('emergency:updated', emergency);
    this.logger.log(`Emergency case updated event emitted: ${emergency.id}`);
  }

  emitTriageCompleted(triage: any): void {
    this.server.to('emergency:all').emit('triage:completed', triage);
    this.logger.log(`Triage completed event emitted: ${triage.id}`);
  }

  /**
   * Queue Events
   */
  emitQueueUpdated(queueType: string, queueData: any): void {
    this.server.to(`queue:${queueType}`).emit('queue:updated', queueData);
    this.logger.log(`Queue updated event emitted: ${queueType}`);
  }

  emitPatientCalledToConsultation(data: any): void {
    this.server.to('queue:consultation').emit('patient:called', data);
    if (data.patientId) {
      this.server.to(`patient:${data.patientId}`).emit('patient:called', data);
    }
    this.logger.log(`Patient called to consultation: ${data.patientId}`);
  }

  /**
   * Laboratory Events
   */
  emitLabResultReady(result: any): void {
    this.server.emit('lab:result-ready', result);
    if (result.patientId) {
      this.server.to(`patient:${result.patientId}`).emit('lab:result-ready', result);
    }
    this.logger.log(`Lab result ready event emitted: ${result.id}`);
  }

  emitLabResultValidated(result: any): void {
    this.server.emit('lab:result-validated', result);
    if (result.patientId) {
      this.server.to(`patient:${result.patientId}`).emit('lab:result-validated', result);
    }
    this.logger.log(`Lab result validated event emitted: ${result.id}`);
  }

  /**
   * Imaging Events
   */
  emitImagingReportReady(report: any): void {
    this.server.emit('imaging:report-ready', report);
    if (report.patientId) {
      this.server.to(`patient:${report.patientId}`).emit('imaging:report-ready', report);
    }
    this.logger.log(`Imaging report ready event emitted: ${report.id}`);
  }

  /**
   * Pharmacy Events
   */
  emitPrescriptionReady(prescription: any): void {
    this.server.emit('pharmacy:prescription-ready', prescription);
    if (prescription.patientId) {
      this.server.to(`patient:${prescription.patientId}`).emit('pharmacy:prescription-ready', prescription);
    }
    this.logger.log(`Prescription ready event emitted: ${prescription.id}`);
  }

  emitLowStockAlert(medicine: any): void {
    this.server.to('department:PHARMACY').emit('pharmacy:low-stock', medicine);
    this.logger.log(`Low stock alert emitted: ${medicine.name}`);
  }

  emitMedicineExpiringSoon(medicine: any): void {
    this.server.to('department:PHARMACY').emit('pharmacy:expiring-soon', medicine);
    this.logger.log(`Medicine expiring soon alert emitted: ${medicine.name}`);
  }

  /**
   * Surgery Events
   */
  emitSurgeryScheduled(surgery: any): void {
    this.server.emit('surgery:scheduled', surgery);
    if (surgery.patientId) {
      this.server.to(`patient:${surgery.patientId}`).emit('surgery:scheduled', surgery);
    }
    this.logger.log(`Surgery scheduled event emitted: ${surgery.id}`);
  }

  emitSurgeryStarted(surgery: any): void {
    this.server.emit('surgery:started', surgery);
    this.server.to('department:SURGERY').emit('surgery:started', surgery);
    this.logger.log(`Surgery started event emitted: ${surgery.id}`);
  }

  emitSurgeryCompleted(surgery: any): void {
    this.server.emit('surgery:completed', surgery);
    this.server.to('department:SURGERY').emit('surgery:completed', surgery);
    if (surgery.patientId) {
      this.server.to(`patient:${surgery.patientId}`).emit('surgery:completed', surgery);
    }
    this.logger.log(`Surgery completed event emitted: ${surgery.id}`);
  }

  /**
   * Billing Events
   */
  emitInvoiceCreated(invoice: any): void {
    this.server.emit('billing:invoice-created', invoice);
    if (invoice.patientId) {
      this.server.to(`patient:${invoice.patientId}`).emit('billing:invoice-created', invoice);
    }
    this.logger.log(`Invoice created event emitted: ${invoice.id}`);
  }

  emitPaymentReceived(payment: any): void {
    this.server.emit('billing:payment-received', payment);
    if (payment.patientId) {
      this.server.to(`patient:${payment.patientId}`).emit('billing:payment-received', payment);
    }
    this.logger.log(`Payment received event emitted: ${payment.id}`);
  }

  /**
   * Hospitalization Events
   */
  emitBedStatusChanged(bed: any): void {
    this.server.to('department:HOSPITALIZATION').emit('bed:status-changed', bed);
    this.logger.log(`Bed status changed event emitted: ${bed.id}`);
  }

  emitPatientAdmitted(admission: any): void {
    this.server.emit('hospitalization:patient-admitted', admission);
    if (admission.patientId) {
      this.server.to(`patient:${admission.patientId}`).emit('hospitalization:patient-admitted', admission);
    }
    this.logger.log(`Patient admitted event emitted: ${admission.id}`);
  }

  emitPatientDischarged(admission: any): void {
    this.server.emit('hospitalization:patient-discharged', admission);
    if (admission.patientId) {
      this.server.to(`patient:${admission.patientId}`).emit('hospitalization:patient-discharged', admission);
    }
    this.logger.log(`Patient discharged event emitted: ${admission.id}`);
  }

  /**
   * Staff Events
   */
  emitStaffCheckIn(attendance: any): void {
    this.server.to('department:HR').emit('staff:checked-in', attendance);
    this.logger.log(`Staff checked in event emitted: ${attendance.employeeId}`);
  }

  emitStaffCheckOut(attendance: any): void {
    this.server.to('department:HR').emit('staff:checked-out', attendance);
    this.logger.log(`Staff checked out event emitted: ${attendance.employeeId}`);
  }

  /**
   * System Events
   */
  emitSystemNotification(notification: any): void {
    this.server.emit('system:notification', notification);
    this.logger.log('System notification emitted');
  }

  emitSystemAlert(alert: any): void {
    this.server.emit('system:alert', alert);
    this.logger.log(`System alert emitted: ${alert.type}`);
  }
}
