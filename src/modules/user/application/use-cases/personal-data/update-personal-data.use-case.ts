import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PersonalData } from 'src/modules/user/domain/entities/personal-data.entity';
import { IPersonalDataRepository, PERSONAL_DATA_REPOSITORY } from 'src/modules/user/domain/repositories/personal-data.repository';
import { UpdatePersonalDataDto } from '../../dto/input/personal-data/update-personal-data.dto';

@Injectable()
export class UpdatePersonalDataUseCase {
  constructor(@Inject(PERSONAL_DATA_REPOSITORY) private readonly repo: IPersonalDataRepository) {}

  async execute(id: string, dto: UpdatePersonalDataDto): Promise<PersonalData> {
    const found = await this.repo.findById(id);
    if (!found) throw new NotFoundException('PersonalData not found');

    const merged = PersonalData.create({
      personalDataId: id,
      name: dto.name ?? found.getName(),
      lastName: dto.lastName ?? found.getLastName(),
      dni: dto.dni ?? found.getDni(),
      dateBirth: dto.dateBirth,
      email: dto.email ?? found.getEmail(),
      cellPhone: dto.cellPhone ?? found.getCellPhone(),
    });

    return this.repo.update(merged);
  }
}
