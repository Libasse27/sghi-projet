import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NursingNote } from '../entities/nursing-note.entity';

@Injectable()
export class NursingCareService {
  constructor(
    @InjectRepository(NursingNote)
    private nursingNoteRepository: Repository<NursingNote>,
  ) {}

  async createNote(createDto: any): Promise<NursingNote> {
    const note = this.nursingNoteRepository.create({
      ...createDto,
      noteDate: new Date(),
    });

    const saved = await this.nursingNoteRepository.save(note);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async findByAdmission(admissionId: string): Promise<NursingNote[]> {
    return await this.nursingNoteRepository.find({
      where: { admissionId },
      relations: ['nurse'],
      order: { noteDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<NursingNote> {
    return await this.nursingNoteRepository.findOne({
      where: { id },
      relations: ['admission', 'nurse'],
    });
  }
}
