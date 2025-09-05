import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Participant } from 'src/modules/user/domain/entities/participant.entity';
import { IParticipantRepository, PARTICIPANT_REPOSITORY } from 'src/modules/user/domain/repositories/participant.repository';
import { UpdateParticipantDto } from '../../dto/input/participant/update-participant.dto';

@Injectable()
export class UpdateParticipantUseCase {
  constructor(@Inject(PARTICIPANT_REPOSITORY) private readonly repo: IParticipantRepository) {}

  async execute(id: string, dto: UpdateParticipantDto): Promise<Participant> {
    const found = await this.repo.findById(id);
    if (!found) throw new NotFoundException('Participant not found');

    const merged = Participant.create({
      participantId: id,
      faculty: dto.faculty ?? found.getFaculty(),
      career: dto.career ?? found.getCareer(),
      type: (dto.type as any) ?? found.getType(),
      personalDataId: dto.personalDataId ?? found.getPersonalDataId(),
      eventId: dto.eventId ?? found.getEventId(),
    });

    return this.repo.update(merged);
  }
}
