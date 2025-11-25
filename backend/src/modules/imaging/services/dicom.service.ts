import { Injectable } from '@nestjs/common';

@Injectable()
export class DicomService {
  generateDicomMetadata(examData: any): any {
    return {
      studyInstanceUID: this.generateUID(),
      seriesInstanceUID: this.generateUID(),
      sopInstanceUID: this.generateUID(),
      studyDate: new Date().toISOString().split('T')[0].replace(/-/g, ''),
      studyTime: new Date().toTimeString().split(' ')[0].replace(/:/g, ''),
      modality: examData.modality,
      patientName: examData.patientNom,
      patientID: examData.patientId,
      studyDescription: examData.studyDescription,
      bodyPartExamined: examData.bodyPart,
    };
  }

  private generateUID(): string {
    const prefix = '1.2.840.10008.5.1.4.1.1.';
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000);
    return `${prefix}${timestamp}.${random}`;
  }

  parseDicomTags(dicomData: any): any {
    return {
      patientInfo: {
        name: dicomData.PatientName || '',
        id: dicomData.PatientID || '',
        birthDate: dicomData.PatientBirthDate || '',
        sex: dicomData.PatientSex || '',
      },
      studyInfo: {
        studyUID: dicomData.StudyInstanceUID || '',
        studyDate: dicomData.StudyDate || '',
        studyTime: dicomData.StudyTime || '',
        studyDescription: dicomData.StudyDescription || '',
        modality: dicomData.Modality || '',
      },
      imageInfo: {
        rows: dicomData.Rows || 0,
        columns: dicomData.Columns || 0,
        bitsAllocated: dicomData.BitsAllocated || 0,
        bitsStored: dicomData.BitsStored || 0,
      },
    };
  }
}
