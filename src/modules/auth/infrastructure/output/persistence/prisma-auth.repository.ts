import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { AUTH_REPOSITORY, IAuthRepository, AuthUser } from '../../../domain/repositories/auth.repository';

@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByUserName(userName: string): Promise<AuthUser | null> {
    const row = await this.prisma.user.findFirst({
      where: { userName },
      select: { userId: true, userName: true, password: true, role: true, participantId: true },
    });
    return row ?? null;
  }

  async findUserById(userId: number): Promise<AuthUser | null> {
    const row = await this.prisma.user.findUnique({
      where: { userId },
      select: { userId: true, userName: true, password: true, role: true, participantId: true },
    });
    return row ?? null;
  }

  async createRefreshToken(userId: number, tokenHash: string, expiresAt: Date): Promise<void> {
    await this.prisma.refreshToken.create({
      data: { tokenHash, userId, expiresAt },
    });
  }

  async findValidRefreshToken(tokenHash: string): Promise<{ id: string; userId: number } | null> {
    const row = await this.prisma.refreshToken.findFirst({
      where: {
        tokenHash,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      select: { id: true, userId: true },
    });
    return row ?? null;
  }

  async revokeRefreshTokenById(id: string): Promise<void> {
    await this.prisma.refreshToken.update({
      where: { id },
      data: { isRevoked: true },
    });
  }

  async revokeAllRefreshTokensForUser(userId: number): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async pruneExpiredTokens(): Promise<number> {
    const res = await this.prisma.refreshToken.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
    return res.count;
  }
}
