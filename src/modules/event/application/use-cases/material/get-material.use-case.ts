import { Inject, Injectable } from '@nestjs/common';
import { MaterialEntity } from 'src/modules/event/domain/entities/event.entity';
import { EVENT_REPOSITORY, IEventRepository } from 'src/modules/event/domain/repositories/event.repository';

@Injectable()
export class GetMaterialUseCase {
  constructor(@Inject(EVENT_REPOSITORY) private readonly repo: IEventRepository) {}
  execute(materialId: string): Promise<MaterialEntity> {
    return this.repo.findMaterialById(materialId);
  }
}
