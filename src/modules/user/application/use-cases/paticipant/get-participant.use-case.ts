import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Participant } from 'src/modules/user/domain/entities/participant.entity';
import { IParticipantRepository, PARTICIPANT_REPOSITORY } from 'src/modules/user/domain/repositories/participant.repository';

@Injectable()
export class GetParticipantUseCase {
  constructor(@Inject(PARTICIPANT_REPOSITORY) private readonly repo: IParticipantRepository) {}

  async execute(id: string): Promise<Participant> {
    const p = await this.repo.findById(id);
    if (!p) throw new NotFoundException('Participant not found');
    return p;
  }
}
