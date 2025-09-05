import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class CreateParticipantDto {
  @ApiPropertyOptional({ example: 'Ingeniería', description: 'Facultad' })
  @IsOptional() @IsString() faculty?: string;

  @ApiPropertyOptional({ example: 'Informática y Sistemas', description: 'Carrera' })
  @IsOptional() @IsString() career?: string;

  @ApiPropertyOptional({
    example: 'participant',
    enum: ['participant', 'speaker', 'teacher'],
    description: 'Tipo de participante'
  })
  @IsOptional() @IsIn(['participant', 'speaker', 'teacher']) type?: 'participant' | 'speaker' | 'teacher';

  @ApiProperty({ example: 'e0a4c7c1-2fd7-4f81-a7f1-2e90e3e2b820', description: 'ID de PersonalData (UUID v4)' })
  @IsString() personalDataId!: string;

  @ApiProperty({ example: 'evt1', description: 'ID de evento (scalar, sin FK cruzada)' })
  @IsString() eventId!: string;
}
