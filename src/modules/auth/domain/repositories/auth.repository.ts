export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';

export interface AuthUser {
  userId: number;
  userName: string | null;
  password: string | null;
  role: number | null;
  participantId: string | null;
}

export interface IAuthRepository {
  findUserByUserName(userName: string): Promise<AuthUser | null>;
  findUserById(userId: number): Promise<AuthUser | null>;

  createRefreshToken(userId: number, tokenHash: string, expiresAt: Date): Promise<void>;
  findValidRefreshToken(tokenHash: string): Promise<{ id: string; userId: number } | null>;
  revokeRefreshTokenById(id: string): Promise<void>;
  revokeAllRefreshTokensForUser(userId: number): Promise<void>;
  pruneExpiredTokens(): Promise<number>;
}
