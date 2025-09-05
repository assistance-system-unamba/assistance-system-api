import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_REPOSITORY, IAuthRepository } from '../../domain/repositories/auth.repository';
import { AuthUserDto } from '../dto/output/auth-user.dto';

@Injectable()
export class MeUseCase {
  constructor(@Inject(AUTH_REPOSITORY) private readonly repo: IAuthRepository) {}

  async execute(userId: number): Promise<AuthUserDto> {
    const user = await this.repo.findUserById(userId);
    if (!user) throw new UnauthorizedException();
    return {
      userId: user.userId,
      userName: user.userName,
      role: user.role,
      participantId: user.participantId,
    };
  }
}
