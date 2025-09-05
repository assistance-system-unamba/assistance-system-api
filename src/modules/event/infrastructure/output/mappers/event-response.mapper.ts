import { EventEntity, MaterialEntity } from '../../../domain/entities/event.entity';
import { EventResponseDto } from '../../../application/dto/output/event-response.dto';
import { MaterialResponseDto } from '../../../application/dto/output/material-response.dto';

export class EventResponseMapper {
  static toMaterialDto(m: MaterialEntity): MaterialResponseDto {
    return {
      materialId: m.materialId,
      materialUrl: m.materialUrl,
      title: m.title,
      description: m.description,
      type: m.type,
      createAt: m.createAt,
      eventId: m.eventId,
    };
  }

  static toEventDto(e: EventEntity): EventResponseDto {
    return {
      eventId: e.eventId,
      title: e.title,
      description: e.description,
      startTime: e.startTime,
      endTime: e.endTime,
      place: e.place,
      createAt: e.createAt,
      // 👇 No usar "this" en callbacks
      materials: (e.materials ?? []).map((m) => EventResponseMapper.toMaterialDto(m)),
    };
  }
}
