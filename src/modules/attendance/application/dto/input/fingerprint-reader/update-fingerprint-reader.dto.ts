import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIP, IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateFingerprintReaderDto {
  @ApiPropertyOptional({ example: '192.168.1.120' })
  @IsOptional() @IsIP()
  ip?: string;

  @ApiPropertyOptional({ example: 'ICLOCK880', maxLength: 50 })
  @IsOptional() @IsString() @Length(1, 50)
  deviceSeries?: string;

  @ApiPropertyOptional({ example: 'Lector Principal', maxLength: 45 })
  @IsOptional() @IsString() @Length(1, 45)
  name?: string;

  @ApiPropertyOptional({ example: '4370' })
  @IsOptional() @Matches(/^\d{1,5}$/)
  port?: string;

  @ApiPropertyOptional({ example: 'Data Center - Rack 3', maxLength: 90 })
  @IsOptional() @IsString() @Length(1, 90)
  location?: string;
}
