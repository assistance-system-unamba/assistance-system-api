import { UUID } from 'src/shared/value-objects/uuid.vo';

export class PersonalData {
  private constructor(
    private readonly personalDataId: string,
    private name: string | null,
    private lastName: string | null,
    private dni: string | null,
    private dateBirth: Date,
    private email: string | null,
    private cellPhone: string | null,
  ) {}

  static create(
    props: {
      personalDataId?: string; 
      name?: string | null; 
      lastName?: string | null; 
      dni?: string | null; 
      dateBirth: Date; 
      email?: string | null; 
      cellPhone?: string | null; 
    }
  ): PersonalData {
    const id = props.personalDataId ?? UUID.create().toString();
    return new PersonalData(
      id,
      props.name ?? null,
      props.lastName ?? null,
      props.dni ?? null,
      props.dateBirth,
      props.email ?? null,
      props.cellPhone ?? null,
    );
  }

  getId() { return this.personalDataId; }
  getName() { return this.name; }
  getLastName() { return this.lastName; }
  getDni() { return this.dni; }
  getDateBirth() { return this.dateBirth; }
  getEmail() { return this.email; }
  getCellPhone() { return this.cellPhone; }
}
