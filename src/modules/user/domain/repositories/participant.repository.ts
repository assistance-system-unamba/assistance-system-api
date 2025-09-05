export const PARTICIPANT_REPOSITORY = Symbol('PARTICIPANT_REPOSITORY');

import { Participant } from '../entities/participant.entity';

export interface IParticipantRepository {
  create(participant: Participant): Promise<Participant>;
  findById(id: string): Promise<Participant | null>;
  findAll(): Promise<Participant[]>;
  update(participant: Participant): Promise<Participant>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
