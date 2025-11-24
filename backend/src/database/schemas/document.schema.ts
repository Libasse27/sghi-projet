import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type DocumentDocument = MedicalDocument & MongooseDocument;

export enum DocumentType {
  RADIOLOGY = 'Radiologie',
  LABORATORY = 'Laboratoire',
  PRESCRIPTION = 'Ordonnance',
  MEDICAL_REPORT = 'Rapport médical',
  CONSENT_FORM = 'Formulaire de consentement',
  DISCHARGE_SUMMARY = 'Résumé de sortie',
  REFERRAL = 'Lettre de référence',
  OTHER = 'Autre',
}

export enum DocumentStatus {
  DRAFT = 'Brouillon',
  FINAL = 'Final',
  ARCHIVED = 'Archivé',
  DELETED = 'Supprimé',
}

@Schema({ timestamps: true, collection: 'medical_documents' })
export class MedicalDocument {
  @Prop({ required: true })
  patientId: string;

  @Prop({ required: true })
  patientName: string;

  @Prop({ required: true, enum: DocumentType })
  type: DocumentType;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop()
  filePath: string;

  @Prop({ required: true })
  mimeType: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ default: 1 })
  pageCount: number;

  @Prop()
  thumbnailUrl: string;

  @Prop({ enum: DocumentStatus, default: DocumentStatus.DRAFT })
  status: DocumentStatus;

  @Prop()
  uploadedBy: string;

  @Prop()
  uploadedByName: string;

  @Prop()
  consultationId: string;

  @Prop()
  emergencyId: string;

  @Prop()
  prescriptionId: string;

  @Prop({ type: Object })
  metadata: {
    author?: string;
    createdDate?: Date;
    modifiedDate?: Date;
    keywords?: string[];
    category?: string;
    department?: string;
    [key: string]: any;
  };

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop()
  expirationDate: Date;

  @Prop({ default: false })
  isConfidential: boolean;

  @Prop({ type: [String], default: [] })
  accessibleBy: string[];

  @Prop({ type: [Object], default: [] })
  versions: {
    version: number;
    fileName: string;
    fileUrl: string;
    uploadedBy: string;
    uploadedAt: Date;
    changes: string;
  }[];

  @Prop({ type: [Object], default: [] })
  comments: {
    userId: string;
    userName: string;
    comment: string;
    createdAt: Date;
  }[];

  @Prop()
  validatedBy: string;

  @Prop()
  validatedByName: string;

  @Prop()
  validatedAt: Date;

  @Prop()
  deletedBy: string;

  @Prop()
  deletedAt: Date;

  @Prop()
  deleteReason: string;
}

export const MedicalDocumentSchema = SchemaFactory.createForClass(MedicalDocument);

// Indexes
MedicalDocumentSchema.index({ patientId: 1, type: 1 });
MedicalDocumentSchema.index({ patientId: 1, createdAt: -1 });
MedicalDocumentSchema.index({ consultationId: 1 });
MedicalDocumentSchema.index({ emergencyId: 1 });
MedicalDocumentSchema.index({ status: 1 });
MedicalDocumentSchema.index({ uploadedBy: 1 });
MedicalDocumentSchema.index({ tags: 1 });
MedicalDocumentSchema.index({ 'metadata.category': 1 });
MedicalDocumentSchema.index({ 'metadata.department': 1 });

// Text search index
MedicalDocumentSchema.index({
  title: 'text',
  description: 'text',
  'metadata.keywords': 'text',
});
