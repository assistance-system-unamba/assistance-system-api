import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { IUserRepository } from '../../../domain/repositories/user.repository';
import { User } from '../../../domain/entities/user.entity';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(user: User): Promise<User> {
    const created = await this.prisma.user.create({
      data: {
        userName: user.getUserName(),
        password: user.getPassword(),
        cardNumber: user.getCardNumber() ?? undefined,
        role: user.getRole() ?? undefined,
        participant: { connect: { participantId: user.getParticipantId() } },
      },
    });
    return this.toDomain(created);
  }

  async findById(id: number): Promise<User | null> {
    const found = await this.prisma.user.findUnique({ where: { userId: id } });
    return found ? this.toDomain(found) : null;
  }

  async findAll(): Promise<User[]> {
    const rows = await this.prisma.user.findMany();
    return rows.map(this.toDomain);
  }

  async update(user: User): Promise<User> {
    const updated = await this.prisma.user.update({
      where: { userId: user.getId()! },
      data: {
        userName: user.getUserName(),
        password: user.getPassword(),
        cardNumber: user.getCardNumber() ?? undefined,
        role: user.getRole() ?? undefined,
      },
    });
    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { userId: id } });
  }

  async existsByUserName(userName: string): Promise<boolean> {
    const found = await this.prisma.user.findFirst({ where: { userName } , select: { userId: true }});
  return !!found;
  }

  private toDomain = (raw: any): User =>
    User.create({
      userId: raw.userId,
      role: raw.role ?? null,
      userName: raw.userName,
      password: raw.password,
      cardNumber: raw.cardNumber ?? null,
      participantId: raw.participantId,
    });
}
