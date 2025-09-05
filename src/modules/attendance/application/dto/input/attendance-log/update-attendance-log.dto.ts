import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class UpdateAttendanceLogDto {
  @ApiPropertyOptional({ example: '2025-09-01T09:10:00.000Z' })
  @IsOptional() @IsDateString()
  timestamp?: string;

  @ApiPropertyOptional({ example: 'PRESENT', maxLength: 10 })
  @IsOptional() @IsString() @Length(1, 10)
  status?: string;

  @ApiPropertyOptional({ example: 'par3' })
  @IsOptional() @IsString() @Length(1, 36)
  participantId?: string;
}
