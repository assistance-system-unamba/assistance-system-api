import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, Length, IsOptional } from 'class-validator';

export class CreateMaterialDto {
  @ApiProperty({ example: '4e62b7f5-fb4a-4a6f-8e63-0a30a3c6a2e9', description: 'ID del evento' })
  @IsString() @IsNotEmpty()
  eventId!: string;

  @ApiPropertyOptional({ example: 'https://example.com/slides.pdf' })
  @IsOptional() @IsUrl()
  materialUrl?: string;

  @ApiPropertyOptional({ example: 'Slides', maxLength: 100 })
  @IsOptional() @IsString() @Length(1, 100)
  title?: string;

  @ApiPropertyOptional({ example: 'Presentación del evento' })
  @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'PDF', maxLength: 45 })
  @IsOptional() @IsString() @Length(1, 45)
  type?: string;
}
