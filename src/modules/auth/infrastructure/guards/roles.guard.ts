import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<number[]>(ROLES_KEY, [
      ctx.getHandler(), ctx.getClass(),
    ]);
    if (!required || required.length === 0) return true; // sin @Roles => basta JWT

    const user = ctx.switchToHttp().getRequest().user as { role: number | null };
    if (!user?.role || !required.includes(user.role)) {
      throw new ForbiddenException('No tienes permisos para esta operación');
    }
    return true;
  }
}