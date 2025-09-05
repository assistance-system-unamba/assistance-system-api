import { Prisma } from '@prisma/client';

declare module '@prisma/client' {
  interface PrismaClient {
    $on(event: 'beforeExit', callback: (event: Prisma.LogEvent) => void): void;
  }
}
