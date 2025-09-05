import { UserResponseDto } from "src/modules/user/application/dto/output/user-response.dto";
import { User } from "src/modules/user/domain/entities/user.entity";


export class UserResponseMapper {
  static toDto(user: User): UserResponseDto {
    return {
      userId: user.getId()!,
      role: user.getRole() ?? null,
      userName: user.getUserName(),
      cardNumber: user.getCardNumber() ?? null,
      participantId: user.getParticipantId(),
    };
  }
}
