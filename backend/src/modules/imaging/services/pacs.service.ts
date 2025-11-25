import { Injectable } from '@nestjs/common';

@Injectable()
export class PacsService {
  private readonly pacsBaseUrl = process.env.PACS_URL || 'http://localhost:8042';

  async uploadStudy(examId: string, dicomFiles: any[]): Promise<string> {
    const studyUrl = `${this.pacsBaseUrl}/studies/${examId}`;
    return studyUrl;
  }

  async getStudyUrl(studyInstanceUID: string): Promise<string> {
    return `${this.pacsBaseUrl}/studies/${studyInstanceUID}`;
  }

  async getImageUrl(sopInstanceUID: string): Promise<string> {
    return `${this.pacsBaseUrl}/instances/${sopInstanceUID}/preview`;
  }

  async queryStudies(criteria: any): Promise<any[]> {
    return [];
  }

  async retrieveStudy(studyInstanceUID: string): Promise<any> {
    return {
      studyInstanceUID,
      url: this.getStudyUrl(studyInstanceUID),
    };
  }

  async deleteStudy(studyInstanceUID: string): Promise<boolean> {
    return true;
  }
}
