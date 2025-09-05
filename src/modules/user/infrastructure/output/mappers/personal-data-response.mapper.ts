import { PersonalDataResponseDto } from "src/modules/user/application/dto/output/personal-data-response.dto";
import { PersonalData } from "src/modules/user/domain/entities/personal-data.entity";


export class PersonalDataResponseMapper {
  static toDto(pd: PersonalData): PersonalDataResponseDto {
    return {
      personalDataId: pd.getId(),
      name: pd.getName() ?? null,
      lastName: pd.getLastName() ?? null,
      dni: pd.getDni() ?? null,
      dateBirth: pd.getDateBirth(),
      email: pd.getEmail() ?? null,
      cellPhone: pd.getCellPhone() ?? null,
    };
  }
}
