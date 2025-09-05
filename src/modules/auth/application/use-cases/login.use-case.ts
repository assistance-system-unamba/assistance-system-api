import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AUTH_REPOSITORY, IAuthRepository } from '../../domain/repositories/auth.repository';
import { PasswordService } from '../services/password.service';
import { TokenService } from '../services/token.service';
import { TokensDto } from '../dto/output/tokens.dto';
import { AuthUserDto } from '../dto/output/auth-user.dto';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY) private readonly repo: IAuthRepository,
    private readonly pwd: PasswordService,
    private readonly tokens: TokenService,
  ) {}

  async execute(userName: string, password: string): Promise<{ user: AuthUserDto; tokens: TokensDto }> {
    const user = await this.repo.findUserByUserName(userName);
    
    if (!user || !user.password) throw new UnauthorizedException('Credenciales inválidas');

    const ok = await this.pwd.compare(password, user.password);

    if (!ok) throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: user.userId,
      role: user.role ?? null,
      userName: user.userName ?? null,
      participantId: user.participantId ?? null,
    };

    const accessToken = await this.tokens.signAccessToken(payload);

    const { token: refreshToken } = this.tokens.generateRefreshToken();
    const { hash, expiresAt } = this.tokens.generateRefreshToken(); // ⚠️ CORRECCIÓN ABAJO
    // ↑ Esto generaría dos tokens distintos. Debe ser UNO solo. Ver línea corregida:
    // const { token: refreshToken, hash, expiresAt } = this.tokens.generateRefreshToken();

    // ✅ Versión correcta:
    const gen = this.tokens.generateRefreshToken();
    const refresh = gen.token;
    await this.repo.createRefreshToken(user.userId, gen.hash, gen.expiresAt);

    const userDto: AuthUserDto = {
      userId: user.userId,
      userName: user.userName,
      role: user.role,
      participantId: user.participantId,
    };

    return { user: userDto, tokens: { accessToken, refreshToken: refresh } };
  }
}
