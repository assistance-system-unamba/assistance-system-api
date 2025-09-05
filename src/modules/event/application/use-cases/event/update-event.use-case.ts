import { Inject, Injectable } from '@nestjs/common';
import { EventEntity } from 'src/modules/event/domain/entities/event.entity';
import { EVENT_REPOSITORY, IEventRepository } from 'src/modules/event/domain/repositories/event.repository';

@Injectable()
export class UpdateEventUseCase {
  constructor(@Inject(EVENT_REPOSITORY) private readonly repo: IEventRepository) {}
  execute(eventId: string, partial: Partial<Omit<EventEntity, 'eventId' | 'createAt' | 'materials'>>): Promise<EventEntity> {
    return this.repo.updateEvent(eventId, partial);
  }
}
