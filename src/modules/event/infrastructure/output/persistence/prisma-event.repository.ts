import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { UUID } from 'src/shared/value-objects/uuid.vo';
import { IEventRepository } from '../../../domain/repositories/event.repository';
import { EventEntity, MaterialEntity } from '../../../domain/entities/event.entity';
import { PrismaEventMapper } from '../mappers/prisma-event.mapper';

@Injectable()
export class PrismaEventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(
    event: Omit<EventEntity, 'eventId' | 'createAt' | 'materials'>,
    materials?: Omit<MaterialEntity, 'materialId' | 'createAt' | 'eventId'>[],
  ): Promise<EventEntity> {
    const id = UUID.create().toString();

    const created = await this.prisma.event.create({
      data: {
        eventId: id,
        title: event.title,
        description: event.description,
        startTime: event.startTime,
        endTime: event.endTime,
        place: event.place,
        ...(materials && materials.length
          ? {
              materials: {
                create: materials.map((m) => ({
                  materialId: UUID.create().toString(),
                  materialUrl: m.materialUrl,
                  title: m.title,
                  description: m.description,
                  type: m.type,
                })),
              },
            }
          : {}),
      },
      include: { materials: true },
    });

    return PrismaEventMapper.toEventEntity(created);
  }

  async findEventById(eventId: string): Promise<EventEntity> {
    const found = await this.prisma.event.findUnique({
      where: { eventId },
      include: { materials: true },
    });
    if (!found) throw new NotFoundException('Event not found');
    return PrismaEventMapper.toEventEntity(found);
  }

  async findAllEvents(): Promise<EventEntity[]> {
    const rows = await this.prisma.event.findMany({
      include: { materials: true },
      orderBy: { createAt: 'desc' },
    });
    return rows.map(PrismaEventMapper.toEventEntity);
  }

  async updateEvent(
    eventId: string,
    partial: Partial<Omit<EventEntity, 'eventId' | 'createAt' | 'materials'>>,
  ): Promise<EventEntity> {
    await this.ensureEventExists(eventId);

    const updated = await this.prisma.event.update({
      where: { eventId },
      data: {
        title: partial.title,
        description: partial.description,
        startTime: partial.startTime,
        endTime: partial.endTime,
        place: partial.place,
      },
      include: { materials: true },
    });

    return PrismaEventMapper.toEventEntity(updated);
  }

  async deleteEvent(eventId: string): Promise<void> {
    await this.ensureEventExists(eventId);

    await this.prisma.$transaction([
      this.prisma.material.deleteMany({ where: { eventId } }),
      this.prisma.event.delete({ where: { eventId } }),
    ]);
  }

  // ---------- Materials ----------
  async createMaterial(
    eventId: string,
    material: Omit<MaterialEntity, 'materialId' | 'createAt' | 'eventId'>,
  ): Promise<MaterialEntity> {
    await this.ensureEventExists(eventId);

    const created = await this.prisma.material.create({
      data: {
        materialId: UUID.create().toString(),
        eventId,
        materialUrl: material.materialUrl,
        title: material.title,
        description: material.description,
        type: material.type,
      },
    });

    return PrismaEventMapper.toMaterialEntity(created);
  }

  async createManyMaterials(
    eventId: string,
    materials: Omit<MaterialEntity, 'materialId' | 'createAt' | 'eventId'>[],
  ): Promise<MaterialEntity[]> {
    await this.ensureEventExists(eventId);

    const created = await this.prisma.$transaction(
      materials.map((m) =>
        this.prisma.material.create({
          data: {
            materialId: UUID.create().toString(),
            eventId,
            materialUrl: m.materialUrl,
            title: m.title,
            description: m.description,
            type: m.type,
          },
        }),
      ),
    );
    return created.map(PrismaEventMapper.toMaterialEntity);
  }

  async findMaterialById(materialId: string): Promise<MaterialEntity> {
    const found = await this.prisma.material.findUnique({ where: { materialId } });
    if (!found) throw new NotFoundException('Material not found');
    return PrismaEventMapper.toMaterialEntity(found);
  }

  async findMaterialsByEvent(eventId: string): Promise<MaterialEntity[]> {
    await this.ensureEventExists(eventId);
    const rows = await this.prisma.material.findMany({
      where: { eventId },
      orderBy: { createAt: 'desc' },
    });
    return rows.map(PrismaEventMapper.toMaterialEntity);
  }

  async updateMaterial(
    materialId: string,
    partial: Partial<Omit<MaterialEntity, 'materialId' | 'createAt' | 'eventId'>>,
  ): Promise<MaterialEntity> {
    await this.ensureMaterialExists(materialId);
    const updated = await this.prisma.material.update({
      where: { materialId },
      data: {
        materialUrl: partial.materialUrl,
        title: partial.title,
        description: partial.description,
        type: partial.type,
      },
    });
    return PrismaEventMapper.toMaterialEntity(updated);
  }

  async deleteMaterial(materialId: string): Promise<void> {
    await this.ensureMaterialExists(materialId);
    await this.prisma.material.delete({ where: { materialId } });
  }

  // ---------- guards ----------
  private async ensureEventExists(eventId: string) {
    const exists = await this.prisma.event.findUnique({ where: { eventId }, select: { eventId: true } });
    if (!exists) throw new NotFoundException('Event not found');
  }
  private async ensureMaterialExists(materialId: string) {
    const exists = await this.prisma.material.findUnique({ where: { materialId }, select: { materialId: true } });
    if (!exists) throw new NotFoundException('Material not found');
  }
}
