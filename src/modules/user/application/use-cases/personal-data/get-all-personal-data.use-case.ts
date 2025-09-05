import { Inject, Injectable } from '@nestjs/common';
import { PersonalData } from 'src/modules/user/domain/entities/personal-data.entity';
import { IPersonalDataRepository, PERSONAL_DATA_REPOSITORY } from 'src/modules/user/domain/repositories/personal-data.repository';

@Injectable()
export class GetAllPersonalDataUseCase {
  constructor(@Inject(PERSONAL_DATA_REPOSITORY) private readonly repo: IPersonalDataRepository) {}
  async execute(): Promise<PersonalData[]> {
    return this.repo.findAll();
  }
}
