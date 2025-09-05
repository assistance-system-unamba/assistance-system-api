export class ParticipantResponseDto {
    participantId!: string;
    faculty!: string | null;
    career!: string | null;
    type!: 'participant' | 'speaker' | 'teacher' | null;
    personalDataId!: string;
    eventId!: string;
}
  