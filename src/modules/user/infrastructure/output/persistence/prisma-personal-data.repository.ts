import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { IPersonalDataRepository } from '../../../domain/repositories/personal-data.repository';
import { PersonalData } from '../../../domain/entities/personal-data.entity';
import { PersonalDataPersistenceMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaPersonalDataRepository implements IPersonalDataRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(pd: PersonalData): Promise<PersonalData> {
    const created = await this.prisma.personalData.create({
      data: PersonalDataPersistenceMapper.toPersistence(pd),
    });
    return PersonalDataPersistenceMapper.toDomain(created);
  }

  async findById(id: string): Promise<PersonalData | null> {
    const found = await this.prisma.personalData.findUnique({ where: { personalDataId: id } });
    return found ? PersonalDataPersistenceMapper.toDomain(found) : null;
  }

  async findAll(): Promise<PersonalData[]> {
    const rows = await this.prisma.personalData.findMany();
    return rows.map(PersonalDataPersistenceMapper.toDomain);
  }

  async update(pd: PersonalData): Promise<PersonalData> {
    const updated = await this.prisma.personalData.update({
      where: { personalDataId: pd.getId() },
      data: PersonalDataPersistenceMapper.toPersistence(pd),
    });
    return PersonalDataPersistenceMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.personalData.delete({ where: { personalDataId: id } });
  }

  async exists(id: string): Promise<boolean> {
    const c = await this.prisma.personalData.count({ where: { personalDataId: id } });
    return c > 0;
  }
}
