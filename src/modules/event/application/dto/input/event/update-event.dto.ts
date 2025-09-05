import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Length } from 'class-validator';

export class UpdateEventDto {
  @ApiPropertyOptional({ example: 'Congreso Internacional de Tecnología', maxLength: 100 })
  @IsOptional() @IsString() @Length(1, 100)
  title?: string;

  @ApiPropertyOptional({ example: 'Nueva descripción del evento' })
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2025-09-01T10:00:00.000Z' })
  @IsOptional() @IsDateString()
  startTime?: string;

  @ApiPropertyOptional({ example: '2025-09-01T19:00:00.000Z' })
  @IsOptional() @IsDateString()
  endTime?: string;

  @ApiPropertyOptional({ example: 'Sala Magna', maxLength: 60 })
  @IsOptional() @IsString() @Length(1, 60)
  place?: string;

  @ApiPropertyOptional({ example: 'https://example.com/slides.pd'})
  @IsOptional() 
  @IsString()
  imageUrl?: string;
}
