import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PersonalData } from 'src/modules/user/domain/entities/personal-data.entity';
import { IPersonalDataRepository, PERSONAL_DATA_REPOSITORY } from 'src/modules/user/domain/repositories/personal-data.repository';

@Injectable()
export class GetPersonalDataUseCase {
  constructor(@Inject(PERSONAL_DATA_REPOSITORY) private readonly repo: IPersonalDataRepository) {}

  async execute(id: string): Promise<PersonalData> {
    const pd = await this.repo.findById(id);
    if (!pd) throw new NotFoundException('PersonalData not found');
    return pd;
  }
}
