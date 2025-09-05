import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    // Desactivador opcional en desarrollo (no usar en producción)
    if (process.env.CSRF_DISABLED === 'true') return true;

    const req = ctx.switchToHttp().getRequest();
    const header = req.get('x-csrf-token') || req.get('X-CSRF-Token');
    const fromCookie = req.cookies?.['csrf_token'];

    if (!fromCookie || !header || header !== fromCookie) {
      throw new ForbiddenException('CSRF token inválido');
    }
    return true;
  }
}
