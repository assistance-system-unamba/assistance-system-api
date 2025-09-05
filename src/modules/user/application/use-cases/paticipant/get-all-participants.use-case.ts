import { Inject, Injectable } from '@nestjs/common';
import { Participant } from 'src/modules/user/domain/entities/participant.entity';
import { IParticipantRepository, PARTICIPANT_REPOSITORY } from 'src/modules/user/domain/repositories/participant.repository';
@Injectable()
export class GetAllParticipantsUseCase {
  constructor(@Inject(PARTICIPANT_REPOSITORY) private readonly repo: IParticipantRepository) {}
  async execute(): Promise<Participant[]> {
    return this.repo.findAll();
  }
}
