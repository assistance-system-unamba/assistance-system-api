import { EventEntity, MaterialEntity } from '../../../domain/entities/event.entity';

export class PrismaEventMapper {
  static toEventEntity(raw: any): EventEntity {
    const materialsRaw = Array.isArray(raw.materials) ? raw.materials : [];
    return EventEntity.create({
      eventId: raw.eventId,
      title: raw.title ?? null,
      description: raw.description ?? null,
      startTime: raw.startTime ?? null,
      endTime: raw.endTime ?? null,
      place: raw.place ?? null,
      createAt: raw.createAt ?? null,
      materials: materialsRaw.map((m) => PrismaEventMapper.toMaterialEntity(m)),
    });
  }

  static toMaterialEntity(raw: any): MaterialEntity {
    return MaterialEntity.create({
      materialId: raw.materialId,
      materialUrl: raw.materialUrl ?? null,
      title: raw.title ?? null,
      description: raw.description ?? null,
      type: raw.type ?? null,
      createAt: raw.createAt ?? null,
      eventId: raw.eventId,
    });
  }
}
