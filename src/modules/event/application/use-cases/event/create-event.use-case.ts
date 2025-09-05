import { Inject, Injectable } from '@nestjs/common';
import { EventEntity, MaterialEntity } from 'src/modules/event/domain/entities/event.entity';
import { EVENT_REPOSITORY, IEventRepository } from 'src/modules/event/domain/repositories/event.repository';

@Injectable()
export class CreateEventUseCase {
  constructor(@Inject(EVENT_REPOSITORY) private readonly repo: IEventRepository) {}

  async execute(
    event: Omit<EventEntity, 'eventId' | 'createAt'>, // <- ya no omites 'materials'
    materials?: Omit<MaterialEntity, 'materialId' | 'createAt' | 'eventId'>[],
  ): Promise<EventEntity> {
    return this.repo.createEvent(
      { ...event, materials: event.materials ?? [] }, // garantiza materials
      materials,
    );
  }  
}
