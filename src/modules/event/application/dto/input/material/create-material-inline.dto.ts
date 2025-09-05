import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateMaterialInlineDto {
  @ApiPropertyOptional({ example: 'https://example.com/slides.pdf', description: 'URL del material' })
  @IsOptional()
  @IsUrl()
  materialUrl?: string;

  @ApiPropertyOptional({ example: 'Presentación Principal', description: 'Título del material', maxLength: 100 })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  title?: string;

  @ApiPropertyOptional({ example: 'Slides oficiales del congreso', description: 'Descripción del material' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'PDF', description: 'Tipo del material (PDF, ZIP, VIDEO, etc.)', maxLength: 45 })
  @IsOptional()
  @IsString()
  @Length(1, 45)
  type?: string;
}
