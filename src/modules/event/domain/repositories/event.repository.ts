export const EVENT_REPOSITORY = 'EVENT_REPOSITORY';

import { EventEntity, MaterialEntity } from '../entities/event.entity';

export interface IEventRepository {
  // Event
  createEvent(event: Omit<EventEntity, 'eventId' | 'createAt'>, materials?: Omit<MaterialEntity, 'materialId' | 'createAt' | 'eventId'>[]): Promise<EventEntity>;
  findEventById(eventId: string): Promise<EventEntity>;
  findAllEvents(): Promise<EventEntity[]>;
  updateEvent(eventId: string, partial: Partial<Omit<EventEntity, 'eventId' | 'createAt' | 'materials'>>): Promise<EventEntity>;
  deleteEvent(eventId: string): Promise<void>;

  // Material
  createMaterial(eventId: string, material: Omit<MaterialEntity, 'materialId' | 'createAt' | 'eventId'>): Promise<MaterialEntity>;
  createManyMaterials(eventId: string, materials: Omit<MaterialEntity, 'materialId' | 'createAt' | 'eventId'>[]): Promise<MaterialEntity[]>;
  findMaterialById(materialId: string): Promise<MaterialEntity>;
  findMaterialsByEvent(eventId: string): Promise<MaterialEntity[]>;
  updateMaterial(materialId: string, partial: Partial<Omit<MaterialEntity, 'materialId' | 'createAt' | 'eventId'>>): Promise<MaterialEntity>;
  deleteMaterial(materialId: string): Promise<void>;
}
