import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';

import { LoginDto } from '../../application/dto/input/login.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RefreshUseCase } from '../../application/use-cases/refresh.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { MeUseCase } from '../../application/use-cases/me.use-case';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CsrfGuard } from '../guards/csrf.guard';

import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';

import { CSRF_COOKIE, REFRESH_COOKIE, refreshCookieOptions } from '../http/cookie.constants';
import { generateCsrfToken } from '../http/csrf.util';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUC: LoginUseCase,
    private readonly refreshUC: RefreshUseCase,
    private readonly logoutUC: LogoutUseCase,
    private readonly meUC: MeUseCase,
  ) {}

  /** Helper para Swagger/curl: setea y devuelve CSRF */
  @Public()
  @Get('csrf')
  @HttpCode(200)
  async getCsrf(@Res({ passthrough: true }) res: Response) {
    const days = Number(process.env.JWT_REFRESH_TTL_DAYS || 6);
    const maxAgeMs = days * 24 * 60 * 60 * 1000;
    const csrf = generateCsrfToken();

    res.cookie(CSRF_COOKIE, csrf, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/auth',
      maxAge: maxAgeMs,
    });

    return { csrfToken: csrf };
  }

  /** Login: set-cookie refresh (httpOnly) + cookie csrf (no httpOnly) y retorna user + accessToken */
  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, tokens } = await this.loginUC.execute(dto.userName, dto.password);

    const days = Number(process.env.JWT_REFRESH_TTL_DAYS || 7);
    const maxAgeMs = days * 24 * 60 * 60 * 1000;

    // refresh token httpOnly
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, refreshCookieOptions(maxAgeMs));

    // csrf token (no httpOnly)
    const csrf = generateCsrfToken();
    res.cookie(CSRF_COOKIE, csrf, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth',
      maxAge: maxAgeMs,
    });

    return { user, accessToken: tokens.accessToken };
  }

  /** Refresh: lee refresh cookie httpOnly, exige header x-csrf-token y rota */
  @Public()
  @Post('refresh')
  @ApiHeader({ name: 'x-csrf-token', required: true })
  @UseGuards(CsrfGuard)
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rt = req.cookies?.[REFRESH_COOKIE];
    if (!rt) return { message: 'No refresh token cookie' };

    const tokens = await this.refreshUC.execute(rt);

    const days = Number(process.env.JWT_REFRESH_TTL_DAYS || 7);
    const maxAgeMs = days * 24 * 60 * 60 * 1000;

    // rotar refresh cookie
    res.cookie(REFRESH_COOKIE, tokens.refreshToken, refreshCookieOptions(maxAgeMs));

    return { accessToken: tokens.accessToken };
  }

  /** Logout: revoca el refresh y limpia cookies */
  @Public()
  @Post('logout')
  @ApiHeader({ name: 'x-csrf-token', required: true })
  @UseGuards(CsrfGuard)
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rt = req.cookies?.[REFRESH_COOKIE];
    if (rt) await this.logoutUC.executeByToken(rt);
    res.clearCookie(REFRESH_COOKIE, { path: '/auth' });
    res.clearCookie(CSRF_COOKIE, { path: '/auth' });
    return { __message: 'Sesión cerrada' };
  }

  /** Cerrar todas las sesiones del usuario actual (requiere Bearer + CSRF porque usa cookies también) */
  @Post('logout-all')
  @ApiHeader({ name: 'x-csrf-token', required: true })
  @UseGuards(JwtAuthGuard, CsrfGuard)
  @HttpCode(200)
  async logoutAll(@CurrentUser() user: any, @Res({ passthrough: true }) res: Response) {
    await this.logoutUC.executeAllForUser(user.userId);
    res.clearCookie(REFRESH_COOKIE, { path: '/auth' });
    res.clearCookie(CSRF_COOKIE, { path: '/auth' });
    return { __message: 'Todas las sesiones cerradas' };
  }

  /** Perfil (Bearer token) */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: any) {
    return this.meUC.execute(user.userId);
  }
}
