import { Participant } from "src/modules/user/domain/entities/participant.entity";
import { PersonalData } from "src/modules/user/domain/entities/personal-data.entity";
import { User } from "src/modules/user/domain/entities/user.entity";


export const UserPersistenceMapper = {
  toDomain(raw: any): User {
    return User.create({
      userId: raw.userId,
      role: raw.role ?? null,
      userName: raw.userName,
      password: raw.password,
      cardNumber: raw.cardNumber ?? null,
      participantId: raw.participantId,
    });
  },

  toPersistence(user: User): any {
    return {
      userName: user.getUserName(),
      password: user.getPassword(),
      cardNumber: user.getCardNumber() ?? undefined,
      role: user.getRole() ?? undefined,
      participantId: user.getParticipantId(),
    };
  },
};

export const ParticipantPersistenceMapper = {
  toDomain(raw: any): Participant {
    return Participant.create({
      participantId: raw.participantId,
      faculty: raw.faculty ?? null,
      career: raw.career ?? null,
      type: raw.type ?? null,
      personalDataId: raw.personalDataId,
      eventId: raw.eventId,
    });
  },

  toPersistence(p: Participant): any {
    return {
      participantId: p.getId(),
      faculty: p.getFaculty() ?? undefined,
      career: p.getCareer() ?? undefined,
      type: p.getType() ?? undefined,
      personalDataId: p.getPersonalDataId(),
      eventId: p.getEventId(),
    };
  },
};

export const PersonalDataPersistenceMapper = {
  toDomain(raw: any): PersonalData {
    return PersonalData.create({
      personalDataId: raw.personalDataId,
      name: raw.name ?? null,
      lastName: raw.lastName ?? null,
      dni: raw.dni ?? null,
      dateBirth: raw.dateBirth ?? null,
      email: raw.email ?? null,
      cellPhone: raw.cellPhone ?? null,
    });
  },

  toPersistence(pd: PersonalData): any {
    return {
      personalDataId: pd.getId(),
      name: pd.getName() ?? undefined,
      lastName: pd.getLastName() ?? undefined,
      dni: pd.getDni() ?? undefined,
      dateBirth: new Date(pd.getDateBirth()),
      email: pd.getEmail() ?? undefined,
      cellPhone: pd.getCellPhone() ?? undefined,
    };
  },
};
