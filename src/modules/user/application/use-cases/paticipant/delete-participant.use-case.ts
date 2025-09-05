import { Inject, Injectable } from '@nestjs/common';
import { IParticipantRepository, PARTICIPANT_REPOSITORY } from 'src/modules/user/domain/repositories/participant.repository';

@Injectable()
export class DeleteParticipantUseCase {
  constructor(@Inject(PARTICIPANT_REPOSITORY) private readonly repo: IParticipantRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
