import { Inject, Injectable } from '@nestjs/common';
import { PersonalData } from 'src/modules/user/domain/entities/personal-data.entity';
import { IPersonalDataRepository, PERSONAL_DATA_REPOSITORY } from 'src/modules/user/domain/repositories/personal-data.repository';
@Injectable()
export class CreatePersonalDataUseCase {
  constructor(@Inject(PERSONAL_DATA_REPOSITORY) private readonly repo: IPersonalDataRepository) {}

  async execute(input: {
    name?: string | null;
    lastName?: string | null;
    dni?: string | null;
    dateBirth: Date ;
    email?: string | null;
    cellPhone?: string | null;
  }): Promise<PersonalData> {
    const entity = PersonalData.create({
      name: input.name ?? null,
      lastName: input.lastName ?? null,
      dni: input.dni ?? null,
      dateBirth: input.dateBirth ,
      cellPhone: input.cellPhone ?? null,
    });
    return this.repo.create(entity);
  }
}
