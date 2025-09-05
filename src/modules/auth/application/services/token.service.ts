import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  async signAccessToken(payload: Record<string, any>): Promise<string> {
    return this.jwt.signAsync(payload);
  }

  generateRefreshToken(): { token: string; hash: string; expiresAt: Date; maxAgeMs: number } {
    const token = crypto.randomBytes(48).toString('base64url'); // opaco
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const days = Number(process.env.JWT_REFRESH_TTL_DAYS || 7);
    const maxAgeMs = days * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(Date.now() + maxAgeMs);
    return { token, hash, expiresAt, maxAgeMs };
  }

  hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}