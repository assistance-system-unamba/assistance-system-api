import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { IsIP, IsOptional, IsString, Length, Matches, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAttendanceInlineDto } from '../attendance-log/create-attendance-inline.dto';

export class CreateFingerprintReaderDto {
  @ApiPropertyOptional({ example: '192.168.1.117', description: 'IP del dispositivo' })
  @IsOptional() @IsIP()
  ip?: string;

  @ApiPropertyOptional({ example: 'ICLOCK880', description: 'Serie del equipo', maxLength: 50 })
  @IsOptional() @IsString() @Length(1, 50)
  deviceSeries?: string;

  @ApiPropertyOptional({ example: 'Lector Principal', description: 'Nombre de referencia', maxLength: 45 })
  @IsOptional() @IsString() @Length(1, 45)
  name?: string;

  @ApiPropertyOptional({ example: '4370', description: 'Puerto TCP de comunicación (1-5 dígitos)' })
  @IsOptional() @Matches(/^\d{1,5}$/)
  port?: string;

  @ApiPropertyOptional({ example: 'Data Center - Rack 3', maxLength: 90 })
  @IsOptional() @IsString() @Length(1, 90)
  location?: string;

  @ApiProperty({
    description: 'Logs iniciales (opcional: 1..n) que se crean junto al lector',
    required: false,
    type: [CreateAttendanceInlineDto],
    example: [
      { timestamp: '2025-09-01T09:05:00.000Z', status: 'PRESENT', participantId: 'par1' },
      { timestamp: '2025-09-01T09:10:00.000Z', status: 'PRESENT', participantId: 'par3' }
    ]
  })
  @IsOptional() @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceInlineDto)
  attendanceLogs?: CreateAttendanceInlineDto[];
}
