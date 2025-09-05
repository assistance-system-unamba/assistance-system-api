import { UUID } from 'src/shared/value-objects/uuid.vo';

export type ParticipantType = 'participant' | 'speaker' | 'teacher';

export class Participant {
  private constructor(
    private readonly participantId: string,
    private faculty: string | null,
    private career: string | null,
    private type: ParticipantType | null,
    private personalDataId: string,
    // Importante: eventId es scalar (rompimos FK con módulo event)
    private eventId: string,
  ) {}

  static create(props: {
    participantId?: string|null;
    faculty?: string | null;
    career?: string | null;
    type?: ParticipantType | null;
    personalDataId: string;
    eventId: string; // solo referencia scalar
  }): Participant {
    const id = props.participantId ?? UUID.create().toString();
    return new Participant(
      id,
      props.faculty ?? null,
      props.career ?? null,
      props.type ?? null,
      props.personalDataId,
      props.eventId,
    );
  }

  getId() { return this.participantId; }
  getPersonalDataId() { return this.personalDataId; }
  getEventId() { return this.eventId; }
  getFaculty() { return this.faculty; }
  getCareer() { return this.career; }
  getType() { return this.type; }
}
