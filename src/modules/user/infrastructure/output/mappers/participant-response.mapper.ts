import { ParticipantResponseDto } from "src/modules/user/application/dto/input/participant/participant-response.dto";
import { Participant } from "src/modules/user/domain/entities/participant.entity";


export class ParticipantResponseMapper {
  static toDto(p: Participant): ParticipantResponseDto {
    return {
      participantId: p.getId(),
      faculty: p.getFaculty() ?? null,
      career: p.getCareer() ?? null,
      type: p.getType() ?? null,
      personalDataId: p.getPersonalDataId(),
      eventId: p.getEventId(),
    };
  }
}
