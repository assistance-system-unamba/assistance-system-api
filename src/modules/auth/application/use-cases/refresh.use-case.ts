import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_REPOSITORY, IAuthRepository } from '../../domain/repositories/auth.repository';
import { TokenService } from '../services/token.service';
import { TokensDto } from '../dto/output/tokens.dto';

@Injectable()
export class RefreshUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly repo: IAuthRepository,
    private readonly tokens: TokenService,
  ) {}

  async execute(refreshToken: string): Promise<TokensDto> {
    const hash = this.tokens.hashRefreshToken(refreshToken);
    const found = await this.repo.findValidRefreshToken(hash);
    if (!found) throw new UnauthorizedException('Refresh token inválido');

    // Rotación
    await this.repo.revokeRefreshTokenById(found.id);

    const user = await this.repo.findUserById(found.userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    const payload = {
      sub: user.userId,
      role: user.role ?? null,
      userName: user.userName ?? null,
      participantId: user.participantId ?? null,
    };
    const accessToken = await this.tokens.signAccessToken(payload);

    const { token: newRefresh, hash: newHash, expiresAt } = this.tokens.generateRefreshToken();
    await this.repo.createRefreshToken(user.userId, newHash, expiresAt);

    return { accessToken, refreshToken: newRefresh };
  }
}
