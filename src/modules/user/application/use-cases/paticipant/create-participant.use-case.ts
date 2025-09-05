import { Inject, Injectable } from '@nestjs/common';
import { Participant } from 'src/modules/user/domain/entities/participant.entity';
import { IParticipantRepository, PARTICIPANT_REPOSITORY } from 'src/modules/user/domain/repositories/participant.repository';

@Injectable()
export class CreateParticipantUseCase {
  constructor(@Inject(PARTICIPANT_REPOSITORY) private readonly repo: IParticipantRepository) {}

  async execute(input: {
    faculty?: string | null;
    career?: string | null;
    type?: 'participant' | 'speaker' | 'teacher' | null;
    personalDataId: string;
    eventId: string;
  }): Promise<Participant> {
    const entity = Participant.create({
      faculty: input.faculty ?? null,
      career: input.career ?? null,
      type: input.type ?? null,
      personalDataId: input.personalDataId,
      eventId: input.eventId,
    });
    return this.repo.create(entity);
  }
}
