import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class CreateAttendanceLogDto {
  @ApiProperty({ example: 'fpr1', description: 'ID del lector' })
  @IsString() @Length(1, 36)
  fingerprintReaderId!: string;

  @ApiPropertyOptional({ example: '2025-09-01T09:05:00.000Z' })
  @IsOptional() @IsDateString()
  timestamp?: string;

  @ApiPropertyOptional({ example: 'PRESENT', maxLength: 10 })
  @IsOptional() @IsString() @Length(1, 10)
  status?: string;

  @ApiPropertyOptional({ example: 'par1' })
  @IsOptional() @IsString() @Length(1, 36)
  participantId?: string;
}
