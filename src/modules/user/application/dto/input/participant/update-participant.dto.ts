import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdateParticipantDto {
  @ApiPropertyOptional({ example: 'Ingeniería', description: 'Facultad' })
  @IsOptional() @IsString() faculty?: string;

  @ApiPropertyOptional({ example: 'Informática y Sistemas', description: 'Carrera' })
  @IsOptional() @IsString() career?: string;

  @ApiPropertyOptional({
    example: 'teacher',
    enum: ['participant', 'speaker', 'teacher'],
    description: 'Tipo de participante'
  })
  @IsOptional() @IsIn(['participant', 'speaker', 'teacher']) type?: 'participant' | 'speaker' | 'teacher';

  @ApiPropertyOptional({ example: 'e0a4c7c1-2fd7-4f81-a7f1-2e90e3e2b820', description: 'Nuevo ID de PersonalData (UUID v4)' })
  @IsOptional() @IsString() personalDataId?: string;

  @ApiPropertyOptional({ example: 'evt2', description: 'Nuevo ID de evento (scalar)' })
  @IsOptional() @IsString() eventId?: string;
}
