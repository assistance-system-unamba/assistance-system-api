import { Inject, Injectable } from '@nestjs/common';
import { EVENT_REPOSITORY, IEventRepository } from 'src/modules/event/domain/repositories/event.repository';

@Injectable()
export class DeleteMaterialUseCase {
  constructor(@Inject(EVENT_REPOSITORY) private readonly repo: IEventRepository) {}
  execute(materialId: string): Promise<void> {
    return this.repo.deleteMaterial(materialId);
  }
}
