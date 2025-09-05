import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateAttendanceInlineDto {
  @ApiPropertyOptional({ example: '2025-09-01T09:05:00.000Z', description: 'ISO8601' })
  @IsOptional() @IsDateString()
  timestamp?: string;

  @ApiPropertyOptional({ example: 'PRESENT', maxLength: 10 })
  @IsOptional() @IsString() @Length(1, 10)
  status?: string;

  @ApiPropertyOptional({ example: 'par1', description: 'ID del participante' })
  @IsOptional() @IsString() @Length(1, 36)
  participantId?: string;
}
