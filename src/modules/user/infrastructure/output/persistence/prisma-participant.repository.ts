import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { IParticipantRepository } from '../../../domain/repositories/participant.repository';
import { Participant } from '../../../domain/entities/participant.entity';
import { ParticipantPersistenceMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaParticipantRepository implements IParticipantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(p: Participant): Promise<Participant> {
    const created = await this.prisma.participant.create({
      data: ParticipantPersistenceMapper.toPersistence(p), // camelCase
    });
    return ParticipantPersistenceMapper.toDomain(created);
  }

  async findById(id: string): Promise<Participant | null> {
    const found = await this.prisma.participant.findUnique({ where: { participantId: id } });
    return found ? ParticipantPersistenceMapper.toDomain(found) : null;
  }

  async findAll(): Promise<Participant[]> {
    const rows = await this.prisma.participant.findMany();
    return rows.map(ParticipantPersistenceMapper.toDomain);
  }

  async update(p: Participant): Promise<Participant> {
    const updated = await this.prisma.participant.update({
      where: { participantId: p.getId() },
      data: ParticipantPersistenceMapper.toPersistence(p), // camelCase
    });
    return ParticipantPersistenceMapper.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.participant.delete({ where: { participantId: id } });
  }

  async exists(id: string): Promise<boolean> {
    const c = await this.prisma.participant.count({ where: { participantId: id } });
    return c > 0;
  }
}
