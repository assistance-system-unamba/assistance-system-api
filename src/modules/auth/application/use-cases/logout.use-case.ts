import { Inject, Injectable } from '@nestjs/common';
import { AUTH_REPOSITORY, IAuthRepository } from '../../domain/repositories/auth.repository';
import { TokenService } from '../services/token.service';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly repo: IAuthRepository,
    private readonly tokens: TokenService,
  ) {}

  async executeByToken(refreshToken: string): Promise<void> {
    const hash = this.tokens.hashRefreshToken(refreshToken);
    const found = await this.repo.findValidRefreshToken(hash);
    if (found) await this.repo.revokeRefreshTokenById(found.id);
  }

  async executeAllForUser(userId: number): Promise<void> {
    await this.repo.revokeAllRefreshTokensForUser(userId);
  }
}
