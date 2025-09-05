import { Inject, Injectable } from '@nestjs/common';
import { MaterialEntity } from 'src/modules/event/domain/entities/event.entity';
import { EVENT_REPOSITORY, IEventRepository } from 'src/modules/event/domain/repositories/event.repository';

@Injectable()
export class UpdateMaterialUseCase {
  constructor(@Inject(EVENT_REPOSITORY) private readonly repo: IEventRepository) {}
  execute(materialId: string, partial: Partial<Omit<MaterialEntity, 'materialId' | 'createAt' | 'eventId'>>) {
    return this.repo.updateMaterial(materialId, partial);
  }
}
