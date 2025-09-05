import { Inject, Injectable } from '@nestjs/common';
import { IPersonalDataRepository, PERSONAL_DATA_REPOSITORY } from 'src/modules/user/domain/repositories/personal-data.repository';

@Injectable()
export class DeletePersonalDataUseCase {
  constructor(@Inject(PERSONAL_DATA_REPOSITORY) private readonly repo: IPersonalDataRepository) {}
  async execute(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
