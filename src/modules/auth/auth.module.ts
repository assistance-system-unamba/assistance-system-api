import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from 'src/config/prisma.service';
import { AUTH_REPOSITORY } from './domain/repositories/auth.repository';
import { PrismaAuthRepository } from './infrastructure/output/persistence/prisma-auth.repository';
import { PasswordService } from './application/services/password.service';
import { TokenService } from './application/services/token.service';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RefreshUseCase } from './application/use-cases/refresh.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { MeUseCase } from './application/use-cases/me.use-case';
import { JwtStrategy } from './infrastructure/jwt/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from './infrastructure/guards/roles.guard';
import { CsrfGuard } from './infrastructure/guards/csrf.guard';
import { AuthController } from './infrastructure/input/auth.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET!,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TTL || '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    { provide: AUTH_REPOSITORY, useClass: PrismaAuthRepository },
    PasswordService,
    TokenService,
    LoginUseCase,
    RefreshUseCase,
    LogoutUseCase,
    MeUseCase,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    CsrfGuard,
  ],
  exports: [
    JwtAuthGuard,
    RolesGuard,
    PasswordService,
  ],
})
export class AuthModule {}
