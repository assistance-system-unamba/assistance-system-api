import { Inject, Injectable } from '@nestjs/common';
import { EventEntity } from 'src/modules/event/domain/entities/event.entity';
import { EVENT_REPOSITORY, IEventRepository } from 'src/modules/event/domain/repositories/event.repository';

@Injectable()
export class GetEventUseCase {
  constructor(@Inject(EVENT_REPOSITORY) private readonly repo: IEventRepository) {}
  execute(eventId: string): Promise<EventEntity> {
    return this.repo.findEventById(eventId);
  }
}
