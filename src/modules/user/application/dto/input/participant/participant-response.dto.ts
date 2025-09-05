import { ApiProperty } from '@nestjs/swagger';

export class ParticipantResponseDto {
  @ApiProperty({ example: '2f1e6f36-4a2f-4a7a-9b83-8d7f3646c8a1', description: 'ID del participante (UUID v4)' })
  participantId!: string;

  @ApiProperty({ example: 'Ingeniería', nullable: true, description: 'Facultad (puede ser null)' })
  faculty!: string | null;

  @ApiProperty({ example: 'Informática y Sistemas', nullable: true, description: 'Carrera (puede ser null)' })
  career!: string | null;

  @ApiProperty({
    example: 'participant',
    enum: ['participant', 'speaker', 'teacher'],
    nullable: true,
    description: 'Tipo de participante (puede ser null)'
  })
  type!: 'participant' | 'speaker' | 'teacher' | null;

  @ApiProperty({ example: 'e0a4c7c1-2fd7-4f81-a7f1-2e90e3e2b820', description: 'ID de PersonalData (UUID v4)' })
  personalDataId!: string;

  @ApiProperty({ example: 'evt1', description: 'ID de Evento (scalar)' })
  eventId!: string;
}
