export const PERSONAL_DATA_REPOSITORY = Symbol('PERSONAL_DATA_REPOSITORY');

import { PersonalData } from '../entities/personal-data.entity';

export interface IPersonalDataRepository {
  create(pd: PersonalData): Promise<PersonalData>;
  findById(id: string): Promise<PersonalData | null>;
  findAll(): Promise<PersonalData[]>;
  update(pd: PersonalData): Promise<PersonalData>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
