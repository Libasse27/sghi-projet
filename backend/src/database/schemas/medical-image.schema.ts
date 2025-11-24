import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type MedicalImageDocument = MedicalImage & MongooseDocument;

export enum ImageModality {
  XRAY = 'Radiographie',
  CT = 'Scanner (CT)',
  MRI = 'IRM',
  ULTRASOUND = 'Échographie',
  MAMMOGRAPHY = 'Mammographie',
  PET = 'PET Scan',
  ENDOSCOPY = 'Endoscopie',
  PHOTO = 'Photographie médicale',
  OTHER = 'Autre',
}

export enum ImageStatus {
  PENDING = 'En attente',
  PROCESSED = 'Traité',
  REPORTED = 'Rapporté',
  VALIDATED = 'Validé',
  ARCHIVED = 'Archivé',
}

export enum ImageQuality {
  EXCELLENT = 'Excellent',
  GOOD = 'Bon',
  ACCEPTABLE = 'Acceptable',
  POOR = 'Mauvais',
}

@Schema({ timestamps: true, collection: 'medical_images' })
export class MedicalImage {
  @Prop({ required: true })
  patientId: string;

  @Prop({ required: true })
  patientName: string;

  @Prop({ required: true, enum: ImageModality })
  modality: ImageModality;

  @Prop({ required: true })
  studyDate: Date;

  @Prop()
  studyDescription: string;

  @Prop({ required: true })
  bodyPart: string;

  @Prop()
  indication: string;

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

  @Prop()
  thumbnailUrl: string;

  @Prop({ type: Object })
  imageDimensions: {
    width: number;
    height: number;
    depth?: number;
  };

  @Prop({ enum: ImageQuality })
  quality: ImageQuality;

  @Prop({ enum: ImageStatus, default: ImageStatus.PENDING })
  status: ImageStatus;

  @Prop()
  seriesNumber: string;

  @Prop()
  instanceNumber: string;

  @Prop({ type: [String], default: [] })
  relatedImages: string[];

  @Prop({ type: Object })
  dicomMetadata: {
    studyInstanceUID?: string;
    seriesInstanceUID?: string;
    sopInstanceUID?: string;
    patientID?: string;
    studyID?: string;
    accessionNumber?: string;
    institutionName?: string;
    manufacturerModelName?: string;
    softwareVersions?: string;
    [key: string]: any;
  };

  @Prop()
  technician: string;

  @Prop()
  technicianName: string;

  @Prop()
  radiologistId: string;

  @Prop()
  radiologistName: string;

  @Prop()
  referringPhysician: string;

  @Prop()
  referringPhysicianName: string;

  @Prop()
  report: string;

  @Prop()
  findings: string;

  @Prop()
  impression: string;

  @Prop()
  recommendations: string;

  @Prop()
  reportDate: Date;

  @Prop({ type: [Object], default: [] })
  measurements: {
    name: string;
    value: number;
    unit: string;
    description?: string;
  }[];

  @Prop({ type: [Object], default: [] })
  annotations: {
    userId: string;
    userName: string;
    type: string;
    coordinates: {
      x: number;
      y: number;
      width?: number;
      height?: number;
    };
    text: string;
    color?: string;
    createdAt: Date;
  }[];

  @Prop()
  consultationId: string;

  @Prop()
  emergencyId: string;

  @Prop()
  examinationId: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: false })
  isConfidential: boolean;

  @Prop({ type: [String], default: [] })
  accessibleBy: string[];

  @Prop()
  validatedBy: string;

  @Prop()
  validatedByName: string;

  @Prop()
  validatedAt: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedBy: string;

  @Prop()
  deletedAt: Date;
}

export const MedicalImageSchema = SchemaFactory.createForClass(MedicalImage);

// Indexes
MedicalImageSchema.index({ patientId: 1, studyDate: -1 });
MedicalImageSchema.index({ patientId: 1, modality: 1 });
MedicalImageSchema.index({ consultationId: 1 });
MedicalImageSchema.index({ emergencyId: 1 });
MedicalImageSchema.index({ examinationId: 1 });
MedicalImageSchema.index({ status: 1 });
MedicalImageSchema.index({ radiologistId: 1 });
MedicalImageSchema.index({ studyDate: 1 });
MedicalImageSchema.index({ modality: 1, bodyPart: 1 });
MedicalImageSchema.index({ tags: 1 });
MedicalImageSchema.index({ 'dicomMetadata.studyInstanceUID': 1 });
MedicalImageSchema.index({ 'dicomMetadata.seriesInstanceUID': 1 });
MedicalImageSchema.index({ isDeleted: 1 });

// Text search index
MedicalImageSchema.index({
  studyDescription: 'text',
  bodyPart: 'text',
  indication: 'text',
  report: 'text',
  findings: 'text',
  impression: 'text',
});
